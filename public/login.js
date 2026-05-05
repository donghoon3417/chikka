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

// 🔹 username → email 변환
function toEmail(username) {
    return username.trim().toLowerCase() + "@chikka.com";
}

// 🔹 회원가입
async function signup() {
    try {
        const username = s_id.value.trim().toLowerCase();
        const displayName = s_name.value.trim();
        const password = s_pw.value;

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

    const username = id.value.trim().toLowerCase();
    const password = pw.value;

    if (!username || !password) {
        alert("아이디/비밀번호 입력");
        return;
    }

    const email = toEmail(username);

    try {
        const userCred = await signInWithEmailAndPassword(auth, email, password);

        currentUser = userCred.user;

        const docSnap = await getDoc(doc(db, currentUser.uid));
        currentUserData = docSnap.data();

        localStorage.setItem("user", JSON.stringify({
            uid: currentUser.uid
        }));

        alert("로그인 성공");

        setLoginUI(true);

        if (window.loadRanking) loadRanking("weekly");

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

    localStorage.removeItem("user");

    alert("로그아웃");

    setLoginUI(false);
}

// 🔹 로그인 상태 유지
onAuthStateChanged(auth, async (user) => {

    if (user) {
        currentUser = user;

        const docSnap = await getDoc(doc(db, "users", user.uid));

        currentUserData = docSnap.exists() ? docSnap.data() : null;

        localStorage.setItem("user", JSON.stringify({
            uid: user.uid
        }));

        setLoginUI(true);

        if (window.loadRanking) loadRanking("weekly");

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

    const deleteBtn = document.querySelector("button[onclick='deleteMyAccount()']");

    if (isLogin) {

        loginPage.querySelectorAll("input").forEach(el => el.style.display = "none");
        signupPage.style.display = "none";

        mypageBtn.style.display = "inline-block";

        // 🔥 회원탈퇴 버튼 표시
        if (deleteBtn) deleteBtn.style.display = "inline-block";

        // 관리자
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

        // 🔥 회원탈퇴 숨김
        if (deleteBtn) deleteBtn.style.display = "none";

        authBtn.innerText = "로그인";
        authBtn.onclick = login;
    }
}

// 🔹 화면 전환
function showSignup() {
    loginPage.style.display = "none";
    signupPage.style.display = "block";
}

function showLogin() {
    loginPage.style.display = "block";
    signupPage.style.display = "none";
}

// 🔹 외부 연결
window.signup = signup;
window.login = login;
window.logout = logout;
window.showSignup = showSignup;
window.showLogin = showLogin;

export { currentUser, currentUserData };