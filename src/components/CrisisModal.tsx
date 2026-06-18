/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { X, HeartHandshake, Phone, ShieldAlert, Sparkles, CheckCircle } from "lucide-react";
import { CEPAPSY_INFO } from "../data";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBooking: (serviceName: string) => void;
}

export default function CrisisModal({ isOpen, onClose, onSelectBooking }: CrisisModalProps) {
  if (!isOpen) return null;

  const urgentServices = [
    { title: "Defusing & Débriefing d'Urgence", desc: "Soutien psychologique immédiat à la suite d'un incident critique (agression, traumatisme soudain, sinistre)." },
    { title: "Crises d'Angoisse & de Panique", desc: "Techniques de respiration contrôlée et d'ancrage menées par un psychologue clinicien." },
    { title: "Premiers Secours Psychosociaux", desc: "Régulation immédiate contre les agitations extrêmes ou conduites à risques suicidaires." }
  ];

  const handleAction = () => {
    onSelectBooking("Urgence / Intervention de Crise");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-custom-900/60 backdrop-blur-xs animate-fadeIn p-4 sm:p-6 flex items-start sm:items-center justify-center">
      <div className="bg-stone-custom-50 rounded-2xl sm:rounded-3xl border border-clay-200 shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto flex flex-col my-auto">
        {/* Header banner */}
        <div className="bg-emerald-custom-700 text-stone-custom-50 p-6 flex justify-between items-start shrink-0">
          <div className="flex gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-custom-100 shrink-0" />
            <div>
              <h2 className="serif-title text-2xl font-bold tracking-tight">Cellule d'Urgence & Crise</h2>
              <p className="text-sm opacity-90 mt-1">
                Premiers secours psychologiques & assistance immédiate du CEPAPSY
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-emerald-custom-800/60 transition-colors text-white"
            aria-label="Fermer le modal"
            id="close-crisis-modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 md:p-8 flex-1">
          <div className="mb-6">
            <p className="text-stone-custom-800 leading-relaxed font-semibold mb-4 text-base">
              Si vous traversez un état de panique extrême, de deuil aigu, ou que des idées suicidaires vous submergent, sachez que vous n'êtes pas seul et que l'aide est accessible immédiatement :
            </p>
            
            {/* Quick action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <a 
                href={`tel:${CEPAPSY_INFO.phoneAppointments.replace(/\s+/g, '')}`} 
                className="flex items-center justify-center gap-2.5 bg-emerald-custom-600 hover:bg-emerald-custom-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-colors text-center"
              >
                <Phone className="w-5 h-5" />
                Appeler Hotline : {CEPAPSY_INFO.phoneAppointments}
              </a>
              <a 
                href="https://wa.me/243978056228" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center justify-center gap-2.5 bg-clay-600 hover:bg-clay-605 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition-colors text-center"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.261 2.268 3.501 5.28 3.5 8.484-.007 6.657-5.346 11.997-11.956 11.997-1.999-.001-3.963-.5-5.717-1.447L0 24zm6.59-4.846c1.6.95 3.187 1.449 4.825 1.451 5.436 0 9.86-4.413 9.864-9.843.003-2.63-1.012-5.101-2.859-6.952C16.635 1.96 14.167 1.9 12.012 1.9c-5.441 0-9.869 4.412-9.873 9.84-.002 1.802.483 3.562 1.404 5.122l-1.085 3.966 4.189-1.074z" />
                </svg>
                WhatsApp Urgence
              </a>
            </div>
          </div>

          {/* Actionable psychological tips inside modal */}
          <div className="bg-stone-custom-100 rounded-2xl px-5 py-5 border border-stone-custom-200 mb-6">
            <h3 className="flex items-center gap-2 font-bold text-emerald-custom-700 text-sm tracking-wide uppercase mb-3">
              <Sparkles className="w-4 h-4" />
              Gérer la Crise Immédiatement (Ancrage 5-4-3-2-1)
            </h3>
            <ul className="space-y-2 text-sm text-stone-custom-800">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                <span><strong>Réguler le souffle :</strong> Inspirez sur 4 secondes, retenez 4 secondes, expirez sur 6 secondes. Recommencez 3 fois.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                <span><strong>Ancrage visuel :</strong> Nommez 5 objets autour de vous, touchez 4 textures différentes, écoutez 3 sons distincts.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                <span><strong>Déferler :</strong> Rappelez-vous que la panique est comme une vague physique : elle atteint un pic, puis redescend. Elle n'est pas mortelle.</span>
              </li>
            </ul>
          </div>

          {/* Services d'urgence list */}
          <div className="space-y-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-stone-custom-800 block">
              Nos protocoles d'intervention de secours :
            </span>
            {urgentServices.map((us, i) => (
              <div key={i} className="flex gap-3 border-l-4 border-clay-200 pl-4 py-1">
                <div>
                  <h4 className="font-bold text-stone-custom-900 text-sm">{us.title}</h4>
                  <p className="text-xs text-stone-custom-800 mt-0.5">{us.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-stone-custom-800 leading-relaxed border-t border-stone-custom-200 pt-4 flex flex-col md:flex-row justify-between items-center gap-3">
            <span>
              <strong>Cabinet physique :</strong> Karisimbi, Mabanga Nord, Avenue Osso2, No 222 (Goma)
            </span>
            <button
              onClick={handleAction}
              className="bg-emerald-custom-600 text-stone-custom-50 text-xs font-bold py-2 px-4 rounded-xl hover:bg-emerald-custom-700 transition-colors"
              id="crisis-modal-book-btn"
            >
              Solliciter une consultation de crise
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
