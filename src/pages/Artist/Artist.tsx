import React, { ChangeEvent, useState } from 'react';
import { ArtistDataParams, ArtistParams } from '../../apis/artist.types';
import { useGetGenreList } from '../../apis/genre';
import { useGetCountryList } from '../../apis/country';
import { InputValueForm } from '../../components/common/InputValueForm';
import MultiSelectAutocomplete from '../../components/MultiSelectAutocomplete';
import { TextareaAutosize } from '@mui/material';
import { ApiError, ApiResponse } from '../../types/common';
import { useArtist } from '../../apis/artist';
import CommonButton from '../../components/common/CommonButton';

const Artist = () => {
  const [inputValue, setInputValue] = useState<ArtistDataParams>({
    artistName: '',
    genreIDs: [],
    description: '',
    countryIDs: [],
  });

  const onSuccess = (data: ApiResponse<null>) => {
    alert('아티스트 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('아티스트 등록 실패:', error);
    alert('아티스트 등록 실패');
  };

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewProfileImage, setPreviewProfileImage] = useState<string | null>(null);

  const { data: eventGenreData } = useGetGenreList();
  const { data: countryData } = useGetCountryList();

  const { mutate } = useArtist(onSuccess, onError);

  const handleSubmit = () => {
    console.log(inputValue);

    if (
      !inputValue.artistName.trim() ||
      !inputValue.genreIDs.length ||
      !inputValue.countryIDs.length ||
      !profileImage
    ) {
      alert('모든 필드를 올바르게 입력해주세요.');
      return;
    }

    const data: ArtistParams = { file: profileImage, data: inputValue };

    mutate(data);
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(file);
        setPreviewProfileImage(reader.result as string);
      };
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewProfileImage(null);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">아티스트 등록</h2>

        <InputValueForm
          label="아티스트 이름*"
          textLabel="아티스트 이름"
          value={inputValue.artistName}
          onChange={(e) => setInputValue((prev) => ({ ...prev, artistName: e.target.value }))}
        />

        <MultiSelectAutocomplete
          options={countryData || []}
          selectedIDs={inputValue.countryIDs}
          setSelectedIDs={(ids) => setInputValue({ ...inputValue, countryIDs: ids })}
          label="아티스트 국적 선택*"
          textLabel="나라 선택"
        />

        <div className="inputField">
          <label className="label">아티스트 설명</label>
          <TextareaAutosize
            aria-label="content"
            minRows={5}
            style={{
              width: '100%',
              resize: 'none',
              borderRadius: '12px', // borderRadius를 12로 설정
              backgroundColor: '#2A2830', // 배경색을 설정
              color: '#eaeaea', // value 색상을 설정
              border: 'none', // 테두리 제거 (원하는 경우)
            }}
            placeholder="내용을 입력해주세요."
            value={inputValue.description || ''}
            onChange={(e) => setInputValue({ ...inputValue, description: e.target.value })}
          />
        </div>

        <MultiSelectAutocomplete
          options={eventGenreData || []}
          selectedIDs={inputValue.genreIDs}
          setSelectedIDs={(ids) => setInputValue({ ...inputValue, genreIDs: ids })}
          label="아티스트 장르 선택*"
          textLabel="장르 선택"
        />

        {/* 프로필 이미지 업로드 */}
        <div className="inputField">
          <label className="label">프로필 이미지 업로드*</label>
          <input type="file" accept=".png,.jpeg,.jpg,.gif" onChange={(e) => handleImage(e)} />
        </div>

        {/* 프로필 이미지 미리보기 */}
        {previewProfileImage && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <img
              src={previewProfileImage}
              alt="프로필 미리보기"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
              }}
            />
            <button
              onClick={handleRemoveImage}
              style={{
                position: 'relative',
                top: '-175px',
                right: '25px',
                backgroundColor: 'red',
                color: 'white',
                borderRadius: '50%',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              &times;
            </button>
          </div>
        )}

        <CommonButton onClick={handleSubmit} title="등록" />
      </div>
    </div>
  );
};

export default Artist;
