import { Button } from '@mui/material';
import React from 'react';

export type buttonProps = {
  onClick: () => void;
  title: string;
};

const CommonButton = (props: buttonProps) => {
  return (
    <div className="buttonContainer">
      <Button
        onClick={props.onClick}
        variant="contained"
        sx={{
          backgroundColor: '#7556ff',
          '&:hover': {
            backgroundColor: '#292346',
          },
        }}
      >
        {props.title}
      </Button>
    </div>
  );
};

export default CommonButton;
