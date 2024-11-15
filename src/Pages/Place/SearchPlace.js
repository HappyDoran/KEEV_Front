import "../../Styles/Layout.css";
import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import axios from "axios";

const SearchPlace = () => {
  const [place, setPlace] = useState({
    countryID: "", // 나라 ID
    name: "", // 장소 이름
    address: "", // 장소 주소
    latitude: "", // 장소 위도
    longitude: "", // 장소 경도
  });

  const [countries, setCountries] = useState([]); // 국가 목록 상태
  const [searchResults, setSearchResults] = useState([]); // 검색 결과 상태
  const [selectedIndex, setSelectedIndex] = useState(-1); // 선택된 메뉴 아이템 인덱스

  const API_URL = process.env.REACT_APP_URL;

  // 국가 목록을 가져오는 함수
  const fetchCountries = async () => {
    try {
      const response = await axios.get(`${API_URL}/country/list`);
      setCountries(response.data.countries);
    } catch (error) {
      console.error("국가 목록 가져오기 실패:", error);
    }
  };

  useEffect(() => {
    fetchCountries(); // 컴포넌트가 마운트될 때 국가 목록을 가져옴
  }, []);

  // 장소 이름 검색
  const handlePlaceSearch = async (e) => {
    const value = e.target.value;
    setPlace({ ...place, name: value }); // 장소 이름 상태 업데이트
    setSelectedIndex(-1); // 검색 시 선택된 인덱스 초기화

    if (value.length > 2) {
      // 3글자 이상 입력 시 검색
      try {
        const response = await axios.post(`${API_URL}/place/search`, {
          placeName: value,
        });
        setSearchResults(response.data); // 검색 결과 업데이트
      } catch (error) {
        console.error("장소 검색 실패:", error);
      }
    } else {
      setSearchResults([]); // 입력이 3글자 미만이면 검색 결과 초기화
    }
  };

  // 키보드 이벤트 처리
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault(); // 기본 스크롤 방지
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, searchResults.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault(); // 기본 스크롤 방지
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, -1));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      // 선택된 아이템 클릭
      handleSelectPlace(searchResults[selectedIndex]);
    }
  };

  // 검색 결과 선택 시 자동 채우기
  const handleSelectPlace = (selectedPlace) => {
    setPlace({
      ...place,
      name: selectedPlace.name,
      address: selectedPlace.address,
      latitude: selectedPlace.latitude,
      longitude: selectedPlace.longitude,
      countryID: place.countryID, // 필요에 따라 추가
    });
    setSearchResults([]); // 검색 결과 초기화
    setSelectedIndex(-1); // 선택된 인덱스 초기화
  };

  const handleUpload = async () => {
    // 필수 필드 확인
    if (
      !place.name ||
      !place.address ||
      !place.latitude ||
      !place.longitude ||
      !place.countryID
    ) {
      alert("빈 칸없이 채워주세요");
      return;
    }

    const placeData = {
      name: place.name,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      countryID: place.countryID,
    };

    try {
      const response = await axios.post(`${API_URL}/place/add`, placeData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("장소 등록 성공: " + response.data.placeID);
    } catch (error) {
      console.error("장소 등록 실패:", error);
      alert("장소 등록 실패");
    }
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">인디스트릿 공연장소 검색</h2>

        <div className="inputField">
          <label className="label">장소 이름</label>
          <TextField
            label="장소 이름"
            variant="outlined"
            fullWidth
            value={place.name}
            onChange={handlePlaceSearch} // 검색 시 호출
            onKeyDown={handleKeyDown} // 키보드 이벤트 처리
          />
          {searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((result, index) => (
                <MenuItem
                  key={result.name}
                  onClick={() => handleSelectPlace(result)}
                  selected={index === selectedIndex} // 선택된 아이템 강조
                >
                  {result.name}
                </MenuItem>
              ))}
            </div>
          )}
        </div>

        <div className="inputField">
          <label className="label">장소 주소</label>
          <TextField
            label="장소 주소"
            variant="outlined"
            fullWidth
            value={place.address}
            onChange={(e) => setPlace({ ...place, address: e.target.value })}
          />
        </div>

        <div className="inputField">
          <label className="label">위도</label>
          <TextField
            label="위도"
            variant="outlined"
            fullWidth
            type="number"
            value={place.latitude}
            onChange={(e) => setPlace({ ...place, latitude: e.target.value })}
          />
        </div>

        <div className="inputField">
          <label className="label">경도</label>
          <TextField
            label="경도"
            variant="outlined"
            fullWidth
            type="number"
            value={place.longitude}
            onChange={(e) => setPlace({ ...place, longitude: e.target.value })}
          />
        </div>

        <div className="inputField">
          <FormControl fullWidth variant="outlined">
            <InputLabel>나라 선택</InputLabel>
            <Select
              label="나라 선택"
              value={place.countryID}
              onChange={(e) =>
                setPlace({ ...place, countryID: e.target.value })
              }
            >
              {countries &&
                countries.map((country) => (
                  <MenuItem key={country.countryID} value={country.countryID}>
                    {country.countryName}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>

        <div className="buttonContainer">
          <Button
            onClick={handleUpload}
            variant="contained"
            sx={{
              backgroundColor: "#34495e",
              "&:hover": {
                backgroundColor: "#2c3e50",
              },
            }}
          >
            등록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchPlace;
