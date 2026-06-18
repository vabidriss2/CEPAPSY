/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CEPAPSY_INFO, TEAM_MEMBERS } from "../data";
import { CheckCircle2, HeartHandshake, Award, Quote, Users, MapPin, Eye, Compass } from "lucide-react";

export default function AboutSection() {
  return (
    <div className="w-full bg-stone-custom-100 rounded-3xl border border-stone-custom-200 p-6 md:p-10 shadow-xs space-y-12" id="about-section">
      
      {/* Overview Intro */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto">
        <div className="lg:col-span-7 space-y-6">
          <span className="text-xs font-bold font-mono text-emerald-custom-700 uppercase tracking-widest bg-emerald-custom-100 px-3 py-1 rounded-full inline-block">
            À Propos de l'Institution
          </span>
          <h2 className="serif-title text-3xl md:text-5xl font-extrabold text-stone-custom-900 leading-tight">
            Une approche pluridisciplinaire de la santé mentale engagée à Goma
          </h2>
          <p className="text-sm md:text-base text-stone-custom-850 leading-relaxed">
            Le <strong>Centre d’Écoute et d’Accompagnement Psychologique (CEPAPSY)</strong> est un cabinet spécialisé rattaché à l’organisation nationale <strong>ACTION COMMUNE (ACO-RDC)</strong>, une association congolaise sans but lucratif, laïque et apolitique, basée à Goma, au Nord-Kivu, en République Démocratique du Congo.
          </p>
          <p className="text-sm md:text-base text-stone-custom-850 leading-relaxed">
            Notre cabinet se distingue par son approche centrée sur l'écoute active, les demandes personnalisées, et s’appuie sur une équipe multidisciplinaire dynamique d’experts dédiée à promouvoir la résilience communautaire.
          </p>
          
          <div className="bg-stone-custom-50 rounded-2xl p-5 border border-stone-custom-200 flex items-start gap-4">
            <Quote className="w-8 h-8 text-clay-600 shrink-0 mt-1" />
            <div>
              <p className="text-sm text-stone-custom-900 italic font-medium leading-relaxed">
                "Nous œuvrons sans relâche pour la promotion de la santé mentale et du bien-être psychologique en offrant des consultations cliniques, des cercles d'interventions de crise et des formations à la pointe au bénéfice des individus, des familles et des organisations."
              </p>
              <span className="text-xs font-bold font-mono block text-emerald-custom-750 uppercase mt-2">
                — Secrétaire Exécutif, AMANI BAFURHA Jonathan
              </span>
            </div>
          </div>
        </div>

        {/* Visual Badge Display (Instead of mock imagery, elegant design banners) */}
        <div className="lg:col-span-5 bg-emerald-custom-700 text-stone-custom-50 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full shadow-lg relative overflow-hidden min-h-[350px]">
          <div className="absolute top-0 right-0 w-44 h-44 rounded-full bg-emerald-custom-600/50 -mr-16 -mt-16"></div>
          
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 border border-white/20">
              <Award className="w-6 h-6 text-clay-100" />
            </div>
            <h3 className="serif-title text-2xl font-bold leading-tight">Notre Champ d'Action</h3>
            <p className="text-xs text-stone-100 mt-2 leading-relaxed opacity-90">
              Une rigueur académique et professionnelle combinée au pragmatisme humanitaire sur le terrain.
            </p>
          </div>

          <div className="space-y-4 pt-6 mt-6 border-t border-emerald-custom-600/80 relative">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold serif-title text-clay-100">01</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block leading-none">RECHERCHE</span>
                <span className="text-[11px] text-stone-200 mt-1 block">Études cliniques sur le stress post-traumatique.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold serif-title text-clay-100">02</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block leading-none">FORMATION</span>
                <span className="text-[11px] text-stone-200 mt-1 block">Ateliers et supervisions pour praticiens de santé.</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold serif-title text-clay-100">03</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block leading-none">INTERVENTION</span>
                <span className="text-[11px] text-stone-200 mt-1 block">Soutien clinique direct et cellule mobile de crise.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
        <div className="bg-stone-custom-50 rounded-2xl p-6 md:p-8 border border-stone-custom-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-clay-100 rounded-xl text-clay-605">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="serif-title text-xl font-bold text-stone-custom-900">La Vision du CEPAPSY</h3>
          </div>
          <p className="text-sm text-stone-custom-850 leading-relaxed mb-4">
            Nous poursuivons des jalons cruciaux de pacification psychologique :
          </p>
          <ul className="space-y-3">
            {CEPAPSY_INFO.visions.map((v, i) => (
              <li key={i} className="flex gap-2.5 items-start text-xs md:text-sm text-stone-custom-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                <span>{v}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-stone-custom-50 rounded-2xl p-6 md:p-8 border border-stone-custom-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-custom-100 rounded-xl text-emerald-custom-605">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="serif-title text-xl font-bold text-stone-custom-900">Notre Mission</h3>
            </div>
            <p className="text-sm md:text-base text-stone-custom-850 leading-relaxed italic">
              « {CEPAPSY_INFO.mission} »
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-stone-custom-200 text-xs text-stone-custom-800">
            <strong>Siège Social :</strong> Goma, Commune de Karisimbi, République Démocratique du Congo.
          </div>
        </div>
      </div>

      {/* Directors Principles */}
      <div className="max-w-7xl mx-auto space-y-6">
        <h3 className="serif-title text-2xl font-bold text-stone-custom-900 text-center">Nos Principes Directeurs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CEPAPSY_INFO.principles.map((p, idx) => (
            <div key={idx} className="bg-stone-custom-50 rounded-2xl p-5 border border-stone-custom-200/85 hover:border-emerald-custom-200 hover:shadow-2xs transition-all text-center flex flex-col justify-center">
              <span className="serif-title text-lg font-bold text-clay-600 mb-1">{idx+1}. {p.title}</span>
              <p className="text-xs text-stone-custom-800 mt-1 font-medium">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Grid */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-stone-custom-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-custom-700">Collaborateurs experts</span>
            <h3 className="serif-title text-2.5xl md:text-3xl font-bold text-stone-custom-900">
              Une Équipe Multidisciplinaire à votre écoute
            </h3>
          </div>
          <span className="text-xs md:text-sm text-stone-custom-800 max-w-sm italic">
            Réunissant des professionnels de santé qualifiés, sensibilisés aux réalités locales et aux protocoles humanitaires globaux.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((tm, idx) => (
            <div key={idx} className="bg-stone-custom-50 rounded-2xl p-5 border border-stone-custom-200/90 hover:border-emerald-custom-300 hover:shadow-xs transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-full bg-emerald-custom-100 flex items-center justify-center text-emerald-custom-700 font-bold mb-4 font-mono">
                  0{idx+1}
                </div>
                <h4 className="font-bold text-stone-custom-910 leading-snug text-base md:text-lg">
                  {tm.name}
                </h4>
                <p className="text-xs font-bold text-clay-600 tracking-wider uppercase mt-1">
                  {tm.role}
                </p>
                <p className="text-xs md:text-sm text-stone-custom-800 mt-2.5 leading-relaxed">
                  {tm.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
