import CryptoJS from "crypto-js";

export const encryptData = (value: string, encryptionKey: string): string => {
  if (!value) return "";
  return CryptoJS.AES.encrypt(value, encryptionKey).toString();
};

export const decryptData = (encryptedValue: string, encryptionKey: string): string => {
  if (!encryptedValue) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, encryptionKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt data", error);
    return "";
  }
};
