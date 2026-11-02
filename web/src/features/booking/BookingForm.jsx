// 預約表單
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateBooking } from '../../hooks/useBookingMutations';
import { formatDateTime } from '../../lib/datetime';
import { useAuth } from '../auth/AuthProvider';
import { BookingSummary } from './BookingSummary';

// 表單驗證規則：只有訪客需要填 Email
const buildSchema = (isGuest) =>
  z.object({
    serviceId: z.string().min(1, '請選擇服務'),
    guestEmail: isGuest
      ? z.string().trim().email('Email 格式不正確')
      : z.string().optional(),
    note: z.string().trim().max(500, '備註最多 500 字').optional(),
  });

const FormFields = ({ services, slot, durationMin, isGuest, onCancel, onSlotTaken, onCreated }) => {
  const mutation = useCreateBooking();
  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(buildSchema(isGuest)),
    defaultValues: { serviceId: services[0].id, guestEmail: '', note: '' },
  });

  const selectedService = services.find((service) => service.id === watch('serviceId'));
  const option = selectedService.options.find((item) => item.durationMin === durationMin);

  // 組出要送給後端的資料，只放需要的欄位
  function onSubmit(values) {
    const requestBody = {
      serviceId: values.serviceId,
      durationMin,
      startAt: slot.start,
    };
    if (isGuest) {
      requestBody.guestEmail = values.guestEmail;
    }
    if (values.note) {
      requestBody.note = values.note;
    }

    mutation.mutate(requestBody, {
      onSuccess: (booking) => {
        onCreated(booking, selectedService.name);
      },
      onError: (error) => {
        if (error.status === 409) {
          onSlotTaken();
        }
      },
    });
  }

  // 409 時表單會關閉，改在頁面上提示，所以這裡不顯示
  let errorMessage = null;
  if (mutation.error && mutation.error.status !== 409) {
    errorMessage = mutation.error.message;
  }

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <DialogContent>
        <Stack spacing={2}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Typography>時間：{formatDateTime(slot.start)}</Typography>
          <Typography>時長：{durationMin} 分鐘</Typography>
          <Controller
            name="serviceId"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="服務" fullWidth>
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Typography sx={{ fontWeight: 700 }}>
            費用：NT$ {option?.priceTwd.toLocaleString('en-US')}
          </Typography>
          {isGuest && (
            <TextField
              {...register('guestEmail')}
              label="Email"
              type="email"
              autoComplete="email"
              required
              fullWidth
              error={Boolean(errors.guestEmail)}
              helperText={errors.guestEmail?.message ?? '確認信與取消連結會寄到這裡'}
            />
          )}
          <TextField
            {...register('note')}
            label="備註（選填）"
            multiline
            minRows={2}
            fullWidth
            error={Boolean(errors.note)}
            helperText={errors.note?.message}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>取消</Button>
        <Button type="submit" variant="contained" disabled={mutation.isPending}>
          {mutation.isPending ? '送出中…' : '確認預約'}
        </Button>
      </DialogActions>
    </form>
  );
};

// 預約對話框：會員和訪客共用，送出成功後切換成確認畫面
const BookingForm = ({ services, slot, durationMin, onClose, onSlotTaken }) => {
  const { user } = useAuth();
  const isMobile = useMediaQuery('(max-width:767.98px)');
  const [result, setResult] = useState(null);
  const bookableServices = services.filter((service) =>
    service.options.some((option) => option.durationMin === durationMin),
  );

  return (
    <Dialog open onClose={onClose} fullScreen={isMobile} fullWidth maxWidth="sm">
      <DialogTitle>{result ? '預約成功' : '確認預約'}</DialogTitle>
      {result ? (
        <DialogContent>
          <BookingSummary
            booking={result.booking}
            serviceName={result.serviceName}
            onClose={onClose}
          />
        </DialogContent>
      ) : (
        <FormFields
          services={bookableServices}
          slot={slot}
          durationMin={durationMin}
          isGuest={!user}
          onCancel={onClose}
          onSlotTaken={onSlotTaken}
          onCreated={(booking, serviceName) => setResult({ booking, serviceName })}
        />
      )}
    </Dialog>
  );
};

export default BookingForm;
