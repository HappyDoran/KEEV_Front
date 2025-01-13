import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDeleteEvent, useGetEventByPagination, useGetSearchedEvent } from '../../apis/event';
import { List, Typography } from '@mui/material';
import { PaginationEvent } from '../../apis/event.types';
import EventSearchField from './components/EventSearchField';
import EventCell from './components/EventCell';
import EventEditBox from './components/EventEditBox';
import useToggle from '../../hooks/useToggle';
import Loading from 'components/Loading';

const EventList = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [isDialog, toggleIsDialog] = useToggle(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [debouncedKeyword, setDebouncedKeyword] = useState<string>(searchKeyword);

  const {
    data: eventData,
    fetchNextPage: fetchNextEvents,
    hasNextPage: hasNextEvents,
    isFetchingNextPage: isFetchingNextEvents,
    status: eventStatus,
  } = useGetEventByPagination();

  const {
    data: searchResults,
    fetchNextPage: fetchNextSearchItems,
    hasNextPage: hasNextSearchItems,
    isFetchingNextPage: isFetchingNextSearchItems,
    status: searchItemsStatus,
  } = useGetSearchedEvent(debouncedKeyword);

  const { mutateAsync: deleteEvent } = useDeleteEvent();

  const handleSearchChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string,
    _reason: string,
  ) => {
    setSearchKeyword(value);
  };

  const handleDeleteEvent = useCallback(
    async (eventId: string) => {
      try {
        await deleteEvent(eventId);

        alert('이벤트 삭제 완료');
        if (eventData) {
          eventData.filter((event) => event.id !== eventId);
        }
        window.location.reload();
      } catch (error) {
        console.error('이벤트 삭제 중 오류 발생:', error);
      }
    },
    [deleteEvent, eventData],
  );

  const handleEditEvent = (selectedEvent: PaginationEvent) => {
    setSelectedEventId(selectedEvent.id);
    toggleIsDialog();
  };

  const observerRef = useRef<IntersectionObserver>();

  const lastEventRef = useCallback(
    (node: HTMLElement | null) => {
      if (searchKeyword) {
        if (isFetchingNextSearchItems) return;

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextSearchItems) {
            fetchNextSearchItems();
          }
        });
      } else {
        if (isFetchingNextEvents) return;

        if (observerRef.current) {
          observerRef.current.disconnect();
        }

        observerRef.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && hasNextEvents) {
            fetchNextEvents();
          }
        });
      }

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [
      searchKeyword,
      isFetchingNextEvents,
      isFetchingNextSearchItems,
      hasNextEvents,
      hasNextSearchItems,
      fetchNextEvents,
      fetchNextSearchItems,
    ],
  );

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedKeyword(searchKeyword);
    }, 300); // 300ms 후에 디바운스 적용

    return () => {
      clearTimeout(handler);
    };
  }, [searchKeyword]);

  return (
    <div className="container">
      <div className="wrapper">
        <h2 className="title">이벤트 목록</h2>

        <div style={{ paddingBottom: '20px' }}>
          <EventSearchField eventData={searchResults} handleSearchChange={handleSearchChange} />
        </div>

        <List>
          {searchKeyword ? (
            searchItemsStatus === 'pending' ? (
              <Typography variant="body2">
                {' '}
                <Loading />
              </Typography>
            ) : searchItemsStatus === 'error' ? (
              <Typography variant="body2" color="error">
                검색 중 오류가 발생했습니다.
              </Typography>
            ) : !searchResults || searchResults.length === 0 ? (
              <Typography variant="body2" style={{ color: '#7556ff' }}>
                검색 결과가 없습니다.
              </Typography>
            ) : (
              <>
                {searchResults.map((item, index) => (
                  <div
                    key={item.id}
                    ref={index === searchResults.length - 1 ? lastEventRef : undefined}
                  >
                    <EventCell event={item} onDelete={handleDeleteEvent} onEdit={handleEditEvent} />
                  </div>
                ))}
                {isFetchingNextSearchItems && (
                  <Typography variant="body2" style={{ textAlign: 'center', padding: '1rem' }}>
                    <Loading />
                  </Typography>
                )}
              </>
            )
          ) : eventStatus === 'pending' ? (
            <Typography variant="body2">
              {' '}
              <Loading />
            </Typography>
          ) : eventStatus === 'error' ? (
            <Typography variant="body2" color="error">
              데이터를 불러오는 중 오류가 발생했습니다.
            </Typography>
          ) : !eventData || eventData.length === 0 ? (
            <Typography variant="body2" style={{ color: '#7556ff' }}>
              등록된 이벤트가 없습니다.
            </Typography>
          ) : (
            <>
              {eventData.map((item, index) => (
                <div key={item.id} ref={index === eventData.length - 1 ? lastEventRef : undefined}>
                  <EventCell event={item} onDelete={handleDeleteEvent} onEdit={handleEditEvent} />
                </div>
              ))}
              {isFetchingNextEvents && (
                <Typography variant="body2" style={{ textAlign: 'center', padding: '1rem' }}>
                  <Loading />
                </Typography>
              )}
            </>
          )}
        </List>
      </div>

      {/* 수정 대화상자 */}
      {isDialog && selectedEventId && (
        <EventEditBox
          openEditDialog={isDialog}
          setOpenEditDialog={toggleIsDialog}
          selectedEventId={selectedEventId}
        />
      )}
    </div>
  );
};

export default EventList;
