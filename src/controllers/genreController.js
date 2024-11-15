const fs = require("fs");
const path = require("path");

const genreFilePath = path.join(__dirname, "../data/genre.json");
let nextGenreId = 1;

// 이벤트 등록
const addGenre = (req, res) => {
  const { genreName } = req.body; // JSON 데이터를 처리

  // 필수 필드 확인
  if (!genreName) {
    return res.status(400).json({ message: "장르 이름이 필요합니다." });
  }

  // 기존 장르 데이터 읽기
  let genreData = { genres: [] };
  if (fs.existsSync(genreFilePath)) {
    const data = fs.readFileSync(genreFilePath, "utf-8");
    try {
      genreData = JSON.parse(data);
      if (!Array.isArray(genreData.genres)) {
        genreData.genres = []; // genre가 배열이 아닐 경우 초기화
      }
      // 다음 장르 ID 계산
      if (genreData.genres.length > 0) {
        nextGenreId = genreData.genres[genreData.genres.length - 1].id + 1;
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  }

  // 새로운 장르 추가
  const newGenre = { id: nextGenreId++, name: genreName };
  genreData.genres.push(newGenre);

  // genre.json 파일에 저장
  try {
    fs.writeFileSync(genreFilePath, JSON.stringify(genreData, null, 2));
    res.status(201).json({
      message: "장르 등록 성공",
      id: newGenre.id,
    });
  } catch (error) {
    console.error("Error writing to genre.json:", error);
    return res.status(500).json({ message: "서버 오류: 파일 쓰기 오류" });
  }
};

// 이벤트 목록 조회
const getGenre = (req, res) => {
  if (fs.existsSync(genreFilePath)) {
    const data = fs.readFileSync(genreFilePath, "utf-8");
    try {
      const genreData = JSON.parse(data);

      res.json({ genres: genreData.genres });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ genres: [] }); // 파일이 없으면 빈 배열 반환
  }
};

// 이벤트 수정
const updateGenre = (req, res) => {
  // 이벤트 수정 로직...
};

// 이벤트 삭제
const deleteGenre = (req, res) => {
  // 이벤트 삭제 로직...
};

module.exports = {
  addGenre,
  getGenre,
  updateGenre,
  deleteGenre,
};
