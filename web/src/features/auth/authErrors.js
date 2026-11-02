const MESSAGES = {
  'auth/email-already-in-use': '此 Email 已經註冊，請直接登入',
  'auth/invalid-email': 'Email 格式不正確',
  'auth/weak-password': '密碼強度不足',
  'auth/too-many-requests': '嘗試次數過多，請稍後再試',
  'auth/network-request-failed': '無法連線，請檢查網路後再試',
  'auth/invalid-credential': 'Email 或密碼不正確',
  'auth/wrong-password': 'Email 或密碼不正確',
  'auth/user-not-found': 'Email 或密碼不正確',
};

export const getAuthErrorMessage = (error) => MESSAGES[error.code] ?? '發生錯誤，請稍後再試';

export const PASSWORD_RULE_TEXT = '至少 8 碼，需包含一個大寫字母及一個特殊符號';

export const isValidPassword = (password) =>
  password.length >= 8 && /[A-Z]/.test(password) && /[^A-Za-z0-9]/.test(password);

export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
