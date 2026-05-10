/* =====================================
   UI
===================================== */

function setLoginUI(isLogin) {

    const loginPage =
        document.getElementById("loginPage");

    const signupPage =
        document.getElementById("signupPage");

    const authBtn =
        document.getElementById("authBtn");

    const mypageBtn =
        document.getElementById("mypageBtn");

    const userSection =
        document.getElementById("userSection");

    const deleteBtn =
        document.querySelector(
            "button[onclick='deleteMyAccount()']"
        );

    if (
        !loginPage ||
        !signupPage ||
        !authBtn ||
        !mypageBtn
    ) {
        return;
    }

    if (isLogin) {

        loginPage
            .querySelectorAll("input")
            .forEach(el => {
                el.style.display = "none";
            });

        signupPage.style.display =
            "none";

        mypageBtn.style.display =
            "inline-block";

        if (deleteBtn) {
            deleteBtn.style.display =
                "inline-block";
        }

        authBtn.innerText =
            "로그아웃";

        authBtn.onclick =
            window.logout;

    } else {

        loginPage
            .querySelectorAll("input")
            .forEach(el => {
                el.style.display =
                    "inline-block";
            });

        mypageBtn.style.display =
            "none";

        if (userSection) {
            userSection.style.display =
                "none";
        }

        if (deleteBtn) {
            deleteBtn.style.display =
                "none";
        }

        authBtn.innerText =
            "로그인";

        authBtn.onclick =
            window.login;
    }
}

/* =====================================
   PAGE CHANGE
===================================== */

function showSignup() {

    const loginPage =
        document.getElementById("loginPage");

    const signupPage =
        document.getElementById("signupPage");

    if (
        !loginPage ||
        !signupPage
    ) {
        return;
    }

    loginPage.style.display =
        "none";

    signupPage.style.display =
        "block";
}

function showLogin() {

    const loginPage =
        document.getElementById("loginPage");

    const signupPage =
        document.getElementById("signupPage");

    if (
        !loginPage ||
        !signupPage
    ) {
        return;
    }

    loginPage.style.display =
        "block";

    signupPage.style.display =
        "none";
}

/* =====================================
   WINDOW
===================================== */

window.showSignup =
    showSignup;

window.showLogin =
    showLogin;

/* =====================================
   EXPORT
===================================== */

export {
    setLoginUI,
    showSignup,
    showLogin
};