import * as crypto from 'crypto';
import { SELF_AES_IV, SELF_AES_KEY } from 'keystore';

const DEFAULT_EXPIRE = 60 * 20; // 20分钟

/**
 * 数据签名
 * @param data
 * @param expire 
 * @returns
 */
export const dataSign = (data: any, expire: number = DEFAULT_EXPIRE) => {
  const dataStr = JSON.stringify({ data, expire: Date.now() + (expire * 1000) });
  const cipher = crypto.createCipheriv('aes-256-cbc', SELF_AES_KEY, SELF_AES_IV);
  let sign = cipher.update(dataStr, 'utf-8', 'hex');
  sign += cipher.final('hex');
  return sign;
};

/**
 * 签名解码
 * @param sign 
 * @returns 
 */
export const decodeSign = (sign: string) => {
  const cipher = crypto.createDecipheriv('aes-256-cbc', SELF_AES_KEY, SELF_AES_IV);
  let src = cipher.update(sign, 'hex', 'utf-8');
  src += cipher.final('utf-8');
  try {
    const { data, expire } = JSON.parse(src);
    if (expire > Date.now()) {
      return data;
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const State = {
  check:(state: string) => {
    const data = decodeSign(state);
    if (data && data.salt && data.time && data.id === 'github-auth-state' ) {
      return true;
    }
    return false;
  },
  generate: () => {
    return dataSign({
      id: 'github-auth-state',
      salt: Math.ceil((Math.random() + Math.random() + Math.random()) * 10000000),
      time: Date.now(),
    })
  }
}