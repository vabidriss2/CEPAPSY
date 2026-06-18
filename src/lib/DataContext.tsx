import React, { createContext, useContext, useState, useEffect } from "react";
import { db, auth } from "./firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy 
} from "firebase/firestore";
import { CEPAPSY_INFO, SERVICES_LIST, TESTIMONIALS_LIST } from "../data";
import { ServiceItem, Testimonial } from "../types";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export interface FirestoreBooking {
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

export interface FirestoreVolunteer {
  id?: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  specialty: string;
  motivation: string;
  cvFileName: string;
  status: "new" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}

interface DataContextProps {
  cepapsyInfo: typeof CEPAPSY_INFO;
  services: ServiceItem[];
  faqs: FaqItem[];
  testimonials: Testimonial[];
  appointments: FirestoreBooking[];
  volunteers: FirestoreVolunteer[];
  loading: boolean;
  isSeeded: boolean;
  
  // Actions
  saveGeneralInfo: (info: typeof CEPAPSY_INFO) => Promise<void>;
  saveService: (service: ServiceItem) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  saveFaq: (faq: FaqItem) => Promise<void>;
  deleteFaq: (id: string) => Promise<void>;
  saveTestimonial: (testi: Testimonial) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  
  // Form submission actions
  submitBooking: (booking: Omit<FirestoreBooking, "status" | "createdAt">) => Promise<void>;
  submitVolunteer: (volunteer: Omit<FirestoreVolunteer, "status" | "createdAt">) => Promise<void>;
  
  // Admin collection actions
  updateBookingStatus: (id: string, status: FirestoreBooking["status"]) => Promise<void>;
  updateVolunteerStatus: (id: string, status: FirestoreVolunteer["status"]) => Promise<void>;
  deleteBooking: (id: string) => Promise<void>;
  deleteVolunteer: (id: string) => Promise<void>;
  
  seedDatabase: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Local fallback default FAQs for initial loading/seeding
const DEFAULT_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    question: "Qu'est-ce que le CEPAPSY et qui peut en bénéficier ?",
    answer: "Le CEPAPSY est un centre professionnel d'écoute et d'accompagnement de premier plan, soutenu par la synergie académique de l'EPA-PSY et syndicale de l'ACO-RDC. Nos consultations cliniques s'adressent à toute personne (enfants, adolescents, adultes, couples ou structures familiales) traversant des périodes de vulnérabilité émotionnelle, de deuil, de stress post-traumatique, de troubles anxieux ou de burnout.",
    order: 1
  },
  {
    id: "faq-2",
    question: "Comment se déroule la première consultation d'évaluation ?",
    answer: "Le premier entretien est un espace d'accueil bienveillant, chaleureux et totalement neutre. Durant 45 à 60 minutes, votre psychologue prend le temps de vous écouter pour cerner la nature de vos difficultés, évaluer vos besoins cliniques exacts et poser les fondations d'un projet thérapeutique personnalisé, en accord avec vos objectifs de vie.",
    order: 2
  },
  {
    id: "faq-3",
    question: "La confidentialité des échanges est-elle rigoureusement garantie ?",
    answer: "Absolument. La confidentialité constitue la pierre angulaire de notre déontologie. Nos cliniciens sont soumis au secret professionnel absolu d'après la charte d'éthique de l'ACO-RDC. Aucune information partagée lors de vos entretiens ne sera partagée avec l'extérieur, vous assurant un espace d'expression intime, sûr et dénué de tout jugement social.",
    order: 3
  },
  {
    id: "faq-4",
    question: "Quelles sont les approches thérapeutiques proposées au sein du centre ?",
    answer: "Afin de garantir des soins d'une haute rigueur scientifique, nos psychologues cliniciens utilisent des thérapies brèves et validées : la Thérapie Cognitive et Comportementale (TCC), la désensibilisation par les mouvements oculaires (EMDR) pour les traumatismes, la thérapie d'acceptation et d'engagement (ACT) ainsi que des thérapies par l'art-thérapie adaptées aux enfants.",
    order: 4
  },
  {
    id: "faq-5",
    question: "Combien coûtent les séances et proposez-vous des tarifs solidaires ?",
    answer: "Conformément à notre mission de santé publique à Goma, nous appliquons une grille tarifaire progressive et solidaire ajustée aux réalités socio-économiques locales. Nous croyons fermement que les barrières financières ne doivent jamais entraver l'accès aux soins de santé mentale. Des dispenses partielles ou totales de frais sont possibles pour les personnes en situation critique.",
    order: 5
  },
  {
    id: "faq-6",
    question: "Proposez-vous des consultations à distance (téléconsultation) ou à domicile ?",
    answer: "Oui, tout à fait. Pour les patients ne pouvant se déplacer au cabinet de Goma ou résidant dans d'autres localités de la RDC, nous disposons d'un protocole de téléconsultation fiable par visioconférence sécurisée ou appel téléphonique. De plus, nos équipes mobiles de crise réalisent des interventions à domicile sur prescription d'urgence psychologique.",
    order: 6
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [cepapsyInfo, setCepapsyInfo] = useState<typeof CEPAPSY_INFO>(CEPAPSY_INFO);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [appointments, setAppointments] = useState<FirestoreBooking[]>([]);
  const [volunteers, setVolunteers] = useState<FirestoreVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSeeded, setIsSeeded] = useState(false);

  // Load all public data
  const refreshAllData = async () => {
    setLoading(true);
    let servicesSnapshotEmpty = true;

    // 1. Load general info
    try {
      const infoDocRef = doc(db, "site_config", "main");
      const infoDoc = await getDoc(infoDocRef);
      if (infoDoc.exists()) {
        const cloudData = infoDoc.data();
        setCepapsyInfo((prev) => ({
          ...prev,
          ...cloudData,
        }));
      } else {
        setCepapsyInfo(CEPAPSY_INFO);
      }
    } catch (err) {
      console.warn("Could not load site_config from Firestore, using offline fallback:", err);
      setCepapsyInfo(CEPAPSY_INFO);
    }

    // 2. Load services
    try {
      const servicesSnapshot = await getDocs(collection(db, "services"));
      if (!servicesSnapshot.empty) {
        const servicesList: ServiceItem[] = [];
        servicesSnapshot.forEach((doc) => {
          servicesList.push({ id: doc.id, ...doc.data() } as ServiceItem);
        });
        setServices(servicesList);
        servicesSnapshotEmpty = false;
      } else {
        // Fallback to static list
        setServices(SERVICES_LIST);
      }
    } catch (err) {
      console.warn("Could not load services from Firestore, using offline fallback:", err);
      setServices(SERVICES_LIST);
    }

    // 3. Load FAQs
    try {
      const faqSnapshot = await getDocs(collection(db, "faq"));
      if (!faqSnapshot.empty) {
        const faqsList: FaqItem[] = [];
        faqSnapshot.forEach((doc) => {
          faqsList.push({ id: doc.id, ...doc.data() } as FaqItem);
        });
        // Sort by order or index
        faqsList.sort((a, b) => (a.order || 0) - (b.order || 0));
        setFaqs(faqsList);
      } else {
        setFaqs(DEFAULT_FAQS);
      }
    } catch (err) {
      console.warn("Could not load FAQ from Firestore, using offline fallback:", err);
      setFaqs(DEFAULT_FAQS);
    }

    // 4. Load Testimonials
    try {
      const testimonialsSnapshot = await getDocs(collection(db, "testimonials"));
      if (!testimonialsSnapshot.empty) {
        const testiList: Testimonial[] = [];
        testimonialsSnapshot.forEach((doc) => {
          testiList.push({ id: doc.id, ...doc.data() } as Testimonial);
        });
        setTestimonials(testiList);
      } else {
        setTestimonials(TESTIMONIALS_LIST);
      }
    } catch (err) {
      console.warn("Could not load testimonials from Firestore, using offline fallback:", err);
      setTestimonials(TESTIMONIALS_LIST);
    }

    // Check if seeded based on services snapshot
    setIsSeeded(!servicesSnapshotEmpty);

    // 5. Load Appointments & Volunteers if an admin user is currently logged in and is a verified admin
    const isAdminUser = localStorage.getItem("cepapsy_is_admin") === "true";
    if (auth.currentUser && isAdminUser) {
      try {
        const appSnapshot = await getDocs(query(collection(db, "appointments"), orderBy("createdAt", "desc")));
        const appList: FirestoreBooking[] = [];
        appSnapshot.forEach((doc) => {
          appList.push({ id: doc.id, ...doc.data() } as FirestoreBooking);
        });
        setAppointments(appList);
      } catch (adminErr) {
        console.warn("Not authorized/unable to load appointments list:", adminErr);
      }

      try {
        const volSnapshot = await getDocs(query(collection(db, "volunteers"), orderBy("createdAt", "desc")));
        const volList: FirestoreVolunteer[] = [];
        volSnapshot.forEach((doc) => {
          volList.push({ id: doc.id, ...doc.data() } as FirestoreVolunteer);
        });
        setVolunteers(volList);
      } catch (adminErr) {
        console.warn("Not authorized/unable to load volunteers list:", adminErr);
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Sync auth state to pull protected records automatically when admin signs in
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user) {
        refreshAllData();
      } else {
        setAppointments([]);
        setVolunteers([]);
      }
    });
    return unsub;
  }, []);

  // Seed All Local Static data to Cloud
  const seedDatabase = async () => {
    setLoading(true);
    try {
      // 1. Seed Main config
      await setDoc(doc(db, "site_config", "main"), {
        phoneAppointments: CEPAPSY_INFO.phoneAppointments,
        phoneAlt1: CEPAPSY_INFO.phoneAlt1,
        phoneAlt2: CEPAPSY_INFO.phoneAlt2,
        phoneAlt3: CEPAPSY_INFO.phoneAlt3,
        email: CEPAPSY_INFO.email,
        emailSecondary: CEPAPSY_INFO.emailSecondary,
        locationMain: CEPAPSY_INFO.locationMain,
        locationSecondary: CEPAPSY_INFO.locationSecondary,
        workingHours: CEPAPSY_INFO.workingHours,
        mission: CEPAPSY_INFO.mission
      });

      // 2. Seed Services list
      for (const s of SERVICES_LIST) {
        await setDoc(doc(db, "services", s.id), {
          title: s.title,
          description: s.description,
          details: s.details || [],
          category: s.category || "all",
          iconName: s.iconName
        });
      }

      // 3. Seed FAQs
      for (const faq of DEFAULT_FAQS) {
        await setDoc(doc(db, "faq", faq.id), {
          question: faq.question,
          answer: faq.answer,
          order: faq.order
        });
      }

      // 4. Seed Testimonials
      for (const t of TESTIMONIALS_LIST) {
        await setDoc(doc(db, "testimonials", t.id), {
          quote: t.quote,
          author: t.author,
          context: t.context,
          rating: t.rating || 5
        });
      }

      await refreshAllData();
    } catch (e) {
      console.error("Error seeding DB:", e);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const saveGeneralInfo = async (info: typeof CEPAPSY_INFO) => {
    try {
      await setDoc(doc(db, "site_config", "main"), {
        phoneAppointments: info.phoneAppointments,
        phoneAlt1: info.phoneAlt1,
        phoneAlt2: info.phoneAlt2,
        phoneAlt3: info.phoneAlt3,
        email: info.email,
        emailSecondary: info.emailSecondary,
        locationMain: info.locationMain,
        locationSecondary: info.locationSecondary,
        workingHours: info.workingHours,
        mission: info.mission
      });
      setCepapsyInfo(info);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const saveService = async (service: ServiceItem) => {
    try {
      await setDoc(doc(db, "services", service.id), {
        title: service.title,
        description: service.description,
        details: service.details || [],
        category: service.category || "all",
        iconName: service.iconName
      });
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await deleteDoc(doc(db, "services", id));
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const saveFaq = async (faq: FaqItem) => {
    try {
      await setDoc(doc(db, "faq", faq.id), {
        question: faq.question,
        answer: faq.answer,
        order: faq.order || 0
      });
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteFaq = async (id: string) => {
    try {
      await deleteDoc(doc(db, "faq", id));
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const saveTestimonial = async (testi: Testimonial) => {
    try {
      await setDoc(doc(db, "testimonials", testi.id), {
        quote: testi.quote,
        author: testi.author,
        context: testi.context,
        rating: testi.rating || 5
      });
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await deleteDoc(doc(db, "testimonials", id));
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // Forms Submissions (Appointments & Volunteers)
  const submitBooking = async (booking: Omit<FirestoreBooking, "status" | "createdAt">) => {
    try {
      const fullBooking: any = {
        ...booking,
        status: "new",
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "appointments"), fullBooking);
      // Wait a moment to sync if Admin
      if (auth.currentUser) {
        await refreshAllData();
      }
    } catch (e) {
      console.error("Firestore booking submit failure, using offline storage:", e);
      // Let standard offline path process it inside the component if this fails, or throw
      throw e;
    }
  };

  const submitVolunteer = async (volunteer: Omit<FirestoreVolunteer, "status" | "createdAt">) => {
    try {
      const fullVolunteer: any = {
        ...volunteer,
        status: "new",
        createdAt: new Date().toISOString()
      };
      await addDoc(collection(db, "volunteers"), fullVolunteer);
      if (auth.currentUser) {
        await refreshAllData();
      }
    } catch (e) {
      console.error("Firestore volunteer application error:", e);
      throw e;
    }
  };

  // Admin status update actions
  const updateBookingStatus = async (id: string, status: FirestoreBooking["status"]) => {
    try {
      await updateDoc(doc(db, "appointments", id), { status });
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const updateVolunteerStatus = async (id: string, status: FirestoreVolunteer["status"]) => {
    try {
      await updateDoc(doc(db, "volunteers", id), { status });
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      await deleteDoc(doc(db, "appointments", id));
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  const deleteVolunteer = async (id: string) => {
    try {
      await deleteDoc(doc(db, "volunteers", id));
      await refreshAllData();
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return (
    <DataContext.Provider value={{
      cepapsyInfo,
      services,
      faqs,
      testimonials,
      appointments,
      volunteers,
      loading,
      isSeeded,
      saveGeneralInfo,
      saveService,
      deleteService,
      saveFaq,
      deleteFaq,
      saveTestimonial,
      deleteTestimonial,
      submitBooking,
      submitVolunteer,
      updateBookingStatus,
      updateVolunteerStatus,
      deleteBooking,
      deleteVolunteer,
      seedDatabase,
      refreshAllData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
