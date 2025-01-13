import React, { useState } from 'react';
import { ApiError, ApiResponse } from '../../types/common';
import { usePlace } from '../../apis/place';
import { PlaceParams } from '../../apis/place.types';
import { useGetCountryList } from '../../apis/country';
import { InputValueForm } from '../../components/common/InputValueForm';
import CommonButton from '../../components/common/CommonButton';
import SingleSelectAutocomplete from '../../components/SingleSelectAutocomplete';
import KakaoMap from 'components/KakaoMap';

const Place = () => {
  const [inputValue, setInputValue] = useState<PlaceParams>({
    placeName: '',
    address: '',
    latitude: NaN,
    longitude: NaN,
    countryID: NaN,
  });

  const { data: countryData } = useGetCountryList();

  const onSuccess = (data: ApiResponse<null>) => {
    alert('장소 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('장소 등록 실패:', error);
    alert('장소 등록 실패');
  };

  const { mutate } = usePlace(onSuccess, onError);

  const handleSubmit = () => {
    if (
      !inputValue.placeName.trim() ||
      !inputValue.address.trim() ||
      isNaN(inputValue.latitude) ||
      isNaN(inputValue.longitude) ||
      isNaN(inputValue.countryID)
    ) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    const data: PlaceParams = inputValue;
    mutate(data);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">공연장 등록</h2>
        <InputValueForm
          label="장소 이름*"
          textLabel="장소 이름"
          value={inputValue.placeName}
          onChange={(e) => setInputValue((prev) => ({ ...prev, placeName: e.target.value }))}
        />
        <InputValueForm
          label="장소 주소*"
          textLabel="장소 주소"
          value={inputValue.address}
          onChange={(e) => setInputValue((prev) => ({ ...prev, address: e.target.value }))}
        />
        <InputValueForm
          label="위도*"
          textLabel="위도"
          type="number"
          value={isNaN(inputValue.latitude) ? '' : `${inputValue.latitude}`} // 숫자로 관리
          onChange={(e) => {
            const latitudeValue = parseFloat(e.target.value);
            setInputValue((prev) => ({
              ...prev,
              latitude: isNaN(latitudeValue) ? NaN : latitudeValue,
            })); // 숫자로 변환
          }}
        />
        <InputValueForm
          label="경도*"
          textLabel="경도"
          type="number"
          value={isNaN(inputValue.longitude) ? '' : `${inputValue.longitude}`} // 숫자로 관리
          onChange={(e) => {
            const longitudeValue = parseFloat(e.target.value);
            setInputValue((prev) => ({
              ...prev,
              longitude: isNaN(longitudeValue) ? NaN : longitudeValue,
            })); // 숫자로 변환
          }}
        />

        <KakaoMap />

        <SingleSelectAutocomplete
          options={countryData || []}
          selectedID={inputValue.countryID}
          setSelectedID={(id) => setInputValue({ ...inputValue, countryID: id })}
          label="공연장 나라 선택*"
          textLabel="나라 선택"
        />

        <CommonButton onClick={handleSubmit} title="등록" />
      </div>
    </div>
  );
};

export default Place;
