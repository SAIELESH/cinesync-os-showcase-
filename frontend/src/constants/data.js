export const DEFAULT_SCRIPT = `INT. BIOTECH LAB — NIGHT

DR. CHEN moves through the dim corridor toward a softly glowing specimen case. The lab is empty. Her breath fogs the cold air.

She reaches the case. Stops. Something is wrong.

A single vial is missing from Rack B-7. She scans the room — then catches a glimpse of the far door swinging slowly shut.

EXT. ROOFTOP — CONTINUOUS

Chen bursts through the stairwell door. The city sprawls below. No one is there. Just wind.`;

export const MOCK_SCENES = [
  {
    id: "s1",
    number: "01",
    title: "Lab Approach",
    description: "Chen moves through dim corridor toward glowing specimen case. Atmosphere of isolation.",
  },
  {
    id: "s2",
    number: "02",
    title: "The Discovery",
    description: "She notices the missing vial. Tension peaks. A door swings shut in background.",
  },
  {
    id: "s3",
    number: "03",
    title: "Rooftop Pursuit",
    description: "Chen exits to the rooftop. City sprawls below. The suspect is gone.",
  },
];

export const MOCK_SHOTS = {
  s1: [
    { id: "sh1a", label: "Wide — Establishing",     sub: "Full corridor, Chen small in frame" },
    { id: "sh1b", label: "Medium — Walking",         sub: "Chest-up, tracking alongside her" },
    { id: "sh1c", label: "Close — Eyes on the case", sub: "Tight on face, specimen case reflected" },
  ],
  s2: [
    { id: "sh2a", label: "Wide — Lab Overview",      sub: "Full room, case in center foreground" },
    { id: "sh2b", label: "Insert — Missing Rack",    sub: "Extreme close on the empty bracket B-7" },
    { id: "sh2c", label: "Medium — Reaction",        sub: "Chen turning, eyes finding the door" },
    { id: "sh2d", label: "Wide — Door Closing",      sub: "Across the room, door swings shut" },
  ],
  s3: [
    { id: "sh3a", label: "Wide — Rooftop Reveal",   sub: "Chen bursts through door, city behind" },
    { id: "sh3b", label: "Low — City Skyline",       sub: "Looking up at Chen, city glowing" },
    { id: "sh3c", label: "Close — Searching",        sub: "Face tight, scanning empty rooftop" },
  ],
};

export const LENS_OPTIONS = [
  { id: "wide",    label: "Wide",    mm: "24mm",  icon: "⬡" },
  { id: "natural", label: "Natural", mm: "50mm",  icon: "◯" },
  { id: "tight",   label: "Tight",   mm: "85mm",  icon: "◉" },
];

export const MOVEMENT_OPTIONS = [
  "Static",
  "Pan Left",
  "Pan Right",
  "Tilt Up",
  "Tilt Down",
  "Dolly In",
  "Dolly Out",
  "Handheld",
];

// Rule of thirds positions [row][col]
export const FRAMING_LABELS = [
  ["Top Left",    "Top Center",    "Top Right"],
  ["Mid Left",    "Center",        "Mid Right"],
  ["Lower Left",  "Lower Center",  "Lower Right"],
];
