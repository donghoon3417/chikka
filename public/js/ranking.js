import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  renderRankingTable
} from "./render.js";

/* =====================================
   FIREBASE WAIT
===================================== */

function getDB() {

  if (!window.db) {

    throw new Error(
      "Firebase DB not initialized"
    );
  }

  return window.db;
}

/* =====================================
   STATE
===================================== */

window.currentGame =
  "4ball";

window.currentPeriod =
  "weekly";

window.currentRankingPage =
  1;

window.ROWS_PER_PAGE =
  10;

window.rankingUsers =
  [];

/* =====================================
   TIER
===================================== */

window.getTier =
  function (score) {

    if (score >= 2000) {

      return {
        name: "S",
        img: "image/tier1.png"
      };
    }

    if (score >= 1500) {

      return {
        name: "A",
        img: "image/tier2.png"
      };
    }

    if (score >= 1000) {

      return {
        name: "B",
        img: "image/tier3.png"
      };
    }

    if (score >= 500) {

      return {
        name: "C",
        img: "image/tier4.png"
      };
    }

    return {
      name: "D",
      img: "image/tier5.png"
    };
  };

/* =====================================
   PERIOD CHANGE
===================================== */

window.changePeriod =
  function (period) {

    window.currentPeriod =
      period;

    window.currentRankingPage =
      1;

    loadRanking(
      window.currentGame,
      window.currentPeriod
    );
  };

/* =====================================
   LOAD RANKING
===================================== */

window.loadRanking =
  async function (
    game = "4ball",
    period = "weekly"
  ) {

    window.currentGame =
      game;

    window.currentPeriod =
      period;

    try {

      const snapshot =
        await getDocs(
          collection(
            getDB(),
            "users"
          )
        );

      window.rankingUsers =
        [];

      snapshot.forEach(docSnap => {

        window.rankingUsers.push(
          docSnap.data()
        );
      });

      window.rankingUsers.sort((a, b) => {

        if (game === "4ball") {

          return (
            (b.score4 || 0) -
            (a.score4 || 0)
          );
        }

        return (
          (b.score3 || 0) -
          (a.score3 || 0)
        );
      });

      renderRankingTable();

    } catch (err) {

      console.error(
        "랭킹 로드 실패:",
        err
      );
    }
  };

/* =====================================
   FIRST LOAD
===================================== */

(async () => {

  const timer =
    setInterval(() => {

      const table =
        document.querySelector(
          "#rankingTable tbody"
        );

      if (
        table &&
        window.db
      ) {

        clearInterval(timer);

        loadRanking(
          "4ball",
          "weekly"
        );
      }

    }, 100);

})();