/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem, TeamMember, FlowchartNode } from "./types";

export const CEPAPSY_INFO = {
  name: "CEPAPSY",
  fullName: "Centre d'Écoute et d'Accompagnement Psychologique",
  tagline: "Recherche, Formation et Intervention en Santé Mentale",
  parentOrg: "ACTION COMMUNE / ACO-RDC (Association sans but lucratif, laïque et apolitique)",
  locationMain: "Bureau Principal : Goma, Comm. Karisimbi, Q. Mabanga Nord, Av. Osso2, No. 222",
  locationSecondary: "Bureau Kasika : Goma, Comm. Karisimbi, Q. Kasika, Av. Lwama, Nord-Kivu, RDC",
  email: "cepapsycontact@gmail.com",
  emailSecondary: "rdr.actioncommune@gmail.com",
  phoneAppointments: "+243 97 80 56 228",
  phoneAlt1: "+243 97 67 19 697",
  phoneAlt2: "+243 89 82 13 498",
  phoneAlt3: "+243 81 16 80 467",
  workingHours: "Lundi à Vendredi : 08h00 - 17h00",
  modesOfWork: [
    { name: "Présentiel", detail: "En cabinet ou déplacement à domicile sur demande." },
    { name: "En Ligne", detail: "Via Teams, Skype, Google Meet, WhatsApp ou appel classique." },
    { name: "Déplacement institutionnel", detail: "Interventions directes auprès des ONG, prisons, écoles et entreprises." }
  ],
  visions: [
    "Déstigmatiser les problématiques liées à la santé mentale et au soutien psychosocial.",
    "Offrir un soutien psychosocial professionnel accessible à tout le monde sans distinction.",
    "Mettre le bien-être émotionnel et psychologique au centre du développement humain et organisationnel."
  ],
  mission: "Contribuer à l'amélioration durable de la santé mentale et du bien-être psychosocial en proposant des services professionnels, hautement accessibles et rigoureusement adaptés aux besoins des personnes et des institutions.",
  principles: [
    { title: "Confidentialité et discrétion", desc: "Le secret professionnel absolu encadre chacune de nos actions cliniques ou de soutien." },
    { title: "Professionnalisme et efficacité", desc: "Une alliance d'expertises prouvées et de méthodes validées scientifiquement." },
    { title: "Inclusion et diversité", desc: "Un accueil inconditionnel, respectueux de l'humanité et de la dignité de chacun." },
    { title: "Bien-être émotionnel", desc: "Reconnaître les émotions comme des leviers de croissance personnelle et collective." },
    { title: "Approche holistique", desc: "Considérer chaque individu dans sa globalité physique, psychologique et sociale." }
  ]
};

