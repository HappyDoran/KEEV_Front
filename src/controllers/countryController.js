const fs = require("fs");
const path = require("path");

const countryFilePath = path.join(__dirname, "../data/country.json");
let nextCountryId = 1;

// 나라 등록
const addCountry = (req, res) => {
  const { countryName } = req.body; // 'countryName'으로 수정

  // 필수 필드 확인
  if (!countryName) {
    return res.status(400).json({ message: "국가 이름이 필요합니다." });
  }

  // 기존 국가 데이터 읽기
  let countryData = { countries: [] };
  if (fs.existsSync(countryFilePath)) {
    const data = fs.readFileSync(countryFilePath, "utf-8");
    try {
      countryData = JSON.parse(data);
      if (!Array.isArray(countryData.countries)) {
        countryData.countries = [];
      }
      // 다음 국가 ID 계산
      if (countryData.countries.length > 0) {
        nextCountryId =
          countryData.countries[countryData.countries.length - 1].id + 1; // 'id'로 변경
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  }

  // 새로운 국가 추가
  const newCountry = { id: nextCountryId++, name: countryName }; // 'id'와 'countryName'으로 수정
  countryData.countries.push(newCountry);

  // country.json 파일에 저장
  try {
    fs.writeFileSync(countryFilePath, JSON.stringify(countryData, null, 2));
    res.status(201).json({
      message: "국가 등록 성공",
      id: newCountry.id, // 'id'로 변경
    });
  } catch (error) {
    console.error("Error writing to country.json:", error);
    return res.status(500).json({ message: "서버 오류: 파일 쓰기 오류" });
  }
};

// 나라 목록 조회
const getCountries = (req, res) => {
  if (fs.existsSync(countryFilePath)) {
    const data = fs.readFileSync(countryFilePath, "utf-8");
    try {
      const countryData = JSON.parse(data);

      res.json({ countries: countryData.countries });
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return res
        .status(500)
        .json({ message: "서버 오류: JSON 형식이 잘못되었습니다." });
    }
  } else {
    res.json({ countries: [] }); // 파일이 없으면 빈 배열 반환
  }
};

// 나라 수정
const updateCountry = (req, res) => {
  // 이벤트 수정 로직...
};

// 나라 삭제
const deleteCountry = (req, res) => {
  // 이벤트 삭제 로직...
};

module.exports = {
  addCountry,
  getCountries,
  updateCountry,
  deleteCountry,
};
