import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { AuthProvider } from './features/auth/AuthProvider';
import { RequireAuth } from './features/auth/RequireAuth';
import { humanDesignPages } from './features/content/humanDesignPages';
import Layout from './Layout/Layout';
import EntranceHome from './PageComponents/HomePageComponents/EntranceHome';

const AboutJerome = lazy(() => import('./PageComponents/AboutJerome'));
const UserFeedBack = lazy(() => import('./PageComponents/UserFeedBack'));
const EmailJormen = lazy(() => import('./PageComponents/EmailJormen/EmailJormen'));
const EntranceHumanDesign = lazy(
  () => import('./PageComponents/WhatIsHumanComponents/EntranceHumanDesign'),
);
const ContentDetailPage = lazy(() => import('./features/content/ContentDetailPage'));
const SignIn = lazy(() => import('./features/auth/SignIn'));
const SignUp = lazy(() => import('./features/auth/SignUp'));
const ForgotPassword = lazy(() => import('./features/auth/ForgotPassword'));
const BookingPage = lazy(() => import('./features/booking/BookingPage'));
const MyBookings = lazy(() => import('./features/booking/MyBookings'));
const CancelBooking = lazy(() => import('./features/booking/CancelBooking'));

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<EntranceHome />} />
            <Route path="jerome" element={<AboutJerome />} />
            <Route path="feedback" element={<UserFeedBack />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="booking" element={<BookingPage />} />
            <Route path="bookings/:id/cancel" element={<CancelBooking />} />
            <Route
              path="my-bookings"
              element={
                <RequireAuth>
                  <MyBookings />
                </RequireAuth>
              }
            />
            <Route path="contact" element={<EmailJormen />} />
            <Route path="human" element={<EntranceHumanDesign />} />
            {humanDesignPages.map(({ path, ...page }) => (
              <Route
                key={path}
                path={`human/${path}`}
                element={<ContentDetailPage key={path} {...page} />}
              />
            ))}
          </Route>
        </Routes>
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
