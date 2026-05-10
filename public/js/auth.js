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

import {
    setLoginUI,
    showLogin
} from "./login.js";

/* =====================================
   FIREBASE
===================================== */

const auth =
    window.auth;

const db =
    window.db;

/* =====================================
   STATE
===================================== */

let currentUser =
    null;

let currentUserData =
    null;

/* =====================================
   USERNAME → EMAIL
===================================== */

function toEmail(username) {

    return (
        username
            .trim()
            .toLowerCase()
        + "@chikka.com"
    );
}

/* =====================================
   SIGNUP
===================================== */

async function signup() {

    try {

        const username =
            document
                .getElementById("s_id")
                .value
                .trim()
                .toLowerCase();

        const displayName =
            document
                .getElementById("s_name")
                .value
                .trim();

        const password =
            document
                .getElementById("s_pw")
                .value;

        if (
            !username ||
            !displayName ||
            !password
        ) {

            alert(
                "모든 값을 입력하세요"
            );

            return;
        }

        const email =
            toEmail(username);

        const userCred =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

        currentUser =
            userCred.user;

        currentUserData = {

            username,
            displayName,

            role: "user",

            score4:
                Number(
                    document.getElementById("s_score4").value
                ) || 0,

            score3:
                Number(
                    document.getElementById("s_score3").value
                ) || 0,

            highrun4:
                Number(
                    document.getElementById("s_hr4").value
                ) || 0,

            highrun3:
                Number(
                    document.getElementById("s_hr3").value
                ) || 0,

            place:
                document.getElementById("s_place").value || ""
        };

        await setDoc(
            doc(
                db,
                "users",
                currentUser.uid
            ),
            currentUserData
        );

        localStorage.setItem(
            "user",
            JSON.stringify({
                uid:
                    currentUser.uid
            })
        );

        showLogin();

        setLoginUI(true);

        alert(
            "회원가입 완료"
        );

        location.href =
            "../index.html";

    } catch (err) {

        console.error(err);

        alert(
            "회원가입 실패: "
            + err.code
        );
    }
}

/* =====================================
   LOGIN
===================================== */

async function login() {

    const username =
        document
            .getElementById("id")
            .value
            .trim()
            .toLowerCase();

    const password =
        document
            .getElementById("pw")
            .value;

    if (
        !username ||
        !password
    ) {

        alert(
            "아이디/비밀번호 입력"
        );

        return;
    }

    try {

        const userCred =
            await signInWithEmailAndPassword(
                auth,
                toEmail(username),
                password
            );

        currentUser =
            userCred.user;

        const docSnap =
            await getDoc(
                doc(
                    db,
                    "users",
                    currentUser.uid
                )
            );

        currentUserData =
            docSnap.exists()
                ? docSnap.data()
                : null;

        localStorage.setItem(
            "user",
            JSON.stringify({
                uid:
                    currentUser.uid
            })
        );

        alert(
            "로그인 성공"
        );

        setLoginUI(true);

    } catch (err) {

        console.error(err);

        alert(
            "로그인 실패"
        );
    }
}

/* =====================================
   LOGOUT
===================================== */

async function logout() {

    await signOut(auth);

    currentUser =
        null;

    currentUserData =
        null;

    localStorage.removeItem(
        "user"
    );

    alert(
        "로그아웃"
    );

    setLoginUI(false);
}

/* =====================================
   AUTH STATE
===================================== */

onAuthStateChanged(
    auth,
    async (user) => {

        if (user) {

            currentUser =
                user;

            const docSnap =
                await getDoc(
                    doc(
                        db,
                        "users",
                        user.uid
                    )
                );

            currentUserData =
                docSnap.exists()
                    ? docSnap.data()
                    : null;

            setLoginUI(true);

        } else {

            currentUser =
                null;

            currentUserData =
                null;

            setLoginUI(false);
        }
    }
);

/* =====================================
   WINDOW
===================================== */

window.signup =
    signup;

window.login =
    login;

window.logout =
    logout;

/* =====================================
   EXPORT
===================================== */

export {
    login,
    signup,
    logout,
    currentUser,
    currentUserData
};