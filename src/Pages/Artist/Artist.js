import "../../Styles/Layout.css";
import "../../Styles/Component.css";
import React, { useState, useEffect } from "react";
import { TextField, Button, TextareaAutosize } from "@mui/material";
import axios from "axios";
import { fetchSingleData } from "../../Utils/Utils";
import MultiSelectAutocomplete from "../../components/MultiSelectAutocomplete/MultiSelectAutocomplete";

const Artist = () => {
  const [artist, setArtist] = useState({
    artistName: "",
    genreIDs: [],
    description: "",
    countryIDs: [],
  });

  const [countries, setCountries] = useState([]);
  const [genres, setGenres] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewProfileImage, setPreviewProfileImage] = useState(null);

  const API_URL = process.env.REACT_APP_URL;

  const handleImage = (e) => {
    const file = e.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfileImage(file);
        setPreviewProfileImage(reader.result);
      };
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewProfileImage(null);
  };

  const handleUpload = async () => {
    if (
      !artist.artistName ||
      !profileImage ||
      !artist.genreIDs.length ||
      !artist.countryIDs.length
    ) {
      alert("빈칸없이 채워주세요");
      return;
    }

    const formData = new FormData();
    formData.append("artistName", artist.artistName);
    formData.append("description", artist.description);
    formData.append("countryIDs", JSON.stringify(artist.countryIDs));
    formData.append("genreIDs", JSON.stringify(artist.genreIDs));
    formData.append("profileImage", profileImage);

    for (const x of formData.entries()) {
      console.log(x);
    }

    try {
      const response = await axios.post(`${API_URL}/artist/register`, formData);
      alert("아티스트 등록 성공: " + response.data.id);
      window.location.reload();
    } catch (error) {
      console.error("아티스트 등록 실패:", error);
      alert("아티스트 등록 실패");
    }
  };

  useEffect(() => {
    fetchSingleData(
      "genre/get",
      (data) => setGenres(data.genres),
      "장르 목록 가져오기 실패"
    );
    fetchSingleData(
      "country/get",
      (data) => setCountries(data.countries),
      "나라 목록 가져오기 실패"
    );
  }, []);

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">아티스트 등록</h2>
        <div className="inputField">
          <label className="label">아티스트 이름</label>
          <TextField
            label="아티스트 이름"
            variant="outlined"
            fullWidth
            value={artist.artistName}
            onChange={(e) =>
              setArtist({ ...artist, artistName: e.target.value })
            }
          />
        </div>

        {/* 국적 선택 - Autocomplete */}
        <MultiSelectAutocomplete
          options={countries}
          selectedIds={artist.countryIDs}
          setSelectedIds={(ids) => setArtist({ ...artist, countryIDs: ids })}
          label="아티스트 국적 선택"
          textLabel="나라 선택"
        />

        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {artist.countryIDs.map((id) => (
            <div key={id} className="countryChip">
              <span>{countries.find((c) => c.id === id)?.name}</span>
              <button
                className="removeButton"
                onClick={() => {
                  const newIDs = artist.countryIDs.filter(
                    (countryId) => countryId !== id
                  );
                  setArtist((prev) => ({ ...prev, countryIDs: newIDs }));
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <div className="inputField">
          <label className="label">아티스트 설명</label>
          <TextareaAutosize
            aria-label="content"
            minRows={5}
            style={{ width: "100%", height: "50px", resize: "none" }}
            placeholder="내용을 입력해주세요."
            value={artist.description || ""}
            onChange={(e) =>
              setArtist({ ...artist, description: e.target.value })
            }
          />
        </div>

        {/* 장르 선택 - Autocomplete */}
        <MultiSelectAutocomplete
          options={genres}
          selectedIds={artist.genreIDs}
          setSelectedIds={(ids) => setArtist({ ...artist, genreIDs: ids })}
          label="아티스트 장르 선택"
          textLabel="장르 선택"
        />

        {/* 선택된 장르 목록 */}
        <div className="selectedCountries" style={{ marginTop: "20px" }}>
          {artist.genreIDs.map((id) => (
            <div key={id} className="countryChip">
              <span>{genres.find((g) => g.id === id)?.name}</span>
              <button
                className="removeButton"
                onClick={() => {
                  const newIDs = artist.genreIDs.filter(
                    (genreId) => genreId !== id
                  );
                  setArtist((prev) => ({ ...prev, genreIDs: newIDs }));
                }}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        {/* 프로필 이미지 업로드 */}
        <div className="inputField">
          <label className="label">프로필 이미지 업로드</label>
          <input
            type="file"
            accept=".png,.jpeg"
            onChange={(e) => handleImage(e)}
          />
        </div>

        {/* 프로필 이미지 미리보기 */}
        {previewProfileImage && (
          <div style={{ position: "relative", marginBottom: "20px" }}>
            <img
              src={previewProfileImage}
              alt="프로필 미리보기"
              style={{
                width: "200px",
                height: "200px",
                objectFit: "cover",
              }}
            />
            <button
              onClick={handleRemoveImage}
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

export default Artist;
