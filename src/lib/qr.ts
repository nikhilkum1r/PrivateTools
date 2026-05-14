/**
 * QR Code related utility functions
 */

export const MAX_QR_CHARS = 1200;

/**
 * Validates a string based on common QR code protocols
 */
export function validateQRValue(value: string): boolean {
  if (!value || value.length === 0) return false;
  if (value.length > MAX_QR_CHARS) return false;

  const trimmed = value.trim();

  // URL/URI protocols
  if (
    trimmed.startsWith("http://") || 
    trimmed.startsWith("https://") || 
    trimmed.startsWith("mailto:") || 
    trimmed.startsWith("tel:")
  ) {
    try {
      new URL(trimmed);
      return true;
    } catch {
      return false;
    }
  }

  // WIFI protocol: WIFI:S:ssid;T:WPA;P:password;;
  if (trimmed.startsWith("WIFI:")) {
    return trimmed.includes("S:") && trimmed.endsWith(";;");
  }

  // MECARD protocol: MECARD:N:Name;TEL:123;...
  if (trimmed.startsWith("MECARD:")) {
    return trimmed.includes("N:") && trimmed.endsWith(";");
  }

  // Plain text is always valid if within limits
  return true;
}

/**
 * Formats WiFi string for QR code
 */
export function formatWiFi(ssid: string, password?: string, encryption: string = "WPA"): string {
  return `WIFI:S:${ssid};T:${encryption};P:${password || ""};;`;
}

/**
 * Formats vCard (MeCard version for simplicity in QR)
 */
export function formatMeCard(name: string, tel?: string, email?: string): string {
  let card = `MECARD:N:${name};`;
  if (tel) card += `TEL:${tel};`;
  if (email) card += `EMAIL:${email};`;
  return card + ";";
}
