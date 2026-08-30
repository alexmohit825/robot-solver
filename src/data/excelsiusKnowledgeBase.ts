import { RoboticErrorItem } from './roboticPlatforms';

export const EXCELSIUS_ERROR_ITEMS: RoboticErrorItem[] = [
  {
    id: 'exc-01',
    platform: 'EXCELSIUS',
    errorCode: 'E-3104',
    displayTitle: 'Surveillance Marker Shift / DRB Deflection Detected',
    category: 'TRAJECTORY_ACCURACY',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'The system has detected a relative spatial shift (> 1.0mm or > 1.5°) between the patient Dynamic Reference Base (DRB) array and the stationary surveillance marker pin.',
    probableCauses: [
      'Accidental elbow or body bump against the DRB clamp by assistant or surgeon',
      'Insufficient dual-cortex purchase of the clamp pins into the iliac crest or spinous process',
      'Intersegmental movement caused by aggressive mallet impaction or bed manipulation'
    ],
    immediateSteps: [
      'Immediately pause instrument advance and freeze robotic arm movement.',
      'Check the physical rigidity of the DRB clamp and surveillance pin by applying gentle manual torque.',
      'Place the navigated verification probe on a known anatomical landmark (e.g. tip of spinous process or facet joint) and check accuracy on screen.',
      'If the landmark is off by > 1.5mm, perform an in-situ re-registration or landmark realignment scan.'
    ],
    verificationCheck: 'Place verification probe tip on the superior spinous process tip. Crosshair on axial/sagittal CT must match probe tip within 1.0mm.',
    escalationFallback: 'If re-registration fails or DRB has pulled out of bone, replace clamp into virgin iliac crest cortex and acquire a fresh 3D spin.',
    fluoroCheckRecommended: true,
    tags: ['DRB', 'Surveillance', 'Deflection', 'Shift', 'Accuracy', 'Registration']
  },
  {
    id: 'exc-02',
    platform: 'EXCELSIUS',
    errorCode: 'E-1002',
    displayTitle: 'Active Array Line of Sight / Optical Occlusion',
    category: 'LINE_OF_SIGHT_TRACKING',
    clinicalPhase: 'EXECUTION',
    severity: 'WARNING',
    whatItMeans: 'The optical camera cannot maintain continuous line of sight with one or more infrared active LED markers on the DRB, surveillance marker, or end-effector.',
    probableCauses: [
      'Surgeon head, scrub tech shoulder, or overhead surgical light head positioned in optical corridor',
      'C-arm intensifier parked in the line of sight between camera boom and patient reference array',
      'Blood, saline spray, or bone dust coating active LED emitter surfaces'
    ],
    immediateSteps: [
      'Inspect the optical corridor between the camera cart and the patient array.',
      'Reposition overhead lights and ask staff to step back from the direct line of sight.',
      'Wipe LED lenses on the active array with dry sterile gauze (do not use wet saline sponges).'
    ],
    verificationCheck: 'Camera tracking status indicators on the top console turn solid green with tracking confidence >= 95%.',
    escalationFallback: 'Elevate camera boom height and angle the optical head down at 45 degrees relative to patient table.',
    fluoroCheckRecommended: false,
    tags: ['Camera', 'Line of Sight', 'Occlusion', 'LED', 'Active Tracking']
  },
  {
    id: 'exc-03',
    platform: 'EXCELSIUS',
    errorCode: 'E-4020',
    displayTitle: 'End-Effector Force Limit Exceeded / Bone Skiving Lockout',
    category: 'MECHANICAL_ARM_FORCE',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'Load cells in the robotic end-effector have exceeded maximum permitted lateral deflection force (> 35N), indicating facet skiving, severe drill deflection, or mechanical obstruction.',
    probableCauses: [
      'Drill bit or tap skiving off a steep sclerotic superior articular process (SAP) facet slope',
      'Soft tissue impingement (fascia or muscle catching in the guide tube)',
      'Excessive lateral hand pressure applied by surgeon against the guide sleeve'
    ],
    immediateSteps: [
      'Release all manual force from the tool and guide tube.',
      'Retract the drill/awl out of the guide tube and clear all interposing muscle and fascial bands with electrocautery.',
      'Create a flat bony docking landing pad with a high-speed burr or matchstick burr before re-docking the guide tube.'
    ],
    verificationCheck: 'Re-engage robot active hold; load cell force bar indicator returns to neutral green (< 5N).',
    escalationFallback: 'Switch to navigated manual mode with live tracker sleeve if steep trajectory continues to induce skiving forces.',
    fluoroCheckRecommended: true,
    tags: ['Force Limit', 'Skiving', 'Load Cell', 'SAP', 'End-Effector']
  },
  {
    id: 'exc-04',
    platform: 'EXCELSIUS',
    errorCode: 'E-2101',
    displayTitle: 'Planar Fluoroscopy 2D/3D Calibration Registration Failure',
    category: 'REGISTRATION_SPIN',
    clinicalPhase: 'REGISTRATION',
    severity: 'CRITICAL',
    whatItMeans: 'The system failed to automatically co-register the intraoperative AP and Lateral fluoroscopic shots with the preoperative CT volume.',
    probableCauses: [
      'C-arm fiducial calibration target not parallel to detector panel or out of center field',
      'Excessive patient torso rotation or lordosis discrepancy between pre-op supine CT and intra-op prone positioning',
      'Dense metallic artifacts (prior fusion hardware) obscuring vertebral body edge detection'
    ],
    immediateSteps: [
      'Verify that the calibration grid target is firmly locked to the image intensifier without vibration.',
      'Re-acquire true AP and true Lateral shots ensuring the target vertebral body is dead-center.',
      'Manually select 3 paired anatomical landmarks (anterior/posterior vertebral body corners) in the manual alignment workspace.'
    ],
    verificationCheck: 'Registration target registration error (TRE) on console displays < 0.8mm with zero red outlier fiducials.',
    escalationFallback: 'Convert to intraoperative 3D fluoroscopy (O-arm / Cios Spin) or perform point-to-point surface matching.',
    fluoroCheckRecommended: true,
    tags: ['Fluoroscopy', 'Registration', 'Calibration', '2D-3D', 'Mismatch']
  },
  {
    id: 'exc-05',
    platform: 'EXCELSIUS',
    errorCode: 'E-5012',
    displayTitle: 'Dynamic Reference Base (DRB) Clamp Micro-Motion',
    category: 'CLAMP_RIGIDITY',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'Inertial sensors and optical feedback detect sub-millimeter oscillatory vibration or toggle at the DRB bone interface.',
    probableCauses: [
      'Single cortex pin purchase in soft osteoporotic iliac bone',
      'Loosened locking star nut on the reference clamp articulation arm',
      'Muscle belly contractions or high-flow irrigation causing rhythmic vibration'
    ],
    immediateSteps: [
      'Grasp the DRB post firmly and test for any mechanical toggle or play.',
      'Tighten the dual-cortex Schanz pins and primary locking nuts with the torque-limiting T-handle.',
      'Perform landmark accuracy check on adjacent spinous process.'
    ],
    verificationCheck: 'Real-time stability graph indicates stability index > 98% with zero oscillation flags.',
    escalationFallback: 'Relocate the reference clamp to the contralateral posterior superior iliac spine (PSIS) or an intact spinous process.',
    fluoroCheckRecommended: true,
    tags: ['Clamp', 'Rigidity', 'Micro-motion', 'PSIS', 'Iliac Pin']
  },
  {
    id: 'exc-06',
    platform: 'EXCELSIUS',
    errorCode: 'E-1208',
    displayTitle: 'Instrument Array Calibration Offset Exceeded',
    category: 'LINE_OF_SIGHT_TRACKING',
    clinicalPhase: 'SETUP',
    severity: 'WARNING',
    whatItMeans: 'The navigated instrument (probe, tap, or screwdriver) active array is bent, misaligned, or seated improperly in its quick-connect coupling.',
    probableCauses: [
      'Bent probe tip following vigorous bone probing or dropping on OR floor',
      'Incomplete seating of active array into instrument collar handle',
      'Mismatched instrument diameter selected in the software profile'
    ],
    immediateSteps: [
      'Remove and re-seat the tracker array into the instrument handle until an audible click is heard.',
      'Place the instrument tip into the Divot Calibration Port on the robot base to run quick recalibration.',
      'If divot check fails (> 0.5mm deviation), replace the instrument with a backup sterile unit.'
    ],
    verificationCheck: 'Divot verification screen shows "Calibration Passed: Error = 0.2mm".',
    escalationFallback: 'Switch to backup calibrated instrument tray and recalibrate in divot port.',
    fluoroCheckRecommended: false,
    tags: ['Calibration', 'Instrument', 'Divot', 'Array', 'Offset']
  },
  {
    id: 'exc-07',
    platform: 'EXCELSIUS',
    errorCode: 'E-4105',
    displayTitle: 'Robotic Arm Kinematic Joint Limit Reached',
    category: 'MECHANICAL_ARM_FORCE',
    clinicalPhase: 'EXECUTION',
    severity: 'WARNING',
    whatItMeans: 'The planned trajectory requires a robotic joint angle that exceeds the mechanical envelope or creates a risk of colliding with the patient table.',
    probableCauses: [
      'Robotic base cart positioned too far rostral or caudal relative to target spinal level',
      'Patient table height positioned outside the sweet spot (too low or too high)',
      'Steep medial-lateral pedicle trajectory planned on extreme obese patient habitus'
    ],
    immediateSteps: [
      'Elevate or lower operating table to bring target vertebra into the 600mm - 900mm robotic vertical envelope.',
      'If table adjustment is insufficient, unlock floor stabilizers and reposition the cart 10cm closer to the target level.',
      'Re-execute trajectory alignment in robotic software.'
    ],
    verificationCheck: 'All 6 articulated joints display in the green zone (> 15° from mechanical hard stops).',
    escalationFallback: 'Manually adjust the entry angle by 2-3 degrees on the plan to clear the joint limit without compromising pedicle fill.',
    fluoroCheckRecommended: false,
    tags: ['Kinematics', 'Joint Limit', 'Envelope', 'Workspace', 'Reach']
  },
  {
    id: 'exc-08',
    platform: 'EXCELSIUS',
    errorCode: 'E-3209',
    displayTitle: 'Intersegmental Vertebral Drift Warning',
    category: 'TRAJECTORY_ACCURACY',
    clinicalPhase: 'EXECUTION',
    severity: 'CRITICAL',
    whatItMeans: 'Trajectory error detected at non-indexed levels due to intersegmental spine motion between the reference vertebra and instrumented level.',
    probableCauses: [
      'DRB clamped at L1 while instrumenting L5-S1 (long multi-level segment drift)',
      'Aggressive facetectomy or interbody disc distraction performed after initial registration',
      'Change in operating table flexion/extension lordosis during the procedure'
    ],
    immediateSteps: [
      'Verify that the reference base is placed within 2 levels of the currently instrumented vertebra.',
      'Check accuracy on the specific lamina and facet of the target level using the verification probe.',
      'Do not instrument levels with > 1.5mm observed landmark discrepancy without level-by-level re-registration.'
    ],
    verificationCheck: 'Direct probe touch on target vertebra facet shows exact anatomical overlay.',
    escalationFallback: 'Perform level-by-level 2D/3D registration matching for each distinct spinal motion segment.',
    fluoroCheckRecommended: true,
    tags: ['Segmental Drift', 'Intersegmental', 'Multi-Level', 'Accuracy']
  }
];
