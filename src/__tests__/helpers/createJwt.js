/**
 * ساخت JWT معتبر برای تست — بدون TextEncoder
 * از Buffer استفاده می‌کند (در Node.js/Jest همیشه موجود است)
 * دقیقاً سازگار با decodeJWT در src/utils/jwt-utils.js
 */
const toBase64Url = (obj) => {
  const jsonStr = JSON.stringify(obj);
  const base64 = Buffer.from(jsonStr, 'utf8').toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

/**
 * @param {object} payload - مثلاً { user_id: 1, exp: 1893456000 }
 * @returns {string} رشته JWT سه‌بخشی
 */
export const createJwt = (payload) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  return `${toBase64Url(header)}.${toBase64Url(payload)}.test-signature`;
};
