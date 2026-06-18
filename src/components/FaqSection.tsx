import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HelpCircle, ChevronDown, CheckCircle, Shield, Calendar, CreditCard } from "lucide-react";
import { useData } from "../lib/DataContext";

export default function FaqSection() {
  const { faqs } = useData();
  const [openId, setOpenId] = useState<string | null>("faq-1"); // Set first item open by default for rich content presentation

  // Helper map to associate icon representation with keys
  const getFaqIcon = (id: string, sizeClass = "w-5 h-5 text-emerald-custom-600") => {
    switch (id) {
      case "faq-1": return <HelpCircle className={sizeClass} />;
      case "faq-2": return <Calendar className={sizeClass} />;
      case "faq-3": return <Shield className={sizeClass} />;
      case "faq-4": return <CheckCircle className={sizeClass} />;
      case "faq-5": return <CreditCard className={sizeClass} />;
      default: return <HelpCircle className={sizeClass} />;
    }
  };

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section 
      id="faq-section" 
      className="py-16 md:py-24 bg-stone-custom-100 border-t border-b border-stone-custom-200 relative overflow-hidden"
    >
      {/* Background soft styling vectors to match corporate look */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-clay-100/40 blur-3xl -z-10 pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-emerald-custom-100/30 blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-1.5 bg-clay-100 text-stone-custom-850 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-stone-custom-200">
            <HelpCircle className="w-3.5 h-3.5 text-clay-600" />
            Processus Clinique & Pratique
          </span>
          <h2 className="serif-title text-3xl md:text-4xl font-extrabold text-stone-custom-900 tracking-tight leading-tight">
            Foire Aux Questions
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-stone-custom-800 mt-3 max-w-xl mx-auto">
            Retrouvez les réponses de notre équipe clinique de psychologues cliniciens chevronnés sur les modalités de prise en charge thérapeutique.
          </p>
        </div>

        {/* Accordion Component - Beautiful styled wrapper using chocolate/blue scheme */}
        <div className="space-y-4 max-w-3xl mx-auto" id="faq-accordion-container">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div 
                key={faq.id}
                className={`group rounded-2xl border transition-all duration-350 overflow-hidden ${
                  isOpen 
                    ? "bg-stone-custom-50 border-emerald-custom-600 shadow-md ring-1 ring-emerald-custom-600/10" 
                    : "bg-stone-custom-50/70 border-stone-custom-200/80 hover:bg-stone-custom-50 hover:border-stone-custom-300 hover:shadow-xs"
                }`}
                id={`faq-item-${faq.id}`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left p-5 sm:p-6 cursor-pointer select-none gap-4"
                  id={`faq-header-btn-${faq.id}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 transition-all ${
                      isOpen ? "bg-emerald-custom-100" : "bg-stone-custom-150 group-hover:bg-stone-custom-200"
                    }`}>
                      {getFaqIcon(faq.id)}
                    </div>
                    <span className={`font-bold text-sm sm:text-base tracking-tight transition-colors duration-250 ${
                      isOpen ? "text-emerald-custom-700" : "text-stone-custom-900 group-hover:text-emerald-custom-700"
                    }`}>
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown className={`w-5 h-5 shrink-0 text-stone-custom-850 transition-transform duration-300 ${
                    isOpen ? "rotate-180 text-emerald-custom-600" : ""
                  }`} />
                </button>

                {/* Accordion Expandable Panel */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-1 sm:pt-2 border-t border-stone-custom-200/40">
                        <p className="text-xs sm:text-sm text-stone-custom-850 leading-relaxed font-normal bg-stone-custom-100/40 p-4 rounded-xl border border-stone-custom-150">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Dynamic CTA at the bottom of FAQ */}
        <div className="mt-12 text-center bg-stone-custom-50 rounded-2xl border border-stone-custom-200/80 p-6 max-w-xl mx-auto shadow-xs">
          <p className="text-xs text-stone-custom-800 font-medium">
            Vous avez une question spécifique qui ne figure pas ici ?
          </p>
          <div className="mt-3 flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="#booking"
              className="bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all uppercase tracking-wider cursor-pointer"
            >
              Échanger avec un Clinicien
            </a>
            <a 
              href="mailto:contact@cepapsy.org" 
              className="bg-stone-custom-150 hover:bg-stone-custom-200 text-stone-custom-900 font-bold text-xs px-5 py-2.5 rounded-xl border border-stone-custom-200 transition-all uppercase tracking-wider block text-center"
            >
              Écrire au Centre
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
