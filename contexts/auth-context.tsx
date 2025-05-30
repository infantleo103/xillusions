"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define User type
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  mobile?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const checkUserSession = async () => {
      try {
        // Get user data from session
        const response = await fetch('/api/user/session');
        const data = await response.json();
        
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUserSession();
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      const data = await response.json();
      
      if (data.success && data.user) {
        setUser(data.user);
        // Store user info in localStorage for persistence
        localStorage.setItem('userEmail', data.user.email);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      });
      
      setUser(null);
      localStorage.removeItem('userEmail');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
