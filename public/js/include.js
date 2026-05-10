async function loadPage(id, file) {

  const html =
    await fetch(file)
      .then(res => res.text());

  document
    .getElementById(id)
    .innerHTML = html;
}

loadPage(
  "login-container",
  "pages/login.html"
);

loadPage(
  "ranking-container",
  "pages/ranking.html"
);

loadPage(
  "match-container",
  "pages/match.html"
);

loadPage(
  "hall-container",
  "pages/hall.html"
);

loadPage(
  "tournament-container",
  "pages/tournament.html"
);

loadPage(
  "mypage-container",
  "pages/mypage.html"
);

loadPage(
  "admin-container",
  "pages/admin.html"
);