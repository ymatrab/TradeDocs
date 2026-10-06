'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

export type ToastTone = 'neutral' | 'success' | 'danger';
type Toast = { id: number; tone: ToastTone; message: string; silent: boolean };

export type ToastOptions = {
  /**
   * Draw the toast without announcing it. For an outcome the page already announces in
   * its own live region (an inline result callout), where a second announcement would
   * only make a screen reader say the same thing twice.
   */
  silent?: boolean;
};

type Notify = (tone: ToastTone, message: string, options?: ToastOptions) => void;

const ToastContext = createContext<Notify | null>(null);

const icon = { neutral: Info, success: CheckCircle2, danger: AlertTriangle } as const;

/** Long enough to read a sentence, short enough not to sit over the work. */
const DISMISS_AFTER = 5000;

/**
 * Results are announced through a live region so a screen reader hears the
 * outcome without focus moving away from the control that caused it. Failures
 * are announced assertively and stay until they are dismissed: an error that
 * times out is an error the user may never have seen.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly Toast[]>([]);
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback(
    (tone: ToastTone, message: string, options?: ToastOptions) => {
      const id = Date.now() + Math.random();
      const silent = options?.silent ?? false;
      // Three at a time is as many as anyone reads; older ones make way.
      setToasts((current) => [...current, { id, tone, message, silent }].slice(-3));
      if (tone === 'danger') return;
      const timer = setTimeout(() => {
        timers.current.delete(timer);
        dismiss(id);
      }, DISMISS_AFTER);
      timers.current.add(timer);
    },
    [dismiss],
  );

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      pending.clear();
    };
  }, []);

  const value = useMemo(() => notify, [notify]);

  const region = (kind: 'danger' | 'other' | 'silent') =>
    toasts
      .filter((toast) =>
        kind === 'silent'
          ? toast.silent
          : !toast.silent && (kind === 'danger') === (toast.tone === 'danger'),
      )
      .map((toast) => {
        const Icon = icon[toast.tone];
        return (
          <div
            key={toast.id}
            className={toast.tone === 'neutral' ? 'toast' : `toast ${toast.tone}`}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{toast.message}</span>
            <button
              type="button"
              className="toast-dismiss"
              onClick={() => dismiss(toast.id)}
              aria-label={`Dismiss: ${toast.message}`}
            >
              <X size={15} aria-hidden="true" />
            </button>
          </div>
        );
      });

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Two regions, because one element cannot be both polite and assertive.
          Both are always present so an inserted message is announced. */}
      <div className="toast-region">
        <div role="alert" aria-live="assertive" className="toast-stack">
          {region('danger')}
        </div>
        <div role="status" aria-live="polite" className="toast-stack">
          {region('other')}
        </div>
        <div className="toast-stack">{region('silent')}</div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const notify = useContext(ToastContext);
  if (!notify) throw new Error('useToast requires ToastProvider.');
  return notify;
}

const ignore: Notify = () => undefined;

/**
 * For components that may also render outside a provider (a preview, a test). Without
 * one, a toast is simply not drawn; the outcome is still reported inline.
 */
export function useOptionalToast(): Notify {
  return useContext(ToastContext) ?? ignore;
}
