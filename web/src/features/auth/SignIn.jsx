// 登入頁
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getFirebaseAuth } from '../../lib/firebase';
import { AuthFormLayout } from './AuthFormLayout';
import { getAuthErrorMessage } from './authErrors';

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);
    try {
      // 登入由 Firebase Auth 處理，成功後回到原本要去的頁面
      await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      navigate(location.state?.from ?? '/booking', { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormLayout
      title="登入"
      submitLabel="登入"
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      footer={
        <Stack spacing={1}>
          <Link to="/forgot-password">忘記密碼?</Link>
          <Link to="/signup">還沒有帳號？立即註冊</Link>
        </Stack>
      }
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="電子信箱"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        id="password"
        label="密碼"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
    </AuthFormLayout>
  );
};

export default SignIn;
