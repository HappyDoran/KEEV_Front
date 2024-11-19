import React, { useEffect, useState } from "react";
import { TextField, Button, Grid2 } from "@mui/material";

const KakaoMap = () => {
  const API_KEY = process.env.REACT_APP_KAKAO_MAP_JAVASCRIPT_KEY; // 발급받은 키 입력
  const [keyword, setKeyword] = React.useState("");
  const [map, setMap] = React.useState(null);
  const [markers, setMarkers] = React.useState([]); // 마커 배열
  const [locationInfo, setLocationInfo] = React.useState({
    latitude: "",
    longitude: "",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  // 드롭다운 토글 함수
  const toggleDropdown = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3,
        };
        const newMap = new window.kakao.maps.Map(mapContainer, options);
        setMap(newMap);

        // 지도 클릭 이벤트 추가
        window.kakao.maps.event.addListener(newMap, "click", (mouseEvent) => {
          const clickedPosition = mouseEvent.latLng;
          setLocationInfo({
            latitude: clickedPosition.getLat(),
            longitude: clickedPosition.getLng(),
          });
        });
      });
    };
    document.head.appendChild(script);
  }, [API_KEY]);

  const searchPlaces = () => {
    if (!window.kakao || !window.kakao.maps) {
      console.error("Kakao Maps API가 로드되지 않았습니다.");
      return; // API가 로드되지 않았을 경우 종료
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        const newMarkers = []; // 새롭게 생성된 마커 배열

        for (let i = 0; i < data.length; i++) {
          const place = data[i];
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });

          // 마커 클릭 시 인포윈도우에 장소명 표시
          const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
          window.kakao.maps.event.addListener(marker, "click", () => {
            infowindow.setContent(
              '<div style="padding:5px;font-size:12px;">' +
                place.place_name +
                "</div>"
            );
            infowindow.open(map, marker);
          });

          newMarkers.push(marker); // 마커를 배열에 추가
          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        }

        setMarkers(newMarkers); // 상태 업데이트
        map.setBounds(bounds); // 검색된 장소 위치를 기준으로 지도 범위를 재설정
      } else {
        console.error("장소 검색 실패:", status);
      }
    });
  };

  return (
    <div>
      <label className="label">좌표 검색</label>
      <div style={{ display: "flex", gap: "10px" }}>
        <TextField
          fullWidth
          label="장소 검색"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            "& .MuiInputLabel-root": {
              color: "white", // label 색상을 흰색으로 설정
            },
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px", // borderRadius를 12로 설정
              backgroundColor: "#2A2830", // 배경색을 흰색으로 설정
              "& input": {
                color: "#eaeaea", // value 색상을 흰색으로 설정
              },
            },
          }}
        />
        <Button
          sx={{
            backgroundColor: "#7556ff",
            "&:hover": {
              backgroundColor: "#292346",
            },
          }}
          onClick={searchPlaces}
          variant="contained"
        >
          검색
        </Button>
      </div>

      <div
        id="map"
        style={{ width: "100%", height: "400px", marginTop: "20px" }}
      />
      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h3 style={{ color: "#7556ff" }}>위치 정보</h3>
        <p style={{ color: "#eaeaea" }}>위도: {locationInfo.latitude}</p>
        <p style={{ color: "#eaeaea" }}>경도: {locationInfo.longitude}</p>
      </div>
    </div>
  );
};

export default KakaoMap;
