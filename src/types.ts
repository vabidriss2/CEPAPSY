/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  details?: string[];
  category: "all" | "adult" | "child" | "corporate" | "specialty";
  iconName: string;
}

export interface TeamMember {
  name: string;
  role: string;
  description: string;
}

export interface BookingRequest {
  fullName: string;
  phone: string;
  email: string;
  mode: "présentiel" | "ligne" | "domicile";
  category: string;
  motif: string;
  dateStr?: string;
  timeStr?: string;
}

export interface VolunteerApplication {
  fullName: string;
  phone: string;
  email: string;
  diploma: string;
  motivation: string;
  location: string;
  cvUploaded: boolean;
  cvFileName?: string;
}

export interface FlowchartNode {
  id: string;
  question: string;
  options: {
    label: string;
    description?: string;
    nextNodeId?: string; // pointer to next question node
    result?: {
      title: string;
      reason: string;
      services: string[];
      suitableMode: string[];
      ctaLabel: string;
      ctaAction: string; // e.g., 'book:Adults' or 'volunteer'
    };
  }[];
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  context: string;
  rating?: number; // e.g., 5-star professional rating
}

