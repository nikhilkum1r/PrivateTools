'use client';

import { useState, useEffect, useCallback } from 'react';
import { get, set, del } from 'idb-keyval';

/**
 * usePersistedState
 *
 * Persists state to IndexedDB (via idb-keyval) so it survives page refreshes
 * and works in low-bandwidth / intermittent connection scenarios.
 *
 * ─ Usage ─────────────────────────────────────────────────────────────────
 * const [files, setFiles] = usePersistedState<ProcessedFile[]>('compressor:files', []);
 * ──────────────────────────────────────────────────────────────────────────
 *
 * @param key    - Unique key for this piece of state (namespaced by tool, e.g. "ocr:lastResult")
 * @param initial - Default value when nothing is stored yet
 * @param ttlMs  - Optional time-to-live in milliseconds (default: 24 hours)
 */
export function usePersistedState<T>(
  key: string,
  initial: T,
  ttlMs: number = 24 * 60 * 60 * 1000
): [T, (val: T | ((prev: T) => T)) => void, () => void] {
  const [state, setStateInternal] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);

  // On mount: hydrate from IndexedDB
  useEffect(() => {
    let cancelled = false;
    get<{ value: T; expires: number }>(key).then((stored) => {
      if (cancelled) return;
      if (stored && Date.now() < stored.expires) {
        setStateInternal(stored.value);
      } else if (stored) {
        // Expired — clean up
        del(key);
      }
      setHydrated(true);
    }).catch(() => {
      setHydrated(true);
    });
    return () => { cancelled = true; };
  }, [key]);

  // Setter: updates React state + persists to IDB
  const setState = useCallback((valOrUpdater: T | ((prev: T) => T)) => {
    setStateInternal((prev) => {
      const next = typeof valOrUpdater === 'function'
        ? (valOrUpdater as (prev: T) => T)(prev)
        : valOrUpdater;

      // Persist asynchronously — don't block the UI
      set(key, { value: next, expires: Date.now() + ttlMs }).catch(() => {
        // Silently fail — IDB may be unavailable (private browsing etc.)
      });

      return next;
    });
  }, [key, ttlMs]);

  // Clear: reset to initial and remove from IDB
  const clear = useCallback(() => {
    setStateInternal(initial);
    del(key).catch(() => {});
  }, [key, initial]);

  return [hydrated ? state : initial, setState, clear];
}

/**
 * useNetworkQuality
 *
 * Returns a normalized connection quality indicator.
 * Use this to gate heavy prefetching behind network availability.
 */
export function useNetworkQuality(): 'fast' | 'slow' | 'offline' | 'unknown' {
  const [quality, setQuality] = useState<'fast' | 'slow' | 'offline' | 'unknown'>('unknown');

  useEffect(() => {
    function evaluate() {
      if (!navigator.onLine) { setQuality('offline'); return; }
      const conn = (navigator as any).connection;
      if (!conn) { setQuality('unknown'); return; }
      if (conn.saveData || ['slow-2g', '2g'].includes(conn.effectiveType)) {
        setQuality('slow');
      } else {
        setQuality('fast');
      }
    }

    evaluate();
    window.addEventListener('online', evaluate);
    window.addEventListener('offline', evaluate);
    const conn = (navigator as any).connection;
    conn?.addEventListener('change', evaluate);

    return () => {
      window.removeEventListener('online', evaluate);
      window.removeEventListener('offline', evaluate);
      conn?.removeEventListener('change', evaluate);
    };
  }, []);

  return quality;
}
