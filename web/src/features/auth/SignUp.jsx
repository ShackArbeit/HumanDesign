// 註冊頁
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFirebaseAuth } from '../../lib/firebase';
import { AuthFormLayout } from './AuthFormLayout';
import {
  PASSWORD_RULE_TEXT,
  getAuthErrorMessage,
  isValidEmail,
  isValidPassword,
} from './authErrors';

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailOk = isValidEmail(email);
  const passwordOk = isValidPassword(password);
  const confirmOk = password === confirmPassword;

  // 使用者離開欄位或按下送出後才顯示錯誤，避免一開始就滿版紅字
  const showEmailError = emailTouched && !emailOk;
  const showPasswordError = passwordTouched && !passwordOk;
  const showConfirmError = confirmTouched && !confirmOk;

  async function handleSubmit(event) {
    event.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmTouched(true);

    if (!emailOk || !passwordOk || !confirmOk) {
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      // 註冊由 Firebase Auth 處理，密碼不會經過我們的後端
      await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
      navigate('/booking', { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthFormLayout
      title="註冊會員"
      submitLabel="註冊"
      errorMessage={errorMessage}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      footer={
        <Stack spacing={1}>
          <Link to="/booking">不註冊，直接預約</Link>
          <Link to="/signin">已經有帳號？前往登入</Link>
        </Stack>
      }
    >
      <TextField
        id="email"
        margin="normal"
        required
        fullWidth
        label="電子信箱"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        error={showEmailError}
        helperText={showEmailError ? '請輸入有效的 Email' : ''}
        onChange={(event) => setEmail(event.target.value)}
        onBlur={() => setEmailTouched(true)}
      />
      <TextField
        id="password"
        margin="normal"
        required
        fullWidth
        label="密碼"
        type="password"
        autoComplete="new-password"
        value={password}
        error={showPasswordError}
        helperText={PASSWORD_RULE_TEXT}
        onChange={(event) => setPassword(event.target.value)}
        onBlur={() => setPasswordTouched(true)}
      />
      <TextField
        id="confirmPassword"
        margin="normal"
        required
        fullWidth
        label="確認密碼"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        error={showConfirmError}
        helperText={showConfirmError ? '兩次輸入的密碼不一致' : ''}
        onChange={(event) => setConfirmPassword(event.target.value)}
        onBlur={() => setConfirmTouched(true)}
      />
    </AuthFormLayout>
  );
};

export default SignUp;