export const SERVICES_LIST: ServiceItem[] = [
  {
    id: "eval-enfant-ado",
    title: "Évaluation & Psychothérapie Enfant-Adolescent",
    description: "Accompagnement ciblé des plus jeunes confrontés à des deuils, difficultés scolaires, d'adaptation ou de comportement.",
    details: [
      "Prise en charge du deuil et des ruptures familiales",
      "Soutien face aux difficultés affectives, relationnelles et scolaires",
      "Gestion des émotions et de l'impulsivité",
      "Exposition aux évènements traumatiques (ESPT)",
      "Troubles du Spectre de l'Autisme (TSA)",
      "Trouble du Déficit de l'Attention avec/sans Hyperactivité (TDAH)",
      "Addictions aux écrans, jeux ou substances",
      "Trouble de l'attachement"
    ],
    category: "child",
    iconName: "Baby"
  },
  {
    id: "eval-adulte",
    title: "Psychothérapie & Interventions pour Adultes",
    description: "Consultations cliniques basées sur des approches éprouvées pour traverser les périodes de crise personelle, de maladie ou de troubles de l'humeur.",
    details: [
      "Gestion de la dépression et des troubles de l'humeur",
      "Prise en charge des troubles anxieux et phobies",
      "Symptômes de stress post-traumatique (ESPT)",
      "Accompagnement du deuil pathologique et maladies chroniques",
      "Faible estime de soi et doutes existentiels",
      "Traitements des addictions (alcool, jeux, tabac, drogues) et sevrage",
      "Troubles psychotiques et de la personnalité (TPL)"
    ],
    category: "adult",
    iconName: "User"
  },
  {
    id: "couple-famille",
    title: "Soutien Conjugal & Familial",
    description: "Médiation et thérapies orientées pour restaurer la communication au sein des couples et des constellations familiales.",
    details: [
      "Résolution de conflits, séparation, divorce et infidélité",
      "Enjeux de périnatalité et accompagnement à la parentalité",
      "Coaching conjugal, familial et réorganisation de familles recomposées",
      "Renforcement des liens d'attachement parents-enfants"
    ],
    category: "specialty",
    iconName: "Heart"
  },
  {
    id: "corporates-ong",
    title: "Services Spécifiques pour ONG & Entreprises",
    description: "Analyse, prévention et intervention en milieu de travail pour lutter contre l'épuisement professionnel ou réagir après un évènement critique.",
    details: [
      "Analyse des sources de stress et diagnostics des risques psychosociaux (RPS)",
      "Ateliers de régulation du stress et prévention du burnout",
      "Activités de renforcement d'équipe (Team Building) et retraites",
      "Interventions de débriefing psychologique et premier secours post-incident",
      "Supervision clinique, mentoring et coaching de managers"
    ],
    category: "corporate",
    iconName: "Building"
  },
  {
    id: "expertises-supervision",
    title: "Expertise, Clinique Légale & Supervisions",
    description: "Programmes avancés d'appui professionnel, supervisions de pratique, et expertises psychologiques ciblées.",
    details: [
      "Psychocriminologie et psychotraumatologie",
      "Supervision clinique contre la fatigue compassionnelle et les traumatismes secondaires",
      "Orientation scolaire et professionnelle personnalisée",
      "Médiation sociale et transformation des conflits communautaires"
    ],
    category: "specialty",
    iconName: "ShieldAlert"
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: "Psychologues Cliniciens & Psychiatres",
    role: "Direction Thérapeutique",
    description: "Spécialistes de la santé mentale assurant les évaluations diagnostiques approfondies, les thérapies individuelles, et les protocoles spécialisés (TCC, EMDR, NET)."
  },
  {
    name: "Psychologues Scolaires & du Travail",
    role: "Orientation et Organisation",
    description: "Experts de l'accompagnement des élèves en difficulté, des diagnostics industriels, de la prévention de l'épuisement et de la gestion de crise en entreprise."
  },
  {
    name: "Assistants Psychosociaux & Médiateurs",
    role: "Action Communautaire",
    description: "Professionnels de terrain assurant les sensibilisations, les visites à domicile, l'accompagnement des enfants en rupture et la médiation de conflits."
  },
  {
    name: "Juristes, Avocats & Conseillers",
    role: "Support Institutionnel",
    description: "Conseils et protection juridique pour les enfants en conflit avec la loi, les personnes vulnérables et l'appui aux actions de réhabilitation."
  }
];

