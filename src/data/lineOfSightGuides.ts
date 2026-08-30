import { PlatformType } from './roboticPlatforms';

export interface LineOfSightSpec {
  platform: PlatformType;
  optimalDistanceMeters: { min: number; max: number; sweetSpot: number };
  optimalAngleDegrees: { min: number; max: number; target: number };
  recommendedPlacement: string;
  commonObstructionVectors: {
    source: string;
    riskDescription: string;
    preventiveTactic: string;
  }[];
  quickChecklist: string[];
}

export const LINE_OF_SIGHT_SPECS: Record<PlatformType, LineOfSightSpec> = {
  EXCELSIUS: {
    platform: 'EXCELSIUS',
    optimalDistanceMeters: { min: 1.5, max: 2.8, sweetSpot: 2.1 },
    optimalAngleDegrees: { min: 35, max: 55, target: 45 },
    recommendedPlacement: 'Position the infrared camera cart on the contralateral side of the table (or 45 degrees relative to patient torso), elevated so camera looks down upon the DRB and end-effector without obstruction from surgeon shoulders.',
    commonObstructionVectors: [
      {
        source: 'C-arm 2D/3D Arc Swing',
        riskDescription: 'C-arm intensifier / X-ray tube passes directly between the camera boom and patient DRB.',
        preventiveTactic: 'Establish dedicated Home position for C-arm away from the optical corridor when not in use.'
      },
      {
        source: 'Surgeon / Assistant Standing Posture',
        riskDescription: 'Surgeon leaning forward during pedicle cannulation blocks the end-effector active LEDs.',
        preventiveTactic: 'Elevate camera boom higher (2.2m height) with a steeper downward pitch.'
      },
      {
        source: 'Fluid/Blood on Active LED Emitters',
        riskDescription: 'Saline spray or blood splashes attenuate infrared emitter brightness.',
        preventiveTactic: 'Wipe with dry sterile gauze before each vertebral level.'
      }
    ],
    quickChecklist: [
      'Camera distance in Green Zone (1.8m - 2.4m)',
      'Camera caster wheels locked on OR floor',
      'Active array cable clicked and strain-relieved',
      'Surveillance marker within continuous field of view',
      'DRB clamp dual-cortex stability confirmed'
    ]
  },
  MAZOR_X: {
    platform: 'MAZOR_X',
    optimalDistanceMeters: { min: 1.8, max: 2.6, sweetSpot: 2.2 },
    optimalAngleDegrees: { min: 30, max: 50, target: 40 },
    recommendedPlacement: 'Position Stealth camera cart facing the patient reference frame at a 40-degree downward incline. Ensure the Mazor X robotic arm base does not shadow the optical target in deep caudal trajectories.',
    commonObstructionVectors: [
      {
        source: 'Overhead Surgical Light Glare',
        riskDescription: 'Direct high-intensity LED beams wash out passive reflective spheres on the patient frame.',
        preventiveTactic: 'Defocus surgical lights or direct them into incision, away from tracking posts.'
      },
      {
        source: 'Robotic Arm Self-Occlusion',
        riskDescription: 'Articulated arm joint swings in front of the patient reference array during steep trajectories.',
        preventiveTactic: 'Rotate arm base collar to maintain an unobstructed line to the Stealth camera.'
      },
      {
        source: 'Damp/Misted Reflective Spheres',
        riskDescription: 'Condensation or moist wipe residue creates a fuzzy tracking reflection.',
        preventiveTactic: 'Always snap on fresh, dry passive spheres and never wipe with moist sponges.'
      }
    ],
    quickChecklist: [
      'Stealth camera distance between 2.0m - 2.5m',
      'Ethernet link to Mazor X console verified green',
      'Patient reference frame rigid on Schanz pin / Bridge',
      'Passive spheres dry, clean, and fully snapped on',
      'Hover-T trajectory clearance verified'
    ]
  }
};
