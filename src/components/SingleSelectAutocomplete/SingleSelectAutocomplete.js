import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const SingleSelectAutocomplete = ({
  options = [],
  selectedID,
  setSelectedID,
  label,
  textLabel,
}) => {
  return (
    <div className="inputField">
      <label className="label">{label}</label>
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.name}
        value={options.find((option) => option.id === selectedID) || null}
        onChange={(event, newValue) => {
          setSelectedID(newValue ? newValue.id : null);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={textLabel}
            placeholder={textLabel}
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
        )}
      />
    </div>
  );
};

export default SingleSelectAutocomplete;
