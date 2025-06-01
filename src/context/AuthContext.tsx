"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  user: { id: string; email: string; name: string } | null;
  setUser: (user: { id: string; email: string; name: string } | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    console.log("AuthContext: Starting refreshAuth...");
    setLoading(true);
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      console.log("AuthContext: /api/auth/me response status:", response.status);
      const data = await response.json();
      if (response.ok && data.user) {
        console.log("AuthContext: User authenticated, user:", data.user);
        setUser(data.user);
      } else {
        console.log("AuthContext: User not authenticated, setting user to null");
        setUser(null);
      }
    } catch (error) {
      console.error("AuthContext: Error refreshing auth:", error);
      setUser(null);
    } finally {
      console.log("AuthContext: refreshAuth complete, setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("AuthContext: Initial auth check");
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated: !!user,
        loading,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}