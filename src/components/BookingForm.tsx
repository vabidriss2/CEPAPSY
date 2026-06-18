/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Calendar, Clock, Phone, Mail, MapPin, Send, History, X, CheckSquare } from "lucide-react";
import { BookingRequest } from "../types";
import { useData } from "../lib/DataContext";

interface BookingFormProps {
  prefilledCategory: string; // prefilled service name from flowchart or list clicks
  clearPrefill: () => void;
}

export default function BookingForm({ prefilledCategory, clearPrefill }: BookingFormProps) {
  const { submitBooking, cepapsyInfo } = useData();
  const [formData, setFormData] = useState<BookingRequest>({
    fullName: "",
    phone: "",
    email: "",
    mode: "présentiel",
    category: "",
    motif: "",
    dateStr: "",
    timeStr: "10:00"
  });

  const [pastBookings, setPastBookings] = useState<BookingRequest[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastBooked, setLastBooked] = useState<BookingRequest | null>(null);

  // Sync state if category changes
  useEffect(() => {
    if (prefilledCategory) {
      setFormData((prev) => ({ ...prev, category: prefilledCategory }));
    }
  }, [prefilledCategory]);

  // Read historic client appointments on load
  useEffect(() => {
    const local = localStorage.getItem("cepapsy_bookings_db");
    if (local) {
      try {
        setPastBookings(JSON.parse(local));
      } catch (err) {
        // ignore
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Set default category if empty
    const finalCategory = formData.category || "Consultation Psychologique Standard";
    const finalDateStr = formData.dateStr || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];
    
    const submission: BookingRequest = {
      ...formData,
      category: finalCategory,
      dateStr: finalDateStr
    };

    // 1. Save to cloud database (Firestore)
    try {
      await submitBooking({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        mode: formData.mode,
        category: finalCategory,
        motif: formData.motif,
        dateStr: finalDateStr,
        timeStr: formData.timeStr || "10:00"
      });
    } catch (err) {
      console.warn("Saving to cloud failed, proceeding with offline state", err);
    }

    const updated = [submission, ...pastBookings];
    setPastBookings(updated);
    localStorage.setItem("cepapsy_bookings_db", JSON.stringify(updated));

    setLastBooked(submission);
    setIsSuccess(true);
    clearPrefill();

    // Reset inputs but preserve contact details
    setFormData((prev) => ({
      ...prev,
      category: "",
      motif: "",
      dateStr: "",
    }));
  };

  const deleteHistoryItem = (idx: number) => {
    const updated = pastBookings.filter((_, i) => i !== idx);
    setPastBookings(updated);
    localStorage.setItem("cepapsy_bookings_db", JSON.stringify(updated));
  };

  const availableSlots = [
    "08:30", "10:00", "11:30", "13:00", "14:30", "16:00"
  ];

  return (
    <div className="w-full bg-stone-custom-100 rounded-3xl border border-stone-custom-200 p-6 md:p-10 shadow-xs max-w-7xl mx-auto" id="booking-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Coordinates & Calendar Policy */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#b57a55] bg-orange-100 px-3 py-1 rounded-full inline-block">
              Planification Clinique
            </span>
            <h2 className="serif-title text-3xl font-extrabold text-stone-custom-900 leading-tight">
              Prendre Rendez-vous
            </h2>
          </div>

          <p className="text-sm text-stone-custom-850 leading-relaxed">
            Remplissez notre formulaire sécurisé s'entendant sous le secret professionnel strict. Vous pouvez choisir de consulter directement dans l'un de nos cabinets de <strong>Goma</strong>, de solliciter une thérapie à domicile, ou de planifier un entretien hautement sécurisé en visioconférence.
          </p>

          <div className="bg-stone-custom-50 rounded-2xl p-5 border border-stone-custom-200 space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-custom-850 block border-b pb-1.5">
              Infos & Horaires de Consultation
            </span>
            
            <div className="flex items-start gap-3">
              <Clock className="w-4.5 h-4.5 text-emerald-custom-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-custom-900 block">Horaires de consultations</span>
                <span className="text-xs text-stone-custom-800">{cepapsyInfo?.workingHours || "Lun-Ven: 08:30 - 17:30 • Sam: 09:00 - 13:00"}</span>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-4.5 h-4.5 text-emerald-custom-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-custom-900 block">Secrétariat Clinique Principal</span>
                <span className="text-xs text-stone-custom-800">{(cepapsyInfo?.locationMain || "Goma, RDC").replace("Bureau Principal : ", "")}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-4.5 h-4.5 text-emerald-custom-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-stone-custom-900 block">WhatsApp direct d'attribution</span>
                <span className="text-xs text-stone-custom-800 font-mono font-medium">{cepapsyInfo?.phoneAppointments || "+243 970 000 000"}</span>
              </div>
            </div>
          </div>

          {/* Past Bookings Summary Panel (Durable local database preview) */}
          {pastBookings.length > 0 && (
            <div className="bg-stone-custom-50 rounded-2xl p-5 border border-stone-custom-200 space-y-3">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-custom-850 flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-emerald-custom-600" />
                  Mes RDV Enregistrés ({pastBookings.length})
                </span>
                <button 
                  onClick={() => {
                    localStorage.removeItem("cepapsy_bookings_db");
                    setPastBookings([]);
                  }}
                  className="text-[10px] text-red-600 hover:underline"
                >
                  Tout effacer
                </button>
              </div>
              <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                {pastBookings.map((bk, i) => (
                  <div key={i} className="bg-stone-custom-100 p-2.5 rounded-lg border border-stone-custom-150 relative text-xs group">
                    <button 
                      onClick={() => deleteHistoryItem(i)}
                      className="absolute top-1.5 right-1.5 text-stone-400 hover:text-red-500 transition-colors"
                      title="Supprimer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <span className="font-bold text-emerald-custom-700 block truncate max-w-[190px]">
                      {bk.category}
                    </span>
                    <div className="flex flex-col text-stone-custom-800 mt-0.5 font-medium">
                      <span>👤 {bk.fullName} • 📍 {bk.mode}</span>
                      <span className="text-[10px] text-stone-500 font-mono mt-0.5">🗓 {bk.dateStr} à {bk.timeStr}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Right Column: Interaction Form or Receipt Block */}
        <div className="lg:col-span-8 bg-stone-custom-50 rounded-3xl p-6 md:p-8 border border-stone-custom-200 shadow-xs relative">
          
          {!isSuccess ? (
            <form onSubmit={handleBookingSubmit} className="space-y-5" id="appointment-form">
              <h3 className="serif-title text-xl md:text-2xl font-bold text-stone-custom-900 border-b border-stone-custom-200 pb-3 mb-2 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-custom-600" />
                Demande de Consultation Psychologique
              </h3>

              {/* Patient Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientName" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Nom et Prénom du patient <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="patientName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: David Mukendi"
                    className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
                <div>
                  <label htmlFor="patientPhone" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    N° Téléphone ou WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="patientPhone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: +243 998 123 456"
                    className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
              </div>

              {/* Email & Counseling Modality */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="patientEmail" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Adresse Email (Optionnelle)
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="patientEmail"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: patient@outlook.com"
                    className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
                <div>
                  <label htmlFor="counselingMode" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Lieu / Canal de consultation souhaité <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="mode"
                    id="counselingMode"
                    value={formData.mode}
                    onChange={handleInputChange}
                    className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-3 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600 h-[46px]"
                  >
                    <option value="présentiel">Présentiel : Au Cabinet clinique (Goma HQ)</option>
                    <option value="domicile">Domicile : Visite à domicile du psychologue</option>
                    <option value="ligne">En Ligne : Teams, Skype, WhatsApp, Meet</option>
                  </select>
                </div>
              </div>

              {/* Selected Clinical Service */}
              <div>
                <label htmlFor="bookingCategory" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                  Soin / Programme sélectionné <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="category"
                    id="bookingCategory"
                    required
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Ex: Psychothérapie Spécialisée (Traumatisme / EMDR)"
                    className="w-full bg-stone-custom-105 rounded-xl border border-emerald-custom-100 focus:border-emerald-custom-650 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none"
                  />
                  {prefilledCategory && (
                    <button
                      type="button"
                      onClick={clearPrefill}
                      className="absolute right-3.5 top-3.5 text-xs text-red-500 font-semibold hover:underline"
                    >
                      Effacer
                    </button>
                  )}
                </div>
                <p className="text-[10px] text-stone-custom-800 leading-relaxed mt-1">
                  💡 Vous pouvez saisir librement le type de trouble ou d'intervention (adulte, couple, enfant, burnout) ou cliquer sur un service plus haut pour l'associer directement.
                </p>
              </div>

              {/* Date & Time Slot Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="bookingDate" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Sélectionner la date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateStr"
                    id="bookingDate"
                    required
                    value={formData.dateStr}
                    onChange={handleInputChange}
                    className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Créneau de consultation préféré <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((slot) => {
                      const isSelected = formData.timeStr === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, timeStr: slot }))}
                          className={`py-2 px-1 text-center text-xs font-mono font-bold rounded-lg border transition-all ${
                            isSelected
                              ? "bg-emerald-custom-600 border-emerald-custom-600 text-stone-custom-50"
                              : "bg-stone-custom-100 border-stone-custom-200 text-stone-custom-850 hover:bg-stone-custom-200"
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Reason description */}
              <div>
                <label htmlFor="motif" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                  Motif de la consultation / Précisions complémentaires <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="motif"
                  id="motif"
                  required
                  rows={3}
                  value={formData.motif}
                  onChange={handleInputChange}
                  placeholder="Ex: Manifestation de troubles anxieux récurrents et de stress post-traumatique suite à un incident critique, doutes sur le deuil..."
                  className="w-full bg-stone-custom-100 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                id="booking-submit-btn"
              >
                <Send className="w-4 h-4" /> Enregistrer ma demande de consultation
              </button>
            </form>
          ) : (
            /* Immersive Ticket receipt Admission */
            <div className="animate-scaleUp text-stone-custom-900" id="booking-success">
              
              <div className="border-4 border-emerald-custom-600 bg-white rounded-3xl p-6 md:p-8 max-w-xl mx-auto shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-custom-600/10 rounded-bl-full"></div>
                
                {/* Header Ticket */}
                <div className="text-center border-b border-dashed border-stone-custom-200 pb-4 mb-4">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-custom-700 font-bold">
                    ACO-RDC • CEPAPSY GOMA
                  </span>
                  <h4 className="serif-title text-xl font-bold text-stone-custom-900 mt-1">
                    Billet d'Admission Thérapeutique
                  </h4>
                  <span className="text-[10px] text-stone-400 font-mono block mt-1">
                    ID-TICKET: BK-{Math.floor(Math.random() * 899990) + 10000}
                  </span>
                </div>

                {/* Patient / Doctor slots details */}
                {lastBooked && (
                  <div className="space-y-3 text-xs md:text-sm">
                    <div className="flex justify-between">
                      <span className="text-stone-custom-800">Nom du Patient :</span>
                      <strong className="text-stone-custom-910">{lastBooked.fullName}</strong>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-stone-custom-800">WhatsApp / Standard :</span>
                      <strong className="text-stone-custom-910 font-mono">{lastBooked.phone}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-stone-custom-800">Canal attribué :</span>
                      <strong className="text-emerald-custom-750 font-bold capitalize">{lastBooked.mode}</strong>
                    </div>

                    <div className="flex justify-between border-t border-stone-custom-100 pt-2">
                      <span className="text-stone-custom-800 font-bold">Type de Soin :</span>
                      <strong className="text-stone-custom-910 text-right font-bold truncate max-w-[200px]" title={lastBooked.category}>
                        {lastBooked.category}
                      </strong>
                    </div>

                    <div className="flex justify-between border-t border-stone-custom-100 pt-2 items-center">
                      <span className="text-stone-custom-800 font-bold">Heure d'entretien :</span>
                      <div className="bg-emerald-custom-100 text-emerald-custom-800 font-bold px-2.5 py-1 rounded-md text-xs font-mono">
                        {lastBooked.dateStr} à {lastBooked.timeStr}
                      </div>
                    </div>

                    {lastBooked.motif && (
                      <div className="bg-stone-custom-100 p-3 rounded-xl border border-stone-custom-150 text-xs mt-3">
                        <span className="block font-bold text-stone-custom-850 mb-1">Motif de consultation :</span>
                        <p className="text-stone-custom-800 leading-relaxed italic">{lastBooked.motif}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Secret of Confidentially footer inside receipt */}
                <div className="mt-6 pt-4 border-t border-dashed border-stone-custom-200 text-center text-[10px] text-stone-custom-800 leading-relaxed">
                  🔒 Secret professionnel absolu • Ce billet d'admission a été synchronisé. Pour confirmer votre rendez-vous, merci de faire un court message WhatsApp contenant l'ID du ticket au coordonnateur d'appui clinique : <strong>{cepapsyInfo?.phoneAppointments || "+243 970 000 000"}</strong>.
                </div>
              </div>

              {/* Instructions on Booking success */}
              <div className="max-w-xl mx-auto mt-6 text-center space-y-4">
                <div className="flex items-center gap-2 justify-center text-xs text-stone-custom-800 font-bold">
                  <CheckSquare className="w-4 h-4 text-emerald-custom-600" />
                  Rendez-vous enregistré avec succès dans votre session !
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="bg-stone-custom-900 text-stone-custom-50 text-xs font-bold py-2.5 px-5 rounded-xl hover:bg-emerald-custom-700 transition-colors"
                    id="ticket-print-button"
                  >
                    Imprimer le Billet
                  </button>
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-emerald-custom-600 text-stone-custom-50 text-xs font-bold py-2.5 px-5 rounded-xl hover:bg-emerald-custom-700 transition-colors"
                    id="ticket-back-button"
                  >
                    Prendre un autre RDV
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
