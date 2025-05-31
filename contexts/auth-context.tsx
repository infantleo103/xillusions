"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Define User type
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: string
  mobile?: string
  name?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

// Demo admin user
const ADMIN_USER: User = {
  id: "1",
  firstName: "Admin",
  lastName: "User",
  email: "admin@xillusions.com",
  role: "admin",
  name: "Admin User"
}

// Demo password - in a real app, this would be hashed and stored in a database
const ADMIN_PASSWORD = "password123"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const checkUserSession = async () => {
      try {
        const storedUserId = localStorage.getItem('userId')
        const storedUserEmail = localStorage.getItem('userEmail')
        
        if (storedUserId && storedUserEmail) {
          // Fetch user data from API
          const response = await fetch('/api/user/session', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.success && data.user) {
              const userData: User = {
                id: data.user._id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                role: data.user.role,
                name: `${data.user.firstName} ${data.user.lastName}`
              };
              
              setUser(userData);
            }
          } else {
            // If API call fails, clear localStorage
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
          }
        }
      } catch (error) {
        console.error('Error checking user session:', error);
        // Clear localStorage on error
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
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
      
      if (data.success) {
        const userData: User = {
          id: data.user._id,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          role: data.user.role,
          name: `${data.user.firstName} ${data.user.lastName}`
        };
        
        setUser(userData);
        
        // Store user info in localStorage for persistence
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('userEmail', userData.email);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userId')
    localStorage.removeItem('userEmail')
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
