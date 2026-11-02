import { AppError } from '../lib/errors.js';
import { listByUser } from '../repositories/bookingRepository.js';
import { toPublicBooking } from '../services/bookingService.js';

export function createBookingController(bookingService) {
  async function create(req, res) {
    const input = req.validated.body;

    if (!req.user && !input.guestEmail) {
      throw new AppError(400, 'VALIDATION_ERROR', '未登入時需填寫 Email', [
        { path: 'guestEmail', message: '未登入時需填寫 Email' },
      ]);
    }

    const data = await bookingService.create({ input, user: req.user });
    res.status(201).json({ data });
  }

  async function cancel(req, res) {
    const data = await bookingService.cancel({
      id: req.validated.params.id,
      user: req.user,
      token: req.validated.query.token,
    });
    res.json({ data });
  }

  async function listMine(req, res) {
    const bookings = await listByUser(req.user.uid);
    const data = [];
    for (const booking of bookings) {
      data.push(toPublicBooking(booking));
    }
    res.json({ data });
  }

  return { create, cancel, listMine };
}
