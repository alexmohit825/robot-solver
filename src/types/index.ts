export type SubSpecialty = 
  | 'Degenerative Spine' 
  | 'Complex Spine Deformity' 
  | 'Minimally Invasive Spine' 
  | 'Cranial Skull Base' 
  | 'Neuro-Oncology & Eloquence' 
  | 'Cerebrovascular' 
  | 'Pediatric & Craniofacial' 
  | 'Functional & Stereotactic';

export type OperativeStage = 
  | 'Pre-Op & Robotic Planning' 
  | 'Table Kinematics & Positioning' 
  | 'Corridor Access & Retraction' 
  | 'Visualization, Lighting & Optics' 
  | 'Drills, Resection & Cavitation' 
  | 'Maneuvering & Micro-Instruments' 
  | 'Dural Reconstruction & Wound Closure';

export type EquipmentCategory = 
  | 'Access & Retraction'
  | 'Drills & Cavitation'
  | 'Tables & Patient Positioning'
  | 'Visualization & Optics'
  | 'Maneuvering & Micro-Instruments'
  | 'Closure & Dural Repair';

export type DonorField = 
  | 'Ophthalmology & Phacoemulsification'
  | 'ENT & Micro-Otology'
  | 'Interventional Cardiology & Catheter Systems'
  | 'Plastic & Reconstructive Surgery'
  | 'Robotic General & Laparoscopic Surgery'
  | 'Aerospace & Turbine Dynamics'
  | 'Deep-Sea Optical Engineering'
  | 'Industrial Precision CNC & Ultrasonic Machining'
  | 'Defense LiDAR & Non-Rigid SLAM'
  | 'Dental Endodontics & Micro-Fluidics'
  | 'Marine Gyroscopic Platforms'
  | 'Polymer Chemistry & Biomimetic Adhesives';

export interface ProceduralStep {
  id: string;
  phase: OperativeStage;
  stepName: string;
  standardPractice: string;
  clinicalBottleneck: string;
  bottleneckId?: string;
  relevantInnovationIds: string[];
}

export interface SurgicalProcedure {
  id: string;
  name: string;
  shortCode: string;
  subspecialty: SubSpecialty;
  anatomicalRegion: string;
  typicalDurationMinutes: number;
  description: string;
  steps: ProceduralStep[];
}

export interface CrossSectionalBottleneck {
  id: string;
  title: string;
  category: EquipmentCategory;
  physicalConstraint: string;
  clinicalImpactSummary: string;
  affectedProcedureIds: string[];
  solvedByInnovationIds: string[];
  severityRating: 1 | 2 | 3 | 4 | 5;
  frequencyScore: number;
}

export interface KinematicParameters {
  shaftLengthMm: number;
  shaftLengthMinMax: [number, number];
  bayonetAngleDeg: number;
  bayonetAngleMinMax: [number, number];
  workingCorridorMinMm: number;
  primaryMaterial: string;
  availableMaterials: string[];
  actuationType: string;
  lineOfSightClearanceAngleDeg: number;
  pressureLimitMmHg?: number;
  opticalLuxAtDepth?: number;
  impactionLoadLimitN?: number;
  hasIrrigationSuctionChannel: boolean;
  isRadiolucent: boolean;
}

export type PatentRecommendation = 
  | 'RECOMMENDED: FILE PROVISIONAL PATENT'
  | 'LEVERAGE: EXPIRED PUBLIC DOMAIN (DO NOT FILE)'
  | 'CAUTION: ACTIVE PRIOR ART - DESIGN AROUND'
  | 'TRADE SECRET / OPEN SURGICAL CONSORTIUM';

export interface DeepPatentAnalysis {
  filingRecommendation: PatentRecommendation;
  filingRecommendationRationale: string;
  usptoClassCodes: string[];
  draftIndependentClaim: string;
  draftDependentClaims: string[];
  closestPriorArtPatents: {
    patentNumber: string;
    title: string;
    filingDate: string;
    donorIndustry: string;
    keyDifference: string;
    isExpired: boolean;
  }[];
  section103NonObviousnessArgument: string;
  section102NoveltyBoundary: string;
  freedomToOperateAssessment: 'Clear (High FTO)' | 'Moderate (Expired Overlap)' | 'Requires License';
  commercialExclusivityPotential: 'High (Pioneer Patent)' | 'Moderate (Device Improvement)' | 'Niche Accessory';
}

export interface BlueprintDimension {
  label: string;
  value: string;
  tolerance: string;
}

