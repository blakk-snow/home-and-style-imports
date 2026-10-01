import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "hsi-enquiry";
const EnquiryContext = createContext(null);

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function EnquiryProvider({ children }) {
  const [items, setItems] = useState(readStored);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    if (!toast) return undefined;
    const id = window.setTimeout(() => setToast(""), 2800);
    return () => window.clearTimeout(id);
  }, [toast]);

  const api = useMemo(
    () => ({
      items,
      open,
      setOpen,
      toast,
      notify: setToast,
      has: (key) => items.some((item) => item.key === key),
      add(item) {
        setItems((current) => {
          if (current.some((saved) => saved.key === item.key)) return current;
          return [...current, item];
        });
        setToast("Saved to your enquiry list");
      },
      remove(key) {
        setItems((current) => current.filter((item) => item.key !== key));
      },
      clear() {
        setItems([]);
      },
    }),
    [items, open, toast],
  );

  return (
    <EnquiryContext.Provider value={api}>
      {children}
      {toast ? (
        <div
          role="status"
          className="fixed bottom-28 left-1/2 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full bg-ink px-4 py-2.5 text-sm text-paper shadow-lift md:bottom-8"
        >
          <span>{toast}</span>
          <button
            type="button"
            className="font-semibold text-[#f0c7b8]"
            onClick={() => {
              setToast("");
              setOpen(true);
            }}
          >
            View
          </button>
        </div>
      ) : null}
    </EnquiryContext.Provider>
  );
}

export function useEnquiry() {
  const value = useContext(EnquiryContext);
  if (!value) throw new Error("useEnquiry must be used within EnquiryProvider");
  return value;
}
