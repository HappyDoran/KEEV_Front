import Loading from 'components/Loading';
import React, { Dispatch, lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router';

const Auth = lazy(() => import('../pages/Auth/Auth'));
const Home = lazy(() => import('../pages/Home/Home'));
const Type = lazy(() => import('../pages/Type/Type'));
const Country = lazy(() => import('../pages/Country/Country'));
const Genre = lazy(() => import('../pages/Genre/Genre'));
const Place = lazy(() => import('../pages/Place/Place'));
const Artist = lazy(() => import('../pages/Artist/Artist'));
const Event = lazy(() => import('../pages/Event/Event'));
const EventList = lazy(() => import('../pages/Event/EventList'));

interface RoutersProps {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<React.SetStateAction<boolean>>;
}

const Routers = (props: RoutersProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {props.isAuthenticated ? (
          <>
            <Route path="/" element={<Navigate replace to="/home" {...props} />} />
            <Route path="home" element={<Home />} />
            <Route path="type" element={<Type />} />
            <Route path="country" element={<Country />} />
            <Route path="genre" element={<Genre />} />
            <Route path="place" element={<Place />} />
            <Route path="artist" element={<Artist />} />
            <Route path="event" element={<Event />} />
            <Route path="event/list" element={<EventList />} />
          </>
        ) : (
          <Route path="*" element={<Auth setIsAuthenticated={props.setIsAuthenticated} />} />
        )}
      </Routes>
    </Suspense>
  );
};

export default Routers;
