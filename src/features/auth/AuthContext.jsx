import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUserApi, loginApi, registerApi } from "./authApi";

const TOKEN_KEY = "portfolio_builder_token_v1";

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  token: "",
  loading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      if (!token) {
        if (!cancelled) {
          setCurrentUser(null);
          setLoading(false);
        }
        return;
      }

      try {
        const payload = await getCurrentUserApi(token);
        if (!cancelled) {
          setCurrentUser(payload.user || null);
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken("");
          setCurrentUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadUser();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      currentUser,
      token,
      loading,
      isAuthenticated: Boolean(currentUser),
      login: async (payload) => {
        try {
          const result = await loginApi(payload);
          localStorage.setItem(TOKEN_KEY, result.token);
          setToken(result.token);
          setCurrentUser(result.user);
          return { ok: true, user: result.user };
        } catch (error) {
          return { ok: false, error: error.message || "Login failed." };
        }
      },
      register: async (payload) => {
        try {
          const result = await registerApi(payload);
          localStorage.setItem(TOKEN_KEY, result.token);
          setToken(result.token);
          setCurrentUser(result.user);
          return { ok: true, user: result.user };
        } catch (error) {
          return { ok: false, error: error.message || "Registration failed." };
        }
      },
      logout: () => {
        localStorage.removeItem(TOKEN_KEY);
        setToken("");
        setCurrentUser(null);
      },
    }),
    [currentUser, loading, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
