import React, { useState, useEffect } from "react";
import { useAdmin } from "../lib/AdminContext";
import { useData, FaqItem } from "../lib/DataContext";
import { ServiceItem, Testimonial } from "../types";
import { 
  Lock, 
  Mail, 
  LogOut, 
  Briefcase, 
  Grid, 
  HelpCircle, 
  Star, 
  Info, 
  Sliders, 
  FileText, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Check, 
  Database, 
  RefreshCw, 
  ShieldCheck, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff
} from "lucide-react";

export default function AdminPanel({ onClose }: { onClose: () => void }) {
  const { user, isAdmin, loading: authLoading, error: authError, login, logout, registerFirstAdmin, checkIfNoAdminsExist } = useAdmin();
  const { 
    cepapsyInfo, 
    services, 
    faqs, 
    testimonials, 
    appointments, 
    volunteers, 
    loading: dbLoading,
    isSeeded,
    saveGeneralInfo, 
    saveService, 
    deleteService, 
    saveFaq, 
    deleteFaq, 
    saveTestimonial, 
    deleteTestimonial,
    updateBookingStatus,
    updateVolunteerStatus,
    deleteBooking,
    deleteVolunteer,
    seedDatabase,
    refreshAllData
  } = useData();

  // Navigation tabs in backend
  const [activeTab, setActiveTab] = useState<"general" | "services" | "faq" | "testimonials" | "appointments" | "volunteers">("general");
  
  // Login credentials states
  const [email, setEmail] = useState("cepapsycontact@gmail.com");
  const [password, setPassword] = useState("Admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit states for individual components
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  // Form creation states
  const [newService, setNewService] = useState<Partial<ServiceItem>>({
    id: "",
    title: "",
    description: "",
    details: [],
    category: "all" as any,
    iconName: "HelpCircle"
  });
  const [newFaq, setNewFaq] = useState<Partial<FaqItem>>({
    id: "",
    question: "",
    answer: "",
    order: 0
  });
  const [newTestimonial, setNewTestimonial] = useState<Partial<Testimonial>>({
    id: "",
    quote: "",
    author: "",
    context: "",
    rating: 5
  });

  // General info state
  const [infoForm, setInfoForm] = useState<typeof cepapsyInfo>({ ...cepapsyInfo });

  // Detail item input for services details
  const [detailInput, setDetailInput] = useState("");

  useEffect(() => {
    // Check if the system has no admin records yet
    checkIfNoAdminsExist().then(empty => {
      setIsFirstLaunch(empty);
    });
  }, [user]);

  useEffect(() => {
    if (cepapsyInfo) {
      setInfoForm({ ...cepapsyInfo });
    }
  }, [cepapsyInfo]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMessage(null);
    try {
      if (isFirstLaunch) {
        await registerFirstAdmin(email, password);
        setStatusMessage({ type: "success", text: "Premier administrateur créé avec succès ! Bienvenue." });
      } else {
        await login(email, password);
        setStatusMessage({ type: "success", text: "Connexion réussie." });
      }
    } catch (err: any) {
      setStatusMessage({ type: "error", text: err.message || "Erreur de connexion." });
    } finally {
      setFormLoading(false);
    }
  };

  const handleSaveGeneralInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setStatusMessage(null);
    try {
      await saveGeneralInfo(infoForm);
      setStatusMessage({ type: "success", text: "Coordonnées générales du site sauvegardées avec succès !" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur lors de la sauvegarde : " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  // SERVICE ACTIONS
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSave = editingService || {
        ...newService,
        id: newService.id || "service-" + Date.now()
      } as ServiceItem;

      await saveService(dataToSave);
      
      // Reset
      setNewService({ id: "", title: "", description: "", details: [], category: "all" as any, iconName: "HelpCircle" });
      setEditingService(null);
      setDetailInput("");
      setStatusMessage({ type: "success", text: "Dispositif sauvegardé avec succès !" });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddDetailToService = () => {
    if (!detailInput.trim()) return;
    if (editingService) {
      setEditingService({
        ...editingService,
        details: [...(editingService.details || []), detailInput.trim()]
      });
    } else {
      setNewService({
        ...newService,
        details: [...(newService.details || []), detailInput.trim()]
      });
    }
    setDetailInput("");
  };

  const handleRemoveDetailFromService = (index: number) => {
    if (editingService) {
      setEditingService({
        ...editingService,
        details: (editingService.details || []).filter((_, i) => i !== index)
      });
    } else {
      setNewService({
        ...newService,
        details: (newService.details || []).filter((_, i) => i !== index)
      });
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service clinique ?")) return;
    try {
      await deleteService(id);
      setStatusMessage({ type: "success", text: "Service supprimé." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  // FAQ ACTIONS
  const handleFaqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSave = editingFaq || {
        ...newFaq,
        id: newFaq.id || "faq-" + Date.now()
      } as FaqItem;

      await saveFaq(dataToSave);
      setNewFaq({ id: "", question: "", answer: "", order: faqs.length + 1 });
      setEditingFaq(null);
      setStatusMessage({ type: "success", text: "FAQ mise à jour." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteFaq = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette question de la FAQ ?")) return;
    try {
      await deleteFaq(id);
      setStatusMessage({ type: "success", text: "FAQ supprimée." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  // TESTIMONIAL ACTIONS
  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dataToSave = editingTestimonial || {
        ...newTestimonial,
        id: newTestimonial.id || "testi-" + Date.now()
      } as Testimonial;

      await saveTestimonial(dataToSave);
      setNewTestimonial({ id: "", quote: "", author: "", context: "", rating: 5 });
      setEditingTestimonial(null);
      setStatusMessage({ type: "success", text: "Témoignage patient enregistré." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    try {
      await deleteTestimonial(id);
      setStatusMessage({ type: "success", text: "Témoignage patient supprimé." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  // APPOINTMENTS ACTIONS
  const handleUpdateAppointmentStatus = async (id: string, status: any) => {
    try {
      await updateBookingStatus(id, status);
      setStatusMessage({ type: "success", text: "Statut de RDV mis à jour." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Voulez-vous supprimer cette fiche de RDV de la base ?")) return;
    try {
      await deleteBooking(id);
      setStatusMessage({ type: "success", text: "RDV supprimé définitivement." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  // VOLUNTEER CANDIDATURE ACTIONS
  const handleUpdateVolunteerStatus = async (id: string, status: any) => {
    try {
      await updateVolunteerStatus(id, status);
      setStatusMessage({ type: "success", text: "Statut de candidature mis à jour." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  const handleDeleteVolunteerApplication = async (id: string) => {
    if (!confirm("Supprimer ce dossier de candidature ?")) return;
    try {
      await deleteVolunteer(id);
      setStatusMessage({ type: "success", text: "Dossier bénévolat supprimé." });
    } catch (err: any) {
      setStatusMessage({ type: "error", text: "Erreur: " + err.message });
    }
  };

  // Seed Helper
  const handleSeedDatabase = async () => {
    if (!confirm("Voulez-vous importer toute la configuration d'origine (services, faq, coordonnées) dans Firestore ?")) return;
    setFormLoading(true);
    try {
      await seedDatabase();
      setStatusMessage({ type: "success", text: "Base de données Firestore correctement initialisée avec les maquettes !" });
    } catch (e) {
      setStatusMessage({ type: "error", text: "Erreur d'importation." });
    } finally {
      setFormLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-custom-50 flex flex-col items-center justify-center p-8">
        <RefreshCw className="w-12 h-12 text-[#046399] animate-spin" />
        <p className="text-xs font-mono text-[#012b45] font-bold mt-4">Authentification sécurisée en cours...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-custom-900/60 backdrop-blur-md p-4 sm:p-6 md:p-10 flex flex-col justify-center items-center">
        {/* Background close click */}
        <div className="absolute inset-0 -z-10" onClick={onClose}></div>

        <div className="bg-stone-custom-50 border border-stone-custom-200 rounded-3xl p-5 sm:p-10 max-w-md w-full space-y-6 shadow-2xl relative animate-fadeIn text-stone-custom-900">
          
          {/* Elegant top-right close trigger */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-xl text-[#321609] hover:bg-stone-custom-150 transition-all cursor-pointer border border-stone-custom-200/40"
            aria-label="Fermer"
            id="admin-login-close-btn"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-clay-100 border border-[#b57a55]/20 flex items-center justify-center text-[#b57a55]">
              <Lock className="w-5 h-5" />
            </div>
            
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1 bg-clay-100 text-[#b57a55] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#b57a55]/10">
                Secrétariat de direction
              </span>
              <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl tracking-tight">
                {isFirstLaunch ? "Première Initialisation" : "Portail de Connexion"}
              </h3>
            </div>

            <p className="text-xs text-stone-custom-800 leading-relaxed font-sans max-w-xs mx-auto">
              {isFirstLaunch 
                ? "Aucun administrateur enregistré sur cette instance. Veuillez définir les accès d'origine CEPAPSY."
                : "Identifiez-vous pour gérer les prises de soins, éditer le site et modérer les candidatures de bénévolat."
              }
            </p>
          </div>

          {/* Banner alerts with clear and highly legible styles */}
          {statusMessage && (
            <div className={`p-4 rounded-xl flex items-start gap-2.5 text-xs font-medium ${
              statusMessage.type === "success" 
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200" 
                : "bg-clay-100 text-[#422110] border border-[#ebdcd0]"
            }`}>
              {statusMessage.type === "success" ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-clay-600 mt-0.5" />
              )}
              <span className="leading-tight shrink">{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5 block">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-850 block">
                Adresse Email Professionnelle
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@cepapsy.org"
                  className="w-full bg-white border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-4 text-xs text-stone-custom-900 placeholder:text-stone-400 font-medium transition-all outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5 block">
              <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-850 block">
                Mot de passe sécurisé
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input 
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-stone-custom-200 focus:border-[#046399] focus:ring-1 focus:ring-[#046399] rounded-xl py-3 pl-11 pr-11 text-xs text-stone-custom-900 placeholder:text-stone-400 font-medium transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-custom-100 transition-colors focus:outline-none cursor-pointer flex items-center justify-center"
                  title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  id="admin-password-toggle-btn"
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
              className="w-full bg-[#046399] hover:bg-[#034b75] disabled:bg-stone-300 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all text-xs uppercase tracking-wider cursor-pointer text-center block mt-6 whitespace-normal break-words leading-tight"
            >
              {formLoading 
                ? "Traitement en cours..." 
                : isFirstLaunch ? "Enregistrer & Initialiser l'instance" : "S'authentifier sur le Cloud"
              }
            </button>
          </form>

          <div className="text-center pt-4 border-t border-stone-custom-150">
            <span className="text-[10px] text-[#422110] font-mono font-medium block">
              Agrément Syndical ACO-RDC • Sécurité SSL 256 bits
            </span>
            <span className="text-[9px] text-stone-500 font-mono mt-1 block">
              Instancié Clinique CEPAPSY RDC
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-custom-900/40 backdrop-blur-md p-4 sm:p-6 md:p-10 flex flex-col justify-start">
      
      {/* Background close click */}
      <div className="absolute inset-0 -z-10" onClick={onClose}></div>

      <div className="bg-stone-custom-50 rounded-3xl border border-stone-custom-200 shadow-2xl max-w-7xl w-full mx-auto flex flex-col min-h-[85vh] my-auto overflow-hidden animate-fadeIn">
        
        {/* Header Ribbon */}
        <div className="bg-stone-custom-900 text-stone-custom-50 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#046399] gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#046399]/20 text-[#2991cf] border border-[#046399]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-lg sm:text-xl tracking-tight leading-none text-white">
                  Portail Administration Clinique
                </h2>
                {user && isAdmin && (
                  <span className="bg-[#046399]/30 text-[#2991cf] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#046399]/30 uppercase tracking-widest">
                    ACTIF (CLOUD)
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-400 mt-1 font-sans">
                Interface d'administration déontologiquement réservée au secrétariat agréé CEPAPSY & ACO-RDC.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {user && (
              <button 
                onClick={logout}
                className="flex items-center gap-2 bg-stone-custom-800 hover:bg-stone-custom-700 text-stone-300 font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-700 transition-all cursor-pointer shadow-inner"
              >
                <LogOut className="w-4 h-4 text-clay-400" />
                Déconnexion
              </button>
            )}
            <button 
              onClick={onClose}
              className="p-2.5 rounded-xl bg-stone-custom-800 hover:bg-stone-custom-700 text-stone-300 transition-colors cursor-pointer border border-stone-700"
              aria-label="Fermer"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 bg-stone-custom-100 border-r border-stone-custom-200 p-4 shrink-0 flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-[#b57a55] uppercase font-mono block mb-1">
                    Système Centralisé
                  </span>
                  <p className="text-xs text-stone-custom-800 leading-normal">
                    Bienvenue, <strong className="text-stone-custom-900 block truncate">{user.email}</strong>
                  </p>
                </div>

                <div className="space-y-1.5">
                  <button 
                    onClick={() => { setActiveTab("general"); setStatusMessage(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "general" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    Infos & Coordonnées
                  </button>
                  <button 
                    onClick={() => { setActiveTab("services"); setStatusMessage(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "services" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <Briefcase className="w-4 h-4" />
                    Soins & Dispositifs ({services.length})
                  </button>
                  <button 
                    onClick={() => { setActiveTab("faq"); setStatusMessage(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "faq" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Foire Aux Questions ({faqs.length})
                  </button>
                  <button 
                    onClick={() => { setActiveTab("testimonials"); setStatusMessage(null); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "testimonials" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <Star className="w-4 h-4" />
                    Témoignages ({testimonials.length})
                  </button>
                  
                  <div className="h-[1px] bg-stone-custom-200 my-3"></div>

                  <button 
                    onClick={() => { setActiveTab("appointments"); setStatusMessage(null); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "appointments" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Calendar className="w-4 h-4" />
                      Consultations / RDV
                    </span>
                    {appointments.filter(a => a.status === "new").length > 0 && (
                      <span className="bg-clay-500 text-stone-custom-50 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {appointments.filter(a => a.status === "new").length}
                      </span>
                    )}
                  </button>

                  <button 
                    onClick={() => { setActiveTab("volunteers"); setStatusMessage(null); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                      activeTab === "volunteers" ? "bg-emerald-custom-650 text-white" : "text-stone-custom-850 hover:bg-stone-custom-200"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="w-4 h-4" />
                      Bénévoles / Recrutement
                    </span>
                    {volunteers.filter(v => v.status === "new").length > 0 && (
                      <span className="bg-clay-500 text-stone-custom-50 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                        {volunteers.filter(v => v.status === "new").length}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Sync tools */}
              <div className="mt-8 space-y-3 bg-stone-custom-50 border border-stone-custom-200 rounded-2xl p-3.5">
                <span className="text-[9px] uppercase tracking-wider text-stone-500 font-mono block">
                  Synchronisation globale
                </span>
                
                <button
                  onClick={refreshAllData}
                  className="w-full flex items-center justify-center gap-2 bg-stone-custom-200 hover:bg-stone-custom-300 text-stone-custom-900 border border-stone-custom-200 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Actualiser les données
                </button>

                {!isSeeded && (
                  <button
                    onClick={handleSeedDatabase}
                    className="w-full flex items-center justify-center gap-2 bg-clay-100 hover:bg-clay-200 text-[#b57a55] border border-clay-200 text-[10px] font-bold py-1.5 rounded-lg transition-all cursor-pointer"
                  >
                    <Database className="w-3 h-3" />
                    Injecter maquettes ACO
                  </button>
                )}
              </div>
            </aside>

            {/* Central Panel Area */}
            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-170px)] md:max-h-[75vh]">
              
              {/* Status Message */}
              {statusMessage && (
                <div className={`p-4 rounded-xl mb-6 flex items-start gap-2 text-xs relative ${
                  statusMessage.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-clay-50 text-clay-800 border border-clay-200"
                }`}>
                  {statusMessage.type === "success" ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
                  <span className="pr-6">{statusMessage.text}</span>
                  <button onClick={() => setStatusMessage(null)} className="absolute right-3 top-3 text-stone-400 hover:text-stone-700">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* 1. GENERAL INFORMATION FORM */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                      Informations de Contact & Identifiants du Site
                    </h3>
                    <p className="text-xs text-stone-custom-800 mt-1">
                      Définissez ici l'adresse clinique, les emails d'attribution et les numéros du standard d'urgence affichés sur l'intégralité du site.
                    </p>
                  </div>

                  <form onSubmit={handleSaveGeneralInfo} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Hotline Appels & Prise de RDV principal
                      </label>
                      <input 
                        type="text"
                        value={infoForm.phoneAppointments}
                        onChange={(e) => setInfoForm({ ...infoForm, phoneAppointments: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Numéro alternatif 1
                      </label>
                      <input 
                        type="text"
                        value={infoForm.phoneAlt1}
                        onChange={(e) => setInfoForm({ ...infoForm, phoneAlt1: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Numéro alternatif 2
                      </label>
                      <input 
                        type="text"
                        value={infoForm.phoneAlt2}
                        onChange={(e) => setInfoForm({ ...infoForm, phoneAlt2: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Numéro alternatif 3
                      </label>
                      <input 
                        type="text"
                        value={infoForm.phoneAlt3}
                        onChange={(e) => setInfoForm({ ...infoForm, phoneAlt3: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Email Principal (Collège Clinique)
                      </label>
                      <input 
                        type="email"
                        value={infoForm.email}
                        onChange={(e) => setInfoForm({ ...infoForm, email: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Email Secondaire (Représentation ACO-RDC)
                      </label>
                      <input 
                        type="email"
                        value={infoForm.emailSecondary}
                        onChange={(e) => setInfoForm({ ...infoForm, emailSecondary: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Coordonnées Bureau Central (Goma)
                      </label>
                      <input 
                        type="text"
                        value={infoForm.locationMain}
                        onChange={(e) => setInfoForm({ ...infoForm, locationMain: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Coordonnées Bureau Secondaire (Kasika)
                      </label>
                      <input 
                        type="text"
                        value={infoForm.locationSecondary}
                        onChange={(e) => setInfoForm({ ...infoForm, locationSecondary: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Textes Horaires d'Ouverture du secrétariat
                      </label>
                      <input 
                        type="text"
                        value={infoForm.workingHours}
                        onChange={(e) => setInfoForm({ ...infoForm, workingHours: e.target.value })}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none"
                      />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                        Texte de Mission Institutionnelle
                      </label>
                      <textarea 
                        value={infoForm.mission}
                        onChange={(e) => setInfoForm({ ...infoForm, mission: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-stone-custom-200 focus:border-emerald-custom-600 focus:ring-1 focus:ring-emerald-custom-600 rounded-xl p-3 text-xs text-stone-custom-900 outline-none leading-relaxed"
                      />
                    </div>

                    <div className="md:col-span-2 pt-4 flex gap-4">
                      <button
                        type="submit"
                        disabled={formLoading}
                        className="bg-emerald-custom-650 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold px-6 py-3.5 rounded-xl shadow-xs text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Enregistrer les modifications
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* 2. SERVICES LIST MANAGEMENT */}
              {activeTab === "services" && (
                <div className="space-y-8">
                  <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                        Édition des dispositifs therapeutiques
                      </h3>
                      <p className="text-xs text-stone-custom-800 mt-1">
                        Ajoutez ou modifiez les soins cliniques, les problématiques et les boutons d'attributions affichés dans la galerie de soins.
                      </p>
                    </div>
                    {!editingService && (
                      <button
                        onClick={() => {
                          setEditingService(null);
                          setNewService({ id: "service-" + Date.now(), title: "", description: "", details: [], category: "all", iconName: "Layers" });
                        }}
                        className="flex items-center gap-1.5 bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white font-bold text-xs py-2 px-3 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nouveau Service
                      </button>
                    )}
                  </div>

                  {/* Creation/Edit Form */}
                  {(editingService || newService.title !== undefined) && (
                    <div className="bg-white rounded-2xl border border-stone-custom-200 p-5 space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-custom-700 flex items-center gap-1">
                          <Edit2 className="w-3.5 h-3.5" />
                          {editingService ? "Modifier :" : "Créer :"} {editingService?.title || "Nouveau service clinique"}
                        </span>
                        <button 
                          onClick={() => { setEditingService(null); setNewService({}); }} 
                          className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleServiceSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">ID Unique (Utilisez des lettres ou un code clin)</label>
                            <input 
                              type="text"
                              disabled={editingService !== null}
                              value={editingService ? editingService.id : newService.id}
                              onChange={(e) => setNewService({ ...newService, id: e.target.value })}
                              className="w-full bg-stone-custom-50 disabled:bg-stone-100 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Nom du Dispositif (Titre principal)</label>
                            <input 
                              type="text"
                              required
                              value={editingService ? editingService.title : newService.title}
                              onChange={(e) => editingService 
                                ? setEditingService({ ...editingService, title: e.target.value })
                                : setNewService({ ...newService, title: e.target.value })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Catégorie</label>
                            <select 
                              value={editingService ? editingService.category : newService.category}
                              onChange={(e) => editingService 
                                ? setEditingService({ ...editingService, category: e.target.value as any })
                                : setNewService({ ...newService, category: e.target.value as any })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-950 outline-none"
                            >
                              <option value="all">Soin Général / Tous publics</option>
                              <option value="adult">Thérapie Adulte & Couples</option>
                              <option value="child">Enfants & Adolescents</option>
                              <option value="corporate">Entreprises & ONG</option>
                              <option value="specialty">Détresse de Crise & Traumatisme</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Icône (Nom Lucide, ex: Heart, Shield, Activity)</label>
                            <input 
                              type="text"
                              value={editingService ? editingService.iconName : newService.iconName}
                              onChange={(e) => editingService 
                                ? setEditingService({ ...editingService, iconName: e.target.value })
                                : setNewService({ ...newService, iconName: e.target.value })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Description courte d'impact</label>
                          <textarea 
                            required
                            rows={2}
                            value={editingService ? editingService.description : newService.description}
                            onChange={(e) => editingService 
                              ? setEditingService({ ...editingService, description: e.target.value })
                              : setNewService({ ...newService, description: e.target.value })
                            }
                            className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none leading-relaxed"
                          />
                        </div>

                        {/* Details List (Problématiques) */}
                        <div className="space-y-2 bg-stone-custom-100/50 p-4 rounded-xl border border-stone-custom-200/80">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-850 block">Problématiques cliniques associées :</label>
                          
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={detailInput}
                              onChange={(e) => setDetailInput(e.target.value)}
                              placeholder="ex: Troubles obsessionnels compulsifs (TOC)"
                              className="flex-1 bg-white border border-stone-custom-200 rounded-lg p-2 text-xs text-stone-custom-900 outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddDetailToService}
                              className="bg-stone-custom-800 hover:bg-stone-custom-700 text-white font-bold text-xs px-3 py-2 rounded-lg cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-4 h-4" />
                              Ajouter
                            </button>
                          </div>

                          <ul className="space-y-1.5 mt-2.5">
                            {((editingService ? editingService.details : newService.details) || []).map((detail, index) => (
                              <li key={index} className="flex items-center justify-between gap-3 text-xs bg-white py-1.5 px-3 rounded-lg border">
                                <span className="truncate">{detail}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveDetailFromService(index)}
                                  className="text-clay-500 hover:text-clay-700 p-0.5 rounded-md hover:bg-stone-50"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </li>
                            ))}
                            {((editingService ? editingService.details : newService.details) || []).length === 0 && (
                              <p className="text-[10px] text-stone-500 italic">Aucune problématique ajoutée pour le moment.</p>
                            )}
                          </ul>
                        </div>

                        <div className="flex gap-3">
                          <button
                            type="submit"
                            disabled={formLoading}
                            className="bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer flex items-center gap-1.5"
                          >
                            <Save className="w-4 h-4" />
                            Sauvegarder
                          </button>
                          <button
                            type="button"
                            onClick={() => { setEditingService(null); setNewService({}); }}
                            className="bg-stone-custom-200 hover:bg-stone-custom-300 text-stone-custom-950 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of current services */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((s) => (
                      <div key={s.id} className="bg-white border rounded-2xl p-4.5 space-y-3.5 flex flex-col justify-between shadow-xs">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 bg-stone-custom-150 text-stone-custom-800 rounded-md">
                                {s.category || "all"}
                              </span>
                              <h4 className="font-bold text-stone-custom-900 text-sm mt-1">{s.title}</h4>
                            </div>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => { setEditingService(s); setStatusMessage(null); }}
                                className="p-1.5 rounded-lg border hover:bg-stone-50 text-stone-600 hover:text-emerald-custom-700 hover:border-emerald-custom-300 cursor-pointer"
                                title="Modifier"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteService(s.id)}
                                className="p-1.5 rounded-lg border hover:bg-stone-50 text-clay-500 hover:text-clay-700 cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-custom-800 line-clamp-2 leading-relaxed">
                            {s.description}
                          </p>
                        </div>

                        {s.details && s.details.length > 0 && (
                          <div className="pt-2.5 border-t border-dashed">
                            <span className="text-[9px] uppercase font-bold tracking-wider text-stone-500 block mb-1">
                              Prises en soins ({s.details.length}) :
                            </span>
                            <div className="flex flex-wrap gap-1 leading-normal max-h-16 overflow-y-auto">
                              {s.details.map((d, i) => (
                                <span key={i} className="text-[9px] bg-stone-50 border border-stone-200 px-2 py-0.5 rounded-md truncate max-w-full">
                                  {d}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. FAQ ACCORDION MANAGEMENT */}
              {activeTab === "faq" && (
                <div className="space-y-8">
                  <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                        Établissement de la Foire aux Questions
                      </h3>
                      <p className="text-xs text-stone-custom-800 mt-1">
                        Composez ou éditez les questions fréquemment posées par vos futurs patients au sujet de vos méthodes dév ou cliniques.
                      </p>
                    </div>
                    {!editingFaq && (
                      <button
                        onClick={() => {
                          setEditingFaq(null);
                          setNewFaq({ id: "faq-" + Date.now(), question: "", answer: "", order: faqs.length + 1 });
                        }}
                        className="flex items-center gap-1.5 bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white font-bold text-xs py-2 px-3 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nouvelle FAQ
                      </button>
                    )}
                  </div>

                  {/* Creation/Edit Form */}
                  {(editingFaq || newFaq.question !== undefined) && (
                    <div className="bg-white rounded-2xl border border-stone-custom-200 p-5 space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-custom-700 flex items-center gap-1">
                          <Edit2 className="w-3.5 h-3.5" />
                          {editingFaq ? "Modifier FAQ :" : "Créer nouvelle FAQ :"}
                        </span>
                        <button onClick={() => { setEditingFaq(null); setNewFaq({}); }} className="p-1 rounded-md text-stone-400 hover:text-stone-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleFaqSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                          <div className="sm:col-span-3 space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Question Posée</label>
                            <input 
                              type="text"
                              required
                              value={editingFaq ? editingFaq.question : newFaq.question}
                              onChange={(e) => editingFaq 
                                ? setEditingFaq({ ...editingFaq, question: e.target.value })
                                : setNewFaq({ ...newFaq, question: e.target.value })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Ordre d'affichage</label>
                            <input 
                              type="number"
                              required
                              value={editingFaq ? editingFaq.order : newFaq.order}
                              onChange={(e) => editingFaq 
                                ? setEditingFaq({ ...editingFaq, order: parseInt(e.target.value) || 0 })
                                : setNewFaq({ ...newFaq, order: parseInt(e.target.value) || 0 })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Réponse apportée par le Collège Clinique</label>
                          <textarea 
                            required
                            rows={3}
                            value={editingFaq ? editingFaq.answer : newFaq.answer}
                            onChange={(e) => editingFaq 
                              ? setEditingFaq({ ...editingFaq, answer: e.target.value })
                              : setNewFaq({ ...newFaq, answer: e.target.value })
                            }
                            className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none leading-relaxed"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button type="submit" className="bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer">
                            Enregistrer FAQ
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of current FAQs */}
                  <div className="space-y-3.5">
                    {faqs.map((faq) => (
                      <div key={faq.id} className="bg-white border rounded-2xl p-4.5 flex gap-4 items-start shadow-xs">
                        <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center font-mono font-bold text-xs shrink-0 text-stone-500">
                          {faq.order || 0}
                        </div>
                        <div className="flex-1 space-y-1.5 min-w-0">
                          <div className="flex justify-between items-start gap-4">
                            <h4 className="font-bold text-stone-custom-900 text-sm leading-snug">{faq.question}</h4>
                            <div className="flex gap-1.5 shrink-0">
                              <button
                                onClick={() => { setEditingFaq(faq); setStatusMessage(null); }}
                                className="p-1.5 rounded-lg border hover:bg-stone-50 text-stone-600 hover:text-emerald-custom-700 cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteFaq(faq.id)}
                                className="p-1.5 rounded-lg border hover:bg-stone-50 text-clay-500 hover:text-clay-700 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <p className="text-xs text-stone-custom-800 leading-relaxed font-sans mt-1.5 bg-stone-50 p-3 rounded-lg border border-dashed text-justify">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4. TESTIMONIALS MODERATION */}
              {activeTab === "testimonials" && (
                <div className="space-y-8">
                  <div className="border-b pb-4 flex justify-between items-center flex-wrap gap-4">
                    <div>
                      <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                        Avis d'expérience & Récits Patient
                      </h3>
                      <p className="text-xs text-stone-custom-800 mt-1">
                        Publiez ou modifiez des retours cliniques anonymisés de patients afin de renforcer l'impact professionnel d'attribution.
                      </p>
                    </div>
                    {!editingTestimonial && (
                      <button
                        onClick={() => {
                          setEditingTestimonial(null);
                          setNewTestimonial({ id: "testi-" + Date.now(), quote: "", author: "", context: "", rating: 5 });
                        }}
                        className="flex items-center gap-1.5 bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white font-bold text-xs py-2 px-3 rounded-lg cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nouveau Témoignage
                      </button>
                    )}
                  </div>

                  {/* Creation/Edit Form */}
                  {(editingTestimonial || newTestimonial.author !== undefined) && (
                    <div className="bg-white rounded-2xl border border-stone-custom-200 p-5 space-y-4">
                      <div className="flex justify-between items-center border-b pb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-custom-700 flex items-center gap-1">
                          <Edit2 className="w-3.5 h-3.5" />
                          {editingTestimonial ? "Modifier Témoignage :" : "Créer nouveau témoignage :"}
                        </span>
                        <button onClick={() => { setEditingTestimonial(null); setNewTestimonial({}); }} className="p-1 rounded-md text-stone-400 hover:text-stone-700">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Pseudonyme / Intérêt (Anonymisé)</label>
                            <input 
                              type="text"
                              required
                              placeholder="ex: Patient en séances de couple"
                              value={editingTestimonial ? editingTestimonial.author : newTestimonial.author}
                              onChange={(e) => editingTestimonial 
                                ? setEditingTestimonial({ ...editingTestimonial, author: e.target.value })
                                : setNewTestimonial({ ...newTestimonial, author: e.target.value })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Contexte clinique court</label>
                            <input 
                              type="text"
                              required
                              placeholder="ex: Soutien anxiété en ligne"
                              value={editingTestimonial ? editingTestimonial.context : newTestimonial.context}
                              onChange={(e) => editingTestimonial 
                                ? setEditingTestimonial({ ...editingTestimonial, context: e.target.value })
                                : setNewTestimonial({ ...newTestimonial, context: e.target.value })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Note Attribuée (Étoiles)</label>
                            <select 
                              value={editingTestimonial ? editingTestimonial.rating : newTestimonial.rating}
                              onChange={(e) => editingTestimonial 
                                ? setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) || 5 })
                                : setNewTestimonial({ ...newTestimonial, rating: parseInt(e.target.value) || 5 })
                              }
                              className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-950 outline-none"
                            >
                              <option value={5}>⭐⭐⭐⭐⭐ (5 étoiles)</option>
                              <option value={4}>⭐⭐⭐⭐ (4 étoiles)</option>
                              <option value={3}>⭐⭐⭐ (3 étoiles)</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-stone-custom-800 block">Citation clinique patient</label>
                          <textarea 
                            required
                            rows={3}
                            placeholder="Écrivez le retour du patient en préservant son intimité..."
                            value={editingTestimonial ? editingTestimonial.quote : newTestimonial.quote}
                            onChange={(e) => editingTestimonial 
                              ? setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                              : setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                            }
                            className="w-full bg-stone-custom-50 border border-stone-custom-200 rounded-lg p-2.5 text-xs text-stone-custom-900 outline-none leading-relaxed"
                          />
                        </div>

                        <div className="flex gap-3">
                          <button type="submit" className="bg-emerald-custom-700 hover:bg-emerald-custom-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer">
                            Enregistrer Témoignage
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of current Testimonials */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((t) => (
                      <div key={t.id} className="bg-white border rounded-2xl p-4.5 space-y-3 flex flex-col justify-between shadow-xs">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start gap-3">
                            <cite className="font-bold text-stone-custom-900 text-xs sm:text-sm not-italic font-sans">
                              {t.author}
                            </cite>
                            <div className="flex gap-1">
                              <button
                                onClick={() => { setEditingTestimonial(t); setStatusMessage(null); }}
                                className="p-1 rounded border hover:bg-stone-50 text-stone-500 hover:text-emerald-custom-700 cursor-pointer"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(t.id)}
                                className="p-1 rounded border hover:bg-stone-50 text-clay-500 hover:text-clay-700 cursor-pointer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                          
                          <span className="text-[10px] text-stone-custom-800 block bg-stone-100/50 px-2.5 py-1 rounded-md max-w-max">
                            {t.context}
                          </span>

                          <blockquote className="text-xs text-stone-custom-900 italic leading-relaxed border-l-2 border-emerald-custom-600 pl-2.5 pt-0.5">
                            « {t.quote} »
                          </blockquote>
                        </div>

                        <div className="flex items-center gap-1 pt-2.5 border-t">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < (t.rating || 5) ? "fill-clay-500 text-clay-500" : "text-stone-300"}`} />
                          ))}
                          <span className="text-[10px] font-mono font-bold text-stone-500 ml-auto flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-custom-650" />
                            Anonymat Garanti
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 5. APPOINTMENTS (BOOKINGS) MANAGEMENT */}
              {activeTab === "appointments" && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                      Consultations & Demandes de Prises de Soins Reçues
                    </h3>
                    <p className="text-xs text-stone-custom-800 mt-1">
                      Consultez la liste des patients ayant sollicité une séance. Mettez à jour le statut, contactez-les ou supprimez les fiches obsolètes.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {appointments.map((app) => (
                      <div 
                        key={app.id} 
                        className={`border rounded-2xl p-5 space-y-4 bg-white shadow-xs hover:shadow-md transition-all ${
                          app.status === "new" ? "border-l-4 border-l-clay-500" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-stone-100 text-stone-500 px-2.5 py-1 rounded-md">
                              Créé le : {new Date(app.createdAt).toLocaleString("fr-FR")}
                            </span>
                            <h4 className="font-bold text-stone-custom-900 text-base mt-2 flex items-center gap-1.5 sm:gap-2">
                              {app.fullName}
                              {app.status === "new" && (
                                <span className="bg-clay-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block">
                                  Nouveau
                                </span>
                              )}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Dropdown status update for cloud tracking */}
                            <select
                              value={app.status || "new"}
                              onChange={(e) => handleUpdateAppointmentStatus(app.id!, e.target.value as any)}
                              className="bg-stone-custom-100 border border-stone-custom-200 hover:border-stone-custom-300 font-bold text-[11px] uppercase tracking-wider rounded-xl p-2 text-stone-custom-950 outline-none cursor-pointer"
                            >
                              <option value="new">🆕 Nouvelle demande</option>
                              <option value="pending">⏳ En attente de rappel</option>
                              <option value="confirmed">✅ RDV fixé & confirmé</option>
                              <option value="completed">🎉 Séance d'évaluation close</option>
                              <option value="cancelled">❌ Annulée / Reportée</option>
                            </select>

                            <button
                              onClick={() => handleDeleteAppointment(app.id!)}
                              className="p-2 rounded-xl border hover:bg-clay-50 text-clay-500 hover:text-clay-700 hover:border-clay-300 cursor-pointer"
                              title="Archiver / Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Booking properties sheet */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-custom-100/55 p-3.5 rounded-xl border">
                          <div className="text-xs space-y-1">
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Contact :</span>
                            <p className="font-medium text-stone-custom-900">{app.phone}</p>
                            <p className="text-stone-custom-800 text-[11px] truncate select-all">{app.email}</p>
                          </div>

                          <div className="text-xs space-y-1">
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Choix thématique :</span>
                            <p className="font-bold text-emerald-custom-700">{app.category}</p>
                            <p className="text-[#a56a42] text-[11px] font-mono uppercase tracking-wide">Modalité : {app.mode}</p>
                          </div>

                          <div className="text-xs space-y-1">
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Disponibilité planifiée :</span>
                            <p className="font-bold text-stone-custom-900 bg-emerald-custom-100/40 border border-emerald-custom-200/50 px-2 py-0.5 rounded-md inline-block">
                              📆 {app.dateStr} @ {app.timeStr}
                            </p>
                          </div>
                        </div>

                        {app.motif && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                              Motif clinique partagé :
                            </span>
                            <p className="text-xs text-stone-custom-850 p-4 rounded-xl border border-dashed bg-white leading-relaxed">
                              « {app.motif} »
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {appointments.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
                        <Calendar className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h4 className="font-bold text-stone-custom-900 text-sm">Aucun rendez-vous enregistré</h4>
                        <p className="text-xs text-stone-custom-800 mt-1 max-w-xs mx-auto leading-relaxed">
                          Dès qu'un client planifie une séance via le formulaire d'accueil, elle sera répertoriée ici en temps réel.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 6. VOLUNTEERS DIRECT DOSSIERS */}
              {activeTab === "volunteers" && (
                <div className="space-y-6">
                  <div className="border-b pb-4">
                    <h3 className="font-extrabold text-stone-custom-900 text-lg sm:text-xl">
                      Candidatures & CV Recrutement Psychologues Bénévoles
                    </h3>
                    <p className="text-xs text-stone-custom-800 mt-1">
                      Étudiez les manifestations d'intérêt récoltées à travers la RDC dans le cadre de vos campagnes d'interventions sociales.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {volunteers.map((vol) => (
                      <div 
                        key={vol.id} 
                        className={`border rounded-2xl p-5 space-y-4 bg-white shadow-xs hover:shadow-md transition-all ${
                          vol.status === "new" ? "border-l-4 border-l-clay-500" : ""
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div>
                            <span className="text-[9px] font-mono uppercase tracking-wider bg-stone-100 text-stone-500 px-2.5 py-1 rounded-md">
                              Reçu le : {new Date(vol.createdAt).toLocaleString("fr-FR")}
                            </span>
                            <h4 className="font-bold text-stone-custom-900 text-base mt-2 flex items-center gap-1.5 sm:gap-2">
                              {vol.fullName}
                              {vol.status === "new" && (
                                <span className="bg-clay-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block">
                                  Nouveau Dossier
                                </span>
                              )}
                            </h4>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <select
                              value={vol.status || "new"}
                              onChange={(e) => handleUpdateVolunteerStatus(vol.id!, e.target.value as any)}
                              className="bg-stone-custom-100 border border-stone-custom-200 hover:border-stone-custom-300 font-bold text-[11px] uppercase tracking-wider rounded-xl p-2 text-stone-custom-955 outline-none cursor-pointer"
                            >
                              <option value="new">🆕 Réceptionné</option>
                              <option value="reviewed">⏳ Dossier en cours d'étude</option>
                              <option value="accepted">✅ Profil validé et intégré</option>
                              <option value="rejected">❌ Candidature non retenue</option>
                            </select>

                            <button
                              onClick={() => handleDeleteVolunteerApplication(vol.id!)}
                              className="p-2 rounded-xl border hover:bg-clay-50 text-clay-500 hover:text-clay-700 hover:border-clay-300 cursor-pointer"
                              title="Supprimer la candidature"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Profile properties */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-stone-custom-100/55 p-3.5 rounded-xl border text-xs">
                          <div>
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Contact direct :</span>
                            <p className="font-bold text-stone-custom-900">{vol.phone}</p>
                            <p className="text-stone-custom-800 text-[11.5px] truncate select-all">{vol.email}</p>
                          </div>

                          <div>
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Affectation & Spécialisation :</span>
                            <p className="font-medium text-emerald-custom-700 flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              Affectation : {vol.location}
                            </p>
                            <p className="text-[#a56a42] text-[11px] uppercase tracking-wide font-medium">Spécialité : {vol.specialty.replace("_", " ")}</p>
                          </div>

                          <div>
                            <span className="text-stone-500 block uppercase font-bold text-[9px] tracking-wider">Curriculum Vitae (CV) :</span>
                            <p className="font-mono text-stone-custom-800 text-[11px] bg-white border px-2.5 py-1.5 rounded-lg inline-flex items-center gap-1.5 mt-1">
                              <FileText className="w-3.5 h-3.5 text-clay-500 shrink-0" />
                              <span className="truncate max-w-[140px]" title={vol.cvFileName}>{vol.cvFileName}</span>
                            </p>
                          </div>
                        </div>

                        {vol.motivation && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500 block">
                              Présentation et motivations cliniques partagées :
                            </span>
                            <p className="text-xs text-stone-custom-800 p-4 rounded-xl border border-dashed bg-white leading-relaxed text-justify">
                              « {vol.motivation} »
                            </p>
                          </div>
                        )}
                      </div>
                    ))}

                    {volunteers.length === 0 && (
                      <div className="text-center py-12 bg-white rounded-3xl border border-stone-200">
                        <Briefcase className="w-12 h-12 text-stone-300 mx-auto mb-4" />
                        <h4 className="font-bold text-stone-custom-900 text-sm">Aucune candidature de bénévolat</h4>
                        <p className="text-xs text-stone-custom-800 mt-1 max-w-xs mx-auto leading-relaxed">
                          Gérez ici vos futurs recrutements solidaires dès qu'un praticien répond au formulaire national de volontariat.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </main>
          </div>

      </div>
    </div>
  );
}
