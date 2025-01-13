import { Autocomplete, TextField } from '@mui/material';
import React from 'react';
import { KeevEvent, PaginationEvent } from '../../../apis/event.types';

interface EventSearchFieldProps {
  eventData: PaginationEvent[] | undefined;
  handleSearchChange: (
    _event: React.SyntheticEvent<Element, Event>,
    value: string,
    _reason: string,
  ) => void;
}

const EventSearchField = (props: EventSearchFieldProps) => {
  return (
    <Autocomplete
      freeSolo
      options={props.eventData ? props.eventData.map((option) => option.name) : []}
      onInputChange={props.handleSearchChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label="이벤트 검색"
          variant="outlined"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white', // label 색상을 흰색으로 설정
            },
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px', // borderRadius를 12로 설정
              backgroundColor: '#2A2830', // 배경색을 흰색으로 설정
              '& input': {
                color: '#eaeaea', // value 색상을 흰색으로 설정
              },
            },
          }}
        />
      )}
    />
  );
};

export default EventSearchField;
