// src/pages/admin/AdminSettings.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Save,
  CheckCircle2,
  AlertTriangle,
  Upload,
  BookOpen,
  CalendarDays,
  Users as UsersIcon,
  ShieldCheck,
  Settings as SettingsIcon,
} from "lucide-react";
import Sidebar from "../../components/DashboardSidebar/DashboardSidebar";

// simple switch component
function Switch({ checked, onChange, label }) {
  return (
    <label className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span
          className="
            h-5 w-9 rounded-full bg-gray-300 peer-checked:bg-sky-600 transition-colors
            relative after:content-[''] after:absolute after:top-0.5 after:left-0.5
            after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform
            peer-checked:after:translate-x-4
          "
        />
      </span>
    </label>
  );
}

const LS_KEY = "adminSettings";

const defaultSettings = {
  features: {
    bookings: true,
    bookOnlyWhenAvailable: true,
    autoApproveBooking: false,

    returnsEnabled: true,
    autoAcceptReturns: true,
    requireReturnPhoto: false,

    uploadsEnabled: true, // donation requests
    requireUploadApproval: true,
  },

  bookingRules: {
    maxDays: 14,
    leadDays: 0,
  },

  returnRules: {
    graceDays: 2,
    finePerDay: 0, // 0 = no fine
    eligibleCategories: ["Programming", "Web Development", "Business"],
  },

  uploadRules: {
    allowedTypes: ["jpg", "jpeg", "png", "pdf"],
    maxSizeMB: 20,
  },

  permissions: {
    client: { canBook: true, canReturn: true, canUpload: true },
    employee: { canBook: true, canReturn: true, canUpload: true },
  },

  meta: {
    lastSavedBy: "Happy",
    lastSavedAt: null,
    audit: [
      { id: 1, who: "Happy", what: "Initialized settings", when: new Date().toISOString() },
    ],
  },
};

