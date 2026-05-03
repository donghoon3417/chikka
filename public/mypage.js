import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔹 마이페이지 열기
export async function showMyPage() {

  const userStr = localStorage.getItem("user");

  if (!userStr) {
    alert("로그인 필요");
    return;
  }

  const user = JSON.parse(userStr);

  const docRef = doc(db, "users", user.docId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("사용자 정보 없음");
    return;
  }

  const data = docSnap.data();

  document.getElementById("m_id").value = data.id || "";
  document.getElementById("m_score4").value = data.score4 || 0;
  document.getElementById("m_score3").value = data.score3 || 0;
  document.getElementById("m_hr4").value = data.highrun4 || 0;
  document.getElementById("m_hr3").value = data.highrun3 || 0;
  document.getElementById("m_place").value = data.place || "";

  document.getElementById("mypage").style.display = "block";
}

// 🔹 정보 수정
export async function updateMyInfo() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("로그인 필요");
    return;
  }

  const docRef = doc(db, "users", user.docId);

  await updateDoc(docRef, {
    score4: Number(m_score4.value) || 0,
    score3: Number(m_score3.value) || 0,
    highrun4: Number(m_hr4.value) || 0,
    highrun3: Number(m_hr3.value) || 0,
    place: m_place.value || ""
  });

  alert("수정 완료");

  window.loadRanking(4);
  closeMyPage();
}

// 🔹 닫기
export function closeMyPage() {
  document.getElementById("mypage").style.display = "none";
}

// 👉 HTML 연결
window.showMyPage = showMyPage;
window.updateMyInfo = updateMyInfo;
window.closeMyPage = closeMyPage;