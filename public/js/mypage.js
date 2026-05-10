import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const db =
  window.db;

/* =====================================
   USER STATE
===================================== */

let currentUser = null;

let currentUserData = null;

/* =====================================
   MY PAGE
===================================== */

async function showMyPage() {

  const userStr =
    localStorage.getItem("user");

  if (!userStr) {

    alert("로그인 필요");

    location.href =
      "../index.html";

    return;
  }

  const user =
    JSON.parse(userStr);

  currentUser = user;

  try {

    const docSnap =
      await getDoc(
        doc(
          db,
          "users",
          user.uid
        )
      );

    if (!docSnap.exists()) {

      alert(
        "회원 정보 없음"
      );

      return;
    }

    currentUserData =
      docSnap.data();

    document.getElementById(
      "m_id"
    ).value =
      currentUserData.username || "";

    document.getElementById(
      "m_displayName"
    ).value =
      currentUserData.displayName || "";

    document.getElementById(
      "m_score4"
    ).value =
      currentUserData.score4 || "";

    document.getElementById(
      "m_score3"
    ).value =
      currentUserData.score3 || "";

    document.getElementById(
      "m_hr4"
    ).value =
      currentUserData.highrun4 || "";

    document.getElementById(
      "m_hr3"
    ).value =
      currentUserData.highrun3 || "";

    document.getElementById(
      "m_place"
    ).value =
      currentUserData.place || "";

  } catch (err) {

    console.error(err);

    alert(
      "회원 정보 로드 실패"
    );
  }
}

function closeMyPage() {

  parent.closeMyPageModal();
}

async function updateMyInfo() {

  if (!currentUser) {
    return;
  }

  try {

    const newData = {

      displayName:
        document.getElementById(
          "m_displayName"
        ).value,

      score4:
        Number(
          document.getElementById(
            "m_score4"
          ).value
        ) || 0,

      score3:
        Number(
          document.getElementById(
            "m_score3"
          ).value
        ) || 0,

      highrun4:
        Number(
          document.getElementById(
            "m_hr4"
          ).value
        ) || 0,

      highrun3:
        Number(
          document.getElementById(
            "m_hr3"
          ).value
        ) || 0,

      place:
        document.getElementById(
          "m_place"
        ).value || ""
    };

    await updateDoc(
      doc(
        db,
        "users",
        currentUser.uid
      ),
      newData
    );

    alert(
      "수정 완료"
    );

    parent.location.reload();

  } catch (err) {

    console.error(err);

    alert(
      "수정 실패"
    );
  }
}

/* =====================================
   WINDOW
===================================== */

window.showMyPage =
  showMyPage;

window.closeMyPage =
  closeMyPage;

window.updateMyInfo =
  updateMyInfo;

window.addEventListener(
  "DOMContentLoaded",
  () => {

    showMyPage();
  }
);