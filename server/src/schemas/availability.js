// GET /availability 的輸入規則
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { z } from 'zod';

dayjs.extend(utc);

const MAX_RANGE_DAYS = 31;

const dateString = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式須為 YYYY-MM-DD')
  .refine((value) => dayjs.utc(value).format('YYYY-MM-DD') === value, '日期不存在');

export const availabilityQuery = z
  .object({
    from: dateString,
    to: dateString,
    durationMin: z.coerce.number().int().positive().max(480).optional(),
  })
  .refine((query) => query.from <= query.to, { message: 'from 不可晚於 to', path: ['to'] })
  .refine((query) => dayjs.utc(query.to).diff(dayjs.utc(query.from), 'day') < MAX_RANGE_DAYS, {
    message: `查詢範圍最多 ${MAX_RANGE_DAYS} 天`,
    path: ['to'],
  });
