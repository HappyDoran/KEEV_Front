const express = require("express");
const multer = require("multer");
const path = require("path");
const { addArtist, getArtists } = require("../controllers/artistController");

const router = express.Router();

// Multer 설정: 파일 저장 위치 및 파일명에 확장자 포함
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public/Images/Artist/"); // 파일 저장 경로
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname); // 원본 파일의 확장자 가져오기
    cb(null, file.fieldname + "-" + uniqueSuffix + extension); // 확장자를 포함한 파일 이름 생성
  },
});

const uploads = multer({ storage: storage });

// 아티스트 등록
router.post("/register", uploads.single("profileImage"), addArtist);

// 아티스트 목록 조회
router.get("/get", getArtists);

// (추가적으로 수정 및 삭제 기능을 원할 경우)
// // 아티스트 수정
// router.put("/:id", updateArtist);

// // 아티스트 삭제
// router.delete("/:id", deleteArtist);

module.exports = router;
