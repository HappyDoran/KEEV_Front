import React, { useEffect, useState } from 'react';
import Routers from '../routers/Routers';
import SideBar from '../components/SideBar';
import useToggle from '../hooks/useToggle';
import Header from '../components/Header';

const Layout = (props: any) => {
  const [isSidebarOpen, toggleIsSidebarOpen] = useToggle(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('admin');
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Header />
      <div style={{ display: 'flex', paddingTop: '70px' }}>
        <SideBar open={isSidebarOpen} toggleSideBar={toggleIsSidebarOpen} />
        <main
          style={{
            flexGrow: 1,
            marginLeft: isSidebarOpen ? '290px' : '50px',
          }}
        >
          <Routers isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        </main>
      </div>
    </div>
  );
};
export default Layout;
