// UserSettings.jsx
import { useEffect, useState } from "react";
import UserSidebar from "../../components/UserSidebar/UserSidebar";
import { Upload, User2, CheckCircle2, Search } from "lucide-react";

export default function UserSettings() {
  useEffect(() => {
    document.title = "Settings";
  }, []);

  // ----- form state -----
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [notify, setNotify] = useState(true);
  const [lang, setLang] = useState("en");

  // Upload preview (working copy) and committed avatar for header
  const [photo, setPhoto] = useState(null);      // file
  const [photoUrl, setPhotoUrl] = useState("");  // preview (before save)
  const [avatarUrl, setAvatarUrl] = useState(""); // committed avatar (shows in header after Done)

  // header search
  const [q, setQ] = useState("");

  // success popup (modal)
  const [savePopup, setSavePopup] = useState(false);

  // map language -> flag emoji
  const flagFor = (code) => {
    switch (code) {
      case "bn":
        return "🇧🇩";
      case "es":
        return "🇪🇸";
      case "fr":
        return "🇫🇷";
      case "en":
      default:
        return "🇬🇧";
    }
  };

  // handle upload (click or drop)
  const onFile = (file) => {
    if (!file) return;
    const okTypes = ["image/png", "image/jpeg", "image/gif", "image/svg+xml"];
    if (!okTypes.includes(file.type)) {
      return;
    }
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
  };

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    onFile(file);
  };

  const onSave = () => {
    // Show confirmation popup. We don't commit avatar yet.
    setSavePopup(true);
  };

  // When user clicks Done in popup: commit avatar to header
  const onPopupDone = () => {
    if (photoUrl) setAvatarUrl(photoUrl); // commit uploaded image to header avatar
    setSavePopup(false);
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar (unchanged) */}
      <UserSidebar active="settings" />

      {/* Main */}
      <main className="flex-1 p-6 space-y-6">
        {/* Header with Search + User icon */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

          <div className="flex items-center gap-3">
            {/* Search bar */}
            <div className="relative hidden sm:block">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={18} />
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search"
                className="w-64 rounded-full border border-gray-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            {/* Header avatar: shows committed avatarUrl AFTER Done; otherwise icon */}
            <div className="h-9 w-9 rounded-full bg-gray-100 ring-1 ring-gray-200 overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User2 className="text-gray-500" size={18} />
              )}
            </div>
          </div>
        </div>

        {/* Card */}
        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            System Settings
          </h2>

          {/* Top row: Name + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                User Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
            </div>
          </div>

          {/* Photo uploader */}
          <div className="mt-6">
            <p className="text-sm font-semibold text-gray-900">Your Photo</p>
            <p className="text-xs text-gray-500 mb-3">
              This will be displayed on your profile.
            </p>

            <div className="flex items-center gap-4">
              {/* avatar preview (working copy before Done) */}
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden ring-1 ring-gray-200">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt="avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User2 className="text-gray-400" size={26} />
                )}
              </div>

              {/* drop zone */}
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="flex-1 cursor-pointer"
              >
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.gif,.svg,image/*"
                  className="hidden"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
                <div className="rounded-lg border border-gray-300 bg-white h-28 flex items-center justify-center">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={22} />
                    <p className="text-sm">
                      <span className="text-sky-600 font-medium">
                        Click to upload
                      </span>{" "}
                      or drag and drop
                    </p>
                    <p className="text-[11px] text-gray-400">
                      SVG, PNG, JPG or GIF (max. 800×400px)
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Email notifications toggle + Language */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  Email Notifications
                </p>
                <p className="text-xs text-gray-500">
                  Receive email notifications for important system events
                </p>
              </div>

              {/* switch */}
              <button
                type="button"
                onClick={() => setNotify((v) => !v)}
                aria-pressed={notify}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                  notify ? "bg-sky-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                    notify ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Language
              </label>
              <div className="relative">
                {/* dynamic flag based on selected language */}
                <span className="absolute left-3 top-1/2 -translate-y-1/2">
                  <span className="text-lg">{flagFor(lang)}</span>
                </span>
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 pl-10 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  <option value="en">En</option>
                  <option value="bn">Bn</option>
                  <option value="es">Es</option>
                  <option value="fr">Fr</option>
                </select>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="mt-6">
            <button
              type="button"
              onClick={onSave}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              Save Changes
            </button>
          </div>
        </section>
      </main>

      {/* -------- Professional Success Popup -------- */}
      {savePopup && (
        <div
          className="fixed inset-0 z-50"
          aria-modal="true"
          role="dialog"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSavePopup(false);
          }}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50 opacity-0 animate-[fadeIn_.2s_ease-out_forwards]" />

          {/* panel */}
          <div className="absolute inset-0 flex items-center justify-center px-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg border border-gray-200 opacity-0 translate-y-2 animate-[popIn_.22s_ease-out_forwards]">
              <div className="px-6 pt-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50">
                  <CheckCircle2 className="text-green-600" size={28} />
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  Changes saved
                </h3>
                <p className="mt-1 mb-4 text-sm text-gray-600">
                  Your profile settings have been updated successfully.
                </p>
              </div>

              <div className="px-6 pb-6 flex justify-center">
                <button
                  type="button"
                  onClick={onPopupDone}
                  className="rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold px-5 py-2 focus:outline-none focus:ring-2 focus:ring-sky-400"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* small animations */}
      <style>{`
        @keyframes fadeIn { to { opacity: 1 } }
        @keyframes popIn { to { opacity: 1; transform: translateY(0) } }
        @keyframes toastIn { from { opacity: 0; transform: translateY(8px) scale(.98) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </div>
  );
}