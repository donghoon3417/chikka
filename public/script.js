import {
  collection, getDocs, doc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 랭킹 불러오기
export async function loadRanking(type) {

  const snapshot = await getDocs(collection(db, "users"));

  let data = [];

  snapshot.forEach(d => {
    const u = d.data();

    data.push({
      name: u.displayName || u.username, // 🔥 닉네임 우선
      score: type == 4 ? u.score4 : u.score3,
      highrun: type == 4 ? u.highrun4 : u.highrun3,
      place: u.place || "",
    });
  });

  // 정렬
  data.sort((a, b) => b.score - a.score);

  data = data.map((u, i) => {

    const tierInfo = getTier(u.score); // 🔥 이거 추가

    return {
      ...u,
      rank: i + 1,
      tier: tierInfo.name,
      tierImg: tierInfo.img
    };
  });
  renderTable(data);
}

// 🔹 테이블 출력
function renderTable(data) {

  const tbody = document.querySelector("#rankingTable tbody");
  tbody.innerHTML = "";

  data.forEach(u => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${u.rank}</td>
      <td>${u.name}</td>
       <td>
    <img src="image/${u.tierImg}" width="30">
    ${u.tier}
  </td>
      <td>${u.score || 0}</td>
      <td>${u.highrun || 0}</td>
      <td>${u.place || ""}</td>
    `;

    tbody.appendChild(tr);
  });
}

// 🔹 회원 목록 (관리자)
export async function loadUsers() {

  const snapshot = await getDocs(collection(db, "users"));

  const tbody = document.querySelector("#userTable tbody");
  tbody.innerHTML = "";

  let i = 1;

  snapshot.forEach(d => {
    const u = d.data();

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${i++}</td>
      <td>${u.username || u.id}</td>
      <td>${u.displayName || ""}</td>
      <td>${u.score4}</td>
      <td>${u.score3}</td>
      <td>${u.highrun4}</td>
      <td>${u.highrun3}</td>
      <td><button onclick="removeUser('${d.id}')">삭제</button></td>
    `;

    tbody.appendChild(tr);
  });
}

function getTier(score) {

  const tiers = [
    { min: 30, name: "입문", img: "tier1.png" },
    { min: 50, name: "초보", img: "tier2.png" },
    { min: 80, name: "하수", img: "tier3.png" },
    { min: 100, name: "중하", img: "tier4.png" },
    { min: 120, name: "중수", img: "tier5.png" },
    { min: 150, name: "중상", img: "tier6.png" },
    { min: 200, name: "고수", img: "tier7.png" },
    { min: 250, name: "상급자", img: "tier8.png" },
    { min: 300, name: "준프로", img: "tier9.png" },
    { min: 400, name: "프로", img: "tier10.png" },
    { min: 500, name: "달인", img: "tier11.png" },
    { min: 700, name: "마스터", img: "tier12.png" },
    { min: 1000, name: "그랜드마스터", img: "tier13.png" },
    { min: 1500, name: "레전드", img: "tier14.png" },
    { min: 2000, name: "신", img: "tier15.png" }
  ];

  let result = tiers[0];

  tiers.forEach(t => {
    if (score >= t.min) {
      result = t;
    }
  });

  return result;
}

// 🔹 삭제
export async function removeUser(uid) {

  if (!confirm("정말 삭제할까요?")) return;

  await deleteDoc(doc(db, "users", uid));

  alert("삭제 완료");

  loadUsers();
  loadRanking(4);
}

// 🔹 초기 실행 (랭킹만)
window.onload = () => {
  loadRanking(4);
};

// 👉 HTML 연결
window.loadRanking = loadRanking;
window.loadUsers = loadUsers;
window.removeUser = removeUser;
