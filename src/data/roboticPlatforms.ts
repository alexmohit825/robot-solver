export type PlatformType = 'EXCELSIUS' | 'MAZOR_X';

export type TriageCategory = 
  | 'TRAJECTORY_ACCURACY' 
  | 'LINE_OF_SIGHT_TRACKING' 
  | 'MECHANICAL_ARM_FORCE' 
  | 'REGISTRATION_SPIN' 
  | 'CLAMP_RIGIDITY' 
  | 'HARDWARE_CONNECTIVITY';

export type SurgicalPhase = 'ALL' | 'SETUP' | 'REGISTRATION' | 'EXECUTION';

export interface RoboticErrorItem {
  id: string;
  platform: PlatformType;
  errorCode: string;
  displayTitle: string;
  category: TriageCategory;
  clinicalPhase: SurgicalPhase;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  whatItMeans: string;
  probableCauses: string[];
  immediateSteps: string[];
  verificationCheck: string;
  escalationFallback: string;
  fluoroCheckRecommended: boolean;
  tags: string[];
}

export interface SymptomDecisionNode {
  id: string;
  question: string;
  contextHint?: string;
  options: {
    label: string;
    description?: string;
    nextNodeId?: string;
    resolution?: {
      title: string;
      diagnosis: string;
      criticalActions: string[];
      verificationCheck: string;
      escalationFallback: string;
      isCritical: boolean;
    };
  }[];
}

export interface DiagnosticSymptomTree {
  id: string;
  platform: PlatformType;
  symptomTitle: string;
  category: TriageCategory;
  nodes: Record<string, SymptomDecisionNode>;
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  systemFullName: string;
  manufacturer: string;
  accentColor: string;
  lightAccentColor: string;
  trackingMechanism: string;
  cameraType: string;
  referenceArrayName: string;
  verificationMethod: string;
}

export const PLATFORM_CONFIGS: Record<PlatformType, PlatformConfig> = {
  EXCELSIUS: {
    id: 'EXCELSIUS',
    name: 'ExcelsiusGPS',
    systemFullName: 'Globus ExcelsiusGPS® Robotic Navigation',
    manufacturer: 'Globus Medical',
    accentColor: '#06B6D4',
    lightAccentColor: 'rgba(6, 182, 212, 0.15)',
    trackingMechanism: 'Active Infrared LED Tracking & Rigid Load Cells',
    cameraType: 'Stereotactic Infrared Camera Boom',
    referenceArrayName: 'Dynamic Reference Base (DRB) & Surveillance Marker',
    verificationMethod: 'Planar Fluoroscopic / 3D Volumetric Matching'
  },
  MAZOR_X: {
    id: 'MAZOR_X',
    name: 'Mazor X Stealth',
    systemFullName: 'Medtronic Mazor X™ Stealth Edition',
    manufacturer: 'Medtronic',
    accentColor: '#F59E0B',
    lightAccentColor: 'rgba(245, 158, 11, 0.15)',
    trackingMechanism: 'StealthStation S8 Optical Infrared & Robotic Serial Link',
    cameraType: 'Dual-Lens Stealth 3D Optical Unit',
    referenceArrayName: 'Bone-Mounted Schanz Pin Reference Frame / Bed Frame Bridge',
    verificationMethod: 'O-arm 2 Volumetric Registration / 3D Scan-and-Plan'
  }
};
