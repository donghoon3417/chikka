import { doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { deleteUser } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// 🔹 마이페이지 열기
export async function showMyPage() {

  const userStr = localStorage.getItem("user");

  if (!userStr) {
    alert("로그인 필요");
    return;
  }

  const user = JSON.parse(userStr);

  // 🔥 docId → uid로 변경
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    alert("사용자 정보 없음");
    return;
  }

  const data = docSnap.data();

  // 🔥 id → username 또는 displayName
  document.getElementById("m_id").value = data.username || "";
  document.getElementById("m_displayName").value = data.displayName || "";
  document.getElementById("m_score4").value = data.score4 || 0;
  document.getElementById("m_score3").value = data.score3 || 0;
  document.getElementById("m_hr4").value = data.highrun4 || 0;
  document.getElementById("m_hr3").value = data.highrun3 || 0;
  document.getElementById("m_place").value = data.place || "";

  document.getElementById("mypage").style.display = "block";
}

export async function deleteMyAccount() {

  if (!confirm("정말 탈퇴하시겠습니까?")) return;

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("로그인 필요");
    return;
  }

  // 🔥 Firestore에서 현재 유저 데이터 가져오기 (안전)
  const docSnap = await getDoc(doc(db, "users", user.uid));
  const currentUserData = docSnap.data();

  // 🔥 1. 관리자 보호
  if (currentUserData.role === "admin") {
    alert("관리자는 탈퇴 불가");
    return;
  }

  // 🔥 2. 아이디 확인
  if (prompt("아이디를 입력하세요") !== currentUserData.username) {
    alert("아이디가 일치하지 않습니다");
    return;
  }

  try {

    // 🔥 3. Firestore 삭제
    await deleteDoc(doc(db, "users", user.uid));

    // 🔥 4. Auth 삭제
    await deleteUser(auth.currentUser);

    localStorage.removeItem("user");

    alert("회원탈퇴 완료");
    location.reload();

  } catch (err) {
    console.error(err);

    if (err.code === "auth/requires-recent-login") {
      alert("다시 로그인 후 시도해주세요");
    } else {
      alert("탈퇴 실패: " + err.message);
    }
  }
}
// 🔹 정보 수정
export async function updateMyInfo() {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("로그인 필요");
    return;
  }

  // 🔥 docId → uid
  const docRef = doc(db, "users", user.uid);
  await updateDoc(docRef, {
    displayName: m_displayName.value,  // 🔥 추가
    score4: Number(m_score4.value) || 0,
    score3: Number(m_score3.value) || 0,
    highrun4: Number(m_hr4.value) || 0,
    highrun3: Number(m_hr3.value) || 0,
    place: m_place.value || ""
  });
  alert("수정 완료");

  if (window.loadRanking) window.loadRanking(4);

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
window.deleteMyAccount = deleteMyAccount;