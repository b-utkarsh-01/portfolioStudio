const AuthModeToggle = ({ mode, onLogin, onRegister }) => (
  <div className="mt-5 flex rounded-xl bg-slate-800 p-1">
    <button
      type="button"
      onClick={onLogin}
      className={`flex-1 rounded-lg px-3 py-2 text-sm ${
        mode === "login" ? "bg-orange-500 text-white" : "text-slate-300"
      }`}
    >
      Login
    </button>
    <button
      type="button"
      onClick={onRegister}
      className={`flex-1 rounded-lg px-3 py-2 text-sm ${
        mode === "register" ? "bg-orange-500 text-white" : "text-slate-300"
      }`}
    >
      Register
    </button>
  </div>
);

export default AuthModeToggle;
