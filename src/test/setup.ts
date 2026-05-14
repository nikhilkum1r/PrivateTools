import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock URL.createObjectURL and revokeObjectURL
if (typeof window !== 'undefined') {
  window.URL.createObjectURL = vi.fn(() => 'mock-url');
  window.URL.revokeObjectURL = vi.fn();
}

// Mock Worker
class MockWorker {
  onmessage: ((ev: MessageEvent) => any) | null = null;
  postMessage(message: any) {
    // Basic echo for testing
    setTimeout(() => {
      this.onmessage?.({ data: message } as MessageEvent);
    }, 0);
  }
  terminate() {}
}
global.Worker = MockWorker as any;
