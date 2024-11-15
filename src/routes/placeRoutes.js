const express = require("express");
const {
  addPlace,
  getPlaces,
  searchPlace,
  //   updatePlace,
  //   deletePlace,
} = require("../controllers/placeController");

const router = express.Router();

// 장소 등록
router.post("/register", addPlace);

// 장소 목록 조회
router.get("/get", getPlaces);

// 장소 검색
router.post("/search", searchPlace);

// // 장소 수정
// router.put("/:id", updatePlace);

// // 장소 삭제
// router.delete("/:id", deletePlace);

module.exports = router;
