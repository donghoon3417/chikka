import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

let currentGame = "4ball";
let currentPeriod = "weekly";

/* =====================================
   TIER
===================================== */

function getTier(score) {

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
}

/* =====================================
   PERIOD CHANGE
===================================== */

window.changePeriod = function (period) {

  currentPeriod = period;

  document
    .querySelectorAll(
      ".ranking-period-buttons button"
    )
    .forEach(btn => {
      btn.classList.remove("active");
    });

  if (period === "weekly") {
    weeklyBtn.classList.add("active");
  }

  if (period === "monthly") {
    monthlyBtn.classList.add("active");
  }

  if (period === "yearly") {
    yearlyBtn.classList.add("active");
  }

  loadRanking(
    currentGame,
    currentPeriod
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

    currentGame = game;
    currentPeriod = period;
    console.log("랭킹 로드 시작");

    const rank4Btn =
  document.getElementById("rank4Btn");

const rank3Btn =
  document.getElementById("rank3Btn");

const weeklyBtn =
  document.getElementById("weeklyBtn");

const monthlyBtn =
  document.getElementById("monthlyBtn");

const yearlyBtn =
  document.getElementById("yearlyBtn");

const highrunHeader =
  document.getElementById("highrunHeader");
    try {

      /* =========================
         게임 버튼 상태
      ========================= */

      document
        .querySelectorAll(
          ".ranking-type-buttons button"
        )
        .forEach(btn => {
          btn.classList.remove("active");
        });

      if (game === "4ball") {

        rank4Btn.classList.add("active");

        highrunHeader.innerText =
          "4구하이런";

      } else {

        rank3Btn.classList.add("active");

        highrunHeader.innerText =
          "3구하이런";
      }

      /* =========================
         기간 버튼 상태
      ========================= */

      document
        .querySelectorAll(
          ".ranking-period-buttons button"
        )
        .forEach(btn => {
          btn.classList.remove("active");
        });

      if (period === "weekly") {
        weeklyBtn.classList.add("active");
      }

      if (period === "monthly") {
        monthlyBtn.classList.add("active");
      }

      if (period === "yearly") {
        yearlyBtn.classList.add("active");
      }

      /* =========================
         유저 데이터 가져오기
      ========================= */

      const snapshot =
        await getDocs(
          collection(
            getDB(),
            "users"
          )
        );
      let users = [];

      snapshot.forEach(docSnap => {

        const user =
          docSnap.data();

        users.push(user);
      });

      /* =========================
         정렬
      ========================= */

      users.sort((a, b) => {

        // 4구
        if (game === "4ball") {

          return (
            (b.score4 || 0) -
            (a.score4 || 0)
          );
        }

        // 3구
        return (
          (b.score3 || 0) -
          (a.score3 || 0)
        );
      });

      /* =========================
         테이블 출력
      ========================= */

      const tbody =
        document.querySelector(
          "#rankingTable tbody"
        );

      tbody.innerHTML = "";

      users.forEach((user, index) => {

        const score =
          game === "4ball"
            ? user.score4 || 0
            : user.score3 || 0;

        const highrun =
          game === "4ball"
            ? user.highrun4 || "-"
            : user.highrun3 || "-";

        const tier =
          getTier(score);

        const row = `
          <tr>

            <td>
              ${index + 1}
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

        tbody.innerHTML += row;
      });

    } catch (err) {

      console.error(
        "랭킹 로드 실패:",
        err
      );
    }
  };


async function waitForRankingTable() {

  return new Promise(resolve => {

    const timer =
      setInterval(() => {

        const table =
          document.querySelector(
            "#rankingTable tbody"
          );

        // table 존재
        if (
          table &&
          window.db
        ) {

          clearInterval(timer);

          resolve();
        }

      }, 100);
  });
}

/* =====================================
   FIRST LOAD
===================================== */

(async () => {

  await waitForRankingTable();

  console.log(
    "랭킹 테이블 준비 완료"
  );

  loadRanking(
    "4ball",
    "weekly"
  );

})();