export type Scene = {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: "Ready" | "Draft" | "Needs polish";
  shots: Shot[];
};

export type Shot = {
  id: string;
  name: string;
  description: string;
  thumbnailLabel: string;
  duration: string;
};

export type Project = {
  id: string;
  name: string;
  updatedAt: string;
  thumbnailLabel: string;
  state: string;
};

export const landingBullets = [
  "Same character across scenes",
  "No prompt rewriting",
  "Faster results, lower cost"
];

export const styleOptions = ["Cinematic", "Emotional", "Ad", "Dark"];

export const scenes: Scene[] = [
  {
    id: "scene-01",
    title: "Scene 01",
    description: "Opening rain sequence with controlled neon contrast and a grounded lead performance.",
    duration: "00:12",
    status: "Ready",
    shots: [
      {
        id: "shot-1",
        name: "Street reveal",
        description: "Wide street reveal with rain streaks, reflective asphalt, and slow push-in.",
        thumbnailLabel: "Wide rain reveal",
        duration: "4s"
      },
      {
        id: "shot-2",
        name: "Character profile",
        description: "Close profile, moody side light, measured breath and eye-line consistency.",
        thumbnailLabel: "Close profile",
        duration: "3s"
      },
      {
        id: "shot-3",
        name: "Umbrella tracking",
        description: "Tracking shot over shoulder with subtle parallax and controlled camera shake.",
        thumbnailLabel: "Tracking umbrella",
        duration: "5s"
      }
    ]
  },
  {
    id: "scene-02",
    title: "Scene 02",
    description: "Interior transition, warmer highlights, stronger emotional focus, tighter coverage.",
    duration: "00:15",
    status: "Draft",
    shots: [
      {
        id: "shot-4",
        name: "Doorway entrance",
        description: "Medium doorway entrance with warm spill from practical lighting.",
        thumbnailLabel: "Doorway entrance",
        duration: "5s"
      },
      {
        id: "shot-5",
        name: "Table detail",
        description: "Natural lens detail shot, slow tilt, controlled reflections and prop continuity.",
        thumbnailLabel: "Table detail",
        duration: "4s"
      },
      {
        id: "shot-6",
        name: "Reaction close-up",
        description: "Intimate close-up with preserved character identity and soft depth falloff.",
        thumbnailLabel: "Reaction close-up",
        duration: "6s"
      }
    ]
  },
  {
    id: "scene-03",
    title: "Scene 03",
    description: "Final decision beat with elevated drama, darker palette, and tighter editorial rhythm.",
    duration: "00:09",
    status: "Needs polish",
    shots: [
      {
        id: "shot-7",
        name: "Decision pause",
        description: "Centered frame, shallow focus, restrained movement for tension build.",
        thumbnailLabel: "Decision pause",
        duration: "4s"
      },
      {
        id: "shot-8",
        name: "Exit motion",
        description: "Dolly back with silhouette breakup, lingering backlight and rain haze.",
        thumbnailLabel: "Exit motion",
        duration: "5s"
      }
    ]
  }
];

export const projects: Project[] = [
  {
    id: "project-1",
    name: "Launch Trailer Showcase",
    updatedAt: "Updated 2 hours ago",
    thumbnailLabel: "Neon hallway frame",
    state: "In review"
  },
  {
    id: "project-2",
    name: "Brand Sizzle Reel",
    updatedAt: "Updated yesterday",
    thumbnailLabel: "Chrome studio motion",
    state: "Ready to export"
  },
  {
    id: "project-3",
    name: "Narrative Proof of Concept",
    updatedAt: "Updated 3 days ago",
    thumbnailLabel: "Rain street dialogue",
    state: "Draft"
  }
];

export const usageBreakdown = [
  { label: "Quick generate", value: 184, percent: 45 },
  { label: "Director mode", value: 136, percent: 33 },
  { label: "Consistency fixes", value: 58, percent: 14 },
  { label: "Exports", value: 32, percent: 8 }
];

export const demoStatuses = [
  "Character: Stable",
  "Lighting: Stable",
  "Style: Stable"
];
