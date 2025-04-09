import jwt from '@tsndr/cloudflare-worker-jwt';

export const generateRandomId = (length = 24) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
};

export const generateJWT = async (payload, secret, ex) => {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + ex;

  const token = await jwt.sign({ ...payload, iat, exp }, secret);
  return token;
};

export const verifyJWT = async (token, secret) => {
  try {
    const verifiedToken = await jwt.verify(token, secret, { throwError: true });
    if (!verifiedToken) throw new Error('invalid jwt');
    return verifiedToken.payload;
  } catch (error) {
    if (error.message === 'EXPIRED') {
      return { expired: true, message: 'JWT expired' };
    } else {
      return { valid: false, message: 'JWT verification failed' };
    }
  }
};