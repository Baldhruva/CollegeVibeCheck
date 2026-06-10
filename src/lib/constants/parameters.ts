/**
 * Responsibility: Static definition of college rating parameters and sub-parameters.
 * Purpose: Centralizes the list of parameters and sub-parameters for seeding, validation, and UI mapping.
 * What code will eventually live here: Static configuration arrays and maps for parameters/sub-parameters.
 */

export interface ParameterConfig {
  name: string;
  description: string;
  subParameters: string[];
}

export const PARAMETERS_CONFIG: ParameterConfig[] = [
  {
    name: "Academics",
    description: "Evaluates quality of teaching, strictness of attendance policies, fairness of examinations, and volume of assignments.",
    subParameters: [
      "Tuition Quality",
      "Attendance Culture",
      "Exam System",
      "Assignment Culture"
    ]
  },
  {
    name: "Amenities",
    description: "Evaluates dining facilities and infrastructure of both academic and residential spaces.",
    subParameters: [
      "Canteen Food",
      "Mess Food",
      "Campus Infra",
      "Hostel Infra"
    ]
  },
  {
    name: "Social Life",
    description: "Assesses campus atmosphere, student diversity, rules regarding dress code, and overall peer engagement.",
    subParameters: [
      "Crowd Diversity",
      "Dress-code Discipline",
      "Dating Scenes",
      "Inter-batch interactions"
    ]
  },
  {
    name: "Opportunities",
    description: "Measures career growth prospects, placement cells performance, and availability of career guides.",
    subParameters: [
      "Internships",
      "Placements",
      "Guidance & Mentorship",
      "Hackathon exposure"
    ]
  },
  {
    name: "Committees",
    description: "Looks at extra-curricular clubs, student societies, their time commitments, and resume value.",
    subParameters: [
      "Work Culture",
      "Resume Impact",
      "Event Frequency & Quality",
      "Time Flexibility"
    ]
  },
  {
    name: "Fests",
    description: "Evaluates the college's cultural, technical, and sports festivals.",
    subParameters: [
      "Event Quality",
      "Space Management",
      "Crowd Turnout",
      "Celebrity Presence"
    ]
  },
  {
    name: "Location",
    description: "Evaluates surrounding neighborhood convenience, accessibility by public transit, and housing options.",
    subParameters: [
      "Cafes, Restaurants",
      "Railway/Metro Station",
      "Hospitals",
      "PG flats"
    ]
  },
  {
    name: "Campus Comfort",
    description: "Assesses environmental factors, personal wellness facilities, and overall physical comfort resources.",
    subParameters: [
      "Green Spaces & Biodiversity",
      "Mental Health Support",
      "Sports & Fitness Facilities",
      "Parking Facilities"
    ]
  }
];

export const PARAMETER_NAMES = PARAMETERS_CONFIG.map(p => p.name);

export const ALL_SUB_PARAMETERS = PARAMETERS_CONFIG.flatMap(p => p.subParameters);
