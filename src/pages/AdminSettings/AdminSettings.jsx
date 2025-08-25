// src/pages/admin/AdminSettings.jsx
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Settings as SettingsIcon,
  CalendarDays,
  BookOpen,
} from "lucide-react";
import AdminDashboardSidebar from "../../components/AdminDashboardSidebar/AdminDashboardSidebar";
import api from "../../api"; // <- use axios instance

const defaults = {
  "borrow-day-limit": 14,
  "borrow-extend-limit": 2,
  "borrow-limit": 5,
  "booking-days-limit": 7,
};

// Single row component with per-row save button
function SettingRow({ icon, title, help, value, onChange, id, onSaveRow }) {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSaveRow(id, value);
    setSaving(false);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-gray-200">
      <div className="flex items-start sm:items-center gap-3">
        <span className="shrink-0 mt-0.5 sm:mt-0 text-sky-600">{icon}</span>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{help}</p>
        </div>
      </div>

      <div className="sm:min-w-[220px] flex gap-2 items-center">
        <div className="relative flex-1">
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

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className={`px-3 py-1 rounded-md text-sm font-medium text-white ${
            saving ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-500"
          }`}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}

export default function AdminSettings() {
  const [limits, setLimits] = useState(null);
  const [toast, setToast] = useState({ show: false, msg: "" });

  useEffect(() => {
    document.title = "Admin Settings";
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get("/admin-settings");
      const data = res.data;
      setLimits({
        "borrow-day-limit": data.borrow_day_limit,
        "borrow-extend-limit": data.borrow_extend_limit,
        "borrow-limit": data.borrow_book_limit,
        "booking-days-limit": data.booking_days_limit,
      });
      console.log("Fetched settings:", data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load settings.");
    }
  };

  const patch = (key, val) => setLimits((prev) => ({ ...prev, [key]: val }));

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const onSaveRow = async (key, val) => {
    try {
      let endpoint = "";
      switch (key) {
        case "borrow-day-limit":
          endpoint = "/borrow-day-limit";
          break;
        case "borrow-extend-limit":
          endpoint = "/borrow-extend-limit";
          break;
        case "borrow-limit":
          endpoint = "/borrow-book-limit";
          break;
        case "booking-days-limit":
          endpoint = "/booking-days-limit";
          break;
        default:
          throw new Error("Invalid key");
      }

      await api.post(endpoint, { value: val });
      showToast(`${titleCase(key)} saved successfully.`);
    } catch (err) {
      console.error(err);
      showToast(`Failed to save ${key}.`);
    }
  };

  const resetDefaults = () => setLimits({ ...defaults });

  // const titleCase = (str) => {
  //   return str
  //     .split("-")
  //     .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
  //     .join(" ");
  // };
    const titleCase = (str) =>
      str
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    if (!limits) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading settings...</p>
        </div>
      );
    }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <AdminDashboardSidebar activePage="settings" />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="text-gray-700" size={20} />
            Admin Settings
          </h1>

          <button
            type="button"
            onClick={resetDefaults}
            className="hidden sm:inline-flex items-center gap-2 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Reset
          </button>
        </header>

        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <CalendarDays size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Circulation & Booking Limits</h2>
          </div>

          <div className="p-4 md:p-6 space-y-4">
            {Object.entries(limits).map(([key, value]) => (
              <SettingRow
                key={key}
                id={key}
                icon={key.includes("borrow") ? <BookOpen size={18} /> : <CalendarDays size={18} />}
                title={titleCase(key)}
                help={`Update ${titleCase(key)}`}
                value={value}
                onChange={(v) => patch(key, v)}
                onSaveRow={onSaveRow}
              />
            ))}
          </div>
        </section>
      </main>

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

      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(8px) scale(.98) }
          to   { opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  );
}
