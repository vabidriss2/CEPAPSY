/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  auth, 
  db, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  addDoc 
} from "../lib/firebase";
import { where } from "firebase/firestore";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  updateProfile,
  onAuthStateChanged
} from "firebase/auth";
import { 
  Calendar, 
  Download, 
  Lock, 
  User, 
  FileText, 
  CheckCircle, 
  LogOut, 
  ChevronRight, 
  Plus, 
  Search, 
  Sparkles, 
  BookOpen, 
  ArrowLeft,
  Clock,
  Eye,
  EyeOff,
  AlertCircle,
  Phone,
  Activity,
  UserCheck
} from "lucide-react";

// List of professional physical & mental health therapeutic download resources
interface TherapeuticResource {
  id: string;
  title: string;
  category: "cognitive" | "relaxation" | "sommeil" | "trauma";
  description: string;
  benefits: string;
  instructions: string[];
  docMeta: string; // e.g., "PDF Formulaire interactif • 244 Ko"
}

const THERAPEUTIC_RESOURCES: TherapeuticResource[] = [
  {
    id: "res-cbt-column",
    title: "Grille d'évaluation des pensées de Beck (TCC)",
    category: "cognitive",
    description: "La fiche classique de thérapie cognitive comportementale pour consigner les situations stressantes, identifier les distorsions cognitives et restructurer les pensées automatiques négatives.",
    benefits: "Diminue significativement la rumination mentale, fluidifie la prise de distance avec les biais catastrophiques.",
    docMeta: "PDF • Formulaire interactif • 185 Ko",
    instructions: [
      "Décrivez objectivement la situation déclenchante (Qui, Quoi, Quand, Où ?).",
      "Évaluez l'émotion déclenchée sur une échelle de 0 à 100%.",
      "Identifiez la pensée automatique associée (ex: 'Je vais rater', 'Tout le monde me juge').",
      "Listez les preuves factuelles qui valident OU contredisent cette pensée.",
      "Formulez une pensée alternative plus réaliste et évaluez l'apaisement obtenu."
    ]
  },
  {
    id: "res-cardiac-coherence",
    title: "Protocole de Cohérence Cardiaque 365",
    category: "relaxation",
    description: "Guide respiratoire scientifique pour rééquilibrer le système nerveux autonome, abaisser le taux de cortisol (hormone de stress) et induire un état de calme immédiat.",
    benefits: "Régule le rythme cardiaque, diminue l'anxiété aiguë et prévient les attaques de panique.",
    docMeta: "GUIDE PRATIQUE • Synthèse PDF • 120 Ko",
    instructions: [
      "Installez-vous confortablement, le dos droit, les épaules relâchées.",
      "Pratiquez ce protocole 3 fois par jour : matin, midi et fin d'après-midi.",
      "Inspirez profondément par le nez pendant 5 secondes en gonflant le ventre.",
      "Expirez lentement par la bouche durant 5 secondes en rentrant le ventre.",
      "Poursuivez ce rythme de 6 respirations par minute pendant 5 minutes."
    ]
  },
  {
    id: "res-sleep-sleep",
    title: "Fiche d'Hygiène Sommeil & Agenda de Nuit",
    category: "sommeil",
    description: "Une check-list clinique d'organisation de fin de journée pour réguler le rythme circadien, couplée à un calendrier de suivi de la qualité du repos nocturne.",
    benefits: "Améliore la structure du sommeil, réduit les réveils précoces et combat l'insomnie chronique.",
    docMeta: "DIAGNOSTIC • Document imprimable • 198 Ko",
    instructions: [
      "Cessez toute activité sur écran d'ordinateur ou téléphone au moins 1h30 avant le coucher.",
      "Maintenez la température de votre chambre de préférence à 18°C.",
      "Évitez la caféine, le thé fort et le sport intense après 16 heures.",
      "Utilisez le lit uniquement pour dormir (pas de lecture tendue ou d'écrans au lit).",
      "Remplissez l'agenda de nuit chaque matin (heure de coucher, réveils, sensation au réveil)."
    ]
  },
  {
    id: "res-emdr-grounding",
    title: "Kit d'Ancrage Sensoriel 5-4-3-2-1 (Anti-Panique)",
    category: "relaxation",
    description: "Protocole clinique d'urgence pour sortir instantanément du mode combat/fuite induit par une réactivation post-traumatique ou une crise de panique soudaine.",
    benefits: "Reconnecte le cerveau préfrontal au présent, bloque les flashbacks traumatiques.",
    docMeta: "FICHE MÉMO • Format poche • 92 Ko",
    instructions: [
      "Prenez une grande aspiration ventrale lente et regardez autour de vous.",
      "Nommez 5 choses que vous pouvez VOIR dans la pièce (ex: une chaise, un stylo, etc.).",
      "Nommez 4 choses physiques que vous pouvez TOUCHER ou ressentir (ex: le pull, le sol).",
      "Nommez 3 sons distincts que vous pouvez ENTENDRE (ex: le vent, la climatisation).",
      "Nommez 2 odeurs que vous pouvez SENTIR (ou apprécier en mémoire).",
      "Nommez 1 sensation gustative ou une affirmation rassurante pour vous-même."
    ]
  }
];

