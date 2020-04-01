import { createHash } from 'crypto';
const SECRET = '48955e33-5871-3982-3c1e-e127e7714958';

export const md5 = value => {
  return createHash('md5')
    .update(value + SECRET)
    .digest('hex');
};

export const NewGuid = (otps?: string) => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  if (otps && otps.toLowerCase() === 'n') {
    return `${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}${s4()}`;
  } else {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  }
};
