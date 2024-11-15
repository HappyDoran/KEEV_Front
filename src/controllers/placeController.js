const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const placeFilePath = path.join(__dirname, "../data/place.json");
const countryFilePath = path.join(__dirname, "../data/country.json");
const placeCSVPath = path.join(__dirname, "../place.csv");

// 장소 등록
const addPlace = (req, res) => {
  const { placeName, address, latitude, longitude, countryID } = req.body; // JSON 데이터를 처리

  // 필수 필드 확인
  if (!placeName || !address || !latitude || !longitude || !countryID) {
    return res.status(400).json({ message: "모든 필드가 필요합니다." });
  }

  // 기존 장소 데이터 읽기
  let placeData = { places: [] };
  if (fs.existsSync(placeFilePath)) {
    const data = fs.readFileSync(placeFilePath, "utf-8");
    try {
      placeData = JSON.parse(data);
      if (!Array.isArray(placeData.places)) {
        placeData.places = []; // place가 배열이 아닐 경우 초기화
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  }

  // 새로운 장소 추가
  const newPlace = {
    id:
      placeData.places.length > 0
        ? placeData.places[placeData.places.length - 1].id + 1
        : 1, // 다음 ID 계산
    name: placeName,
    address,
    latitude,
    longitude,
    countryID,
  };
  placeData.places.push(newPlace);

  // place.json 파일에 저장
  try {
    fs.writeFileSync(placeFilePath, JSON.stringify(placeData, null, 2));
    res.status(201).json(newPlace); // 성공 시 응답
  } catch (error) {
    console.error("Error writing to place.json:", error);
    return res.status(500).json({ message: "서버 오류: 파일 쓰기 오류" });
  }
};

// 장소 목록 조회
const getPlaces = (req, res) => {
  if (fs.existsSync(placeFilePath)) {
    const data = fs.readFileSync(placeFilePath, "utf-8");
    try {
      const placeData = JSON.parse(data);

      // 각 장소에 대해 countryName 추가
      const placesWithCountryNames = placeData.places.map((place) => {
        const countryName = getCountryNameById(place.countryID);
        return {
          id: place.id,
          name: place.name,
          address: place.address,
          latitude: place.latitude,
          longitude: place.longitude,
          countryName: countryName || "Unknown", // countryName이 없을 경우 "Unknown"으로 처리
        };
      });

      res.json({ places: placesWithCountryNames });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ places: [] }); // 파일이 없으면 빈 배열 반환
  }
};

// countryID로 countryName 조회 함수
const getCountryNameById = (countryID) => {
  if (fs.existsSync(countryFilePath)) {
    const data = fs.readFileSync(countryFilePath, "utf-8");
    const countries = JSON.parse(data).countries;
    const country = countries.find((c) => c.id === countryID);
    return country ? country.name : null;
  }
  return null;
};

// 장소 검색
const searchPlace = (req, res) => {
  const { placeName } = req.body; // 클라이언트로부터 장소 이름을 받음
  let results = [];

  // 검색어에서 공백 제거
  const normalizedPlaceName = placeName.replace(/\s+/g, "").toLowerCase();

  fs.createReadStream(placeCSVPath)
    .pipe(csv())
    .on("data", (data) => {
      // CSV 데이터에서 공백 제거
      const normalizedFilename = data.filename
        .replace(/\s+/g, "")
        .toLowerCase();

      // 공백 제거 후 비교
      if (normalizedFilename.includes(normalizedPlaceName)) {
        results.push({
          name: data.filename,
          address: data.address,
          latitude: data.lat,
          longitude: data.lng,
        });
      }
    })
    .on("end", () => {
      res.json(results); // 검색 결과를 클라이언트에 반환
    })
    .on("error", (error) => {
      console.error("CSV 파일 읽기 오류:", error);
      res
        .status(500)
        .json({ message: "서버 오류: CSV 파일을 읽는 데 실패했습니다." });
    });
};

// 장소 수정
const updatePlace = (req, res) => {
  // 장소수정 로직...
};

// 장소 삭제
const deletePlace = (req, res) => {
  // 장소 삭제 로직...
};

module.exports = {
  addPlace,
  getPlaces,
  searchPlace,
  updatePlace,
  deletePlace,
};
