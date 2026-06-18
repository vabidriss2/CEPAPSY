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
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return localStorage.getItem("cepapsy_is_admin") === "true";
  });
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
            localStorage.setItem("cepapsy_is_admin", "true");
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
              localStorage.setItem("cepapsy_is_admin", "true");
            } else {
              setIsAdmin(false);
              localStorage.removeItem("cepapsy_is_admin");
              // Sign out immediately so this non-admin account doesn't linger logged in
              await signOut(auth);
            }
          }
        } catch (err: any) {
          console.warn("Could not verify admin status with Firestore. Checking offline cache:", err);
          // Fall back to localStorage status if it exists and we have an auth user
          const cachedAdmin = localStorage.getItem("cepapsy_is_admin") === "true";
          setIsAdmin(cachedAdmin);
        }
      } else {
        setIsAdmin(false);
        localStorage.removeItem("cepapsy_is_admin");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      // Double check if this user is in the admins collection
      const adminDoc = await getDoc(doc(db, "admins", res.user.uid));
      if (!adminDoc.exists()) {
        // Also check if no admins exist (special case for first run setup)
        const adminsCheck = await getDocs(collection(db, "admins"));
        if (!adminsCheck.empty) {
          // Administrators exist, and this general user is not one of them!
          await signOut(auth);
          setIsAdmin(false);
          localStorage.removeItem("cepapsy_is_admin");
          throw new Error("Accès refusé. Seuls les administrateurs enregistrés peuvent se connecter.");
        }
      }
    } catch (err: any) {
      let friendlyMessage = err.message || "Identifiants de connexion invalides.";
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential" || err.code === "auth/invalid-login-credentials") {
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
      localStorage.removeItem("cepapsy_is_admin");
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
      const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import("firebase/auth");
      let uid = "";
      
      try {
        // Try creating the user
        const res = await createUserWithEmailAndPassword(auth, email, password);
        uid = res.user.uid;
        setUser(res.user);
      } catch (authErr: any) {
        if (authErr.code === "auth/email-already-in-use") {
          // If the email is already in use, try signing in to reuse/verify the credentials
          try {
            const loginRes = await signInWithEmailAndPassword(auth, email, password);
            uid = loginRes.user.uid;
            setUser(loginRes.user);
          } catch (loginErr: any) {
            throw new Error("Cette adresse email est déjà enregistrée. Veuillez saisir son mot de passe correct pour l'associer au rôle d'administrateur CEPAPSY.");
          }
        } else {
          throw authErr;
        }
      }
      
      // Save profile/promotion to Firestore admin collection
      await setDoc(doc(db, "admins", uid), {
        email: email,
        role: "super_admin",
        createdAt: new Date().toISOString()
      });
      
      setIsAdmin(true);
      localStorage.setItem("cepapsy_is_admin", "true");
    } catch (err: any) {
      let friendlyMessage = err.message || "Impossible d'enregistrer l'administrateur.";
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
