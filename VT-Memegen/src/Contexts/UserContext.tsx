// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../Models/User';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Define the shape of the context
interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

// Define the props for the provider
interface UserProviderProps {
  children: ReactNode;
}

// Create the context with default values
const UserContext = createContext<UserContextType | undefined>(undefined);

// UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore if necessary
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          // If user data doesn't exist in Firestore, set minimal data
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email ,
            username: "user",
            upvotes: 0,
            bio: "",
          })
        }
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