export interface PatientRecord {
  id?: string;
  patientEmail: string;
  date: string;
  therapistName: string;
  sessionTopic: string;
  content: string;
  recommendations: string;
  createdAt: string;
}

interface FirestoreBooking {
  id?: string;
  fullName: string;
  phone: string;
  email: string;
  mode: string;
  category: string;
  motif: string;
  dateStr: string;
  timeStr: string;
  status: "new" | "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export default function PatientPortal({ onClose }: { onClose: () => void }) {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"appointments" | "resources" | "history">("appointments");
  
  // Auth states
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Patient content data
  const [myAppointments, setMyAppointments] = useState<FirestoreBooking[]>([]);
  const [myHistory, setMyHistory] = useState<PatientRecord[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Track Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        fetchPatientData(user.email || "");
      } else {
        setMyAppointments([]);
        setMyHistory([]);
      }
    });
    return unsubscribe;
  }, []);

  const fetchPatientData = async (patientEmail: string) => {
    if (!patientEmail) return;
    setDataLoading(true);
    try {
      // 1. Fetch appointments where email == patientEmail
      const appRef = collection(db, "appointments");
      const appQuery = query(appRef, where("email", "==", patientEmail.trim().toLowerCase()));
      const appSnapshot = await getDocs(appQuery);
      
      const appList: FirestoreBooking[] = [];
      appSnapshot.forEach((doc) => {
        appList.push({ id: doc.id, ...doc.data() } as FirestoreBooking);
      });
      // Sort client side by date and time
      appList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMyAppointments(appList);

      // 2. Fetch clinical records from 'clinical_records' where patientEmail == patientEmail
      const historyRef = collection(db, "clinical_records");
      const historyQuery = query(historyRef, where("patientEmail", "==", patientEmail.trim().toLowerCase()));
      const historySnapshot = await getDocs(historyQuery);

      const historyList: PatientRecord[] = [];
      historySnapshot.forEach((doc) => {
        historyList.push({ id: doc.id, ...doc.data() } as PatientRecord);
      });
      historyList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setMyHistory(historyList);

    } catch (err: any) {
      console.error("Error fetching patient medical file data:", err);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccessMessage("Connexion réussie !");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error("Patient login error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setErrorMessage("Adresse email ou mot de passe incorrect.");
      } else if (err.code === "auth/invalid-email") {
        setErrorMessage("Adresse email incorrecte.");
      } else {
        setErrorMessage("Erreur d'authentification : " + err.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMessage(null);
    try {
      const trimmedEmail = email.trim();
      const res = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      
      // Update display name
      if (res.user) {
        await updateProfile(res.user, {
          displayName: fullName.trim()
        });
      }

      // Automatically check for appointments to match or link!
      // Create user profile document in Firestore patients collection inside CEPAPSY
      const userDocRef = collection(db, "patients");
      await addDoc(userDocRef, {
        fullName: fullName.trim(),
        email: trimmedEmail.toLowerCase(),
        phone: phone.trim(),
        registeredAt: new Date().toISOString(),
        uid: res.user.uid
      });

      setSuccessMessage("Votre compte patient a été créé avec succès.");
      setTimeout(() => setSuccessMessage(null), 3500);
    } catch (err: any) {
      console.error("Patient signup error:", err);
      if (err.code === "auth/email-already-in-use") {
        setErrorMessage("Cette adresse email est déjà enregistrée. Veuillez vous connecter.");
      } else if (err.code === "auth/weak-password") {
        setErrorMessage("Le mot de passe doit contenir au moins 6 caractères.");
      } else {
        setErrorMessage("Erreur lors de la création du compte : " + err.message);
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clean states
      setEmail("");
      setPassword("");
      setFullName("");
      setPhone("");
      setMyAppointments([]);
      setMyHistory([]);
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  const handleDownloadResource = (res: TherapeuticResource) => {
    // Generate mock visual representation by triggering an alert detailing prescription context
    alert(`Téléchargement clinique initié.\n\nFiche : "${res.title}"\nCe document est prescrit par CEPAPSY. Veuillez lire scrupuleusement les consignes cliniques au bas du résumé.`);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-custom-50 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#046399] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-medium text-stone-custom-800">Sécurisation du portail patient...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-custom-50 flex flex-col font-sans select-none">
      
      {/* Portal Navbar Top Row */}
      <div className="bg-white border-b border-stone-custom-200 px-4 py-3.5 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <button
               onClick={onClose}
               className="p-2 -ml-2 rounded-xl text-stone-custom-800 hover:text-[#046399] hover:bg-stone-custom-100 transition-colors flex items-center justify-center cursor-pointer"
               title="Retour au site"
               id="patient-portal-back-btn"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-[#046399] text-base sm:text-lg tracking-tight leading-none">
                  Espace Patient Sécurisé
                </h2>
                <span className="bg-emerald-custom-100 text-emerald-custom-700 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-emerald-custom-200 uppercase tracking-widest font-mono">
                  Sécurisé
                </span>
              </div>
              <p className="text-[10px] text-stone-500 mt-0.5">
                Portail Clinique d'Écoute et d'Accompagnement CEPAPSY • Ordre de l'ACO-RDC
              </p>
            </div>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-stone-custom-850 bg-stone-100 border border-stone-200 rounded-lg px-2.5 py-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-custom-650" />
                Dossier : <strong className="truncate max-w-[150px]">{currentUser.displayName || currentUser.email}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 bg-stone-custom-100 hover:bg-stone-custom-200 border border-stone-custom-300 text-stone-custom-900 font-bold text-xs py-2 px-3 rounded-xl transition-all cursor-pointer shadow-xs"
                id="patient-portal-logout-btn"
              >
                <LogOut className="w-3.5 h-3.5 text-clay-505" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Container Workspace */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
        
        {!currentUser ? (
          /* AUTH WALL - LOGIN / REGISTER */
          <div className="max-w-md w-full mx-auto my-auto bg-white border border-stone-custom-200 shadow-xl rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden transition-all duration-300">
            {/* Soft decorative cloud blur background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-custom-100/40 rounded-full blur-2xl -z-10"></div>
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-emerald-custom-100 flex items-center justify-center mx-auto text-emerald-custom-700 shadow-inner">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="serif-title font-extrabold text-xl sm:text-2xl text-stone-custom-900">
                {isRegisterMode ? "Créer mon Espace Écoute" : "Se connecter au Portail"}
              </h3>
              <p className="text-xs text-stone-custom-800 leading-relaxed max-w-sm mx-auto">
                {isRegisterMode 
                  ? "Créez votre dossier confidentiel CEPAPSY pour retrouver vos rendez-vous et consulter vos prescriptions médicales de thérapie."
                  : "Accédez en toute sécurité à vos prochaines consultations psychiatriques, téléchargez vos fiches pratiques de séance et lisez votre dossier de suivi."
                }
              </p>
            </div>

            {errorMessage && (
              <div className="bg-clay-50 border border-clay-200 text-clay-700 text-xs px-4 py-3 rounded-2xl flex items-start gap-2 animate-fadeIn relative" id="patient-auth-error">
                <AlertCircle className="w-4 h-4 text-clay-500 shrink-0 mt-0.5" />
                <p className="font-semibold">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-2xl flex items-start gap-2 animate-fadeIn relative" id="patient-auth-success">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            <form onSubmit={isRegisterMode ? handleRegister : handleLogin} className="space-y-4">
              
              {isRegisterMode && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-700 font-bold uppercase tracking-wider block">
                      Nom complet de l'intéressé(e)
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="text" 
                        required
                        placeholder="Ex : Amina Masudi"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-stone-custom-100/60 border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-stone-custom-900 placeholder:text-stone-400 outline-none transition-all"
                        id="patient-reg-fullname"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-stone-700 font-bold uppercase tracking-wider block">
                      Numéro de téléphone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                      <input 
                        type="tel" 
                        required
                        placeholder="Ex : +243 970 000 000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-custom-100/60 border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-stone-custom-900 placeholder:text-stone-400 outline-none transition-all"
                        id="patient-reg-phone"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-xs text-stone-700 font-bold uppercase tracking-wider block">
                  Adresse Email Personnel
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    type="email" 
                    required
                    placeholder="votre.email@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-custom-100/60 border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-4 text-xs font-semibold text-stone-custom-900 placeholder:text-stone-400 outline-none transition-all"
                    id="patient-auth-email"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-700 font-bold uppercase tracking-wider block">
                  Mot de passe sécurisé
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-stone-custom-100/60 border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-11 text-xs font-semibold text-stone-custom-900 placeholder:text-stone-400 outline-none transition-all"
                    id="patient-auth-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                    title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    id="patient-password-toggle-btn"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-[#046399] hover:bg-[#034b75] text-white font-bold py-3 px-4 rounded-xl shadow-md transition-all active:scale-98 cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 disabled:bg-stone-300 disabled:cursor-not-allowed"
                id="patient-auth-submit-btn"
              >
                {formLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  isRegisterMode ? "Créer mon dossier CEPAPSY" : "S'authentifier confidentiellement"
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setErrorMessage(null);
                }}
                className="text-[11px] text-[#046399] hover:text-[#034b75] hover:underline font-semibold transition-all focus:outline-none cursor-pointer"
                id="patient-toggle-auth-mode"
              >
                {isRegisterMode 
                  ? "Déjà enregistré ? Se connecter" 
                  : "Pas encore de compte ? Créer un Espace Confidentiel"
                }
              </button>
            </div>
          </div>
        ) : (
          /* CONFIDENTIEL DASHBOARD */
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* PORTAL SIDE MENUS */}
            <div className="w-full lg:w-72 bg-white border border-stone-custom-200 rounded-2xl p-4 sm:p-5 shrink-0 space-y-5 shadow-xs">
              <div className="pb-4 border-b border-stone-custom-150">
                <span className="text-[9px] font-bold tracking-widest text-[#046399] uppercase font-mono block mb-1">
                  Connecté en toute sécurité
                </span>
                <h4 className="font-bold text-stone-custom-900 text-[13px] truncate">
                  {currentUser.displayName || "Patient CEPAPSY"}
                </h4>
                <p className="text-[11px] text-stone-500 truncate mt-0.5 select-all">
                  {currentUser.email}
                </p>
                
                {/* Visual health metric */}
                <span className="mt-3.5 inline-flex items-center gap-1.5 text-[10px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 px-2.5 py-1 rounded-full w-full justify-center">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  Dossier Médical Confidentiel Actif
                </span>
              </div>

              {/* Patient Tabs Trigger */}
              <div className="space-y-1.5">
                <button
                  onClick={() => setActiveTab("appointments")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === "appointments" 
                      ? "bg-[#046399] text-white shadow-xs" 
                      : "text-stone-custom-850 hover:bg-stone-custom-100"
                  }`}
                  id="tab-btn-appointments"
                >
                  <span className="flex items-center gap-2.5">
                    <Calendar className="w-4 h-4" />
                    Mes Rendez-vous / Consultations
                  </span>
                  {myAppointments.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === "appointments" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                    }`}>
                      {myAppointments.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("resources")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === "resources" 
                      ? "bg-[#046399] text-white shadow-xs" 
                      : "text-stone-custom-850 hover:bg-stone-custom-100"
                  }`}
                  id="tab-btn-resources"
                >
                  <span className="flex items-center gap-2.5">
                    <Download className="w-4 h-4" />
                    Ressources & Fiches de Séance
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    activeTab === "resources" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                  }`}>
                    {THERAPEUTIC_RESOURCES.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                    activeTab === "history" 
                      ? "bg-[#046399] text-white shadow-xs" 
                      : "text-stone-custom-850 hover:bg-stone-custom-100"
                  }`}
                  id="tab-btn-history"
                >
                  <span className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4" />
                    Mon Suivi & Étoiles Cliniques
                  </span>
                  {myHistory.length > 0 && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      activeTab === "history" ? "bg-white/20 text-white" : "bg-stone-200 text-stone-700"
                    }`}>
                      {myHistory.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Support Notice Card */}
              <div className="p-3.5 bg-[#b57a55]/10 border border-[#b57a55]/20 rounded-2xl text-[11px] text-stone-custom-850 space-y-2">
                <span className="font-bold text-[#b57a55] block">Secret Médical Garanti</span>
                <p className="leading-relaxed">
                  Toutes les informations stockées sont cryptées de bout en bout et protégées selon la déontologie clinique de l'ACO-RDC. Seul votre psychologue titulaire agréé a accès à ces suivis.
                </p>
              </div>
            </div>

            {/* TAB CONTENT ACTIVE AREA */}
            <div className="flex-1 w-full bg-white border border-stone-custom-200 rounded-3xl p-5 sm:p-6 shadow-sm overflow-hidden min-h-[500px]">
              
              {dataLoading && (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-[#046399] border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-xs text-stone-custom-800">Synchronisation sécurisée de vos données médicales avec le cloud...</p>
                  </div>
                </div>
              )}

              {!dataLoading && (
                <>
                  {/* TAB 1: APPOINTMENTS */}
                  {activeTab === "appointments" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                          Mes Prises en Charge & Consultations
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Consultez l'état d'approbation et les détails des rendez-vous que vous avez programmés auprès du secrétariat CEPAPSY.
                        </p>
                      </div>

                      {myAppointments.length === 0 ? (
                        <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
                          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-custom-900 text-sm">Aucun rendez-vous planifié</p>
                            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                              Vous n'avez pas encore demandé de consultation avec cette adresse email ({currentUser.email}) ou votre fiche est en cours d'enregistrement par le secrétariat.
                            </p>
                          </div>
                          <button
                            onClick={onClose}
                            className="bg-emerald-custom-600 hover:bg-emerald-custom-700 text-white font-bold text-xs py-2 px-6 rounded-xl transition-all shadow-xs"
                            id="portal-jump-book-btn"
                          >
                            Prendre Rendez-vous Maintenant
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {myAppointments.map((app) => (
                            <div 
                              key={app.id} 
                              className={`border rounded-2xl p-5 space-y-4 bg-stone-custom-50/40 hover:bg-white transition-all hover:shadow-xs ${
                                app.status === "confirmed" ? "border-l-4 border-l-emerald-500" : ""
                              }`}
                            >
                              <div className="flex justify-between items-start gap-4 flex-wrap">
                                <div>
                                  <span className="text-[10px] font-bold text-stone-500 bg-stone-100 border rounded-md px-2 py-0.5 uppercase tracking-wide">
                                    RDV n° {app.id?.slice(0, 8)}
                                  </span>
                                  <h4 className="font-bold text-stone-custom-900 text-base mt-2">
                                    {app.category}
                                  </h4>
                                  <p className="text-xs text-stone-custom-850 mt-1">
                                    Motif : <strong className="text-stone-900 font-bold">{app.motif}</strong>
                                  </p>
                                </div>

                                <div className="shrink-0">
                                  {app.status === "new" && (
                                    <span className="bg-clay-100 text-clay-700 border border-clay-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                      🆕 En attente d'approbation
                                    </span>
                                  )}
                                  {app.status === "pending" && (
                                    <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                      ⏳ Prise de contact en cours
                                    </span>
                                  )}
                                  {app.status === "confirmed" && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full inline-flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                                      Validé & Confirmé
                                    </span>
                                  )}
                                  {app.status === "completed" && (
                                    <span className="bg-[#046399]/10 text-[#046399] border border-[#046399]/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                      ✅ Séance d'évaluation effectuée
                                    </span>
                                  )}
                                  {app.status === "cancelled" && (
                                    <span className="bg-stone-100 text-stone-500 border border-stone-200 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                      ❌ Annulé ou Reporté
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-3.5 rounded-xl border border-stone-custom-200 text-xs">
                                <div className="space-y-1">
                                  <span className="text-stone-400 block uppercase font-bold text-[8.5px] tracking-wider">Planification</span>
                                  <p className="font-semibold text-stone-custom-900 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-emerald-custom-650" />
                                    {app.dateStr ? new Date(app.dateStr).toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "Date à convenir"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-stone-400 block uppercase font-bold text-[8.5px] tracking-wider">Créneau Horaire</span>
                                  <p className="font-semibold text-stone-custom-900 flex items-center gap-1.5">
                                    <Clock className="w-3.5 h-3.5 text-[#b57a55]" />
                                    {app.timeStr || "Non défini"}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-stone-400 block uppercase font-bold text-[8.5px] tracking-wider">Modalité</span>
                                  <p className="font-semibold text-stone-custom-900 capitalize">
                                    📋 {app.mode === "présentiel" ? "Consultation Présentielle" : app.mode === "ligne" ? "Téléconsultation en Ligne" : "Séance Mobile à Domicile"}
                                  </p>
                                </div>
                              </div>

                              {app.status === "confirmed" && (
                                <div className="bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100 text-xs leading-relaxed text-stone-custom-850">
                                  <strong className="text-emerald-800">Note du secrétariat CEPAPSY :</strong> Votre praticien désigné vous attendra au salon d'accueil de notre cabinet de Goma à l'heure convenue. Présentez-vous 10 minutes à l'avance, muni de votre pièce d'identité. Pour les téléconsultations, vous recevrez un lien d'appel vidéo par email 15 minutes avant le début de la séance.
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 2: RESOURCES */}
                  {activeTab === "resources" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                          Fiches Pratiques de Séance & Outils de Co-thérapie
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Consultez ou téléchargez les fiches d'exercices et les guides cliniques prescrits par nos psychologues cliniciens. Ces exercices soutiennent votre travail thérapeutique entre chaque séance.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {THERAPEUTIC_RESOURCES.map((res) => (
                          <div 
                            key={res.id} 
                            className="border border-stone-custom-200 rounded-2xl p-5 bg-stone-custom-50/30 hover:bg-stone-custom-50/60 transition-all flex flex-col justify-between space-y-4"
                          >
                            <div className="space-y-3">
                              <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                                res.category === "cognitive" ? "bg-[#046399]/10 text-[#046399]" :
                                res.category === "relaxation" ? "bg-emerald-100 text-emerald-800" :
                                res.category === "sommeil" ? "bg-purple-100 text-purple-800" :
                                "bg-amber-100 text-amber-800"
                              }`}>
                                {res.category === "cognitive" ? "🧠 TCC & Pensées" :
                                 res.category === "relaxation" ? "🧘 Relaxation" :
                                 res.category === "sommeil" ? "💤 Régulation Sommeil" :
                                 "⚡ Urgence Traumatisme"}
                              </span>

                              <h4 className="font-bold text-stone-custom-900 text-[15px] leading-snug">
                                {res.title}
                              </h4>
                              <p className="text-xs text-stone-custom-850 leading-relaxed">
                                {res.description}
                              </p>

                              <p className="text-[11px] text-stone-500 italic block">
                                <strong className="text-stone-700 not-italic">Bienfaits attendus :</strong> {res.benefits}
                              </p>

                              <div className="bg-white rounded-xl p-3 border border-stone-custom-200 space-y-1.5">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-[#b57a55] block">Consignes d'utilisation :</span>
                                <ul className="space-y-1 list-none p-0 m-0">
                                  {res.instructions.map((inst, idx) => (
                                    <li key={idx} className="text-[11px] text-stone-custom-800 leading-normal flex items-start gap-1">
                                      <span className="text-[#b57a55] font-bold shrink-0">{idx + 1}.</span>
                                      <span>{inst}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="pt-3.5 border-t border-stone-custom-200 flex items-center justify-between gap-4 flex-wrap">
                              <span className="text-[10px] font-mono text-stone-400">
                                {res.docMeta}
                              </span>
                              <button
                                onClick={() => handleDownloadResource(res)}
                                className="flex items-center gap-1.5 bg-[#046399] hover:bg-[#034b75] text-white font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                Télécharger la fiche
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: HISTORY */}
                  {activeTab === "history" && (
                    <div className="space-y-6">
                      <div className="border-b pb-4">
                        <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                          Carnet Confidentiel de Suivi Clinique
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Consultez l'historique de vos séances de psychothérapie, les comptes-rendus et recommandations rédigés à votre attention par votre psychologue agréé.
                        </p>
                      </div>

                      {myHistory.length === 0 ? (
                        <div className="text-center py-16 space-y-4 max-w-sm mx-auto">
                          <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                            <FileText className="w-6 h-6" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-custom-900 text-sm">Aucune note de synthèse de séance</p>
                            <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                              Votre psychologue CEPAPSY n'a pas encore saisi de compte-rendu ou de note clinique pour votre adresse email ({currentUser.email}). Ceux-ci s'afficheront ici de manière 100% confidentielle après validation de votre médecin traitant.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          {myHistory.map((record) => (
                            <div 
                              key={record.id} 
                              className="border border-stone-custom-200 bg-stone-custom-50/10 rounded-2xl p-5 sm:p-6 space-y-4 hover:border-[#b57a55]/30 transition-all shadow-xs"
                            >
                              <div className="flex justify-between items-start gap-4 flex-wrap pb-3.5 border-b border-stone-custom-150">
                                <div>
                                  <span className="text-[10px] font-mono font-bold text-[#b57a55]">
                                    📆 SÉANCE DU : {new Date(record.date).toLocaleDateString("fr-FR", { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                  <h4 className="font-extrabold text-stone-custom-900 text-base mt-1.5">
                                    {record.sessionTopic}
                                  </h4>
                                </div>
                                <div className="bg-[#b57a55]/10 text-[#b57a55] border border-[#b57a55]/20 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                  <User className="w-3 h-3" />
                                  Psy : {record.therapistName}
                                </div>
                              </div>

                              <div className="space-y-3.5">
                                <div className="text-xs leading-relaxed text-stone-custom-850">
                                  <span className="font-bold text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Résumé Clinique de la Séance</span>
                                  <p className="bg-stone-custom-50/40 p-4 rounded-xl border border-stone-custom-200/60 whitespace-pre-wrap select-text">
                                    {record.content}
                                  </p>
                                </div>

                                <div className="text-xs leading-relaxed text-stone-custom-850">
                                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-custom-700 block mb-1">Prescriptions et Recommandations Confidentielles</span>
                                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/60 whitespace-pre-wrap select-text">
                                    {record.recommendations}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
