import { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { EventTypeParams } from '../apis/eventType.types';
import { useEventType } from '../apis/eventType';
import { ApiError, ApiResponse } from '../types/common';
import { InputValue, InputValueForm } from './common/InputValueForm';
import CommonButton from './common/CommonButton';

interface SingleFormPropsType extends Omit<InputValue, 'onChange'> {
  title: string;
  handleSubmit: (inputValue: string) => void;
}

const SingleForm = (props: SingleFormPropsType) => {
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">{props.title}</h2>
        <InputValueForm
          label={props.label}
          textLabel={props.textLabel}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <CommonButton onClick={() => props.handleSubmit(inputValue)} title="등록" />
      </div>
    </div>
  );
};

export default SingleForm;