export default function AdminSettings() {
  // load / init
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Save modal + toast
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "" });

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: "" }), 1800);
  };

  const onSave = () => setConfirmOpen(true);

  const doSave = () => {
    const now = new Date().toISOString();
    const next = {
      ...settings,
      meta: {
        ...settings.meta,
        lastSavedAt: now,
        audit: [
          { id: Date.now(), who: "Happy", what: "Saved settings", when: now },
          ...(settings.meta?.audit || []),
        ].slice(0, 8),
      },
    };
    setSettings(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
    setConfirmOpen(false);
    showToast("Settings have been saved and applied.");
  };

  // derived
  const allowedTypesText = useMemo(
    () => (settings.uploadRules.allowedTypes || []).join(", "),
    [settings.uploadRules.allowedTypes]
  );

  // helpers to update nested state
  const patch = (path, value) => {
    setSettings((prev) => {
      const next = structuredClone(prev);
      // tiny path setter (path like "features.bookings")
      const parts = path.split(".");
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const toggleType = (ext, checked) => {
    const cur = new Set(settings.uploadRules.allowedTypes);
    if (checked) cur.add(ext);
    else cur.delete(ext);
    patch("uploadRules.allowedTypes", Array.from(cur));
  };

  const toggleCategory = (name, checked) => {
    const cur = new Set(settings.returnRules.eligibleCategories);
    if (checked) cur.add(name);
    else cur.delete(name);
    patch("returnRules.eligibleCategories", Array.from(cur));
  };

  const perms = settings.permissions;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <main className="flex-1 p-4 md:p-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="text-gray-700" size={20} />
            Admin Settings
          </h1>

          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <Save size={16} /> Save Changes
          </button>
        </header>

        {/* ======== Feature Toggles ======== */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <ShieldCheck size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Feature Toggles</h2>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bookings */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={18} className="text-sky-600" />
                <p className="font-medium text-gray-800">Bookings</p>
              </div>
              <div className="space-y-3">
                <Switch
                  checked={settings.features.bookings}
                  onChange={(v) => patch("features.bookings", v)}
                  label="Enable bookings"
                />
                <Switch
                  checked={settings.features.bookOnlyWhenAvailable}
                  onChange={(v) => patch("features.bookOnlyWhenAvailable", v)}
                  label="Allow booking only when available"
                />
                <Switch
                  checked={settings.features.autoApproveBooking}
                  onChange={(v) => patch("features.autoApproveBooking", v)}
                  label="Auto-approve booking"
                />
              </div>
            </div>

            {/* Returns */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={18} className="text-green-600" />
                <p className="font-medium text-gray-800">Returns</p>
              </div>
              <div className="space-y-3">
                <Switch
                  checked={settings.features.returnsEnabled}
                  onChange={(v) => patch("features.returnsEnabled", v)}
                  label="Enable returns"
                />
                <Switch
                  checked={settings.features.autoAcceptReturns}
                  onChange={(v) => patch("features.autoAcceptReturns", v)}
                  label="Auto-accept when scanned"
                />
                <Switch
                  checked={settings.features.requireReturnPhoto}
                  onChange={(v) => patch("features.requireReturnPhoto", v)}
                  label="Require condition photo on return"
                />
              </div>
            </div>

            {/* Uploads / Donation Requests */}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Upload size={18} className="text-violet-600" />
                <p className="font-medium text-gray-800">Uploads / Donation Requests</p>
              </div>
              <div className="space-y-3">
                <Switch
                  checked={settings.features.uploadsEnabled}
                  onChange={(v) => patch("features.uploadsEnabled", v)}
                  label="Enable user uploads (donation requests)"
                />
                <Switch
                  checked={settings.features.requireUploadApproval}
                  onChange={(v) => patch("features.requireUploadApproval", v)}
                  label="Require admin approval"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ======== Rules ======== */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <SettingsIcon size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Rules</h2>
          </div>

          <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Booking rules */}
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-800 mb-3">Booking Rules</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max reservation days</label>
                  <input
                    type="number"
                    min={1}
                    value={settings.bookingRules.maxDays}
                    onChange={(e) => patch("bookingRules.maxDays", Number(e.target.value || 1))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Lead time (days)</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.bookingRules.leadDays}
                    onChange={(e) => patch("bookingRules.leadDays", Number(e.target.value || 0))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Return rules */}
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-800 mb-3">Return Rules</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Grace days</label>
                  <input
                    type="number"
                    min={0}
                    value={settings.returnRules.graceDays}
                    onChange={(e) => patch("returnRules.graceDays", Number(e.target.value || 0))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Fine per day (optional)</label>
                  <input
                    type="number"
                    min={0}
                    step="0.01"
                    value={settings.returnRules.finePerDay}
                    onChange={(e) => patch("returnRules.finePerDay", Number(e.target.value || 0))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
                <div>
                  <p className="block text-sm text-gray-700 mb-1">Eligible categories</p>
                  <div className="flex flex-wrap gap-2">
                    {["Programming", "Web Development", "Design", "Business", "Science"].map(
                      (cat) => {
                        const checked = settings.returnRules.eligibleCategories.includes(cat);
                        return (
                          <label
                            key={cat}
                            className={`px-3 py-1 rounded-full text-xs font-medium ring-1 cursor-pointer ${
                              checked
                                ? "bg-sky-50 text-sky-700 ring-sky-200"
                                : "bg-white text-gray-700 ring-gray-200"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={(e) => toggleCategory(cat, e.target.checked)}
                            />
                            {cat}
                          </label>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Upload rules */}
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-medium text-gray-800 mb-3">Upload Rules</p>
              <div className="space-y-3">
                <div>
                  <p className="block text-sm text-gray-700 mb-1">Allowed types</p>
                  <div className="flex flex-wrap gap-2">
                    {["jpg", "jpeg", "png", "pdf"].map((ext) => {
                      const checked = settings.uploadRules.allowedTypes.includes(ext);
                      return (
                        <label
                          key={ext}
                          className={`px-3 py-1 rounded-full text-xs font-medium ring-1 cursor-pointer ${
                            checked
                              ? "bg-violet-50 text-violet-700 ring-violet-200"
                              : "bg-white text-gray-700 ring-gray-200"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={(e) => toggleType(ext, e.target.checked)}
                          />
                          {ext.toUpperCase()}
                        </label>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Selected: {allowedTypesText || "—"}</p>
                </div>

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Max size (MB)</label>
                  <input
                    type="number"
                    min={1}
                    value={settings.uploadRules.maxSizeMB}
                    onChange={(e) => patch("uploadRules.maxSizeMB", Number(e.target.value || 1))}
                    className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======== Roles & Permissions ======== */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center gap-2">
            <UsersIcon size={18} className="text-gray-700" />
            <h2 className="font-semibold text-gray-800">Roles & Permissions</h2>
          </div>

          <div className="p-4 md:p-6 overflow-x-auto">
            <table className="min-w-[520px] w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2 px-3">Role</th>
                  <th className="py-2 px-3">Can Book</th>
                  <th className="py-2 px-3">Can Return</th>
                  <th className="py-2 px-3">Can Upload Donation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {["client", "employee"].map((role) => (
                  <tr key={role} className="even:bg-gray-50">
                    <td className="py-3 px-3 font-medium capitalize">{role}</td>
                    {["canBook", "canReturn", "canUpload"].map((perm) => (
                      <td key={perm} className="py-3 px-3">
                        <input
                          type="checkbox"
                          className="h-4 w-4 accent-sky-600"
                          checked={perms[role][perm]}
                          onChange={(e) =>
                            patch(`permissions.${role}.${perm}`, e.target.checked)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-xs text-gray-500 mt-3">
              Tip: If a feature is disabled above, related permissions won’t have effect.
            </p>
          </div>
        </section>

        {/* ======== Audit ======== */}
        <section className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
          <div className="px-4 md:px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-gray-700" />
              <h2 className="font-semibold text-gray-800">Audit</h2>
            </div>
            <div className="text-sm text-gray-600">
              Last saved by <span className="font-medium">Happy</span>{" "}
              {settings.meta.lastSavedAt
                ? `on ${new Date(settings.meta.lastSavedAt).toLocaleString()}`
                : "(not yet saved)"}
            </div>
          </div>

          <div className="p-4 md:p-6">
            <ul className="space-y-2">
              {(settings.meta.audit || []).map((a) => (
                <li key={a.id} className="flex items-center justify-between rounded border border-gray-200 p-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle2 className="text-green-600" size={18} />
                    <span className="font-medium">{a.what}</span>
                    <span className="text-gray-500">— {a.who}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(a.when).toLocaleString()}
                  </div>
                </li>
              ))}
              {(settings.meta.audit || []).length === 0 && (
                <li className="text-sm text-gray-500">No audit entries yet.</li>
              )}
            </ul>
          </div>
        </section>
      </main>

      {/* ===== Save confirmation modal ===== */}
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
                      Settings will apply immediately for all users (client & employee).
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

      {/* ===== Toast ===== */}
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