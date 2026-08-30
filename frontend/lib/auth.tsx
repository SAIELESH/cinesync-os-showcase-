import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserAccount {
  name: string;
  email: string;
  plan: "Free Tier" | "Creator Pro" | "Studio Enterprise";
  credits: number;
  siliconFlowKey: string;
  anthropicKey: string;
  isLoggedIn: boolean;
}

const DEFAULT_USER: UserAccount = {
  name: "Sailesh Krishnan",
  email: "director@cinesync.ai",
  plan: "Creator Pro",
  credits: 1240,
  siliconFlowKey: "",
  anthropicKey: "",
  isLoggedIn: true,
};

interface AuthContextType {
  user: UserAccount;
  login: (email: string, name?: string) => void;
  logout: () => void;
  deductCredits: (amount: number) => boolean;
  addCredits: (amount: number) => void;
  saveApiKeys: (siliconFlowKey: string, anthropicKey: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAccount>(DEFAULT_USER);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cinesync_user");
      if (saved) {
        setUser(JSON.parse(saved));
      }
    } catch {
      // Ignore local storage error
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("cinesync_user", JSON.stringify(user));
      } catch {
        // Ignore error
      }
    }
  }, [user, isLoaded]);

  const login = (email: string, name?: string) => {
    setUser((prev) => ({
      ...prev,
      email,
      name: name || email.split("@")[0] || "Director",
      isLoggedIn: true,
    }));
  };

  const logout = () => {
    setUser({
      name: "Guest Filmmaker",
      email: "",
      plan: "Free Tier",
      credits: 200,
      siliconFlowKey: "",
      anthropicKey: "",
      isLoggedIn: false,
    });
  };

  const deductCredits = (amount: number): boolean => {
    if (user.credits < amount) return false;
    setUser((prev) => ({ ...prev, credits: Math.max(0, prev.credits - amount) }));
    return true;
  };

  const addCredits = (amount: number) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
  };

  const saveApiKeys = (siliconFlowKey: string, anthropicKey: string) => {
    setUser((prev) => ({
      ...prev,
      siliconFlowKey: siliconFlowKey.trim(),
      anthropicKey: anthropicKey.trim(),
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        deductCredits,
        addCredits,
        saveApiKeys,
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
