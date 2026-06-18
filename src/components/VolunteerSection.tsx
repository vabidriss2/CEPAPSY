/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, FileText, Send, UserCheck, MapPin, Award, Check } from "lucide-react";
import { CEPAPSY_INFO } from "../data";

export default function VolunteerSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "Goma",
    specialty: "psychologie_clinique",
    motivation: "",
  });

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvFileName, setCvFileName] = useState<string>("");
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const locations = [
    "Goma", "Mweso", "Walikale", "Masisi", "Bunia", "Beni", 
    "Butembo", "Kisangani", "Kindu", "Bukavu", "Uvira", "Baraka", 
    "Shabunda", "Kalemie", "Lubumbashi", "Lualaba", "Kinshasa", "Kananga", "Mbuji-Mayi"
  ];

  const benefits = [
    "Rencontres, intervisions et partages de connaissances diversifiés.",
    "Participation gratuite aux formations continues, séminaires et colloques cliniques.",
    "Participation directe aux interventions auprès des populations et des institutions partenaires (ONG, prisons, écoles).",
    "Participation active aux réunions de planification stratégique en RDC."
  ];

  // Drag-and-drop mechanics
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf" || file.name.endsWith(".docx") || file.name.endsWith(".doc")) {
        setCvFile(file);
        setCvFileName(file.name);
      } else {
        alert("Veuillez sélectionner uniquement un document PDF ou Word (.doc, .docx).");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setCvFile(file);
      setCvFileName(file.name);
    }
  };

  const selectFileManual = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cvFileName) {
      alert("Veuillez d'abord associer votre Curriculum Vitae (CV) pour finaliser l'étude de dossier.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-stone-custom-50 rounded-3xl border border-stone-custom-200 p-6 md:p-10 shadow-xs" id="volunteer-section">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Offer Details */}
        <div className="lg:col-span-6 space-y-6">
          <span className="text-xs font-bold font-mono text-clay-650 uppercase tracking-widest bg-clay-100 px-3 py-1 rounded-full inline-block">
            Engagement Solidaire & Social
          </span>
          <h2 className="serif-title text-3xl md:text-4xl font-extrabold text-stone-custom-900 leading-tight">
            Appel National de Candidature : Psychologues Bénévoles
          </h2>
          <p className="text-sm md:text-base text-stone-custom-850 leading-relaxed">
            Dans le but d’étendre ses actions de promotion de santé mentale auprès des populations vulnérables, le <strong>CEPAPSY</strong> lance un appel à manifestation d'intérêt à l'intention des psychologues cliniciens et psychologues du travail.
          </p>

          <div className="border border-stone-custom-200 rounded-2xl p-5 bg-stone-custom-100/50 space-y-3">
            <h4 className="font-bold text-stone-custom-900 text-sm tracking-wide uppercase">
              Villes prioritaires pour le déploiement :
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {locations.slice(0, 10).map((city) => (
                <span key={city} className="text-xs font-medium px-2.5 py-1 bg-stone-custom-200/80 rounded-lg text-stone-custom-850 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-custom-700" />
                  {city}
                </span>
              ))}
              <span className="text-xs text-stone-custom-800 font-semibold px-2.5 py-1">
                + {locations.length - 10} autres localités en RDC
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-emerald-custom-750 text-base">
              Avantages à rejoindre notre réseau national de bénévolat :
            </h4>
            <ul className="space-y-3.5">
              {benefits.map((b, i) => (
                <li key={i} className="flex gap-3 items-start text-xs md:text-sm text-stone-custom-800 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-emerald-custom-100 text-emerald-custom-600 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-clay-100 border border-clay-200 rounded-xl p-4 text-xs text-clay-650 leading-relaxed">
            <strong>Profil requis :</strong> Titulaire d'un diplôme de niveau graduat ou licence en psychologie clinique ou du travail • Hautement sensible à la détresse humaine • Engagement de volontariat éthique (aucune contrepartie financière exigée).
          </div>
        </div>

        {/* Right Column: Interaction Form or Success Block */}
        <div className="lg:col-span-6 bg-stone-custom-100 rounded-3xl p-6 md:p-8 border border-stone-custom-200 shadow-sm relative">
          
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5" id="volunteer-form">
              <h3 className="serif-title text-xl md:text-2xl font-bold text-stone-custom-900 border-b border-stone-custom-200 pb-3 mb-2 flex items-center gap-2">
                <UserCheck className="w-6 h-6 text-emerald-custom-600" />
                Soumettre ma demande
              </h3>

              {/* Name */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Prénom et Nom complet <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Ex: Jonathan Bafurha"
                    className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 placeholder-stone-400 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Email de contact <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="adresse@mail.com"
                    className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    N° Téléphone / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Ex: +243 971 234 567"
                    className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                  />
                </div>
              </div>

              {/* Location & Specialty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="location" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Lieu de résidence <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="location"
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-3 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600 h-[46px]"
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc} (RDC)
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="specialty" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                    Spécialisation d'exercice <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="specialty"
                    id="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-3 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600 h-[46px]"
                  >
                    <option value="psychologie_clinique">Psychologie Clinique</option>
                    <option value="psychologie_scolaire">Psychologie Scolaire / Education</option>
                    <option value="psychologie_travail">Psychologie Industrielle & du Travail</option>
                    <option value="therapeute">Psychothérapeute spécialisé</option>
                    <option value="assistant_social">Assistance Psychosociale / Mediateure</option>
                  </select>
                </div>
              </div>

              {/* Motivations */}
              <div>
                <label htmlFor="motivation" className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                  Motifs & Résumé d'engagement <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="motivation"
                  id="motivation"
                  required
                  rows={3}
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder="Décrivez brièvement vos motivations humanitaires et votre disponibilité..."
                  className="w-full bg-stone-custom-50 rounded-xl border border-stone-custom-200 py-3 px-4 text-sm text-stone-custom-900 focus:outline-none focus:border-emerald-custom-600"
                ></textarea>
              </div>

              {/* Drag and Drop File Input Area */}
              <div>
                <span className="block text-xs font-bold text-stone-custom-800 uppercase mb-1.5">
                  Joindre votre CV (PDF/DOCX) <span className="text-red-500">*</span>
                </span>
                
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`w-full rounded-2xl border-2 border-dashed py-6 px-4 text-center cursor-pointer transition-all duration-150 ${
                    dragOver
                      ? "bg-emerald-custom-50 border-emerald-custom-600"
                      : "bg-stone-custom-50 border-stone-custom-200 hover:border-emerald-custom-400"
                  }`}
                  onClick={selectFileManual}
                  id="cv-upload-region"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                  />
                  {cvFileName ? (
                    <div className="flex flex-col items-center gap-1 text-emerald-custom-700 animate-fadeIn bg-emerald-custom-50 max-w-sm mx-auto p-2 rounded-xl border border-emerald-custom-100">
                      <FileText className="w-10 h-10 text-emerald-custom-600" />
                      <span className="text-xs font-bold truncate max-w-[240px] block mt-1">
                        {cvFileName}
                      </span>
                      <span className="text-[10px] text-stone-custom-800 flex items-center gap-1 font-semibold">
                        <Check className="w-3.5 h-3.5 text-emerald-custom-600" />
                        Prêt à soumettre! Cliquez sur Modifier pour réajuster
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <UploadCloud className="w-10 h-10 text-stone-custom-805 mb-2" />
                      <p className="text-xs font-bold text-stone-custom-900 block">
                        Glissez-déposez votre CV ici, ou <span className="text-emerald-custom-600 underline">parcourez votre disque</span>
                      </p>
                      <span className="text-[10px] text-stone-custom-800 mt-1">
                        Formats acceptés : PDF, Word (.docx, .doc) — Max. 5 Mo
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer uppercase text-xs tracking-wider"
                id="volunteer-submit-btn"
              >
                <Send className="w-4 h-4" /> Envoyer ma candidature bénévole
              </button>
            </form>
          ) : (
            /* Success confirmation screen Signed by General Secretary J. Bafurha */
            <div className="text-center py-6 md:py-10 animate-scaleUp text-stone-custom-900" id="volunteer-success">
              <div className="w-20 h-20 rounded-full bg-emerald-custom-100 text-emerald-custom-600 flex items-center justify-center mx-auto mb-6 border border-emerald-custom-200">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <span className="text-[10px] bg-emerald-custom-150 text-emerald-custom-700 px-3 py-1 rounded font-mono font-bold tracking-widest uppercase mb-4 inline-block">
                Demande Enregistrée • Ref-ACO-RDC-{Math.floor(Math.random() * 8999) + 1000}
              </span>

              <h3 className="serif-title text-2xl font-bold tracking-tight text-emerald-custom-750 mb-3">
                Merci {formData.fullName} pour votre noble engagement !
              </h3>
              
              <p className="text-sm text-stone-custom-850 leading-relaxed max-w-md mx-auto mb-6">
                Votre dossier de candidature a été instruit auprès de la cellule nationale de coordination du <strong>CEPAPSY</strong>. Notre Secrétariat d'évaluation académique examinera vos diplômes sous 5 jours ouvrés.
              </p>

              <div className="bg-stone-custom-50 border border-stone-custom-200 rounded-2xl px-5 py-5 text-left max-w-md mx-auto space-y-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-custom-800 block text-center border-b pb-1.5">
                  Prochaines Étapes :
                </span>
                <div className="space-y-2 text-xs text-stone-custom-850">
                  <p><strong>1. Réunion de mise au point :</strong> Un appel d'intervision de 15 min sera fixé via Teams ou Skype, pour convenir des modalités de fonctionnement.</p>
                  <p className="mt-1"><strong>2. Confirmation :</strong> Envoi de votre charte d'éthique clinique du volontariat.</p>
                  <p className="mt-1"><strong>3. Contact :</strong> Vous serez contacté directement au <span className="font-mono text-emerald-custom-700 font-bold">{formData.phone}</span> ou par mail à <span className="font-mono text-emerald-custom-700 font-bold">{formData.email}</span>.</p>
                </div>
              </div>

              <div className="border-t border-stone-custom-200 pt-6 max-w-md mx-auto text-left">
                <span className="text-[10px] uppercase font-mono tracking-widest text-stone-custom-800 block mb-1">Signé et d'autorité,</span>
                <p className="text-sm font-bold text-stone-custom-900">AMANI BAFURHA Jonathan</p>
                <p className="text-xs text-stone-custom-800">Secrétaire Exécutif National, CEPAPSY • ACO-RDC</p>
              </div>

              <button
                onClick={() => {
                  setCvFile(null);
                  setCvFileName("");
                  setIsSubmitted(false);
                  setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    location: "Goma",
                    specialty: "psychologie_clinique",
                    motivation: "",
                  });
                }}
                className="mt-8 text-xs font-semibold text-emerald-custom-600 hover:text-emerald-custom-750 transition-colors bg-white hover:bg-stone-custom-50 border border-stone-custom-200 rounded-xl py-2 px-5 shadow-xs cursor-pointer"
                id="volunteer-new-btn"
              >
                Soumettre une autre demande
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
