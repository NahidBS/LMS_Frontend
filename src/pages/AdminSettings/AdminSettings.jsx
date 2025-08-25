// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Settings as SettingsIcon,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";

const LS_KEY = "adminSettings_limits_v1";

// Pretty row used for each setting
function SettingRow({ icon, title, help, value, onChange, id }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-gray-200">
      <div className="flex items-start sm:items-center gap-3">
        <span className="shrink-0 mt-0.5 sm:mt-0 text-sky-600">{icon}</span>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{help}</p>
        </div>
      </div>

      <div className="sm:min-w-[220px]">
        <div className="relative">
          <input
            id={id}
            type="number"
            min={0}
            step={1}
            value={value}
            onChange={(e) => onChange(Math.max(0, Number(e.target.value || 0)))}
            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-right focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs text-gray-500">
            days
          </span>
        </div>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  useEffect(() => {
    document.title = "Admin Settings";
  }, []);

  // Default values (you can change these if your backend wants other initial numbers)
  const defaults = {
    "borrow-day-limit": 14,
    "borrow-extend-limit": 7,
    "borrow-limit": 3,
    "booking-duration": 2,
    "booking-days-limit": 30,
  };

  // Load from localStorage
  const [limits, setLimits] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      const saved = raw ? JSON.parse(raw) : {};
      return { ...defaults, ...saved };
    } catch {
      return { ...defaults };
    }
  });

  // Modal + Toast
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const patch = (key, val) =>
    setLimits((prev) => ({
      ...prev,
      [key]: val,
    }));

  const onSave = () => setConfirmOpen(true);

  const doSave = () => {
    // Persist locally
    localStorage.setItem(LS_KEY, JSON.stringify(limits));

    // Prepare API payload using the EXACT hyphenated keys your backend expects
    const payload = {
      "borrow-day-limit": limits["borrow-day-limit"],
      "borrow-extend-limit": limits["borrow-extend-limit"],
      "borrow-limit": limits["borrow-limit"],
      "booking-duration": limits["booking-duration"],
      "booking-days-limit": limits["booking-days-limit"],
    };

    // Hook this up to your API call when ready:
    // await fetch('/api/admin/settings/limits', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })

    setConfirmOpen(false);
    setToast({ show: true, msg: "Settings saved successfully." });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const resetDefaults = () => setLimits({ ...defaults });

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar activePage="settings" />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="text-gray-700" size={20} />
            Admin Settings
          </h1>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={resetDefaults}
              className="hidden sm:inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <Save size={16} /> Save Changes
            </button>
          </div>
        </header>

        {/* Limits card */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <CalendarDays size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Circulation & Booking Limits</h2>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            <SettingRow
              id="borrow-day-limit"
              icon={<BookOpen size={18} />}
              title="Borrow Day Limit"
              help="Update borrow day limit"
              value={limits["borrow-day-limit"]}
              onChange={(v) => patch("borrow-day-limit", v)}
            />

            <SettingRow
              id="borrow-extend-limit"
              icon={<BookOpen size={18} />}
              title="Borrow Extension Limit"
              help="Update borrow extension limit"
              value={limits["borrow-extend-limit"]}
              onChange={(v) => patch("borrow-extend-limit", v)}
            />

            <SettingRow
              id="borrow-limit"
              icon={<BookOpen size={18} />}
              title="Max Borrow Limit"
              help="Update max borrow limit (how many books a user can borrow at once)"
              value={limits["borrow-limit"]}
              onChange={(v) => patch("borrow-limit", v)}
            />

            <SettingRow
              id="booking-duration"
              icon={<CalendarDays size={18} />}
              title="Max Booking Duration"
              help="Update max booking duration"
              value={limits["booking-duration"]}
              onChange={(v) => patch("booking-duration", v)}
            />

            <SettingRow
              id="booking-days-limit"
              icon={<CalendarDays size={18} />}
              title="Booking Days Limit"
              help="Update booking days limit"
              value={limits["booking-days-limit"]}
              onChange={(v) => patch("booking-days-limit", v)}
            />
          </div>
        </section>
      </main>

      {/* Save confirmation modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setConfirmOpen(false);
          }}
        >
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-lg bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 py-5">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <AlertTriangle className="text-amber-500" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Apply these changes?
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Limits will update for all users immediately after saving.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 bg-white border-t border-gray-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={doSave}
                  className="rounded-md px-5 py-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 focus:ring-2 focus:ring-sky-400"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success toast */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-[60] pointer-events-none animate-[toastIn_.25s_ease-out]">
          <div className="pointer-events-auto flex items-start gap-3 rounded-xl bg-white shadow-lg ring-1 ring-black/5 px-4 py-3">
            <div className="mt-0.5">
              <CheckCircle2 className="text-green-600" size={22} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Success</p>
              <p className="text-xs text-gray-600">{toast.msg}</p>
            </div>
          </div>
        </div>
      )}

      {/* animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}