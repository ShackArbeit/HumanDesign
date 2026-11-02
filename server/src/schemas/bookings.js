// 預約相關 API 的輸入規則。strict() 會拒絕多餘欄位，例如前端自己傳來的價格
import { z } from 'zod';

export const createBookingBody = z
  .object({
    serviceId: z.string().min(1).max(100),
    durationMin: z.number().int().positive(),
    startAt: z.string().datetime({ offset: true }),
    guestEmail: z.string().trim().email('Email 格式不正確').optional(),
    note: z.string().trim().max(500).optional(),
  })
  .strict();

export const bookingParams = z.object({ id: z.string().min(1).max(100) });

export const cancelBookingQuery = z.object({ token: z.string().max(200).optional() });
