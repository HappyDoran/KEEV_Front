import React, { Dispatch, lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Loading from 'components/Loading';

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
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<Loading />}>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          transition={{
            type: 'tween',
            duration: 0.5,
          }}
          key={location.pathname}
        >
          <Routes location={location} key={location.pathname}>
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
        </motion.div>
      </Suspense>
    </AnimatePresence>
  );
};

export default Routers;
