import emailjs from '@emailjs/browser';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { PageContainer } from '../../components/PageContainer';

const EMPTY_FORM = { name: '', email: '', message: '' };

const ContactPage = () => {
  const [values, setValues] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle');

  const fieldProps = (field) => ({
    required: true,
    fullWidth: true,
    value: values[field],
    onChange: (event) => setValues({ ...values, [field]: event.target.value }),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: values.name,
          from_email: values.email,
          to_name: 'Shack Lin',
          message: values.message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setValues(EMPTY_FORM);
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  };

  return (
    <PageContainer title="意見回饋" narrow>
      <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ maxWidth: 420 }}>
        {status === 'sent' && <Alert severity="success">已收到你的回饋，我們將儘速回覆你！</Alert>}
        {status === 'failed' && <Alert severity="error">送出失敗，請稍後再試</Alert>}
        <TextField {...fieldProps('name')} label="你的姓名" autoComplete="name" />
        <TextField {...fieldProps('email')} label="你的電子信箱" type="email" autoComplete="email" />
        <TextField {...fieldProps('message')} label="想說的話" multiline minRows={5} />
        <Button type="submit" variant="contained" disabled={status === 'sending'}>
          提交回饋
        </Button>
      </Stack>
    </PageContainer>
  );
};

export default ContactPage;
