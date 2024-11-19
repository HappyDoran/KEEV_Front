import "../../Styles/Layout.css";
import React, { useState, useEffect } from "react";
import { TextField, Button } from "@mui/material";
import axios from "axios";
import { fetchSingleData } from "../../utils/Utils";
import SingleSelectAutocomplete from "../../components/SingleSelectAutocomplete/SingleSelectAutocomplete";
import KakaoMap from "../../components/KakaoMap/KakaoMap";

const Place = () => {
  const [place, setPlace] = useState({
    placeName: "", // 장소 이름
    address: "", // 장소 주소
    latitude: "", // 장소 위도
    longitude: "", // 장소 경도
    countryID: "", // 나라 ID
  });

  const [countries, setCountries] = useState([]);

  const API_URL = process.env.REACT_APP_URL;

  useEffect(() => {
    fetchSingleData(
      "country/get",
      (data) => setCountries(data.countries),
      "나라 목록 가져오기 실패"
    );
  }, []);

  const handleUpload = async () => {
    // 필수 필드 확인
    if (
      !place.placeName ||
      !place.address ||
      !place.latitude ||
      !place.longitude ||
      !place.countryID
    ) {
      alert("빈 칸없이 채워주세요");
      return;
    }

    const placeData = {
      placeName: place.placeName,
      address: place.address,
      latitude: place.latitude,
      longitude: place.longitude,
      countryID: place.countryID,
    };

    try {
      const response = await axios.post(
        `${API_URL}/place/register`,
        placeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      alert("장소 등록 성공: " + response.data.id);
    } catch (error) {
      console.error("장소 등록 실패:", error);
      alert("장소 등록 실패");
    }
  };

  const Input = ({ label, value, onChange }) => {
    return (
      <div className="inputField">
        <label className="label">{label}</label>
        <TextField
          label={label}
          variant="outlined"
          fullWidth
          value={value}
          onChange={onChange}
        />
      </div>
    );
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">공연장소 등록</h2>
        <div className="inputField">
          <label className="label">장소 이름*</label>
          <TextField
            label="장소 이름"
            variant="outlined"
            fullWidth
            value={place.placeName}
            onChange={(e) => setPlace({ ...place, placeName: e.target.value })} // 상태 업데이트
          />
        </div>

        <div className="inputField">
          <label className="label">장소 주소*</label>
          <TextField
            label="장소 주소"
            variant="outlined"
            fullWidth
            value={place.address}
            onChange={(e) => setPlace({ ...place, address: e.target.value })} // 상태 업데이트
          />
        </div>

        <div className="inputField">
          <label className="label">위도*</label>
          <TextField
            label="위도"
            variant="outlined"
            fullWidth
            type="number"
            value={place.latitude}
            onChange={(e) => setPlace({ ...place, latitude: e.target.value })} // 상태 업데이트
          />
        </div>

        <div className="inputField">
          <label className="label">경도*</label>
          <TextField
            label="경도"
            variant="outlined"
            fullWidth
            type="number"
            value={place.longitude}
            onChange={(e) => setPlace({ ...place, longitude: e.target.value })} // 상태 업데이트
          />
        </div>

        <SingleSelectAutocomplete
          options={countries}
          selectedID={place.countryID}
          setSelectedID={(id) => setPlace({ ...place, countryID: id })}
          label="공연장 나라 선택*"
          textLabel="나라 선택"
        />

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

export default Place;
