import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { addDoc, collection, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const db = window.db;

// 🔥 티어 계산 (기존 유지 or 커스텀 가능)
function getTier(score) {
  if (score >= 2000) return { name: "S", img: "image/tier1.png" };
  if (score >= 1500) return { name: "A", img: "image/tier2.png" };
  if (score >= 1000) return { name: "B", img: "image/tier3.png" };
  if (score >= 500) return { name: "C", img: "image/tier4.png" };
  return { name: "D", img: "image/tier5.png" };
}

// 🔥 랭킹 불러오기 (핵심)
window.loadRanking = async function (type) {

  const snapshot = await getDocs(collection(db, "matches"));

  let scores = {};

  const now = new Date();
  let startDate;

  if (type === "weekly") {
    startDate = new Date();
    startDate.setDate(now.getDate() - 7);
  } else if (type === "monthly") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    startDate = new Date(now.getFullYear(), 0, 1);
  }

  snapshot.forEach(doc => {
    const m = doc.data();

    if (!m.createdAt) return;

    const matchDate = m.createdAt.toDate();
    if (matchDate < startDate) return;

    const WIN = 100;
    const LOSE = 10;

    if (!scores[m.playerA]) scores[m.playerA] = { score: 0, name: m.playerA };
    if (!scores[m.playerB]) scores[m.playerB] = { score: 0, name: m.playerB };

    if (m.winner === m.playerA) {
      scores[m.playerA].score += WIN;
      scores[m.playerB].score += LOSE;
    } else {
      scores[m.playerB].score += WIN;
      scores[m.playerA].score += LOSE;
    }
  });

  let data = Object.values(scores);

  data.sort((a, b) => b.score - a.score);

  // 🔥 users 정보 가져오기 (닉네임/당구장)
  const userSnap = await getDocs(collection(db, "users"));
  const userMap = {};

  userSnap.forEach(doc => {
    const u = doc.data();
    userMap[u.username] = u;
  });

  const tbody = document.querySelector("#rankingTable tbody");
  tbody.innerHTML = "";

  data.forEach((u, i) => {
    const user = userMap[u.name] || {};

    const tier = getTier(u.score);

    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${user.displayName || u.name}</td>
        <td>
          <img src="${tier.img}" width="30" />
          ${tier.name}
        </td>
        <td>${u.score}</td>
        <td>${user.highrun4 || "-"}</td>
        <td>${user.place || "-"}</td>
      </tr>
    `;

    tbody.innerHTML += row;
  });
};

window.addMatch = async function () {
  const playerA = document.getElementById("pA").value;
  const playerB = document.getElementById("pB").value;
  const winner = document.getElementById("win").value;

  if (!playerA || !playerB || !winner) {
    alert("값을 모두 입력하세요");
    return;
  }

  if (winner !== playerA && winner !== playerB) {
    alert("승자는 플레이어 A 또는 B와 같아야 합니다");
    return;
  }

  await addDoc(collection(window.db, "matches"), {
    playerA,
    playerB,
    winner,
    createdAt: serverTimestamp()
  });

  alert("경기 등록 완료");

  // 입력칸 초기화
  document.getElementById("pA").value = "";
  document.getElementById("pB").value = "";
  document.getElementById("win").value = "";

  // 랭킹 다시 로드
  loadRanking("weekly");
};

// 🔥 최초 로딩
window.loadRanking("weekly");