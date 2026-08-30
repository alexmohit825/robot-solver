import { RoboticErrorItem } from './roboticPlatforms';

export const MAZOR_X_ERROR_ITEMS: RoboticErrorItem[] = [
  {
    id: 'maz-01',
    platform: 'MAZOR_X',
    errorCode: 'ST-104',
    displayTitle: 'StealthStation S8 Serial Navigation Link Disconnected',
    category: 'HARDWARE_CONNECTIVITY',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'High-speed optical tracking telemetry data between the StealthStation S8 navigation station and the Mazor X robotic controller has timed out (> 200ms drop).',
    probableCauses: [
      'Ethernet umbilical cord stepped on or disconnected at Mazor cart base',
      'IP configuration mismatch or DHCP subnet conflict on OR network',
      'StealthStation navigation software crash or background sync hang'
    ],
    immediateSteps: [
      'Inspect physical CAT6 Ethernet cable connection between Mazor X workstation and StealthStation cart.',
      'Check rear Ethernet port link LEDs (solid green activity light required).',
      'On Mazor screen, click "Hardware Diagnostics" -> "Reset Stealth Link".',
      'If link does not re-establish in 15 seconds, restart the Mazor Navigation Service on StealthStation.'
    ],
    verificationCheck: 'Console top banner shows "Stealth Link Active: Latency < 12ms" with green status ring.',
    escalationFallback: 'Switch to Standalone Mazor Scan-and-Plan registration mode without live Stealth optical overlay.',
    fluoroCheckRecommended: false,
    tags: ['StealthStation', 'Ethernet', 'Link', 'S8', 'Serial', 'Timeout']
  },
  {
    id: 'maz-02',
    platform: 'MAZOR_X',
    errorCode: 'OPT-202',
    displayTitle: '3D Camera Lens Glare / Passive Sphere Reflection Washout',
    category: 'LINE_OF_SIGHT_TRACKING',
    clinicalPhase: 'EXECUTION',
    severity: 'WARNING',
    whatItMeans: 'The Mazor 3D optical tracking camera receives saturated or scattering infrared reflection, degrading passive sphere centroid calculation accuracy.',
    probableCauses: [
      'Direct high-intensity overhead surgical LED light beam focused directly onto passive spheres',
      'Damp, blood-smeared, or fogged retroreflective spheres on patient reference array',
      'Shiny metallic instruments or wet sterile plastic drapes creating false specular reflections'
    ],
    immediateSteps: [
      'Defocus and redirect overhead surgical lights away from the tracking arrays and into the deep wound.',
      'Replace any wet or dirty passive retroreflective spheres with fresh sterile dry spheres (never wipe with wet sponges).',
      'Reposition blue or green sterile drapes to cover shiny metallic retractor blades in camera field.'
    ],
    verificationCheck: 'Camera tracking view displays crisp circular fiducials with centroid error < 0.15mm.',
    escalationFallback: 'Adjust camera exposure gain slider on StealthStation settings menu.',
    fluoroCheckRecommended: false,
    tags: ['Glare', 'Reflective Spheres', 'Optics', 'Washout', '3D Camera']
  },
  {
    id: 'maz-03',
    platform: 'MAZOR_X',
    errorCode: 'ARM-401',
    displayTitle: 'Robotic Arm Trajectory Deviation / Deflection Lockout',
    category: 'MECHANICAL_ARM_FORCE',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'The articulated robotic arm trajectory guide has deflected > 1.2mm from the planned vector during cannula docking or drilling.',
    probableCauses: [
      'Excessive lateral axial bending force during high-speed drill or tap advance',
      'Bone mount bridge clamp flexing against patient table or retractor frame',
      'Steep entry angle against sloping lamina without prior cortex flattening'
    ],
    immediateSteps: [
      'Stop drilling immediately and retract tool back into the guide sleeve.',
      'Check mechanical tightness of all bridge joints and Schanz pin fixation clamps.',
      'Flatten entry cortex at pedicle landing zone with a round high-speed burr before resuming.'
    ],
    verificationCheck: 'Trajectory crosshair alignment indicator returns to dead center (< 0.5mm deviation ring).',
    escalationFallback: 'Unlock Hover-T trajectory articulation and re-execute robotic arm approach with reduced feed rate.',
    fluoroCheckRecommended: true,
    tags: ['Deviation', 'Deflection', 'Lockout', 'Arm', 'Cannula']
  },
  {
    id: 'maz-04',
    platform: 'MAZOR_X',
    errorCode: 'REG-305',
    displayTitle: 'O-arm 2 Volumetric Registration Matching Failure',
    category: 'REGISTRATION_SPIN',
    clinicalPhase: 'REGISTRATION',
    severity: 'CRITICAL',
    whatItMeans: 'Automatic registration pairing between the intraoperative Medtronic O-arm 2 3D volumetric DICOM dataset and Mazor X reference frame could not achieve mathematical convergence.',
    probableCauses: [
      'O-arm calibration tracking fixture moved or bumped during the 360-degree gantry spin',
      'Patient reference frame partially cut off outside the reconstructed O-arm 3D FOV cylinder',
      'Severely osteopenic anatomy or dense metallic spinal hardware causing image saturation artifacts'
    ],
    immediateSteps: [
      'Inspect the reconstructed O-arm volume to ensure all reference frame fiducial spheres are completely inside the scan volume.',
      'Verify that the O-arm tracking tracker and patient reference clamp were not touched during gantry rotation.',
      'Perform manual 3-point paired landmark co-registration on the Mazor registration screen.'
    ],
    verificationCheck: 'Visual overlay shows exact 1-to-1 bony cortical outline matching on axial, sagittal, and coronal views.',
    escalationFallback: 'Re-position O-arm isocenter, ensure reference frame is fully centered in field, and acquire a repeat low-dose 3D spin.',
    fluoroCheckRecommended: true,
    tags: ['O-arm', 'Volumetric', 'Registration', 'DICOM', 'Matching']
  },
  {
    id: 'maz-05',
    platform: 'MAZOR_X',
    errorCode: 'MNT-102',
    displayTitle: 'Bone Mount Schanz Pin Mechanical Flex / Bridge Deflection',
    category: 'CLAMP_RIGIDITY',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'The rigid mechanical link between the bone-mounted Schanz pin or bed mount bridge and the robotic base shows micro-deflection under load.',
    probableCauses: [
      'Schanz pin inserted into thin spinous process cortex rather than solid iliac crest or pedicle',
      'Universal joint bridge clamp quick-release cam lever not fully closed in locked detent',
      'Table clamp loosening on the operating table side rail'
    ],
    immediateSteps: [
      'Inspect the Schanz pin bone interface; check for bone toggle with manual finger pressure.',
      'Verify all quick-clamp cam levers on the bridge assembly are in the solid locked position.',
      'Re-verify anatomical accuracy on the index vertebra with the navigated pointer.'
    ],
    verificationCheck: 'Pointer touch on index level transverse process matches virtual CT anatomy within 1.0mm.',
    escalationFallback: 'Insert a second converging Schanz pin to triangulate and stiffen the skeletal mount frame.',
    fluoroCheckRecommended: true,
    tags: ['Bone Mount', 'Schanz Pin', 'Bridge', 'Flex', 'Rigidity']
  },
  {
    id: 'maz-06',
    platform: 'MAZOR_X',
    errorCode: 'GUI-503',
    displayTitle: 'Trajectory Hover-T Articulation Angle Proximity Limit',
    category: 'TRAJECTORY_ACCURACY',
    clinicalPhase: 'EXECUTION',
    severity: 'WARNING',
    whatItMeans: 'The planned trajectory Hover-T mechanical guide approaches within 5 degrees of the robotic arm base clearance boundary.',
    probableCauses: [
      'Extreme lateral trajectory angle or deep lordotic L5-S1 angulation',
      'Patient positioning too close to the edge of the operating table',
      'Robotic arm base bridge mounted at an unfavorable caudal/cranial angle'
    ],
    immediateSteps: [
      'Review trajectory in 3D workspace and check robot arm virtual model clearance.',
      'Rotate the main bridge articulated arm base slightly to widen mechanical clearance envelope.',
      'Re-calculate trajectory collision envelope.'
    ],
    verificationCheck: 'Software clearance indicator changes from amber proximity alert to green clearance status.',
    escalationFallback: 'Slightly reduce cranial/caudal trajectory tilt by 2 degrees on the plan to restore robotic clearance.',
    fluoroCheckRecommended: false,
    tags: ['Hover-T', 'Articulation', 'Proximity', 'Kinematics', 'Clearance']
  },
  {
    id: 'maz-07',
    platform: 'MAZOR_X',
    errorCode: 'OARM-201',
    displayTitle: 'O-arm Tracking Fixture Geometry Discrepancy',
    category: 'REGISTRATION_SPIN',
    clinicalPhase: 'SETUP',
    severity: 'CRITICAL',
    whatItMeans: 'The optical tracker attached to the O-arm gantry during 3D spin shows a geometric discrepancy compared to factory calibration coordinates.',
    probableCauses: [
      'Damaged or bent tracking arm on the O-arm gantry clamp',
      'Missing or loose passive tracking spheres on O-arm array',
      'Gantry vibration during spin from uneven OR floor wheel locking'
    ],
    immediateSteps: [
      'Inspect O-arm tracking fixture; ensure all 4 spheres are firmly snapped into position.',
      'Check that the O-arm tracking clamp is rigidly tightened to the gantry housing.',
      'Perform quick tracker integrity self-test on the StealthStation console.'
    ],
    verificationCheck: 'Self-test reports "O-arm Tracker Geometric Residual Error: 0.18mm (Passed)".',
    escalationFallback: 'Replace O-arm tracking bracket with sterile backup unit and re-verify geometry.',
    fluoroCheckRecommended: false,
    tags: ['O-arm Tracker', 'Fixture', 'Geometry', 'Residual', 'Calibration']
  },
  {
    id: 'maz-08',
    platform: 'MAZOR_X',
    errorCode: 'ST-119',
    displayTitle: 'Patient Dynamic Reference Array Multi-Sphere Drop',
    category: 'LINE_OF_SIGHT_TRACKING',
    clinicalPhase: 'EXECUTION',
    severity: 'WARNING',
    whatItMeans: 'Less than the minimum required 3 passive tracking spheres are visible to the Stealth camera simultaneously.',
    probableCauses: [
      'Surgeon leaning over patient reference post during midline dissection',
      'Sterile blue drape tented over the reference frame array post',
      'Blood or fluid splash obscuring one of the reflective spheres'
    ],
    immediateSteps: [
      'Ask assistant to adjust posture and verify optical line of sight from camera to reference post.',
      'Check for drape tenting and fold back any encroaching sterile fabric.',
      'Inspect passive spheres and snap on fresh dry spheres if contaminated.'
    ],
    verificationCheck: 'All 4 spheres illuminate solid green on the StealthStation tracking HUD.',
    escalationFallback: 'Adjust camera boom position or elevate Stealth camera head by 15cm.',
    fluoroCheckRecommended: false,
    tags: ['Sphere Drop', 'Line of Sight', 'Reference Post', 'Occlusion']
  }
];
