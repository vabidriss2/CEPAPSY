/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Phone, Mail, MapPin, Menu, X, AlertTriangle, ShieldCheck } from "lucide-react";
import { CEPAPSY_INFO } from "../data";
import { EpaPsyLogo, AcoRdcLogo } from "./Logos";

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenCrisis: () => void;
}

export default function Header({ onNavigate, activeSection, onOpenCrisis }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { id: "hero", label: "Accueil" },
    { id: "flowchart", label: "Trouver mon Parcours" },
    { id: "services", label: "Nos Services" },
    { id: "about", label: "À Propos & Équipe" },
    { id: "volunteer", label: "Recrutement Bénévoles" },
    { id: "booking", label: "Prendre RDV" },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <header className="w-full relative z-40 bg-stone-custom-50 shadow-xs border-b border-stone-custom-200">
      {/* Top emergency & Quick Contact bar */}
      <div className="bg-emerald-custom-600 text-stone-custom-50 text-[11px] sm:text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2.5">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-center md:text-left">
            <span className="flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-clay-200" />
              Soutien Psychosocial de Confiance • Goma, RDC
            </span>
            <span className="hidden md:inline-block text-stone-300 opacity-60">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-clay-200" />
              {CEPAPSY_INFO.locationMain.replace("Bureau Principal : ", "")}
            </span>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <a href={`tel:${CEPAPSY_INFO.phoneAppointments.replace(/\s+/g, '')}`} className="hover:text-clay-200 transition-colors flex items-center gap-1 font-mono">
              <Phone className="w-3.5 h-3.5 text-clay-200" />
              {CEPAPSY_INFO.phoneAppointments}
            </a>
            <a href={`mailto:${CEPAPSY_INFO.email}`} className="hover:text-clay-200 transition-colors flex items-center gap-1 font-mono">
              <Mail className="w-3.5 h-3.5 text-clay-200" />
              {CEPAPSY_INFO.email}
            </a>
          </div>
        </div>
      </div>

      {/* Main Crisis Banner Link */}
      <div className="bg-clay-100 border-b border-clay-200 py-3 px-4 text-clay-650 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <AlertTriangle className="w-4.5 h-4.5 text-clay-600 shrink-0" />
            <span className="font-semibold text-stone-custom-900 leading-snug">
              En situation de crise ou d'urgence psychologique ? (idées suicidaires, panique extrême...)
            </span>
          </div>
          <button
            onClick={onOpenCrisis}
            className="w-full sm:w-auto text-center bg-clay-600 hover:bg-clay-605 text-white font-bold text-xs py-2 px-4 sm:py-1.5 sm:px-4 rounded-full shadow-xs hover:shadow-md transition-all shrink-0 uppercase sm:normal-case tracking-wider sm:tracking-normal cursor-pointer"
            id="emergency-banner-btn"
          >
            Premiers Secours
          </button>
        </div>
      </div>

      {/* Main clean navigation hierarchy */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Brand Group */}
        <div className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none" onClick={() => handleLinkClick("hero")}>
          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 bg-white p-1 rounded-xl shadow-xs border border-stone-custom-200">
            <EpaPsyLogo size={34} className="h-8 sm:h-9 w-auto" />
            <div className="w-[1px] h-5 sm:h-6 bg-stone-custom-150"></div>
            <AcoRdcLogo size={34} className="h-8 sm:h-9 w-auto" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-emerald-custom-700 leading-none">
                CEPAPSY
              </h1>
              <span className="text-[8px] sm:text-[10px] bg-clay-100 text-clay-600 font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                ACO-RDC
              </span>
            </div>
            <p className="text-[9px] sm:text-[10px] text-stone-custom-800 tracking-wide mt-0.5 uppercase max-w-[160px] xs:max-w-[200px] sm:max-w-[280px] md:max-w-none truncate">
              Centre d'Écoute & d'Accompagnement Psychologique
            </p>
          </div>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-custom-100 text-emerald-custom-700 font-semibold"
                    : "text-stone-custom-800 hover:text-emerald-custom-600 hover:bg-stone-custom-100"
                }`}
                id={`nav-${link.id}`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="w-[1px] h-6 bg-stone-custom-200 mx-2"></div>
          <button
            onClick={() => handleLinkClick("booking")}
            className="bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-semibold text-sm py-2 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
            id="nav-cta-booking"
          >
            Prendre RDV
          </button>
        </nav>

        {/* Mobile menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-2 rounded-lg hover:bg-stone-custom-150 text-stone-custom-800 transition-colors"
          aria-label="Toggle menu"
          id="mobile-nav-toggle"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer with overlay */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-stone-custom-50 border-b border-stone-custom-200 shadow-xl py-4 px-4 flex flex-col gap-2 z-50 animate-fadeIn">
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`text-left w-full px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-custom-100 text-emerald-custom-700 font-semibold"
                    : "text-stone-custom-800 hover:bg-stone-custom-100"
                }`}
                id={`mobile-nav-${link.id}`}
              >
                {link.label}
              </button>
            );
          })}
          <div className="h-[1px] bg-stone-custom-200 my-2"></div>
          <button
            onClick={() => handleLinkClick("booking")}
            className="w-full text-center bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-semibold py-3 px-4 rounded-xl shadow-md transition-colors"
            id="mobile-nav-cta-booking"
          >
            Prendre Rendez-vous
          </button>
        </div>
      )}
    </header>
  );
}
