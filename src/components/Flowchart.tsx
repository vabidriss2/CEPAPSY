/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, RefreshCw, Layers, CalendarRange, Sparkles, AlertCircle, Users, ClipboardCheck, ArrowUpRight } from "lucide-react";
import { INTAKE_FLOWCHART } from "../data";
import { FlowchartNode } from "../types";

interface FlowchartProps {
  onSelectBooking: (serviceName: string) => void;
  onSelectVolunteer: () => void;
}

export default function Flowchart({ onSelectBooking, onSelectVolunteer }: FlowchartProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");

  const currentNode = INTAKE_FLOWCHART.find((n) => n.id === currentNodeId) || INTAKE_FLOWCHART[0];

  const handleOptionSelect = (nextNodeId?: string, result?: any) => {
    if (nextNodeId) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(nextNodeId);
    } else if (result) {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(`result:${result.ctaAction}`);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(prev);
    }
  };

  const resetFlowchart = () => {
    setHistory([]);
    setCurrentNodeId("start");
  };

  // Determine if we are on a result node
  const isResultNode = currentNodeId.startsWith("result:");
  let resultData: any = null;

  if (isResultNode) {
    const actionKey = currentNodeId.replace("result:", "");
    // Scan all options in flowchart to recover our exact result object
    for (const node of INTAKE_FLOWCHART) {
      for (const opt of node.options) {
        if (opt.result && opt.result.ctaAction === actionKey) {
          resultData = opt.result;
          break;
        }
      }
      if (resultData) break;
    }
  }

  // Handle CTA actions from results
  const handleCta = (action: string) => {
    if (action === "volunteer") {
      onSelectVolunteer();
    } else if (action.startsWith("book:")) {
      const serviceName = action.replace("book:", "");
      onSelectBooking(serviceName);
    }
  };

  return (
    <div className="w-full bg-stone-custom-100 rounded-2xl sm:rounded-3xl border border-stone-custom-200 p-4 sm:p-6 md:p-10 shadow-sm relative overflow-hidden" id="flowchart-section">
      {/* Background soft ambient vectors */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-emerald-custom-100/30 blur-3xl -mr-20 -mt-20 -z-10"></div>
      
      {/* Container header for Clinical Matcher */}
      <div className="max-w-3xl mx-auto mb-8 text-center">
        <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold tracking-widest text-emerald-custom-700 uppercase bg-emerald-custom-100 px-3 py-1 rounded-full mb-3">
          <Layers className="w-3.5 h-3.5" />
          Orientation Thérapeutique Interactive
        </span>
        <h2 className="serif-title text-2xl sm:text-3xl md:text-4xl font-extrabold text-stone-custom-900 tracking-tight leading-tight">
          Trouvez l'aide adaptée à vos besoins
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-stone-custom-800 mt-2 max-w-xl mx-auto">
          Inspiré du portail d'orientation clinique, ce guiding interactif vous aiguille vers le service, le spécialiste et l'approche thérapeutique les plus adaptés à votre profil.
        </p>
      </div>

      <div className="max-w-2xl mx-auto bg-stone-custom-50 rounded-2xl border border-stone-custom-200/80 p-4 sm:p-6 md:p-8 shadow-xs relative">
        <AnimatePresence mode="wait">
          {!isResultNode ? (
            <motion.div
              key={currentNodeId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col h-full justify-between"
              id={`node-container-${currentNodeId}`}
            >
              <div>
                {/* Navigation and state header */}
                <div className="flex items-center justify-between gap-2 mb-6">
                  {history.length > 0 ? (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-custom-600 hover:text-emerald-custom-700 transition-colors"
                      id="flowchart-back-btn"
                    >
                      <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                  ) : (
                    <span className="text-xs font-mono font-medium text-stone-custom-800">Étape d'entrée</span>
                  )}
                  
                  <span className="text-xs bg-stone-custom-100 border border-stone-custom-200 px-2.5 py-1 rounded-md text-stone-custom-800 font-medium">
                    {history.length + 1} Question{history.length > 0 ? "s" : ""}
                  </span>
                </div>

                {/* Question */}
                <h3 className="serif-title text-xl md:text-2xl font-bold text-stone-custom-900 leading-snug mb-6">
                  {currentNode.question}
                </h3>

                {/* Options list */}
                <div className="space-y-3.5">
                  {currentNode.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(opt.nextNodeId, opt.result)}
                      className="w-full text-left p-4 rounded-xl border border-stone-custom-200 hover:border-emerald-custom-600 hover:bg-emerald-custom-50/40 focus:bg-emerald-custom-50/50 group transition-all duration-200 flex justify-between items-start gap-4"
                      id={`option-${currentNodeId}-${idx}`}
                    >
                      <div className="flex-1">
                        <span className="font-bold text-stone-custom-900 text-sm group-hover:text-emerald-custom-700 transition-colors block">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <p className="text-xs text-stone-custom-800 mt-1 leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                      </div>
                      <span className="w-6 h-6 rounded-full bg-stone-custom-100 flex items-center justify-center border border-stone-custom-200 text-stone-custom-800 text-xs font-bold group-hover:bg-emerald-custom-600 group-hover:text-white group-hover:border-emerald-custom-600 transition-colors shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Restart anchor */}
              {history.length > 0 && (
                <div className="mt-6 pt-4 border-t border-stone-custom-150 flex justify-end">
                  <button
                    onClick={resetFlowchart}
                    className="flex items-center gap-1.5 text-xs text-stone-custom-800 hover:text-emerald-custom-600 transition-colors"
                    id="flowchart-reset-shortcut"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Recommencer à zéro
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            /* Results Screen */
            <motion.div
              key="result-display"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="text-stone-custom-900"
              id="flowchart-result-container"
            >
              {resultData ? (
                <div>
                  {/* Results header */}
                  <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-custom-200">
                    <span className="text-xs font-mono font-bold tracking-wider text-clay-600 uppercase bg-clay-100 px-2.5 py-1 rounded">
                      ✔ Solution Recommandée
                    </span>
                    <button
                      onClick={resetFlowchart}
                      className="flex items-center gap-1 text-xs font-semibold text-emerald-custom-600 hover:text-emerald-custom-700 transition-colors"
                      id="result-reset-btn"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Refaire le test
                    </button>
                  </div>

                  {/* Program title */}
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-emerald-custom-600 flex items-center justify-center text-white mt-1 shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="serif-title text-xl md:text-2xl font-bold tracking-tight text-emerald-custom-750">
                        {resultData.title}
                      </h3>
                      <p className="text-xs text-stone-custom-800 mt-1 font-medium leading-relaxed">
                        {resultData.reason}
                      </p>
                    </div>
                  </div>

                  {/* Highlights checklist */}
                  <div className="mb-6 bg-emerald-custom-50/60 rounded-xl px-5 py-4 border border-emerald-custom-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-custom-700 block mb-2.5">
                      Secteurs clés et services conseillés :
                    </span>
                    <ul className="space-y-2">
                      {resultData.services.map((serv: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-stone-custom-800">
                          <ClipboardCheck className="w-4 h-4 text-emerald-custom-600 mt-0.5 shrink-0" />
                          <span>{serv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Modality recommendations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    <div className="bg-stone-custom-100 rounded-xl p-3.5 border border-stone-custom-150">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-custom-800 block mb-1">
                        Format d'intervention optimal
                      </span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {resultData.suitableMode.map((mode: string, i: number) => (
                          <span key={i} className="text-xs bg-stone-custom-50 border border-stone-custom-200 px-2 py-0.5 rounded text-stone-custom-850 font-medium">
                            {mode}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="bg-stone-custom-100 rounded-xl p-3.5 border border-stone-custom-150 flex items-center gap-3">
                      <Users className="w-8 h-8 text-emerald-custom-600 shrink-0" />
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-stone-custom-800 block">
                          Équipe d'attribution
                        </span>
                        <span className="text-xs font-semibold text-stone-custom-905 block mt-0.5">
                          Clinique pluridisciplinaire CEPAPSY
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* CTA matching */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => handleCta(resultData.ctaAction)}
                      className="flex-1 bg-emerald-custom-600 hover:bg-emerald-custom-700 text-stone-custom-50 font-bold py-3.5 px-6 rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                      id="result-cta-primary"
                    >
                      <CalendarRange className="w-4.5 h-4.5" />
                      {resultData.ctaLabel}
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={resetFlowchart}
                      className="bg-stone-custom-100 hover:bg-stone-custom-200 text-stone-custom-800 font-bold py-3.5 px-5 rounded-xl border border-stone-custom-200 transition-all flex items-center justify-center gap-1.5 text-xs"
                      id="result-cta-secondary"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Choisir une autre situation
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <AlertCircle className="w-10 h-10 text-emerald-custom-600 mx-auto" />
                  <p className="text-sm mt-2 text-stone-custom-800">Aucun résultat trouvé pour votre sélection.</p>
                  <button onClick={resetFlowchart} className="mt-4 bg-emerald-custom-600 text-white rounded px-4 py-2 text-xs">
                    Recommencer
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating alert of privacy */}
      <p className="text-center text-[10px] text-stone-custom-800 leading-relaxed mt-6 max-w-md mx-auto italic">
        🔒 Confidentialité garantie • Les réponses à ce questionnaire ne sont partagées avec aucune entité tierce et servent uniquement à ajuster d'éventuels rendez-vous.
      </p>
    </div>
  );
}
