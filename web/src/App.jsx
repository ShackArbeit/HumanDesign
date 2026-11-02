// 網站路由設定
import { lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { RequireAuth } from './features/auth/RequireAuth';
import HomePage from './features/content/HomePage';
import { humanDesignPages } from './features/content/humanDesignPages';
import Layout from './layout/Layout';

const AboutPage = lazy(() => import('./features/content/AboutPage'));
const FeedbackPage = lazy(() => import('./features/content/FeedbackPage'));
const ContactPage = lazy(() => import('./features/content/ContactPage'));
const HumanDesignIndex = lazy(() => import('./features/content/HumanDesignIndex'));
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
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="jerome" element={<AboutPage />} />
          <Route path="feedback" element={<FeedbackPage />} />
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
          <Route path="contact" element={<ContactPage />} />
          <Route path="human" element={<HumanDesignIndex />} />
          {humanDesignPages.map(({ path, ...page }) => (
            <Route
              key={path}
              path={`human/${path}`}
              element={<ContentDetailPage key={path} {...page} />}
            />
          ))}
        </Route>
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
