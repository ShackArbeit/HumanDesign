import TextField from '@mui/material/TextField';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirebaseAuth } from '../../lib/firebase';
import { AuthFormLayout } from './AuthFormLayout';
import { getAuthErrorMessage } from './authErrors';

const NO_ACCOUNT_CODE = 'auth/user-not-found';
const SENT_MESSAGE = '若此 Email 已註冊，你會收到重設密碼的信件';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email);
      setSuccessMessage(SENT_MESSAGE);
    } catch (error) {
      // Same outcome either way, so this form cannot be used to probe for accounts.
      if (error.code === NO_ACCOUNT_CODE) setSuccessMessage(SENT_MESSAGE);
      else setErrorMessage(getAuthErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthFormLayout
      title="忘記密碼"
      submitLabel="寄送重設信"
      errorMessage={errorMessage}
      successMessage={successMessage}
      isSubmitting={isSubmitting}
      onSubmit={handleSubmit}
      footer={<Link to="/signin">返回登入</Link>}
    >
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="註冊時使用的電子信箱"
        type="email"
        autoComplete="email"
        autoFocus
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
    </AuthFormLayout>
  );
};

export default ForgotPassword;
