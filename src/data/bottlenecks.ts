import { CrossSectionalBottleneck } from '../types';

export const BOTTLENECKS: CrossSectionalBottleneck[] = [
  {
    id: 'bn-03',
    title: 'Sustained Retraction Ischemia & Muscle/Brain Creep',
    category: 'Access & Retraction',
    physicalConstraint: 'Continuous mechanical displacement exceeding microvascular capillary closing pressure (>30 mmHg) in narrow deep corridors.',
    clinicalImpactSummary: 'Causes femoral/cranial nerve neuropraxia, paraspinal muscle necrosis, post-op cerebellar edema, and visual obstruction from muscle creeping under blade tips.',
    affectedProcedureIds: ['proc-01', 'proc-02', 'proc-05', 'proc-07', 'proc-10'],
    solvedByInnovationIds: ['inn-02', 'inn-03', 'inn-04', 'inn-08', 'inn-13'],
    severityRating: 5,
    frequencyScore: 18
  },
  {
    id: 'bn-04',
    title: 'Deep-Corridor Optical Drop-Off & Exoscopic Line-of-Sight Shadowing',
    category: 'Visualization & Optics',
    physicalConstraint: 'Inverse-square photonic attenuation and severe parallax shadows cast by retractor rims at depths > 60mm under 300-450mm exoscope focal lengths.',
    clinicalImpactSummary: 'Forces unnatural surgeon posture, obscures thecal sac margin, and limits depth perception during micro-dissection.',
    affectedProcedureIds: ['proc-01', 'proc-02', 'proc-03', 'proc-05', 'proc-07'],
    solvedByInnovationIds: ['inn-57', 'inn-58', 'inn-59', 'inn-65'],
    severityRating: 5,
    frequencyScore: 24
  },
  {
    id: 'bn-08',
    title: 'Thermal Transfer & Mechanical Burr Kick-Back Near Neural Structures',
    category: 'Drills & Cavitation',
    physicalConstraint: 'High-speed rotary friction (>75,000 RPM) generating focal heat >47°C (protein coagulation) and dangerous rotational kick-back on bony shelves.',
    clinicalImpactSummary: 'Causes permanent nerve root thermal injury, incidental durotomies, and bone-dust slurry that clouds the lens/field.',
    affectedProcedureIds: ['proc-02', 'proc-03', 'proc-04', 'proc-08'],
    solvedByInnovationIds: ['inn-23', 'inn-24', 'inn-25', 'inn-27', 'inn-33'],
    severityRating: 5,
    frequencyScore: 22
  },
  {
    id: 'bn-09',
    title: 'Straight-Shaft Line-of-Sight Occlusion & Sub-Shelf Maneuvering Failure',
    category: 'Maneuvering & Micro-Instruments',
    physicalConstraint: 'Straight mechanical shafts placing surgeon hand/fingers directly in the exoscope optical cone, preventing manipulation around anatomical corners.',
    clinicalImpactSummary: 'Forces excessive dural/neural retraction to achieve straight-line access to hidden disc fragments or uncinate spurs.',
    affectedProcedureIds: ['proc-02', 'proc-03', 'proc-04', 'proc-08'],
    solvedByInnovationIds: ['inn-79', 'inn-80', 'inn-81', 'inn-83'],
    severityRating: 4,
    frequencyScore: 19
  },
  {
    id: 'bn-10',
    title: 'Watertight Dural Repair Failure in Narrow Deep Corridors',
    category: 'Closure & Dural Repair',
    physicalConstraint: 'Kinematic impossibility of manipulating standard needle drivers and tying secure microsurgical knots inside 12-16mm tubular ports or sellar bases.',
    clinicalImpactSummary: 'Results in intractable post-op CSF leaks, pseudomeningoceles, meningitis, and revision operations.',
    affectedProcedureIds: ['proc-02', 'proc-04', 'proc-05'],
    solvedByInnovationIds: ['inn-93', 'inn-94', 'inn-96', 'inn-98'],
    severityRating: 5,
    frequencyScore: 16
  },
  {
    id: 'bn-02',
    title: 'Static Patient Positioning & Passive Nerve Plexus Tension',
    category: 'Tables & Patient Positioning',
    physicalConstraint: 'Fixed table planes failing to decouple regional joint flexion (e.g. hip/cervical) from the global surgical coordinate frame.',
    clinicalImpactSummary: 'Maintains prolonged stretch on the femoral/brachial plexus during lateral/park-bench access, causing postoperative motor deficits.',
    affectedProcedureIds: ['proc-01', 'proc-05'],
    solvedByInnovationIds: ['inn-41', 'inn-42', 'inn-43'],
    severityRating: 4,
    frequencyScore: 12
  },
  {
    id: 'bn-07',
    title: 'Sub-Fascial Dead-Space Formation & High-Tension Knot Breakdown',
    category: 'Closure & Dural Repair',
    physicalConstraint: 'Focal suture knots concentrating mechanical shear force on paraspinal muscle bundles, leaving cavernous ischemic dead space.',
    clinicalImpactSummary: 'Causes painful fluid seromas, high infection rates, hematomas, and paraspinal muscle atrophy.',
    affectedProcedureIds: ['proc-01', 'proc-03', 'proc-06'],
    solvedByInnovationIds: ['inn-91', 'inn-92', 'inn-95', 'inn-100'],
    severityRating: 4,
    frequencyScore: 15
  },
  {
    id: 'bn-06',
    title: 'High-Impaction Articulation Failure around Obstructed Trajectories',
    category: 'Maneuvering & Micro-Instruments',
    physicalConstraint: 'Articulating inserter pivot pins shearing or buckling under axial mallet strike forces exceeding 450 Newtons.',
    clinicalImpactSummary: 'Prevents optimal lordotic cage delivery past the high iliac crest in L4-L5/L5-S1 minimally invasive fusions.',
    affectedProcedureIds: ['proc-01'],
    solvedByInnovationIds: ['inn-77', 'inn-78'],
    severityRating: 4,
    frequencyScore: 11
  },
  {
    id: 'bn-14',
    title: 'Long-Shank High-Speed Burr Oscillation & Micro-Chatter',
    category: 'Drills & Cavitation',
    physicalConstraint: 'Harmonic resonance in drill shanks > 80mm causing erratic tip wobble at 80,000 RPM.',
    clinicalImpactSummary: 'Risk of erratic bone skips into the internal auditory canal, labyrinth, or sigmoid sinus.',
    affectedProcedureIds: ['proc-05'],
    solvedByInnovationIds: ['inn-29', 'inn-30'],
    severityRating: 4,
    frequencyScore: 9
  },
  {
    id: 'bn-18',
    title: 'Set-Screw Cross-Threading & Extreme Wrist Fatigue in Deformity Cantilevers',
    category: 'Maneuvering & Micro-Instruments',
    physicalConstraint: 'Manual reduction towers requiring > 15 Nm of torque while combating immense corrective spinal spring-back forces.',
    clinicalImpactSummary: 'Causes severe surgeon wrist strain, stripped set-screws, and sudden bone-screw pullout in osteoporotic bone.',
    affectedProcedureIds: ['proc-06'],
    solvedByInnovationIds: ['inn-87', 'inn-88'],
    severityRating: 4,
    frequencyScore: 10
  }
];
