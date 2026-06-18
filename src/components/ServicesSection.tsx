/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { useData } from "../lib/DataContext";
import { ServiceItem } from "../types";
import { Baby, User, Heart, Building, ShieldAlert, Sparkles, Check, ChevronRight } from "lucide-react";

interface ServicesSectionProps {
  onSelectService: (serviceTitle: string) => void;
}

export default function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const { services } = useData();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeExpandedId, setActiveExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (services && services.length > 0 && !activeExpandedId) {
      setActiveExpandedId(services[0].id);
    }
  }, [services]);

  const categories = [
    { id: "all", label: "Tous nos services", icon: <Sparkles className="w-4 h-4" /> },
    { id: "adult", label: "Adultes", icon: <User className="w-4 h-4" /> },
    { id: "child", label: "Enfants & Ados", icon: <Baby className="w-4 h-4" /> },
    { id: "corporate", label: "Entreprises & ONG", icon: <Building className="w-4 h-4" /> },
    { id: "specialty", label: "Expertises", icon: <ShieldAlert className="w-4 h-4" /> },
  ];

  const filteredServices = selectedCategory === "all"
    ? services
    : services.filter(s => s.category === selectedCategory);

  // Helper map for finding relevant SVG icon
  const getIcon = (iconName: string, sizeClass = "w-6 h-6 text-emerald-custom-600") => {
    switch (iconName) {
      case "Baby": return <Baby className={sizeClass} />;
      case "User": return <User className={sizeClass} />;
      case "Heart": return <Heart className={sizeClass} />;
      case "Building": return <Building className={sizeClass} />;
      case "ShieldAlert": return <ShieldAlert className={sizeClass} />;
      default: return <Sparkles className={sizeClass} />;
    }
  };

  return (
    <div className="w-full bg-stone-custom-50 rounded-3xl border border-stone-custom-200 p-6 md:p-10 shadow-xs" id="services-section">
      {/* Title */}
      <div className="max-w-2xl mx-auto text-center mb-8">
        <span className="text-xs font-bold font-mono text-clay-600 uppercase tracking-widest bg-clay-100 px-3 py-1 rounded-full mb-2 inline-block">
          Offre Thérapeutique Multi-Spécialités
        </span>
        <h2 className="serif-title text-3xl md:text-4xl font-extrabold text-stone-custom-900 leading-tight">
          Services Psychologiques Cliniques & Spécifiques
        </h2>
        <p className="text-sm md:text-base text-stone-custom-850 mt-2">
          De la consultation individuelle en cabinet ou en ligne, jusqu’à l'accompagnement d'équipes d'ONG sur le terrain dans l'Est de la RDC.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-1.5 md:gap-2.5 mb-8 md:mb-10 max-w-4xl mx-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 border cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-emerald-custom-600 border-emerald-custom-600 text-stone-custom-50 shadow-md transform -translate-y-0.5"
                : "bg-stone-custom-100 border-stone-custom-200 text-stone-custom-800 hover:bg-stone-custom-200"
            }`}
            id={`filter-btn-${cat.id}`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Grid & Highlight Section layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-7xl mx-auto">
        
        {/* Left column: Cards lists of matches */}
        <div className="lg:col-span-7 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-stone-custom-800 block mb-1">
            Rechercher un service ({filteredServices.length}) :
          </span>
          {filteredServices.map((service) => {
            const isExpanded = activeExpandedId === service.id;
            return (
              <div
                key={service.id}
                className="space-y-3"
              >
                <div
                  onClick={() => setActiveExpandedId(isExpanded ? null : service.id)}
                  className={`p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isExpanded
                      ? "bg-emerald-custom-50/40 border-emerald-custom-600 shadow-xs"
                      : "bg-stone-custom-100/50 border-stone-custom-200 hover:border-stone-custom-300"
                  }`}
                  id={`service-row-${service.id}`}
                >
                  <div className="flex items-start gap-4 justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl ${isExpanded ? "bg-emerald-custom-100" : "bg-stone-custom-100"}`}>
                        {getIcon(service.iconName)}
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-custom-900 text-base md:text-lg leading-tight group-hover:text-emerald-custom-700">
                          {service.title}
                        </h3>
                        <p className="text-xs md:text-sm text-stone-custom-800 mt-1 lines-clamp-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-stone-custom-800 shrink-0 mt-1 transition-transform ${isExpanded ? "rotate-90 text-emerald-custom-600" : ""}`} />
                  </div>
                </div>

                {isExpanded && (
                  <div className="lg:hidden mt-2 bg-stone-custom-100/80 border border-stone-custom-200/80 rounded-2xl p-4 sm:p-5 space-y-4 animate-fadeIn">
                    <p className="text-xs sm:text-sm text-stone-custom-850 leading-relaxed">
                      {service.description}
                    </p>
                    {service.details && (
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-custom-800 block">
                          Problématiques prises en soin :
                        </span>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {service.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-1.5 text-xs text-stone-custom-800 leading-normal">
                              <Check className="w-3.5 h-3.5 text-emerald-custom-600 mt-0.5 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectService(service.title);
                      }}
                      className="w-full bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold py-3.5 px-4 rounded-xl shadow-xs transition-colors text-xs uppercase tracking-wide cursor-pointer text-center block mt-3"
                    >
                      Prendre RDV pour ce soin
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right column: Active Detail card (Extremely sleek, high-end look) */}
        <div className="hidden lg:block lg:col-span-5 border border-stone-custom-200 bg-stone-custom-100 rounded-3xl p-6 md:p-8 sticky top-6 shadow-sm">
          {activeExpandedId ? (() => {
            const activeService = services.find(s => s.id === activeExpandedId);
            if (!activeService) return (
              <div className="text-center py-20 text-stone-custom-850 font-medium">
                Aucun détail disponible. Sélectionnez un autre service à gauche.
              </div>
            );
            return (
              <div>
                <span className="text-[10px] font-bold font-mono inline-block px-2.5 py-1 bg-emerald-custom-100 text-emerald-custom-700 rounded uppercase tracking-wider mb-4">
                  Détail de la Couverture
                </span>
                
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="bg-emerald-custom-600 text-stone-custom-50 p-2.5 rounded-2xl">
                    {getIcon(activeService.iconName, "w-6 h-6 text-white")}
                  </div>
                  <div>
                    <h3 className="serif-title text-xl md:text-2xl font-bold text-stone-custom-910 leading-snug">
                      {activeService.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-stone-custom-850 leading-relaxed mb-6 border-b border-stone-custom-200 pb-4">
                  {activeService.description}
                </p>

                {activeService.details && (
                  <div className="mb-6">
                    <span className="text-xs font-bold uppercase tracking-wider text-stone-custom-800 block mb-3.5">
                      Problématiques prises en soin :
                    </span>
                    <ul className="space-y-3">
                      {activeService.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-stone-custom-800 leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="bg-white rounded-2xl p-4 border border-stone-custom-200 mb-6 text-xs text-stone-custom-800">
                  <strong>ℹ Modalité :</strong> Présentiel en cabinet (Goma), consultations à domicile, ou sessions sécurisées en ligne.
                </div>

                <button
                  onClick={() => onSelectService(activeService.title)}
                  className="w-full bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold py-3 px-5 rounded-2xl shadow-md transition-all text-sm uppercase tracking-wide cursor-pointer text-center block"
                  id="expanded-service-book-btn"
                >
                  Prendre Rendez-vous pour ce soin
                </button>
              </div>
            );
          })() : (
            <div className="text-center py-20 text-stone-custom-800 font-medium">
              Cliquez sur un service à gauche pour afficher les détails du soin.
            </div>
          )}
        </div>

      </div>

      {/* Quality commitment Footer */}
      <div className="bg-emerald-custom-50 rounded-2xl p-4 border border-emerald-custom-200 mt-10 text-center max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
        <span className="text-xs text-emerald-custom-800 font-semibold">
          🛡 Nous appliquons les méthodes TCC (Thérapie Cognitive), EMDR (Désensibilisation) et NET (Thérapie d'Exposition Narrative).
        </span>
        <a href="#about-section" className="text-xs font-bold text-emerald-custom-700 hover:underline">
          Découvrir l'approche clinique →
        </a>
      </div>
    </div>
  );
}
