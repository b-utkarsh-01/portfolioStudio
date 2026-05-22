import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getCurrentUserApi, loginApi, logoutApi, refreshSessionApi, registerApi } from "./authApi";

const AuthContext = createContext({
  currentUser: null,
  isAuthenticated: false,
  loading: true,
  login: async () => ({ ok: false }),
  register: async () => ({ ok: false }),
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      try {
        const payload = await getCurrentUserApi();
        if (!cancelled) setCurrentUser(payload.user || null);
      } catch (error) {
        if (error?.status === 401) {
          try {
            const refreshed = await refreshSessionApi();
            if (!cancelled) setCurrentUser(refreshed.user || null);
          } catch {
            if (!cancelled) setCurrentUser(null);
          }
        } else if (!cancelled) {
          setCurrentUser((prev) => prev);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadUser();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      loading,
      isAuthenticated: Boolean(currentUser),
      login: async (payload) => {
        try {
          const result = await loginApi(payload);
          setCurrentUser(result.user || null);
          return { ok: true, user: result.user };
        } catch (error) {
          return { ok: false, error: error.message || "Login failed." };
        }
      },
      register: async (payload) => {
        try {
          const result = await registerApi(payload);
          setCurrentUser(result.user || null);
          return { ok: true, user: result.user };
        } catch (error) {
          return { ok: false, error: error.message || "Registration failed." };
        }
      },
      logout: async () => {
        try {
          await logoutApi();
        } catch {
          // noop
        } finally {
          setCurrentUser(null);
        }
      },
    }),
    [currentUser, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
