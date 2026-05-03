import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

let currentUser = null;
let currentUserData = null;

// 🔹 공통: username → email 변환
function toEmail(username) {
    return username.trim().toLowerCase() + "@chikka.com";
}

// 🔹 회원가입
async function signup() {
    try {
        const username = document.getElementById("s_id").value.trim().toLowerCase();
        const displayName = document.getElementById("s_name").value.trim();
        const password = document.getElementById("s_pw").value;

        if (!username || !displayName || !password) {
            alert("모든 값을 입력하세요");
            return;
        }

        const email = toEmail(username);

        const userCred = await createUserWithEmailAndPassword(auth, email, password);

        await setDoc(doc(db, "users", userCred.user.uid), {
            username,
            displayName,
            role: "user",
            score4: Number(s_score4.value) || 0,
            score3: Number(s_score3.value) || 0,
            highrun4: Number(s_hr4.value) || 0,
            highrun3: Number(s_hr3.value) || 0,
            place: s_place.value || ""
        });

        alert("회원가입 완료");

    } catch (err) {
        console.error(err);
        alert("회원가입 실패: " + err.message);
    }
}

// 🔹 로그인
async function login() {

    const username = document.getElementById("id").value.trim().toLowerCase();
    const password = document.getElementById("pw").value;

    if (!username || !password) {
        alert("아이디/비밀번호 입력");
        return;
    }

    const email = toEmail(username);

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        currentUser = userCred.user;

        const docSnap = await getDoc(doc(db, "users", currentUser.uid));
        currentUserData = docSnap.data();

        // 🔥 로그인 유지용 저장
        localStorage.setItem("user", JSON.stringify({
            uid: currentUser.uid
        }));

        alert("로그인 성공");

        setLoginUI(true);

        if (window.loadRanking) loadRanking(4);

    } catch (err) {
        console.error(err);
        alert("로그인 실패");
    }
}

// 🔹 로그아웃
async function logout() {

    await signOut(auth);

    currentUser = null;
    currentUserData = null;

    // 🔥 로컬 제거
    localStorage.removeItem("user");

    alert("로그아웃");

    setLoginUI(false);
}

// 🔹 로그인 상태 자동 유지 (핵심)
onAuthStateChanged(auth, async (user) => {

    if (user) {
        currentUser = user;

        const docSnap = await getDoc(doc(db, "users", user.uid));

        if (docSnap.exists()) {
            currentUserData = docSnap.data();
        } else {
            console.warn("유저 데이터 없음");
            currentUserData = null;
        }

        // 🔥 로컬 동기화
        localStorage.setItem("user", JSON.stringify({
            uid: user.uid
        }));

        setLoginUI(true);

        if (window.loadRanking) loadRanking(4);

    } else {
        currentUser = null;
        currentUserData = null;

        localStorage.removeItem("user");

        setLoginUI(false);
    }
});

// 🔹 UI 처리
function setLoginUI(isLogin) {

    const loginPage = document.getElementById("loginPage");
    const signupPage = document.getElementById("signupPage");
    const authBtn = document.getElementById("authBtn");
    const mypageBtn = document.getElementById("mypageBtn");
    const userSection = document.getElementById("userSection");

    if (isLogin) {

        loginPage.querySelectorAll("input").forEach(el => el.style.display = "none");
        signupPage.style.display = "none";

        mypageBtn.style.display = "inline-block";

        // 🔥 관리자 체크 강화
        if (currentUserData && currentUserData.role === "admin") {
            userSection.style.display = "block";
            if (window.loadUsers) loadUsers();
        } else {
            userSection.style.display = "none";
        }

        authBtn.innerText = "로그아웃";
        authBtn.onclick = logout;

    } else {

        loginPage.querySelectorAll("input").forEach(el => el.style.display = "inline-block");

        mypageBtn.style.display = "none";
        userSection.style.display = "none";

        authBtn.innerText = "로그인";
        authBtn.onclick = login;
    }
}

// 🔹 화면 전환
function showSignup() {
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("signupPage").style.display = "block";
}

function showLogin() {
    document.getElementById("loginPage").style.display = "block";
    document.getElementById("signupPage").style.display = "none";
}

// 🔹 외부 접근 허용
window.signup = signup;
window.login = login;
window.logout = logout;
window.showSignup = showSignup;
window.showLogin = showLogin;

// 🔹 다른 파일에서 사용 가능
export { currentUser, currentUserData };