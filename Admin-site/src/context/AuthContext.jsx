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
            // Self-heal: Create the admin document automatically
            const newAdmin = {
              email: user.email || 'admin@ugb.rw',
              firstName: 'System',
              lastName: 'Admin',
              role: 'Super Admin',
              approved: true,
              createdAt: new Date().toISOString()
            };
            await setDoc(docRef, newAdmin);
            setAdminProfile(newAdmin);
          }
        } catch (err) {
          console.error("Auth init error:", err);
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

    const data = {
      ...profileData,
      email,
      approved: true, // Simplified bootstrap: auto-approve
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
