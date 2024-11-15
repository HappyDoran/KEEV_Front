const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  addEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");

const router = express.Router();

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir =
      file.fieldname === "posterImage"
        ? "../public/Images/Event/Poster/"
        : "../public/Images/Event/Description/";
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`);
  },
});

// Single file for posterImage and multiple files for descriptionImages
const upload = multer({ storage: storage });

// 이벤트 등록
router.post(
  "/register",
  upload.fields([{ name: "posterImage" }, { name: "descriptionImages" }]),
  addEvent
);

// 이벤트 등록

// 이벤트 목록 조회
router.get("/get", getEvents);

// 이벤트 수정
router.put("/:id", updateEvent);

// 이벤트 삭제
router.delete("/:id", deleteEvent);

module.exports = router;
