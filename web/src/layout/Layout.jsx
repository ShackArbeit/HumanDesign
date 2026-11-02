import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import Footer from './Footer';
import Header from './Header';
import style from '../styles/Layout.module.css';

const Layout = () => (
  <div className={style.shell}>
    <Header />
    <main className={style.main}>
      <Suspense fallback={<LoadingSkeleton />}>
        <Outlet />
      </Suspense>
    </main>
    <Footer />
  </div>
);

export default Layout;
