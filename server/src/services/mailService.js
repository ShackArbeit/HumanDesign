import nodemailer from 'nodemailer';
import { paymentInfo } from '../config/paymentInfo.js';

const formatter = (timezone) =>
  new Intl.DateTimeFormat('zh-TW', {
    timeZone: timezone,
    dateStyle: 'long',
    timeStyle: 'short',
    hourCycle: 'h23',
  });

const buildConfirmationHtml = ({ booking, serviceName, timezone, cancelUrl }) => `
  <p>感謝你的預約，以下是預約內容：</p>
  <ul>
    <li>項目：${serviceName}（${booking.durationMin} 分鐘）</li>
    <li>時間：${formatter(timezone).format(booking.startAt)}</li>
    <li>費用：NT$ ${booking.priceTwd.toLocaleString('en-US')}</li>
  </ul>
  <p>請於三日內匯款至以下帳戶（示範資料，請勿實際匯款），確認款項後即完成預約：</p>
  <ul>
    <li>銀行：${paymentInfo.bankName}</li>
    <li>戶名：${paymentInfo.accountName}</li>
    <li>帳號：${paymentInfo.accountNumber}</li>
  </ul>
  <p>預約開始前 1 天內不可取消。${
    cancelUrl ? `<a href="${cancelUrl}">取消預約</a>` : '可至「我的預約」頁面取消。'
  }</p>
`;

export const createMailService = ({ user, password }) => {
  const transporter =
    user && password
      ? nodemailer.createTransport({ service: 'gmail', auth: { user, pass: password } })
      : null;

  return {
    async sendBookingConfirmation({ to, ...details }) {
      if (!transporter) {
        console.log(JSON.stringify({ severity: 'INFO', message: 'Email skipped: not configured' }));
        return;
      }
      await transporter.sendMail({
        from: user,
        to,
        subject: '預約確認信',
        html: buildConfirmationHtml(details),
      });
    },
  };
};
