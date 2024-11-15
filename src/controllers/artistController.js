const fs = require("fs");
const path = require("path");

// artist.json 파일 경로 설정
const artistFilePath = path.join(__dirname, "../data/artist.json");

// 아티스트 등록 (POST 요청)
const addArtist = (req, res) => {
  const { artistName, description, countryIDs, genreIDs } = req.body;
  const profileImage = req.file; // 이미지가 포함된 경우

  // 필수 항목 확인
  if (!artistName || !profileImage) {
    return res.status(400).json({ message: "필수 항목이 누락되었습니다." });
  }

  // 나라 및 장르 ID 배열 파싱
  let parsedCountryIDs, parsedGenreIDs;
  try {
    parsedCountryIDs = JSON.parse(countryIDs);
    parsedGenreIDs = JSON.parse(genreIDs);
  } catch (error) {
    return res.status(400).json({ message: "잘못된 형식의 데이터입니다." });
  }

  // 기존 아티스트 데이터를 읽어옴
  fs.readFile(artistFilePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "파일 읽기 실패" });
    }

    let artistData = { artists: [] };

    // 파일이 비어있지 않으면 기존 데이터를 파싱
    if (data.length > 0) {
      try {
        artistData = JSON.parse(data);
        if (!Array.isArray(artistData.artists)) {
          return res.status(500).json({ message: "잘못된 데이터 형식입니다." });
        }
      } catch (parseError) {
        return res.status(500).json({ message: "파일 파싱 실패" });
      }
    } else {
      // 파일이 비어있으면 초기화
      artistData = { artists: [] };
    }

    // 새 아티스트 ID 생성 (기존 아티스트 수에 따라 증가)
    const newArtistId = artistData.artists.length + 1;

    // 새 아티스트 객체 생성
    const newArtist = {
      id: newArtistId,
      name: artistName,
      description,
      countryIDs: parsedCountryIDs,
      genreIDs: parsedGenreIDs,
      profileImageURL: profileImage.path,
    };

    // 새 아티스트 데이터를 배열에 추가
    artistData.artists.push(newArtist);

    // 업데이트된 데이터를 다시 파일에 저장
    fs.writeFile(artistFilePath, JSON.stringify(artistData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "파일 쓰기 실패" });
      }
      res.status(201).json({ message: "아티스트 등록 성공", id: newArtist.id });
    });
  });
};

// 아티스트 목록 조회 (GET 요청)
const getArtists = (req, res) => {
  if (fs.existsSync(artistFilePath)) {
    const data = fs.readFileSync(artistFilePath, "utf-8");
    try {
      const artistData = JSON.parse(data);

      res.json({ artists: artistData.artists });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ artists: [] });
  }
};

module.exports = {
  addArtist,
  getArtists,
};
