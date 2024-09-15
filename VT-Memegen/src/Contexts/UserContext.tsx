// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../Models/User';
import { auth } from '../firebaseConfig';
import { sendEmailVerification, createUserWithEmailAndPassword , onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Define the shape of the context
interface UserContextType {
  user: User | null;
  register: (email: string, password: string) => Promise<void>;
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
        }
      } else {
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string) => {
    try {
      // Register the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      const firebaseUser = userCredential.user;


      // Create a user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: email,
        username: email.split('@')[0],
        bio: '',
        upvotes: 0,
        createdAt: new Date(),
        // Add other fields as needed
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      setUser(newUser);
    } catch (error) {
      console.error('Error registering user:', error);
      throw error; // Re-throw the error to handle it in the calling component
    }
  };

  return <UserContext.Provider value={{ user, setUser, register }}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
