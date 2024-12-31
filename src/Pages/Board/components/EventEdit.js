import "../../../Styles/Layout.css";
import "../../../Styles/Component.css";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  TextareaAutosize,
} from "@mui/material";
import MultiSelectAutocomplete from "../../../components/MultiSelectAutocomplete/MultiSelectAutocomplete";
import SingleSelectAutocomplete from "../../../components/SingleSelectAutocomplete/SingleSelectAutocomplete";
import axios from "axios";
import { fetchSingleData, handleEditItem } from "../../../utils/Utils";

const EventEdit = ({
  openEditDialog,
  setOpenEditDialog,
  selectedEvent,
  setSelectedEvent,
  setEvents,
  setFilteredEvents,
}) => {
  const API_URL = process.env.REACT_APP_URL;

  const [places, setPlaces] = useState([]);
  const [genres, setGenres] = useState([]);
  const [artists, setArtists] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [posterImage, setPosterImage] = useState(null);
  const [descriptionImages, setDescriptionImages] = useState([]);
  const [previewPosterImage, setPreviewPosterImage] = useState(null);
  const [previewDescriptionImages, setPreviewDescriptionImages] = useState([]);

  const S3_URL = process.env.REACT_APP_S3_URL;
  const CLOUDFRONT_URL = process.env.REACT_APP_CLOUDFRONT_URL;

  const urlToFile = async (url, filename) => {
    const newUrl = url.replace(S3_URL, CLOUDFRONT_URL);

    const response = await fetch(newUrl);
    const blob = await response.blob(); // Blob 객체로 변환
    return new File([blob], filename, { type: blob.type }); // File 객체 생성
  };

  useEffect(() => {
    // 데이터 가져오기
    fetchSingleData(
      "place/get",
      (data) => setPlaces(data.places),
      "장소 목록 가져오기 실패"
    );

    fetchSingleData(
      "genre/get",
      (data) => setGenres(data.genres),
      "장르 목록 가져오기 실패"
    );

    fetchSingleData(
      "artist/get",
      (data) => setArtists(data.artists),
      "아티스트 목록 가져오기 실패"
    );

    fetchSingleData(
      "eventType/get",
      (data) => setEventTypes(data.eventTypes),
      "공연 종류 목록 가져오기 실패"
    );

    const loadImages = async () => {
      if (selectedEvent.posterImageURL) {
        const posterFile = await urlToFile(
          selectedEvent.posterImageURL,
          "posterImage.jpeg"
        );
        setPosterImage(posterFile);
        setPreviewPosterImage(URL.createObjectURL(posterFile));
      }

      if (selectedEvent.descriptionImageURLS) {
        const descriptionFiles = await Promise.all(
          selectedEvent.descriptionImageURLS.map((url) =>
            urlToFile(url, "descriptionImage.jpeg")
          )
        );
        setDescriptionImages(descriptionFiles);
        setPreviewDescriptionImages(
          descriptionFiles.map((file) => URL.createObjectURL(file))
        );
      }
    };

    loadImages();
  }, [selectedEvent]);

  const handleImage = (type, e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (type === "poster") {
          setPosterImage(file);
          setPreviewPosterImage(reader.result);
        } else if (type === "description") {
          setDescriptionImages((prevImages) => [...prevImages, file]);
          setPreviewDescriptionImages((prevPreviews) => [
            ...prevPreviews,
            reader.result,
          ]);
        }
      };
    });
  };

  const handleRemoveDescriptionImage = (indexToRemove) => {
    setDescriptionImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
    setPreviewDescriptionImages((prevPreviews) =>
      prevPreviews.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleRemovePosterImage = () => {
    setPosterImage(null);
    setPreviewPosterImage(null);
  };

  const handleEditSubmit = async () => {
    try {
      if (
        !selectedEvent.name ||
        !selectedEvent.startDate ||
        !selectedEvent.endDate ||
        !selectedEvent.genres.length ||
        !selectedEvent.eventType ||
        !selectedEvent.places.length
      ) {
        alert("빈칸없이 채워주세요");
        return;
      }

      // 이벤트 데이터 객체 생성
      const eventData = {
        eventName: selectedEvent.name,
        description: selectedEvent.description,
        placeIDs: selectedEvent.places.map((place) => place.id), // ID 배열로 변환
        genreIDs: selectedEvent.genres.map((genre) => genre.id), // ID 배열로 변환
        artistIDs: selectedEvent.artists.map((artist) => artist.id), // ID 배열로 변환
        eventTypeID: selectedEvent.eventType[0]?.id, // eventType이 배열인 경우 첫 번째 ID 추출
        startDate: selectedEvent.startDate,
        endDate: selectedEvent.endDate,
        startTime:
          selectedEvent.startTime !== ""
            ? `${selectedEvent.startTime}`
            : "00:00:00",
        reservationStartDate: selectedEvent.reservationStartDate,
      };

      // FormData 객체 생성
      const formData = new FormData();

      // Blob으로 변환하여 FormData에 추가
      const json = JSON.stringify(eventData);

      const blob = new Blob([json], { type: "application/json" });
      formData.append("eventData", blob);

      // posterImage 추가
      formData.append("posterImage", posterImage);

      // descriptionImages 추가
      descriptionImages.forEach((file) => {
        formData.append("descriptionImages", file);
      });

      await axios.patch(
        `${API_URL}/event/update/${selectedEvent.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("이벤트 수정 성공");
      setOpenEditDialog(false);

      // 이벤트 목록 새로 고침
      fetchSingleData(
        "event/get",
        (data) => {
          setEvents(data.events);
          setFilteredEvents(data.events);
        },
        "이벤트 목록 가져오기 실패"
      );
    } catch (error) {
      alert("이벤트 수정 실패");
    }
  };

  return (
    <Dialog
      open={openEditDialog}
      onClose={() => setOpenEditDialog(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          backgroundColor: "#100f11",
          color: "#7556ff",
        }}
      >
        이벤트 수정
      </DialogTitle>
      <DialogContent
        sx={{
          backgroundColor: "#100f11",
        }}
      >
        <div className="inputField">
          <label className="label">이벤트 이름*</label>
          <TextField
            autoFocus
            margin="dense"
            label="제목"
            type="text"
            fullWidth
            variant="outlined"
            value={selectedEvent?.name || ""}
            onChange={(e) =>
              setSelectedEvent((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#2A2830",
                "& input": {
                  color: "#eaeaea",
                },
              },
            }}
          />
        </div>

        {/* 장소 선택 */}
        <MultiSelectAutocomplete
          options={places}
          selectedIds={selectedEvent.places.map((place) => place.id)} // places의 id 배열로 변환
          setSelectedIds={(ids) =>
            setSelectedEvent({
              ...selectedEvent,
              places: ids.map((id) => places.find((p) => p.id === id)), // 선택된 ID로 places 배열 업데이트
            })
          }
          label="이벤트 장소 선택*"
          textLabel="장소 선택"
          sx={{ backgroundColor: "#2A2830", marginTop: "20px" }}
        />

        {/* 선택된 장소 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {selectedEvent.places.map((place) => (
            <div key={place.id} className="chip">
              <span>{place.name}</span>
              <button
                className="chipRemoveButton"
                onClick={() =>
                  handleEditItem(
                    "places", // 'places'는 selectedEvent의 키
                    setSelectedEvent,
                    selectedEvent,
                    place.id // 제거할 항목의 ID
                  )
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 장르 선택 */}
        <MultiSelectAutocomplete
          options={genres}
          selectedIds={selectedEvent.genres.map((genre) => genre.id)}
          setSelectedIds={(ids) =>
            setSelectedEvent({
              ...selectedEvent,
              genres: ids.map((id) => genres.find((g) => g.id === id)), // 선택된 ID로 places 배열 업데이트
            })
          }
          label="이벤트 장르 선택*"
          textLabel="장르 선택"
          sx={{ backgroundColor: "#2A2830", marginTop: "20px" }}
        />

        {/* 선택된 장르 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {selectedEvent.genres.map((genre) => (
            <div key={genre.id} className="chip">
              <span>{genre.name}</span>
              <button
                className="chipRemoveButton"
                onClick={() =>
                  handleEditItem(
                    "genres",
                    setSelectedEvent,
                    selectedEvent,
                    genre.id
                  )
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 아티스트 선택 */}
        <MultiSelectAutocomplete
          options={artists}
          selectedIds={selectedEvent.artists.map((artist) => artist.id)}
          setSelectedIds={(ids) =>
            setSelectedEvent({
              ...selectedEvent,
              artists: ids.map((id) => artists.find((a) => a.id === id)), // 선택된 ID로 places 배열 업데이트
            })
          }
          label="아티스트 선택*"
          textLabel="아티스트 선택"
          sx={{ backgroundColor: "#2A2830", marginTop: "20px" }}
        />

        {/* 선택된 아티스트 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {selectedEvent.artists.map((artist) => (
            <div key={artist.id} className="chip">
              <span>{artist.name}</span>
              <button
                className="chipRemoveButton"
                onClick={() =>
                  handleEditItem(
                    "artists",
                    setSelectedEvent,
                    selectedEvent,
                    artist.id
                  )
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 공연 종류 선택 */}
        <SingleSelectAutocomplete
          options={eventTypes}
          selectedID={selectedEvent.eventType[0]?.id} // eventType 배열에서 첫 번째 요소의 ID를 선택
          setSelectedID={(id) =>
            setSelectedEvent({
              ...selectedEvent,
              eventType: [
                { id, name: eventTypes.find((type) => type.id === id)?.name },
              ], // 선택된 ID로 eventType 업데이트
            })
          }
          label="공연 종류 선택*"
          textLabel="공연 종류 선택"
          sx={{ marginTop: "20px" }}
        />

        {/* 날짜 및 시간 입력 */}
        <div className="inputField" style={{ marginTop: "20px" }}>
          <label className="label">이벤트 시작 날짜*</label>
          <TextField
            label="시작 날짜"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedEvent.startDate}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, startDate: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#2A2830",
                "& input": {
                  color: "#eaeaea",
                },
              },
            }}
          />
        </div>

        <div className="inputField">
          <label className="label">이벤트 종료 날짜*</label>
          <TextField
            label="종료 날짜"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedEvent.endDate}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, endDate: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#2A2830",
                "& input": {
                  color: "#eaeaea",
                },
              },
            }}
          />
        </div>

        <div className="inputField">
          <label className="label">이벤트 시작 시간</label>
          <TextField
            label="시작 시간"
            type="time"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={selectedEvent.startTime}
            onChange={(e) =>
              setSelectedEvent({ ...selectedEvent, startTime: e.target.value })
            }
            sx={{
              "& .MuiInputLabel-root": {
                color: "white",
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                backgroundColor: "#2A2830",
                "& input": {
                  color: "#eaeaea",
                },
              },
            }}
          />
        </div>

        <div className="inputField">
          <label className="label">공연 설명</label>
          <TextareaAutosize
            aria-label="content"
            minRows={3}
            style={{
              width: "100%",
              resize: "none",
              borderRadius: "12px",
              backgroundColor: "#2A2830",
              color: "#eaeaea",
              border: "none",
            }}
            placeholder="상세 설명을 입력해주세요."
            value={selectedEvent.description || ""}
            onChange={(e) =>
              setSelectedEvent({
                ...selectedEvent,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* 포스터 이미지 업로드 */}
        <div className="inputField">
          <label className="label">포스터 이미지 업로드*</label>
          <input
            type="file"
            accept=".png,.jpeg,.jpg,.gif"
            onChange={(e) => handleImage("poster", e)}
          />
        </div>

        {/* 포스터 이미지 미리보기 */}
        {previewPosterImage && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <img
              src={previewPosterImage}
              alt="포스터 미리보기"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <button
              onClick={handleRemovePosterImage}
              style={{
                position: "relative",
                top: "-175px",
                right: "25px",
                backgroundColor: "red",
                color: "white",
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
              }}
            >
              &times;
            </button>
          </div>
        )}

        {/* 상세 이미지 업로드 */}
        <div className="inputField">
          <label className="label">상세 이미지 업로드</label>
          <input
            type="file"
            accept=".png,.jpeg,.jpg,.gif"
            onChange={(e) => handleImage("description", e)}
          />
        </div>

        {/* 선택된 상세 이미지 목록 */}
        {previewDescriptionImages.length > 0 && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {previewDescriptionImages.map((previewUrl, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={previewUrl}
                    alt={`description-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                    }}
                  />

                  <button
                    onClick={() => handleRemoveDescriptionImage(index)}
                    style={{
                      position: "relative",
                      top: "-75px",
                      right: "25px",
                      backgroundColor: "red",
                      color: "white",
                      borderRadius: "50%",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions
        sx={{
          backgroundColor: "#100f11",
        }}
      >
        <Button
          onClick={() => setOpenEditDialog(false)}
          sx={{
            color: "#eaeaea",
            backgroundColor: "#818181",
            "&:hover": {
              backgroundColor: "#2A2830",
            },
          }}
        >
          취소
        </Button>
        <Button
          onClick={handleEditSubmit}
          sx={{
            color: "#eaeaea",
            backgroundColor: "#7556ff",
            "&:hover": {
              backgroundColor: "#292346",
            },
          }}
        >
          수정 완료
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventEdit;
