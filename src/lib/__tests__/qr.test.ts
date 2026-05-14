import { describe, it, expect } from 'vitest';
import { validateQRValue, formatWiFi, formatMeCard } from '../qr';

describe('QR Utilities', () => {
  describe('validateQRValue', () => {
    it('should validate standard URLs', () => {
      expect(validateQRValue('https://safetools.space')).toBe(true);
      expect(validateQRValue('http://example.com')).toBe(true);
    });

    it('should invalidate malformed URLs starting with http', () => {
      expect(validateQRValue('https://')).toBe(false);
      expect(validateQRValue('http:// invalid')).toBe(false);
    });

    it('should validate mailto and tel protocols', () => {
      expect(validateQRValue('mailto:test@example.com')).toBe(true);
      expect(validateQRValue('tel:+1234567890')).toBe(true);
    });

    it('should validate WiFi protocol', () => {
      expect(validateQRValue('WIFI:S:MyNetwork;T:WPA;P:secret;;')).toBe(true);
      expect(validateQRValue('WIFI:S:MyNetwork;;')).toBe(true);
      expect(validateQRValue('WIFI:S:MyNetwork')).toBe(false);
    });

    it('should validate MeCard protocol', () => {
      expect(validateQRValue('MECARD:N:Nikhil Kumar;TEL:1234567890;;')).toBe(true);
      expect(validateQRValue('MECARD:N:Test;')).toBe(true);
    });

    it('should validate plain text', () => {
      expect(validateQRValue('Simple text message')).toBe(true);
      expect(validateQRValue('12345')).toBe(true);
    });

    it('should invalidate empty or overly long values', () => {
      expect(validateQRValue('')).toBe(false);
      expect(validateQRValue('a'.repeat(1201))).toBe(false);
    });
  });

  describe('formatWiFi', () => {
    it('should format WiFi strings correctly', () => {
      expect(formatWiFi('Home', '123456')).toBe('WIFI:S:Home;T:WPA;P:123456;;');
      expect(formatWiFi('Open')).toBe('WIFI:S:Open;T:WPA;P:;;');
    });
  });

  describe('formatMeCard', () => {
    it('should format MeCard strings correctly', () => {
      expect(formatMeCard('Nikhil', '123', 'nikhil@example.com')).toBe('MECARD:N:Nikhil;TEL:123;EMAIL:nikhil@example.com;;');
    });
  });
});
