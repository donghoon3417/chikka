import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function showMyPage() {

  if (!auth.currentUser) {
    alert("로그인 필요");
    return;
  }

  const docRef = doc(db, "users", auth.currentUser.uid);
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

export async function updateMyInfo() {

  const docRef = doc(db, "users", auth.currentUser.uid);

  await updateDoc(docRef, {
    displayName: m_name.value || "",
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

export function closeMyPage() {
  document.getElementById("mypage").style.display = "none";
}

// 👉 HTML onclick 대응
window.showMyPage = showMyPage;
window.updateMyInfo = updateMyInfo;
window.closeMyPage = closeMyPage;