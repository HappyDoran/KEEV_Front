import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const KakaoMap = () => {
  const [keyword, setKeyword] = useState('');
  const [map, setMap] = useState<any>(null);
  const [locationInfo, setLocationInfo] = useState({
    latitude: '',
    longitude: '',
  });

  useEffect(() => {
    let container = document.getElementById(`map`); // 지도를 담을 영역의 DOM 레퍼런스
    let options = {
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 지도 중심 좌표
      level: 3, // 지도의 레벨(확대, 축소 정도)
    };

    let map = new window.kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
    setMap(map);

    window.kakao.maps.event.addListener(map, 'click', (mouseEvent: any) => {
      const clickedPosition = mouseEvent.latLng;
      setLocationInfo({
        latitude: clickedPosition.getLat(),
        longitude: clickedPosition.getLng(),
      });
    });
  }, []);

  const searchPlaces = () => {
    if (!map) {
      console.error('지도 객체가 초기화되지 않았습니다.');
      return;
    }

    if (!window.kakao || !window.kakao.maps) {
      console.error('Kakao Maps API가 로드되지 않았습니다.');
      return;
    }

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, (data: any[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();

        data.forEach((place) => {
          const marker = new window.kakao.maps.Marker({
            map: map,
            position: new window.kakao.maps.LatLng(place.y, place.x),
          });

          const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infowindow.setContent(
              `<div style="padding:5px;font-size:12px;">${place.place_name}</div>`,
            );
            infowindow.open(map, marker);
          });

          bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
        });

        map.setBounds(bounds);
      } else {
        console.error('장소 검색 실패:', status);
      }
    });
  };

  return (
    <div>
      <label className="label">좌표 검색</label>
      <div style={{ display: 'flex', gap: '10px' }}>
        <TextField
          fullWidth
          label="장소 검색"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white', // label 색상을 흰색으로 설정
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', // borderRadius를 12로 설정
              backgroundColor: '#2A2830', // 배경색을 흰색으로 설정
              '& input': {
                color: '#eaeaea', // value 색상을 흰색으로 설정
              },
            },
          }}
        />
        <Button
          sx={{
            backgroundColor: '#7556ff',
            '&:hover': {
              backgroundColor: '#292346',
            },
          }}
          onClick={searchPlaces}
          variant="contained"
        >
          검색
        </Button>
      </div>

      <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }} />
      <div style={{ marginTop: '20px', marginBottom: '20px' }}>
        <h3 style={{ color: '#7556ff' }}>위치 정보</h3>
        <p style={{ color: '#eaeaea' }}>위도: {locationInfo.latitude}</p>
        <p style={{ color: '#eaeaea' }}>경도: {locationInfo.longitude}</p>
      </div>
    </div>
  );
};

export default KakaoMap;
