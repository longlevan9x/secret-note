import CryptoJS from "crypto-js";

/**
 * Derives a stronger key from the master password using PBKDF2.
 */
export const deriveKey = (password: string, salt: string = "secret-note-salt"): string => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: 256 / 32,
    iterations: 1000,
  }).toString();
};

export const encryptSecret = (value: string, masterKey: string): string => {
  if (!value) return "";
  return CryptoJS.AES.encrypt(value, masterKey).toString();
};

export const decryptSecret = (encryptedValue: string, masterKey: string): string => {
  if (!encryptedValue) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedValue, masterKey);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error("Failed to decrypt secret", error);
    return "";
  }
};

/**
 * Creates a validation hash that can be used to check if a password is correct.
 * It encrypts a known constant "VAULT_OPEN".
 */
export const createValidationHash = (masterKey: string): string => {
  return encryptSecret("VAULT_OPEN", masterKey);
};

/**
 * Verifies if the provided masterKey can correctly decrypt the validation hash.
 */
export const verifyMasterKey = (hash: string, masterKey: string): boolean => {
  try {
    const decrypted = decryptSecret(hash, masterKey);
    return decrypted === "VAULT_OPEN";
  } catch {
    return false;
  }
};

/**
 * Generates a random recovery key.
 */
export const generateRecoveryKey = (): string => {
  return Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, "0"))
    .join("-")
    .toUpperCase();
};
