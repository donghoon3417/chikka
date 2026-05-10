/* =====================================
   RENDER TABLE
===================================== */

export function renderRankingTable() {

  const tbody =
    document.querySelector(
      "#rankingTable tbody"
    );

  tbody.innerHTML =
    "";

  const start =
    (window.currentRankingPage - 1)
    * window.ROWS_PER_PAGE;

  const pageUsers =
    window.rankingUsers.slice(
      start,
      start + window.ROWS_PER_PAGE
    );

  for (
    let i = 0;
    i < window.ROWS_PER_PAGE;
    i++
  ) {

    const user =
      pageUsers[i];

    let row = "";

    if (user) {

      const score =
        window.currentGame === "4ball"
          ? user.score4 || 0
          : user.score3 || 0;

      const highrun =
        window.currentGame === "4ball"
          ? user.highrun4 || "-"
          : user.highrun3 || "-";

      const tier =
        window.getTier(score);

      row = `
        <tr>

          <td>
            ${start + i + 1}
          </td>

          <td>
            ${user.displayName || "-"}
          </td>

          <td>
            <img
              src="${tier.img}"
              width="28"
              style="
                vertical-align: middle;
                margin-right: 6px;
              "
            />
            ${tier.name}
          </td>

          <td>
            ${score}
          </td>

          <td>
            ${highrun}
          </td>

          <td>
            ${user.place || "-"}
          </td>

        </tr>
      `;

    } else {

      row = `
        <tr>

          <td>
            ${start + i + 1}
          </td>

          <td></td>

          <td></td>

          <td></td>

          <td></td>

          <td></td>

        </tr>
      `;
    }

    tbody.innerHTML +=
      row;
  }

  /* 페이지 표시 */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        window.rankingUsers.length /
        window.ROWS_PER_PAGE
      )
    );

  const pageInfo =
    document.getElementById(
      "rankingPageInfo"
    );

  if (pageInfo) {

    pageInfo.innerText =
      `${window.currentRankingPage} / ${totalPages}`;
  }
}

/* =====================================
   PAGINATION
===================================== */

window.prevRankingPage =
  function () {

    if (
      window.currentRankingPage > 1
    ) {

      window.currentRankingPage--;

      renderRankingTable();
    }
  };

window.nextRankingPage =
  function () {

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          window.rankingUsers.length /
          window.ROWS_PER_PAGE
        )
      );

    if (
      window.currentRankingPage <
      totalPages
    ) {

      window.currentRankingPage++;

      renderRankingTable();
    }
  };