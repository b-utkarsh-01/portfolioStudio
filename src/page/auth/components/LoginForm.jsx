import { inputClassName } from "../registerStages";

const LoginForm = ({
  username,
  password,
  error,
  submitting,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
}) => (
  <form onSubmit={onSubmit} className="mt-5 space-y-4 transition-opacity duration-300 ease-out">
    <label className="block text-sm text-slate-200">
      Username
      <input
        value={username}
        onChange={onUsernameChange}
        placeholder="yourname"
        autoComplete="username"
        className={inputClassName}
      />
    </label>
    <label className="block text-sm text-slate-200">
      Password
      <input
        type="password"
        value={password}
        onChange={onPasswordChange}
        autoComplete="current-password"
        className={inputClassName}
      />
    </label>
    {error ? <p className="text-sm text-rose-300">{error}</p> : null}
    <button
      type="submit"
      disabled={submitting}
      className="w-full rounded-lg bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-400"
    >
      {submitting ? "Please wait..." : "Login"}
    </button>
  </form>
);

export default LoginForm;
