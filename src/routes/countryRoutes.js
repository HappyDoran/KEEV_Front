const express = require("express");
const {
  addCountry,
  getCountries,
  //   updateCountry,
  //   deleteCountry,
} = require("../controllers/countryController");

const router = express.Router();

// 나라 등록
router.post("/register", addCountry);

// 나라 목록 조회
router.get("/get", getCountries);

// // 나라 수정
// router.put("/:id", updateCountry);

// // 나라 삭제
// router.delete("/:id", deleteCountry);

module.exports = router;
