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
   PATH
========================= */

const isSubPage =
    location.pathname.includes(
        "/pages/"
    );

const base =
    isSubPage
        ? "../"
        : "";

/* =========================
   HTML LOAD
========================= */

await loadPage(
    "header-container",
    `${base}pages/header.html`
);

await loadPage(
    "login-container",
    `${base}pages/login.html`
);

await loadPage(
    "ranking-container",
    `${base}pages/ranking.html`
);

await loadPage(
    "hall-container",
    `${base}pages/hall.html`
);

await loadPage(
    "tournament-container",
    `${base}pages/tournament.html`
);

await loadPage(
    "admin-container",
    `${base}pages/admin.html`
);

/* =========================
   JS LOAD
========================= */

await import("./login.js");

await import("./auth.js");

await import("./ranking.js");

console.log(
    "모듈 로드 완료"
);