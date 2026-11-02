// 聯絡表單：透過 EmailJS 把訊息寄給站長
import emailjs from '@emailjs/browser';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { PageContainer } from '../../components/PageContainer';

const ContactPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: name,
          from_email: email,
          to_name: 'Shack Lin',
          message,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setName('');
      setEmail('');
      setMessage('');
      setStatus('sent');
    } catch {
      setStatus('failed');
    }
  }

  return (
    <PageContainer title="意見回饋" narrow>
      <Stack component="form" spacing={2} onSubmit={handleSubmit} sx={{ maxWidth: 420 }}>
        {status === 'sent' && <Alert severity="success">已收到你的回饋，我們將儘速回覆你！</Alert>}
        {status === 'failed' && <Alert severity="error">送出失敗，請稍後再試</Alert>}
        <TextField
          required
          fullWidth
          label="你的姓名"
          autoComplete="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <TextField
          required
          fullWidth
          label="你的電子信箱"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <TextField
          required
          fullWidth
          label="想說的話"
          multiline
          minRows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button type="submit" variant="contained" disabled={status === 'sending'}>
          提交回饋
        </Button>
      </Stack>
    </PageContainer>
  );
};

export default ContactPage;