export type BlueprintDiagramType = 
  | 'kerrison_rongeur'
  | 'frazier_suction'
  | 'bayonet_bipolar'
  | 'probe_dissector'
  | 'handheld_retractor'
  | 'ultrasonic_horn'
  | 'vertebral_inserter'
  | 'dural_clip_applier'
  | 'light_pipe'
  | 'dynamic_table'
  | 'pressure_retractor'
  | 'steerable_curette'
  | 'cavitation_burr'
  | 'micro_clip'
  | 'vertebral_lock'
  | 'gecko_sealant';

export interface BlueprintSpec {
  partNumber: string;
  materialSpec: string;
  finish: string;
  scale: string;
  diagramType: BlueprintDiagramType;
  views: ('Isometric 3D' | 'Side Elevation' | 'Plan View' | 'Section A-A')[];
  dimensions: BlueprintDimension[];
  criticalFeatures: string[];
}

export interface InnovationDossier {
  id: string;
  rank: number;
  title: string;
  category: EquipmentCategory;
  donorField: DonorField;
  donorDeviceOrigin: string;
  primaryProcedureTarget: string;
  crossSectionalMultiplier: number;
  affectedProcedureIds: string[];
  
  clinicalProblemStatement: string;
  mechanicalDelta: string;
  kinematicPrinciple: string;
  
  parameters: KinematicParameters;
  blueprint: BlueprintSpec;
  
  masterCriticVerdict: {
    passed: boolean;
    duralSafetyRating: string;
    lineOfSightScore: string;
    radiologicalScatterIndex: string;
    tactileHapticFeedback: string;
    criticNotes: string;
  };
  
  regulatoryPathway: {
    fdaClassification: 'Class I (Exempt)' | 'Class II (510k)' | 'Class III (PMA)';
    predicateDeviceKNumber: string;
    predicateDeviceName: string;
    transferabilityScore: number;
  };
  
  patentStatus: {
    status: 'Public Domain (Expired)' | 'White Space (Unclaimed)' | 'Novel Hybrid Mechanism';
    originalPatentRef?: string;
    unclaimedSpineAngle: string;
    draftPatentTitle: string;
  };
  
  deepPatentAnalysis: DeepPatentAnalysis;
  diagramType: BlueprintDiagramType;
}

export type ReviewStatus = 'unreviewed' | 'shortlisted' | 'refining' | 'rejected';

export interface SurgeonReviewState {
  status: ReviewStatus;
  customParameters?: Partial<KinematicParameters>;
  surgeonNotes: string;
  voiceDictationTranscript?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  flaggedForPatentDraft: boolean;
  lastUpdated: string;
}

// 1. Quick-Win Accessories Schema (< 30-60 Days, 3D Print / Silicone Mold)
export interface QuickWinTool {
  id: string;
  rank: number;
  title: string;
  category: 'Ergonomic Grips' | 'Vision & Anti-Glare' | 'Suction & Fluidics' | 'Dural Fixation' | 'Cable & OR Flow' | 'Lighting & Optical';
  timeToORImplementation: '< 30 Days (Direct 3D Print / Off-Shelf)' | '60 Days (Simple CNC / Silicone Mold)' | '90 Days (Class I Registration)';
  designEffortScore: 'Low (1/5)' | 'Minimal-Mod (2/5)' | 'Moderate (3/5)';
  ergonomicPayoff: string;
  immediateMechanism: string;
  estimatedPrototypingCost: string;
  affectedSpecialties: string[];
  blueprint: BlueprintSpec;
  patentRecommendation: PatentRecommendation;
}

// 2. Low-Capital Handheld Instruments Schema (Suctions, Rongeurs, Probes, Bipolars, Retractors)
export type HandheldCategory = 
  | 'Suctions & Fluidic Scavengers'
  | 'Rongeurs & Micro-Punches'
  | 'Probes & Micro-Dissectors'
  | 'Bipolar & Electrosurgical Tools'
  | 'Handheld Retractors & Specula'
  | 'Micro-Elevators & Curettes';

export interface HandheldInstrument {
  id: string;
  rank: number;
  title: string;
  category: HandheldCategory;
  primaryTarget: string; // e.g. "MIS Tubular Decompression", "Acoustic Neuroma", "ACDF"
  machiningMethod: string; // e.g. "Wire-EDM + CNC Lathe + Passivation", "Laser Welded ASTM F899 Steel"
  estimatedPrototypingCost: string; // e.g. "$450 - $900"
  prototypingLeadTimeDays: number; // e.g. 14, 21, 30 days
  clinicalAdvantage: string;
  mechanicalInnovation: string;
  ergonomicHandpieceDesign: string;
  materials: string;
  patentStrategy: PatentRecommendation;
  blueprint: BlueprintSpec;
}
