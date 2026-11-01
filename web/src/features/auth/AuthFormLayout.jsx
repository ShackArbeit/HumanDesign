import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import style from '../../CssModules/AuthProcess.module.css';

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
  <div className={style.signInContainer}>
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          {title}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1, width: '100%' }} onSubmit={onSubmit}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {children}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={isSubmitting}
            sx={{ mt: 3, mb: 2, fontWeight: 'bold', fontSize: '20px' }}
          >
            {submitLabel}
          </Button>
          {footer}
        </Box>
      </Box>
    </Container>
  </div>
);
