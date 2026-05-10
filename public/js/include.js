async function loadPage(id, file) {

    const el =
        document.getElementById(id);

    if (!el) return;

    const html =
        await fetch(file)
            .then(res => res.text());

    el.innerHTML = html;
}

/* =========================
   HTML LOAD
========================= */

await loadPage(
    "login-container",
    "pages/login.html"
);

await loadPage(
    "ranking-container",
    "pages/ranking.html"
);

await loadPage(
    "hall-container",
    "pages/hall.html"
);

await loadPage(
    "tournament-container",
    "pages/tournament.html"
);

await loadPage(
    "mypage-container",
    "pages/mypage.html"
);

await loadPage(
    "admin-container",
    "pages/admin.html"
);

/* =========================
   JS LOAD
========================= */


await import("./login.js"); // UI 함수 먼저

await import("./auth.js"); // login(), signup()

await import("./script.js");

await import("./mypage.js");

console.log("모듈 로드 완료");