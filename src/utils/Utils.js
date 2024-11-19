import axios from "axios";

const API_URL = process.env.REACT_APP_URL;

// 공통 fetchData 함수 정의
export const fetchSingleData = async (url, setData, errorMessage) => {
  try {
    const response = await axios.get(`${API_URL}/${url}`);

    setData(response.data);
  } catch (error) {
    console.error(`${errorMessage}:`, error);
  }
};

// 공통 업로드 함수
export const handleUploadSingleData = async (
  data,
  apiEndpoint,
  successMessage,
  errorMessage,
  fieldName // 동적으로 사용할 필드명 (예: countryName, genreName 등)
) => {
  if (!data[fieldName]) {
    alert("빈 칸없이 채워주세요");
    return;
  }

  // 동적으로 필드명을 설정한 데이터 객체 생성
  const requestData = { [fieldName]: data[fieldName] };

  try {
    const response = await axios.post(
      `${API_URL}/${apiEndpoint}`,
      `/${apiEndpoint}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    alert(`${successMessage}: ${response.data.id}`);
    window.location.reload();
  } catch (error) {
    let errorMessageToShow = errorMessage;

    if (error.response && error.response.data) {
      errorMessageToShow = error.response.data.message || errorMessage;
    } else if (error.message) {
      errorMessageToShow = error.message;
    }

    console.error(`${errorMessageToShow}:`, error);
    alert(`${errorMessageToShow}`);
  }
};

// 공통 추가 함수
export const handleAddItem = (type, setData, data, id) => {
  if (!data[type].includes(id)) {
    setData({ ...data, [type]: [...data[type], id] });
  }
};

// 공통 삭제 함수
export const handleRemoveItem = (type, setData, data, id) => {
  setData({
    ...data,
    [type]: data[type].filter((itemId) => itemId !== id),
  });
};
