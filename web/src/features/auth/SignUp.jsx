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
  const [values, setValues] = useState({ email: '', password: '', confirmPassword: '' });
  const [touched, setTouched] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fieldErrors = {
    email: isValidEmail(values.email) ? '' : '請輸入有效的 Email',
    password: isValidPassword(values.password) ? '' : PASSWORD_RULE_TEXT,
    confirmPassword: values.password === values.confirmPassword ? '' : '兩次輸入的密碼不一致',
  };
  const shownError = (field) => (touched[field] ? fieldErrors[field] : '');

  const fieldProps = (field) => ({
    id: field,
    margin: 'normal',
    required: true,
    fullWidth: true,
    value: values[field],
    error: Boolean(shownError(field)),
    onChange: (event) => setValues({ ...values, [field]: event.target.value }),
    onBlur: () => setTouched({ ...touched, [field]: true }),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setTouched({ email: true, password: true, confirmPassword: true });
    if (Object.values(fieldErrors).some(Boolean)) return;

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(getFirebaseAuth(), values.email, values.password);
      navigate('/booking', { replace: true });
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {...fieldProps('email')}
        label="電子信箱"
        type="email"
        autoComplete="email"
        autoFocus
        helperText={shownError('email')}
      />
      <TextField
        {...fieldProps('password')}
        label="密碼"
        type="password"
        autoComplete="new-password"
        helperText={PASSWORD_RULE_TEXT}
      />
      <TextField
        {...fieldProps('confirmPassword')}
        label="確認密碼"
        type="password"
        autoComplete="new-password"
        helperText={shownError('confirmPassword')}
      />
    </AuthFormLayout>
  );
};

export default SignUp;
