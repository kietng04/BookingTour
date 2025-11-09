import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ add: () => {}, remove: () => {}, success: () => {}, error: () => {} });

let idSeq = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type, message, timeout = 3000) => {
    const id = ++idSeq;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (timeout > 0) {
      setTimeout(() => remove(id), timeout);
    }
    return id;
  }, [remove]);

  const success = useCallback((message, timeout) => add('success', message, timeout), [add]);
  const error = useCallback((message, timeout) => add('error', message, timeout), [add]);

  const value = useMemo(() => ({ add, remove, success, error }), [add, remove, success, error]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              'rounded-xl border px-4 py-3 text-sm shadow ' +
              (t.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-red-200 bg-red-50 text-red-700')
            }
            role="alert"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

