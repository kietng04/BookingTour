import PropTypes from 'prop-types';
import { Outlet, useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showHero = useMemo(
    () => !['/auth/login', '/auth/register'].includes(location.pathname),
    [location.pathname]
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Header />
      <main className="flex-1">
        {children || <Outlet />}
      </main>
      {showHero && <Footer />}
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node
};

export default MainLayout;
