import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export function secretBytes(name: string): Buffer {
  const value = process.env[name];
  if (value) {
    const decoded = Buffer.from(value, "base64");
    if (decoded.length === 32) return decoded;
    return createHash("sha256").update(value).digest();
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error(`${name} is required in production.`);
  }
  return createHash("sha256").update(`lung-learn-dev-${name}`).digest();
}

export function hashToken(token: string): string {
  return createHmac("sha256", secretBytes("SESSION_SECRET")).update(token).digest("hex");
}

export function newToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const actual = scryptSync(password, salt, 32);
  const expected = Buffer.from(hash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function encryptBytes(plain: Buffer): Buffer {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretBytes("APP_ENCRYPTION_KEY"), iv);
  const data = Buffer.concat([cipher.update(plain), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), data]);
}

export function decryptBytes(payload: Buffer): Buffer {
  const iv = payload.subarray(0, 12);
  const tag = payload.subarray(12, 28);
  const data = payload.subarray(28);
  const decipher = createDecipheriv("aes-256-gcm", secretBytes("APP_ENCRYPTION_KEY"), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

export function sniffUpload(bytes: Uint8Array): "jpeg" | "png" | "pdf" | null {
  if (bytes.byteLength < 8 || bytes.byteLength > 5_000_000) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return "jpeg";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "png";
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "pdf";
  return null;
}

export function redactSensitive(value: string): string {
  return value
    .replace(/[A-Za-z0-9+/]{60,}={0,2}/g, "[redacted]")
    .replace(/verification[\\/][^\s]+/g, "[redacted-path]");
}

const BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function base32Encode(bytes: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of bytes) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += BASE32[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += BASE32[(value << (5 - bits)) & 31];
  return output;
}

export function hotp(secret: Buffer, counter: number): string {
  const message = Buffer.alloc(8);
  message.writeBigUInt64BE(BigInt(counter));
  const digest = createHmac("sha1", secret).update(message).digest();
  const offset = digest[digest.length - 1] & 0x0f;
  const binary = (digest.readUInt32BE(offset) & 0x7fffffff) % 1_000_000;
  return binary.toString().padStart(6, "0");
}

export function verifyTotp(secret: Buffer, token: string, now = Date.now()): boolean {
  if (!/^\d{6}$/.test(token)) return false;
  const counter = Math.floor(now / 30_000);
  for (let offset = -1; offset <= 1; offset += 1) {
    const expected = Buffer.from(hotp(secret, counter + offset));
    const actual = Buffer.from(token);
    if (timingSafeEqual(expected, actual)) return true;
  }
  return false;
}