// Interactive Flowchart Data representing the Therapist Finder Questionnaire (similar to lecapsp.ca)
export const INTAKE_FLOWCHART: FlowchartNode[] = [
  {
    id: "start",
    question: "Qui recherche de l'aide aujourd'hui ?",
    options: [
      {
        label: "Moi-même (Adulte)",
        description: "Difficultés personnelles, anxiété, détresse émotionnelle, deuil, dépendances ou conflits.",
        nextNodeId: "adult_need"
      },
      {
        label: "Mon enfant ou adolescent",
        description: "Gestion des émotions, TDAH, TSA, difficultés relationnelles scolaires ou traumatismes.",
        nextNodeId: "child_need"
      },
      {
        label: "Notre Couple ou Famille",
        description: "Séparation, périnatalité, dynamique familiale difficile, deuil partagé ou infidélité.",
        result: {
          title: "Soutien Conjugal & Familial d'Urgence ou Suivi",
          reason: "Le CEPAPSY offre des séances de thérapie systémique de couple ou de famille, axées sur la communication, le rétablissement de la confiance et les enjeux parentaux.",
          services: ["Coaching conjugal et familial", "Médiation et transformation de conflits", "Soutien à la parentalité"],
          suitableMode: ["Présentiel au cabinet", "En ligne (Google Meet / Teams)"],
          ctaLabel: "Prendre RDV Famille",
          ctaAction: "book:Couple & Famille"
        }
      },
      {
        label: "Une Entreprise / ONG ou Institution",
        description: "Prévention du burnout, bilans psychosociaux, team building ou débriefing d'urgence.",
        nextNodeId: "corp_need"
      },
      {
        label: "Je souhaite m'engager comme Bénévole",
        description: "Campagne de recrutement national du CEPAPSY pour psychologues cliniciens titulaires d'un diplôme.",
        result: {
          title: "Réseau National des Psychologues Bénévoles",
          reason: "Le CEPAPSY recrute des psychologues à Goma, Mweso, Masisi, Kinshasa et partout en RDC pour étendre son impact de santé mentale communautaire.",
          services: ["Rencontres de partage et colloques", "Formations professionnelles gratuites", "Interventions solidaires en santé mentale"],
          suitableMode: ["Terrain (Présentiel)", "Formations à distance"],
          ctaLabel: "Postuler en Ligne",
          ctaAction: "volunteer"
        }
      }
    ]
  },
  {
    id: "adult_need",
    question: "Quelle est la nature principale de votre préoccupation ?",
    options: [
      {
        label: "Stress intense, anxiété ou déprime",
        description: "Sentiment de surmenage, insomnies, peurs inexpliquées ou tristesse persistante.",
        result: {
          title: "Soutien Psychologique - Troubles Cliniques de l'Adulte",
          reason: "Nos thérapeutes proposent des thérapies cognitives et comportementales (TCC) adaptées à l'anxiété, aux phobies et aux troubles dépressifs.",
          services: ["Psychothérapie individuelle", "Prise en charge de l'anxiété et de la dépression", "Soutien à l'estime de soi"],
          suitableMode: ["Présentiel au cabinet", "Soutien en ligne", "À domicile (sur demande)"],
          ctaLabel: "Consulter pour anxiété/dépression",
          ctaAction: "book:Adulte (Anxiété & Humeur)"
        }
      },
      {
        label: "Traumatisme, incident ou deuil douloureux",
        description: "Confrontation à un événement violent, crise personnelle ou deuil pathologique prolongé.",
        result: {
          title: "Psychotraumatologie Spécialisée (Thérapie EMDR / NET / TCC)",
          reason: "Le CEPAPSY est expert en psychotraumatologie clinique en RDC, offrant des premiers secours psychologiques, et des thérapies par désensibilisation (EMDR, NET).",
          services: ["Prise en charge de l'ESPT (Stress Post-Traumatique)", "Soutien du deuil complexe", "Débriefing clinique individuel"],
          suitableMode: ["Présentiel prioritaire", "Soutien à distance"],
          ctaLabel: "Consulter un Psychologue Spécialiste",
          ctaAction: "book:Adulte (Trauma/ESPT)"
        }
      },
      {
        label: "Addictions ou dépendances",
        description: "Alcool, drogues, jeux d'argent, écrans, tabac, et besoin d'entamer un sevrage sécuritaire.",
        result: {
          title: "Soin des Addictions & Accompagnement au Sevrage",
          reason: "Notre protocole d'addictologie allie soutien motivationnel, psychoéducation, et restructuration des habitudes de vie en cabinet ou à distance.",
          services: ["Prise en charge des addictions", "Soutien à l'abstinence et au sevrage", "Sessions d'interviews motivationnelles"],
          suitableMode: ["Cabinet", "Dépistage et suivi"],
          ctaLabel: "Prendre RDV Addictions",
          ctaAction: "book:Adulte (Addictions)"
        }
      },
      {
        label: "Autre situation de vulnérabilité",
        description: "Maladie chronique (VIH, cancer, diabète) ou besoin d'orientation de vie/carrière.",
        result: {
          title: "Soin Holistique Personnalisé & Orientation",
          reason: "Un accompagnement multidisciplinaire intégrant le conseil d'orientation professionnelle ou le soutien face aux maladies chroniques pour restaurer la résilience.",
          services: ["Accompagnement maladies chroniques", "Orientation scolaire et professionnelle", "Coaching de vie"],
          suitableMode: ["Cabinet", "En ligne"],
          ctaLabel: "Demander Conseil",
          ctaAction: "book:Adulte (Orientation/Aide)"
        }
      }
    ]
  },
  {
    id: "child_need",
    question: "De quoi souffre principalement l'enfant ou adolescent ?",
    options: [
      {
        label: "Difficultés à l'école, concentration ou agitation",
        description: "Soupçon de TDAH, agitation motrice, impulsivité ou baisse brutale de notes scolaires.",
        result: {
          title: "Évaluation Scolaire & Gestion du TDAH (Enfant/Ado)",
          reason: "Une prise en charge globale combinant bilan psychoéducatif, conseils méthodologiques aux parents et techniques cognitives pour canaliser l'attention.",
          services: ["Gestion du TDAH et de l'impulsivité", "Conseils d'orientation et de comportement", "Bilan psychologique"],
          suitableMode: ["Présentiel (Bilan obligatoire au cabinet)"],
          ctaLabel: "Planifier un Bilan Enfant",
          ctaAction: "book:Enfant TDAH/Scolaire"
        }
      },
      {
        label: "Troubles du comportement, retrait social ou angoisses",
        description: "Retrait, crises de larmes, mutisme sélectif, peurs de la séparation, colère, troubles du sommeil.",
        result: {
          title: "Soutien Émotionnel et Psychothérapie Infanto-Juvénile",
          reason: "Par le jeu, le dessin et des outils d'expression, nous aidons l'enfant à externaliser ses blocages et reconstruire son sentiment de sécurité.",
          services: ["Difficultés affectives et relationnelles", "Troubles et symptômes anxieux", "Accompagnement de l'attachement"],
          suitableMode: ["Présentiel (recommandé pour enfants)", "Ligne (pour adolescents)"],
          ctaLabel: "Prendre RDV Pédopsychologue",
          ctaAction: "book:Enfant Émotions/Angoisses"
        }
      },
      {
        label: "Vécu de maltraitance, deuil, ou rupture familiale",
        description: "Séparations conflictuelles, enfants en rupture de famille ou témoins d'évènements violents.",
        result: {
          title: "Soin Spécifique de Restauration Psychologique post-Trauma",
          reason: "Le CEPAPSY intervient avec sensibilité auprès des enfants victimes d'urgences humanitaires, de deuil parental direct, ou d'environnements violents.",
          services: ["Exposition ou vécu d'évènement traumatique", "Prise en charge des enfants en conflit ou rupture", "Soutien de crise"],
          suitableMode: ["Présentiel prioritaire", "À domicile"],
          ctaLabel: "Demander une Intervention Spéciale",
          ctaAction: "book:Enfant Trauma & Crise"
        }
      }
    ]
  },
  {
    id: "corp_need",
    question: "Quelle est l'intervention institutionnelle souhaitée ?",
    options: [
      {
        label: "Prévention de crise et diagnostic des risques",
        description: "Épuisement professionnel (Burnout), gestion du stress au travail ou climat délétère.",
        result: {
          title: "Audit & Ateliers de Régulation des Risques Psychosociaux (RPS)",
          reason: "Diagnostic approfondi des sources de surcharge et conduite d'ateliers interactifs sur l'hygiène émotionnelle pour préserver la santé des collaborateurs.",
          services: ["Analyse des sources de stress et risques", "Ateliers régulation stress/burnout", "Mentoring de management"],
          suitableMode: ["En milieu professionnel (Goma & Région)", "Présentiel"],
          ctaLabel: "Demander un Devis Entreprise",
          ctaAction: "book:Corporate RPS & Burnout"
        }
      },
      {
        label: "Intervention post-incident ou traumatique",
        description: "Accompagner les équipes après un drame, kidnapping, conflit, accident ou catastrophe.",
        result: {
          title: "Cellule de Crise Institutionnelle post-Incident",
          reason: "Déploiement rapide d'un psychologue senior qualifié en defusing, débriefing psychologique et appui groupal d'urgence après traumatismes.",
          services: ["Interventions post-incident critique", "Désensibilisation groupale et individuelle", "Suivi post-crise"],
          suitableMode: ["Sur site d'urgence", "À la demande"],
          ctaLabel: "Activer la Cellule de Déploiement",
          ctaAction: "book:Corporate Crise & Defusing"
        }
      },
      {
        label: "Cohésion d'équipe et bien-être",
        description: "Team building, retraite au vert pour les ONG, session collective de décharge émotionnelle.",
        result: {
          title: "Journée Cohésion, Team Building & Régulation du Stress",
          reason: "Activités structurées pour soulager la fatigue compassionnelle inhérente aux métiers de l'humanitaire en RDC et consolider la synergie communautaire.",
          services: ["Ateliers de bien-être au travail", "Team Building clinique et ludique", "Groupes de parole"],
          suitableMode: ["Séminaires", "Hors site Goma"],
          ctaLabel: "Planifier un Team Building",
          ctaAction: "book:Corporate Team Building"
        }
      }
    ]
  }
];

