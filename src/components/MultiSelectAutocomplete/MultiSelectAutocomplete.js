import React from "react";
import { Autocomplete, Chip, TextField } from "@mui/material";

const MultiSelectAutocomplete = ({
  options = [],
  selectedIds = [],
  setSelectedIds,
  label,
  textLabel,
}) => {
  return (
    <div className="inputField">
      <label className="label">{label}</label>
      <Autocomplete
        multiple
        options={options}
        getOptionLabel={(option) => option.name}
        value={options.filter((option) => selectedIds.includes(option.id))}
        onChange={(event, newValue) => {
          setSelectedIds(newValue.map((option) => option.id));
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={textLabel}
            placeholder={`${textLabel}`}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={option.name}
              {...getTagProps({ index })}
              onDelete={() => {
                const newIDs = selectedIds.filter((id) => id !== option.id);
                setSelectedIds(newIDs);
              }}
            />
          ))
        }
        // filterOptions={(options, { inputValue }) => {
        //   const filtered = options.filter((option) =>
        //     option.name.toLowerCase().includes(inputValue.toLowerCase())
        //   );

        //   return filtered.slice(0, 5); // 최대 5개 항목만 표시
        // }}
      />
    </div>
  );
};

export default MultiSelectAutocomplete;
