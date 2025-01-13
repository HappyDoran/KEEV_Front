import { ChangeEvent, useState } from 'react';
import { useGetPlaceList } from '../../apis/place';
import { useGetGenreList } from '../../apis/genre';
import { useGetArtistList } from '../../apis/artist';
import { useGetEventTypeList } from '../../apis/eventType';
import { InputValueForm } from '../../components/common/InputValueForm';
import { EventDataParams, EventParams } from '../../apis/event.types';
import MultiSelectAutocomplete from '../../components/MultiSelectAutocomplete';
import SingleSelectAutocomplete from '../../components/SingleSelectAutocomplete';
import { TextareaAutosize } from '@mui/material';
import CommonButton from '../../components/common/CommonButton';
import { ApiError, ApiResponse } from '../../types/common';
import { useEvent } from '../../apis/event';

const Event = () => {
  const [inputValue, setInputValue] = useState<EventDataParams>({
    eventName: '',
    placeIDs: [],
    genreIDs: [],
    artistIDs: [],
    eventTypeID: NaN,
    startDate: '',
    endDate: '',
    startTime: '',
    description: '',
    reservationStartDate: '',
  });

  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [descriptionImages, setDescriptionImages] = useState<File[]>([]);
  const [previewPosterImage, setPreviewPosterImage] = useState<string | null>(null);
  const [previewDescriptionImages, setPreviewDescriptionImages] = useState<string[]>([]);

  const { data: placeData } = useGetPlaceList();
  const { data: eventGenreData } = useGetGenreList();
  const { data: artistData } = useGetArtistList();
  const { data: eventTypeData } = useGetEventTypeList();

  const onSuccess = (data: ApiResponse<null>) => {
    alert('이벤트 등록 성공');
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('이벤트 등록 실패:', error);
    // 오류 처리를 여기에 작성할 수 있습니다.
    alert('이벤트 등록 실패');
  };

  const { mutate } = useEvent(onSuccess, onError);

  const handleImage = (type: string, e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (type === 'poster') {
          setPosterImage(file);
          setPreviewPosterImage(reader.result as string);
        } else if (type === 'description') {
          setDescriptionImages((prevImages) => [...prevImages, file]);
          setPreviewDescriptionImages((prevPreviews) => [...prevPreviews, reader.result as string]);
        }
      };
    });
  };

  const handleRemovePosterImage = () => {
    setPosterImage(null);
    setPreviewPosterImage(null);
  };

  const handleRemoveDescriptionImage = (indexToRemove: number) => {
    setDescriptionImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
    setPreviewDescriptionImages((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleSubmit = () => {
    if (
      !inputValue.eventName.trim() ||
      !inputValue.placeIDs.length ||
      !inputValue.genreIDs.length ||
      !inputValue.artistIDs.length ||
      isNaN(inputValue.eventTypeID) ||
      !inputValue.startDate.trim() ||
      !inputValue.endDate.trim() ||
      !posterImage
    ) {
      alert('빈칸없이 채워주세요');
      return;
    }

    if (inputValue.startTime !== '') {
      inputValue.startTime = `${inputValue.startTime}:00`;
    } else {
      inputValue.startTime = '00:00:00';
    }

    const data: EventParams = { file: posterImage, files: descriptionImages, data: inputValue };

    mutate(data);
  };

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">이벤트 등록</h2>

        <InputValueForm
          label="이벤트 이름*"
          textLabel="이벤트 이름"
          value={inputValue.eventName}
          onChange={(e) => setInputValue((prev) => ({ ...prev, eventName: e.target.value }))}
        />

        <MultiSelectAutocomplete
          options={placeData || []}
          selectedIDs={inputValue.placeIDs}
          setSelectedIDs={(ids) => setInputValue({ ...inputValue, placeIDs: ids })}
          label="이벤트 장소 선택*"
          textLabel="장소 선택"
        />

        <MultiSelectAutocomplete
          options={eventGenreData || []}
          selectedIDs={inputValue.genreIDs}
          setSelectedIDs={(ids) => setInputValue({ ...inputValue, genreIDs: ids })}
          label="이벤트 장르 선택*"
          textLabel="장르 선택"
        />

        <MultiSelectAutocomplete
          options={artistData || []}
          selectedIDs={inputValue.artistIDs}
          setSelectedIDs={(ids) => setInputValue({ ...inputValue, artistIDs: ids })}
          label="아티스트 선택*"
          textLabel="아티스트 선택"
        />

        <SingleSelectAutocomplete
          options={eventTypeData || []}
          selectedID={inputValue.eventTypeID}
          setSelectedID={(id) => setInputValue({ ...inputValue, eventTypeID: id })}
          label="공연 종류 선택*"
          textLabel="공연 종류 선택"
        />

        <InputValueForm
          label="이벤트 시작 날짜*"
          textLabel=""
          value={inputValue.startDate}
          type="date"
          onChange={(e) => setInputValue((prev) => ({ ...prev, startDate: e.target.value }))}
        />

        <InputValueForm
          label="이벤트 종료 날짜*"
          textLabel=""
          value={inputValue.endDate}
          type="date"
          onChange={(e) => setInputValue((prev) => ({ ...prev, endDate: e.target.value }))}
        />

        <InputValueForm
          label="이벤트 시작 시간"
          textLabel=""
          value={inputValue.startTime}
          type="time"
          onChange={(e) => setInputValue((prev) => ({ ...prev, startTime: e.target.value }))}
        />

        <div className="inputField">
          <label className="label">공연 설명</label>
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
            placeholder="상세 설명을 입력해주세요."
            value={inputValue.description || ''}
            onChange={(e) => setInputValue({ ...inputValue, description: e.target.value })}
          />
        </div>

        <div className="inputField">
          <label className="label">포스터 이미지 업로드*</label>
          <input
            type="file"
            accept=".png,.jpeg,.jpg,.gif"
            onChange={(e) => handleImage('poster', e)}
          />
        </div>

        {/* 포스터 이미지 미리보기 */}
        {previewPosterImage && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <img
              src={previewPosterImage}
              alt="포스터 미리보기"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
              }}
            />
            <button
              onClick={handleRemovePosterImage}
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

        <div className="inputField">
          <label className="label">상세 이미지 업로드</label>
          <input
            type="file"
            multiple
            accept=".png,.jpeg,.jpg,.gif"
            onChange={(e) => handleImage('description', e)}
          />
        </div>

        {/* 선택된 상세 이미지 미리보기*/}
        {previewDescriptionImages.length > 0 && (
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {previewDescriptionImages.map((previewUrl, index) => (
                <div key={index} style={{ position: 'relative' }}>
                  <img
                    src={previewUrl}
                    alt={`description-${index}`}
                    style={{
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                    }}
                  />
                  <button
                    onClick={() => handleRemoveDescriptionImage(index)}
                    style={{
                      position: 'relative',
                      top: '-75px',
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
              ))}
            </div>
          </div>
        )}

        <InputValueForm
          label="이벤트 예매 시작일"
          textLabel=""
          value={inputValue.reservationStartDate}
          type="datetime-local"
          onChange={(e) =>
            setInputValue((prev) => ({ ...prev, reservationStartDate: e.target.value }))
          }
        />

        <CommonButton onClick={handleSubmit} title="등록" />
      </div>
    </div>
  );
};

export default Event;
