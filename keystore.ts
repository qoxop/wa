export const CLIENT_ID_GITHUB = process.env.CLIENT_ID_GITHUB as string;
export const CLIENT_SECRET_GITHUB = process.env.CLIENT_SECRET_GITHUB as string;
export const SELF_AES_IV = process.env.SELF_AES_IV as string;
export const SELF_AES_KEY = process.env.SELF_AES_KEY as string;
export const FIREBASE_JSON = JSON.parse(Buffer.from(process.env.FIREBASE_TOKEN as string, 'base64').toString());