import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext();

const MOCK_ADMIN_PROFILE = {
  name: 'byglobal Admin',
  role: 'superadmin',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAh7uShrWK0V1aiKuDwIiXJfeGIpKW2nNfnzV87pNsbNn6m63g70_lqC1gkceKsoEpaShdWtvHVSN-j4e33fAOBmM_lxAuEyBBxffKWVcDyj1kEdMAZAXRVyh6l-KyfoKQNGiObUOkeadpnV3cwKW-366kW-IRrEZKGbX7w9MeCMPlYCPQ4i1_DolWZu-ZdFMrdnSzsLP1anLcP92mYZ2PmLqorkcWn_OnMJ0TFlghJYwxlRXMGmkY7WTCY9BfxHt9lwcwNMYNoUgXJ'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initially true while checking session

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Map Firebase user to our app's user structure
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email,
          ...MOCK_ADMIN_PROFILE // Fallback until we create a Firestore users collection
        });
      } else {
        // Check if we have a mock login session
        if (localStorage.getItem('mockAdminLoggedIn') === 'true') {
          setUser({
            id: 'mock-admin-id',
            email: 'admin@byglobal.com',
            ...MOCK_ADMIN_PROFILE
          });
        } else {
          setUser(null);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // onAuthStateChanged will handle the setUser state update
      return { success: true };
    } catch (error) {
      console.error('Firebase login error:', error);
      setIsLoading(false);
      return { success: false, error: error.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      localStorage.removeItem('mockAdminLoggedIn');
      await signOut(auth);
    } catch (error) {
      console.error('Firebase logout error:', error);
    }
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isLoading }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

export default AuthContext;
