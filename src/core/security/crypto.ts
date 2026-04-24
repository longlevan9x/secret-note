import CryptoJS from "crypto-js";

export const encryptSecret = (value: string, masterKey: string): string => {
  if (!value) return "";
  return CryptoJS.AES.encrypt(value, masterKey).toString();
};

export const decryptSecret = (encryptedValue: string, masterKey: string): string => {
  if (!encryptedValue) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, masterKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    // If decryption fails due to wrong key, it might return empty string
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt secret", error);
    return "";
  }
};
