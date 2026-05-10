import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db = window.db;

/* =========================================
   TIER
========================================= */

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

/* =========================================
   LOAD RANKING
========================================= */

window.loadRanking = async function (type = "weekly") {

  try {

    /* =========================
       경기 데이터 가져오기
    ========================= */

    const matchSnap =
      await getDocs(
        collection(db, "matches")
      );

    let scores = {};

    const now = new Date();

    let startDate;

    // 🔥 기간 계산
    if (type === "weekly") {

      startDate = new Date();

      startDate.setDate(
        now.getDate() - 7
      );

    } else if (type === "monthly") {

      startDate =
        new Date(
          now.getFullYear(),
          now.getMonth(),
          1
        );

    } else {

      startDate =
        new Date(
          now.getFullYear(),
          0,
          1
        );
    }

    /* =========================
       점수 계산
    ========================= */

    matchSnap.forEach(docSnap => {

      const match = docSnap.data();

      if (!match.createdAt) return;

      const matchDate =
        match.createdAt.toDate();

      // 🔥 기간 제외
      if (matchDate < startDate) return;

      const WIN_SCORE = 100;
      const LOSE_SCORE = 10;

      // 플레이어 초기화
      if (!scores[match.playerA]) {

        scores[match.playerA] = {
          score: 0,
          name: match.playerA
        };
      }

      if (!scores[match.playerB]) {

        scores[match.playerB] = {
          score: 0,
          name: match.playerB
        };
      }

      // 승패 계산
      if (match.winner === match.playerA) {

        scores[match.playerA].score += WIN_SCORE;
        scores[match.playerB].score += LOSE_SCORE;

      } else {

        scores[match.playerB].score += WIN_SCORE;
        scores[match.playerA].score += LOSE_SCORE;
      }
    });

    /* =========================
       정렬
    ========================= */

    let rankingData =
      Object.values(scores);

    rankingData.sort((a, b) => {
      return b.score - a.score;
    });

    /* =========================
       유저 정보 가져오기
    ========================= */

    const userSnap =
      await getDocs(
        collection(db, "users")
      );

    const userMap = {};

    userSnap.forEach(docSnap => {

      const user = docSnap.data();

      userMap[user.username] = user;
    });

    /* =========================
       테이블 출력
    ========================= */

    const tbody =
      document.querySelector(
        "#rankingTable tbody"
      );

    tbody.innerHTML = "";

    rankingData.forEach((rankUser, index) => {

      const user =
        userMap[rankUser.name] || {};

      const tier =
        getTier(rankUser.score);

      const row = `
        <tr>
          <td>${index + 1}</td>

          <td>
            ${user.displayName || rankUser.name}
          </td>

          <td>
            <img
              src="${tier.img}"
              width="30"
              style="
                vertical-align: middle;
                margin-right: 6px;
              "
            />
            ${tier.name}
          </td>

          <td>${rankUser.score}</td>

          <td>
            ${user.highrun4 || "-"}
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

/* =========================================
   MATCH REGISTER
========================================= */

window.addMatch = async function () {

  try {

    const playerA =
      document
        .getElementById("pA")
        .value
        .trim()
        .toLowerCase();

    const playerB =
      document
        .getElementById("pB")
        .value
        .trim()
        .toLowerCase();

    const winner =
      document
        .getElementById("win")
        .value
        .trim()
        .toLowerCase();

    /* =========================
       입력 검사
    ========================= */

    if (
      !playerA ||
      !playerB ||
      !winner
    ) {

      alert("값을 모두 입력하세요");

      return;
    }

    if (
      winner !== playerA &&
      winner !== playerB
    ) {

      alert(
        "승자는 플레이어 A 또는 B와 같아야 합니다"
      );

      return;
    }

    /* =========================
       경기 저장
    ========================= */

    await addDoc(
      collection(db, "matches"),
      {
        playerA,
        playerB,
        winner,
        createdAt: serverTimestamp()
      }
    );

    alert("경기 등록 완료");

    /* =========================
       입력 초기화
    ========================= */

    document.getElementById("pA").value = "";

    document.getElementById("pB").value = "";

    document.getElementById("win").value = "";

    /* =========================
       랭킹 갱신
    ========================= */

    loadRanking("weekly");

  } catch (err) {

    console.error(
      "경기 등록 실패:",
      err
    );

    alert("경기 등록 실패");
  }
};

/* =========================================
   FIRST LOAD
========================================= */

window.loadRanking("weekly");