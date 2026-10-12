import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("access"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!token);

  const save = (t) => { localStorage.setItem("access", t); setToken(t); };
  const logout = () => { localStorage.removeItem("access"); setToken(null); setUser(null); };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api("/me/", { token }).then(setUser).catch(logout).finally(() => setLoading(false));
  }, [token]);

  const login = async (email, password) => {
    const d = await api("/login/", { method: "POST", body: { username: email.trim().toLowerCase(), password } });
    save(d.access);
  };
  const register = async (full_name, email, password) => {
    const d = await api("/register/", { method: "POST", body: { full_name, email: email.trim().toLowerCase(), password } });
    save(d.access);
  };
  return <Ctx.Provider value={{ user, token, loading, login, register, logout }}>{children}</Ctx.Provider>;
}
