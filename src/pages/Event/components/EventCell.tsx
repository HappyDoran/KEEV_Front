import React from 'react';
import { PaginationEvent } from '../../../apis/event.types';
import { ListItem, Box, Typography, ButtonGroup, Button } from '@mui/material';
import useMakeSaveUrl from 'hooks/useMakeSaveUrl';

interface EventCellProps {
  event: PaginationEvent;
  onDelete: (eventId: string) => void;
  onEdit: (seletedEvent: PaginationEvent) => void;
}

const EventCell = (props: EventCellProps) => {
  const makeSaveUrl = useMakeSaveUrl();

  return (
    <ListItem
      key={props.event.id}
      className="inputField"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '10px 0',
      }}
    >
      <Box flexGrow={1} style={{ display: 'flex', alignItems: 'flex-start' }}>
        {props.event.posterURL && (
          <img
            src={makeSaveUrl(props.event.posterURL)}
            alt={props.event.name}
            style={{
              width: '100px',
              height: 'auto',
              marginRight: '15px',
            }}
          />
        )}
        <Box>
          <Typography style={{ color: '#EAEAEA' }}>제목: {props.event.name}</Typography>
          <Typography style={{ color: '#EAEAEA' }} variant="body2">
            시작일 - 종료일: {props.event.startDate} - {props.event.endDate}
          </Typography>
          <Typography style={{ color: '#EAEAEA' }} variant="body2">
            공연장:{' '}
            {props.event.placeNameList.length > 0
              ? props.event.placeNameList.map((place, index) => place).join(', ')
              : '등록된 공연장이 없습니다.'}
          </Typography>
        </Box>
      </Box>
      <ButtonGroup>
        <Button
          variant="outlined"
          style={{
            color: '#eaeaea',
            backgroundColor: '#E6234C',
            border: 'none',
          }}
          onClick={() => props.onEdit(props.event)}
        >
          수정
        </Button>
        <Button
          variant="outlined"
          style={{
            color: '#eaeaea',
            backgroundColor: '#818181',
            border: 'none',
          }}
          onClick={() => props.onDelete(props.event.id)}
        >
          삭제
        </Button>
      </ButtonGroup>
    </ListItem>
  );
};

export default EventCell;
