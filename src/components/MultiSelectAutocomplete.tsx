import { Autocomplete, Chip, TextField } from '@mui/material';
import React from 'react';

interface MultiSelectAutocompleteProps {
  options: { id: number; name: string }[]; // Country 타입의 배열
  selectedIDs: number[]; // 선택된 ID
  setSelectedIDs: (ids: number[]) => void; // ID 설정 함수
  label: string; // 레이블
  textLabel: string; // 텍스트 레이블
}

const MultiSelectAutocomplete = (props: MultiSelectAutocompleteProps) => {
  return (
    <div>
      <div className="inputField">
        <label className="label">{props.label}</label>
        <Autocomplete
          multiple
          options={props.options}
          getOptionLabel={(option) => option.name}
          value={props.options.filter((option) => props.selectedIDs.includes(option.id))}
          onChange={(event, newValue) => {
            props.setSelectedIDs(newValue.map((option) => option.id));
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label={props.textLabel}
              placeholder={props.textLabel}
              sx={{
                '& .MuiInputLabel-root': {
                  color: 'white',
                },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  backgroundColor: '#2A2830',
                  '& input': {
                    color: '#eaeaea',
                  },
                },
              }}
            />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => {
              const { key, ...tagProps } = getTagProps({ index }); // Extract key explicitly
              return (
                <Chip
                  key={key} // Pass key directly here
                  label={option.name}
                  {...tagProps}
                  onDelete={() => {
                    const newIDs = props.selectedIDs.filter((id) => id !== option.id);
                    props.setSelectedIDs(newIDs);
                  }}
                />
              );
            })
          }
        />
      </div>

      <div className="selectedCountries" style={{ marginTop: '20px' }}>
        {props.selectedIDs.map((id) => (
          <div key={id} className="chip">
            <span>{props.options && props.options.find((c) => c.id === id)?.name}</span>
            <button
              className="chipRemoveButton"
              onClick={() => {
                const newIDs = props.selectedIDs.filter((selectedID) => selectedID !== id);
                props.setSelectedIDs(newIDs);
              }}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MultiSelectAutocomplete;
