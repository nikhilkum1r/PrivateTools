/**
 * AES-GCM 256-bit encryption/decryption using the native Web Crypto API.
 * No third-party crypto libraries. Passwords never stored — held in memory only.
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;    // 96-bit IV for AES-GCM
const SALT_LENGTH = 16;
const ITERATIONS = 100_000;

/** Derive an AES-GCM key from a password using PBKDF2 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  // Ensure we pass a clean ArrayBuffer to satisfy strict types
  const saltBuffer = (salt.buffer instanceof SharedArrayBuffer 
    ? salt.buffer.slice(0) 
    : salt.buffer) as ArrayBuffer;
    
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: saltBuffer, iterations: ITERATIONS, hash: "SHA-256" },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt a Blob with AES-GCM 256-bit.
 * Output format: [salt(16)] + [iv(12)] + [ciphertext]
 * Returns a .locked Blob.
 */
export async function encryptBlob(blob: Blob, password: string): Promise<Blob> {
  if (!crypto.subtle) throw new Error("Web Crypto API unavailable. Ensure the page is served over HTTPS.");
  const salt = new Uint8Array(new ArrayBuffer(SALT_LENGTH));
  crypto.getRandomValues(salt);
  const iv = new Uint8Array(new ArrayBuffer(IV_LENGTH));
  crypto.getRandomValues(iv);
  const key = await deriveKey(password, salt);
  const plaintext = await blob.arrayBuffer();
  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, plaintext);

  // Pack: magic(8) + salt(16) + iv(12) + ciphertext
  const magic = new TextEncoder().encode("PVTLOCK!"); // 8 bytes magic identifier
  const output = new Uint8Array(magic.length + SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  let offset = 0;
  output.set(magic, offset); offset += magic.length;
  output.set(salt, offset); offset += SALT_LENGTH;
  output.set(iv, offset); offset += IV_LENGTH;
  output.set(new Uint8Array(ciphertext), offset);

  return new Blob([output], { type: "application/octet-stream" });
}

/**
 * Decrypt a .locked Blob.
 * Throws if magic bytes don't match (not a SafeTools locked file).
 * Throws if decryption fails (wrong password).
 */
export async function decryptBlob(blob: Blob, password: string): Promise<Blob> {
  if (!crypto.subtle) throw new Error("Web Crypto API unavailable. Ensure the page is served over HTTPS.");
  const buffer = await blob.arrayBuffer();
  const data = new Uint8Array(buffer);

  // Check magic
  const magic = new TextDecoder().decode(data.slice(0, 8));
  if (magic !== "PVTLOCK!") {
    throw new Error("This doesn't appear to be a SafeTools locked file.");
  }

  let offset = 8;
  const salt = data.slice(offset, offset + SALT_LENGTH); offset += SALT_LENGTH;
  const iv = data.slice(offset, offset + IV_LENGTH); offset += IV_LENGTH;
  const ciphertext = data.slice(offset);

  const key = await deriveKey(password, salt);
  try {
    const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
    return new Blob([plaintext]);
  } catch {
    throw new Error("Decryption failed. The password may be incorrect.");
  }
}

/**
 * Encrypt a UTF-8 string to a Base64 string (for Secure Note).
 * Output: base64(magic + salt + iv + ciphertext)
 */
export async function encryptText(text: string, password: string): Promise<string> {
  const blob = new Blob([new TextEncoder().encode(text)]);
  const encBlob = await encryptBlob(blob, password);
  const buf = await encBlob.arrayBuffer();
  return btoa(String.fromCharCode(...new Uint8Array(buf)));
}

/**
 * Decrypt a Base64 string back to UTF-8 text (for Secure Note).
 */
export async function decryptText(cipherB64: string, password: string): Promise<string> {
  const bytes = Uint8Array.from(atob(cipherB64), (c) => c.charCodeAt(0));
  const blob = new Blob([bytes]);
  const decBlob = await decryptBlob(blob, password);
  return new TextDecoder().decode(await decBlob.arrayBuffer());
}
