import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { Country } from '../apis/country.types';

interface SingleSelectAutocompleteProps {
  options: { id: number; name: string }[];
  selectedID: number;
  setSelectedID: (id: number) => void;
  label: string;
  textLabel: string;
}

const SingleSelectAutocomplete = (props: SingleSelectAutocompleteProps) => {
  return (
    <div className="inputField">
      <label className="label">{props.label}</label>
      <Autocomplete
        options={props.options}
        getOptionLabel={(option) => option.name} // name을 반환
        value={props.options.find((option) => option.id === props.selectedID) || null}
        onChange={(event, newValue) => {
          props.setSelectedID(newValue ? newValue.id : NaN);
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {option.name}
          </li>
        )}
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
      />
    </div>
  );
};

export default SingleSelectAutocomplete;
