import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'admins', user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setAdminProfile(snap.data());
          } else {
            setAdminProfile(null);
          }
        } catch {
          setAdminProfile(null);
        }
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  
  const signup = async (email, password, profileData) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Check if this is the very first admin
    const adminsSnap = await getDocs(collection(db, 'admins'));
    const isFirstAdmin = adminsSnap.empty;

    const data = {
      ...profileData,
      email,
      approved: isFirstAdmin,
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'admins', cred.user.uid), data);
    setAdminProfile(data);
    return cred;
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ currentUser, adminProfile, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
