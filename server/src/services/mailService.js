import nodemailer from 'nodemailer';

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
  <!-- TODO(shack): add the bank transfer details shown to customers. -->
  <p>請於三日內完成匯款，確認款項後即完成預約。</p>
  <p>如需取消，請於預約開始 24 小時前處理。${
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
