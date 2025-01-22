import { Dialog, DialogContent, DialogTitle, TextareaAutosize } from '@mui/material';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { EventDataParams, EventEditParams } from '../../../apis/event.types';
import { useGetPlaceList } from '../../../apis/place';
import { useGetGenreList } from '../../../apis/genre';
import { useGetArtistList } from '../../../apis/artist';
import { useGetEventTypeList } from '../../../apis/eventType';
import { InputValueForm } from '../../../components/common/InputValueForm';
import MultiSelectAutocomplete from '../../../components/MultiSelectAutocomplete';
import SingleSelectAutocomplete from '../../../components/SingleSelectAutocomplete';
import { useEditEvent, useGetEventById } from '../../../apis/event';
import CommonButton from '../../../components/common/CommonButton';
import { ApiError, ApiResponse } from '../../../types/common';
import useMakeSaveUrl from '../../../hooks/useMakeSaveUrl';

interface EventEditProps {
  openEditDialog: boolean;
  setOpenEditDialog: () => void;
  selectedEventId: string;
}

const EventEditBox = ({ openEditDialog, setOpenEditDialog, selectedEventId }: EventEditProps) => {
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
  const { data: selectedEventData } = useGetEventById(selectedEventId);

  const makeSaveUrl = useMakeSaveUrl();

  const onSuccess = (data: ApiResponse<null>) => {
    alert('이벤트 수정 성공');
    setOpenEditDialog();
    window.location.reload();
  };

  const onError = (error: ApiError) => {
    console.error('이벤트 수정 실패:', error);
    alert('이벤트 수정 실패');
  };

  const { mutate } = useEditEvent(onSuccess, onError);

  if (!process.env.REACT_APP_S3_URL || !process.env.REACT_APP_CLOUDFRONT_URL) {
    throw new Error('환경 변수가 정의되지 않았습니다.');
  }

  const S3_URL = process.env.REACT_APP_S3_URL;
  const CLOUDFRONT_URL = process.env.REACT_APP_CLOUDFRONT_URL;

  const urlToFile = useCallback(
    async (url: string, filename: string) => {
      if (!S3_URL || !CLOUDFRONT_URL) {
        throw new Error('환경 변수가 정의되지 않았습니다.');
      }

      const newUrl = url.replace(S3_URL, CLOUDFRONT_URL);

      const saveUrl = makeSaveUrl(newUrl);

      const response = await fetch(saveUrl);
      if (!response.ok) {
        throw new Error(`파일을 가져오는 데 실패했습니다: ${response.statusText}`);
      }

      const blob = await response.blob();
      return new File([blob], filename, { type: blob.type });
    },
    [S3_URL, CLOUDFRONT_URL, makeSaveUrl],
  );

  const loadImages = useCallback(
    async (posterURL: string, descriptionURLs: string[]) => {
      const posterFile = await urlToFile(posterURL, 'posterImage.jpeg');
      setPosterImage(posterFile);
      setPreviewPosterImage(URL.createObjectURL(posterFile));

      const descriptionFiles = await Promise.all(
        descriptionURLs.map((url) => urlToFile(url, 'descriptionImage.jpeg')),
      );
      setDescriptionImages(descriptionFiles);
      setPreviewDescriptionImages(descriptionFiles.map((file) => URL.createObjectURL(file)));
    },
    [urlToFile],
  );

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
      inputValue.startTime = `${inputValue.startTime}`;
    } else {
      inputValue.startTime = '00:00:00';
    }

    const data: EventEditParams = {
      file: posterImage,
      files: descriptionImages,
      data: inputValue,
      event_num: selectedEventId,
    };

    mutate(data);
  };

  useEffect(() => {
    if (!selectedEventData) return;
    setInputValue({
      eventName: selectedEventData[0].name,
      placeIDs: selectedEventData[0].places.map((place) => place.id),
      genreIDs: selectedEventData[0].genres.map((genre) => genre.id),
      artistIDs: selectedEventData[0].artists.map((artist) => artist.id),
      eventTypeID: selectedEventData[0].eventType[0].id,
      startDate: selectedEventData[0].startDate,
      endDate: selectedEventData[0].endDate,
      startTime: selectedEventData[0].startTime,
      description: selectedEventData[0].description,
      reservationStartDate: selectedEventData[0].reservationStartDate || '',
    });

    loadImages(selectedEventData[0].posterImageURL, selectedEventData[0].descriptionImageURLS);
  }, [selectedEventData, loadImages]);

  return (
    <Dialog open={openEditDialog} onClose={setOpenEditDialog} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          backgroundColor: '#100f11',
          color: '#7556ff',
        }}
      >
        이벤트 수정
      </DialogTitle>

      <DialogContent
        sx={{
          backgroundColor: '#100f11',
        }}
      >
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
              borderRadius: '12px',
              backgroundColor: '#2A2830',
              color: '#eaeaea',
              border: 'none',
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
      </DialogContent>
    </Dialog>
  );
};

export default EventEditBox;
