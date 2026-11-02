// 登入、註冊、忘記密碼共用的表單外框
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PageContainer } from '../../components/PageContainer';

export const AuthFormLayout = ({
  title,
  errorMessage,
  successMessage,
  submitLabel,
  isSubmitting,
  onSubmit,
  children,
  footer,
}) => (
  <PageContainer narrow>
    <Box sx={{ width: 'min(100%, 420px)', mx: 'auto' }}>
      <h1 style={{ marginBottom: 16, textAlign: 'center' }}>{title}</h1>
      <Box component="form" noValidate onSubmit={onSubmit}>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {children}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isSubmitting}
          sx={{ mt: 2, mb: 2 }}
        >
          {submitLabel}
        </Button>
        {footer}
      </Box>
    </Box>
  </PageContainer>
);
