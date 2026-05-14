/**
 * AES-GCM 256-bit encryption/decryption using the native Web Crypto API.
 * No third-party crypto libraries. Passwords never stored  held in memory only.
 */

const ALGORITHM = "AES-GCM";
const KEY_LENGTH = 256;
const IV_LENGTH = 12;    // 96-bit IV for AES-GCM
const SALT_LENGTH = 16;
const ITERATIONS = 100_000;
const VAULT_MAGIC = "ST-VAULT"; // 8 bytes

/** Derive an AES-GCM key from a password using PBKDF2 */
async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
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
 * Encrypt a File/Blob with metadata (filename, type).
 * Output format: [VAULT_MAGIC(8)] + [salt(16)] + [iv(12)] + [metadata_len(4)] + [metadata_json] + [ciphertext]
 */
export async function encryptVault(file: File, password: string): Promise<Blob> {
  if (!crypto.subtle) throw new Error("Web Crypto API unavailable.");

  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);
  const plaintext = await file.arrayBuffer();

  const metadata = JSON.stringify({
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    ts: Date.now()
  });
  const metadataBytes = new TextEncoder().encode(metadata);

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, plaintext);

  // Construction
  const magicBytes = new TextEncoder().encode(VAULT_MAGIC);
  const metadataLen = new Uint8Array(new Uint32Array([metadataBytes.length]).buffer);

  const combined = new Blob([
    magicBytes,
    salt,
    iv,
    metadataLen,
    metadataBytes,
    ciphertext
  ]);

  return combined;
}

export type DecryptResult = 
  | { success: true; blob: Blob; name: string; type: string }
  | { success: false; error: string; code?: "LEGACY" | "INVALID_FILE" | "AUTH_FAILED" };

/**
 * Decrypt a vault Blob and recover original File.
 */
export async function decryptVault(blob: Blob, password: string): Promise<DecryptResult> {
  if (!crypto.subtle) return { success: false, error: "Web Crypto API unavailable." };

  try {
    const buffer = await blob.arrayBuffer();
    const data = new Uint8Array(buffer);
    const decoder = new TextDecoder();

    // Check magic
    const magic = decoder.decode(data.slice(0, 8));
    if (magic !== VAULT_MAGIC) {
      if (decoder.decode(data.slice(28, 32)) === "PVLT") {
        return { success: false, error: "This is an older vault version. Please use the legacy extractor.", code: "LEGACY" };
      }
      return { success: false, error: "Not a valid SafeTools Vault file.", code: "INVALID_FILE" };
    }

    let offset = 8;
    const salt = data.slice(offset, offset + SALT_LENGTH); offset += SALT_LENGTH;
    const iv = data.slice(offset, offset + IV_LENGTH); offset += IV_LENGTH;

    const metadataLen = new Uint32Array(data.slice(offset, offset + 4).buffer)[0]; offset += 4;
    const metadata = JSON.parse(decoder.decode(data.slice(offset, offset + metadataLen))); offset += metadataLen;

    const ciphertext = data.slice(offset);
    const key = await deriveKey(password, salt);

    try {
      const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);
      return {
        success: true,
        blob: new Blob([plaintext], { type: metadata.type }),
        name: metadata.name,
        type: metadata.type
      };
    } catch {
      return { success: false, error: "Decryption failed. Invalid password or corrupted data.", code: "AUTH_FAILED" };
    }
  } catch (e: any) {
    return { success: false, error: e.message || "An unexpected error occurred during decryption." };
  }
}

/**
 * Encrypt a simple string (Secure Note).
 */
export async function encryptText(text: string, password: string): Promise<string> {
  const enc = new TextEncoder().encode(text);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const ciphertext = await crypto.subtle.encrypt({ name: ALGORITHM, iv }, key, enc);

  const combined = new Uint8Array(SALT_LENGTH + IV_LENGTH + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, SALT_LENGTH);
  combined.set(new Uint8Array(ciphertext), SALT_LENGTH + IV_LENGTH);

  return btoa(String.fromCharCode(...combined));
}

/**
 * Decrypt a simple string.
 */
export async function decryptText(cipherB64: string, password: string): Promise<string> {
  const data = Uint8Array.from(atob(cipherB64), (c) => c.charCodeAt(0));
  const salt = data.slice(0, SALT_LENGTH);
  const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
  const ciphertext = data.slice(SALT_LENGTH + IV_LENGTH);

  const key = await deriveKey(password, salt);
  const plaintext = await crypto.subtle.decrypt({ name: ALGORITHM, iv }, key, ciphertext);

  return new TextDecoder().decode(plaintext);
}
