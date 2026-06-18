import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  auth, 
  db, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  getDocs,
  addDoc
} from "./firebase";
import { User } from "firebase/auth";

interface AdminContextProps {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  registerFirstAdmin: (email: string, password: string) => Promise<void>;
  checkIfNoAdminsExist: () => Promise<boolean>;
}

const AdminContext = createContext<AdminContextProps | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          // Check if uid exists in "admins" collection
          const adminDoc = await getDoc(doc(db, "admins", currentUser.uid));
          if (adminDoc.exists()) {
            setIsAdmin(true);
          } else {
            // Check if there are any admins at all. If not, auto-promote the first user!
            const adminsCheck = await getDocs(collection(db, "admins"));
            if (adminsCheck.empty) {
              // Create admin doc
              await setDoc(doc(db, "admins", currentUser.uid), {
                email: currentUser.email,
                role: "super_admin",
                createdAt: new Date().toISOString()
              });
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          }
        } catch (err: any) {
          console.error("Error verifying admin status:", err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      let friendlyMessage = "Identifiants de connexion invalides.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
        friendlyMessage = "Adresse email ou mot de passe incorrect.";
      } else if (err.code === "auth/invalid-email") {
        friendlyMessage = "Adresse email non valide.";
      } else if (err.code === "auth/network-request-failed") {
        friendlyMessage = "Erreur de connexion réseau.";
      }
      setError(friendlyMessage);
      setLoading(false);
      throw new Error(friendlyMessage);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error("Error signing out:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkIfNoAdminsExist = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "admins"));
      return querySnapshot.empty;
    } catch (e) {
      console.error(e);
      // fallback to true to allow registering or setup
      return true;
    }
  };

  const registerFirstAdmin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // In Firebase Auth, we create the user
      const { createUserWithEmailAndPassword } = await import("firebase/auth");
      const res = await createUserWithEmailAndPassword(auth, email, password);
      
      // Save profile to Firestore
      await setDoc(doc(db, "admins", res.user.uid), {
        email: email,
        role: "super_admin",
        createdAt: new Date().toISOString()
      });
      
      setUser(res.user);
      setIsAdmin(true);
    } catch (err: any) {
      let friendlyMessage = "Impossible d'enregistrer l'administrateur.";
      if (err.code === "auth/email-already-in-use") {
        friendlyMessage = "Cette adresse email est déjà utilisée.";
      } else if (err.code === "auth/weak-password") {
        friendlyMessage = "Le mot de passe doit contenir au moins 6 caractères.";
      }
      setError(friendlyMessage);
      setLoading(false);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      error, 
      login, 
      logout, 
      registerFirstAdmin,
      checkIfNoAdminsExist 
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
