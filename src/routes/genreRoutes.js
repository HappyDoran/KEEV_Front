const express = require("express");
const {
  addGenre,
  getGenre,
  updateGenre,
  deleteGenre,
} = require("../controllers/genreController");

const router = express.Router();

// 장르 등록
router.post("/register", addGenre);

// 장르 목록 조회
router.get("/get", getGenre);

// 장르 수정
router.put("/:id", updateGenre);

// 장르 삭제
router.delete("/:id", deleteGenre);

module.exports = router;
