const express = require("express");
const {
  addEventType,
  getEventTypes,
  getEventTypeById,
  //   updateEventTypes,
  //   deleteEventTypes,
} = require("../controllers/eventTypeController");

const router = express.Router();

// 이벤트 타입 등록
router.post("/register", addEventType);

// 이벤트 타입 목록 조회
router.get("/get", getEventTypes);

// 특정 이벤트 타입 조회
router.get("/get/:id", getEventTypeById); // 추가

// // 이벤트 타입 수정
// router.put("/:id", updateEventTypes);

// // 이벤트 타입 삭제
// router.delete("/:id", deleteEventTypes);

module.exports = router;