export const TESTIMONIALS_LIST = [
  {
    id: "testi-1",
    quote: "Le CEPAPSY a transformé la dynamique de notre organisation après un événement sécuritaire critique. Leurs psychologues ont su intervenir avec tact, écoute active et méthodes scientifiquement éprouvées.",
    author: "Responsable des Ressources Humaines",
    context: "Soutien post-incident en ONG internationale, Goma",
    rating: 5
  },
  {
    id: "testi-2",
    quote: "Grâce à l'approche structurée en TCC (Thérapie Cognitive et Comportementale) et une écoute d'une bienveillance infinie, j'ai surmonté un état d'anxiété généralisée qui me paralysait au quotidien.",
    author: "Patient accompagné en séances individuelles",
    context: "Prise en charge de l'anxiété, Cabinet Goma",
    rating: 5
  },
  {
    id: "testi-3",
    quote: "Un accompagnement remarquable pour notre fils de 12 ans à la suite d'un deuil difficile. Les psychologues du CEPAPSY ont su employer la thérapie par le jeu et le dessin pour libérer sa parole.",
    author: "Mère d'adolescent",
    context: "Soutien deuil, Bureau Goma",
    rating: 5
  },
  {
    id: "testi-4",
    quote: "Sceptique au début concernant les consultations à distance, le suivi hebdomadaire en ligne pour burnout m'a redonné d'excellentes bases d'équilibre. La confidentialité y est absolue.",
    author: "Cadre en transition professionnelle",
    context: "Consultation en ligne, RDC",
    rating: 5
  },
  {
    id: "testi-5",
    quote: "La collaboration avec le CEPAPSY a permis de sensibiliser nos équipes éducatives à l'identification des signes de détresse psychologique chez les élèves. Une formation pratique de très haut niveau.",
    author: "Directeur d'institution scolaire",
    context: "Atelier de sensibilisation en santé mentale",
    rating: 5
  }
];

