import CryptoJS from "crypto-js";
import { ENV } from "../config/env.js";

export function encrypt(text) {
  return CryptoJS.AES.encrypt(text, ENV.ENCRYPTION_SECRET).toString();
}

export function decrypt(cipher) {
  const bytes = CryptoJS.AES.decrypt(cipher, ENV.ENCRYPTION_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
}
