import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  role: 'admin' | 'staff' | 'customer';
  full_name: string;
  phone_number: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true); // Start with true, set false after check
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
      }
      
      // Set default admin profile if not found
      if (!data) {
        setProfile({
          id: userId,
          role: 'admin',
          full_name: 'Admin',
          phone_number: ''
        });
      } else {
        setProfile(data);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      // Set default admin profile on error
      setProfile({
        id: userId,
        role: 'admin',
        full_name: 'Admin',
        phone_number: ''
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const initAuth = async () => {
      try {
        // Get initial session - quick check
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (session?.user) {
          setUser(session.user);
          // Fetch profile in background, don't block
          fetchProfile(session.user.id);
        }
      } catch (error: any) {
        console.error('Error getting session:', error);
      } finally {
        if (mounted) {
          setLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Setup auth state listener
    const setupListener = () => {
      const { data } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (!mounted) return;
        
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          // Fetch profile in background
          fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      });
      
      subscription = data.subscription;
    };

    initAuth();
    setupListener();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isAdmin: !!user, // Assume all logged in users are admin for now
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
