import React, { useEffect } from "react";
import { TextField, Button } from "@mui/material";

const KakaoMap = () => {
  const API_KEY = process.env.KAKAO_MAP_JAVASCRIPT_KEY; // 발급받은 키 입력
  const [keyword, setKeyword] = React.useState("");
  const [map, setMap] = React.useState(null);
  const [marker, setMarker] = React.useState(null);
  const [locationInfo, setLocationInfo] = React.useState({
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${API_KEY}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심 좌표
          level: 3,
        };
        const newMap = new window.kakao.maps.Map(mapContainer, options);
        setMap(newMap);
      });
    };
    document.head.appendChild(script);
  }, [API_KEY]);

  const searchPlaces = () => {
    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const firstPlace = data[0];
        const latlng = new window.kakao.maps.LatLng(firstPlace.y, firstPlace.x);
        map.setCenter(latlng);

        if (marker) {
          marker.setMap(null); // 기존 마커 제거
        }

        const newMarker = new window.kakao.maps.Marker({
          position: latlng,
        });
        newMarker.setMap(map);
        setMarker(newMarker);

        window.kakao.maps.event.addListener(map, "click", (mouseEvent) => {
          const clickedPosition = mouseEvent.latLng;
          setLocationInfo({
            latitude: clickedPosition.getLat(),
            longitude: clickedPosition.getLng(),
          });
        });
      }
    });
  };

  return (
    <div>
      <div>
        <TextField
          label="장소 검색"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={searchPlaces} variant="contained">
          검색
        </Button>
      </div>
      <div
        id="map"
        style={{ width: "100%", height: "400px", marginTop: "20px" }}
      ></div>
      <div style={{ marginTop: "20px" }}>
        <h3>위치 정보</h3>
        <p>위도: {locationInfo.latitude}</p>
        <p>경도: {locationInfo.longitude}</p>
      </div>
    </div>
  );
};

export default KakaoMap;
