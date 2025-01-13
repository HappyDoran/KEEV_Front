import { TextField } from '@mui/material';
import { ChangeEvent } from 'react';

export interface InputValue {
  label: string;
  textLabel: string;
  value: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const InputValueForm = (props: InputValue) => {
  return (
    <div className="inputField">
      <label className="label">{props.label}</label>
      <TextField
        label={props.textLabel}
        variant="outlined"
        fullWidth
        type={props.type}
        value={props.value}
        onChange={props.onChange}
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
    </div>
  );
};
