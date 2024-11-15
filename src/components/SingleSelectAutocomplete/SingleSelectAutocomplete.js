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
          />
        )}
      />
    </div>
  );
};

export default SingleSelectAutocomplete;
