import { DiagnosticSymptomTree } from './roboticPlatforms';

export const ROBOTIC_SYMPTOM_TREES: DiagnosticSymptomTree[] = [
  {
    id: 'excelsius-trajectory-off',
    platform: 'EXCELSIUS',
    symptomTitle: 'Robotic Trajectory Off / Spatial Mismatch on Anatomy (ExcelsiusGPS)',
    category: 'TRAJECTORY_ACCURACY',
    nodes: {
      root: {
        id: 'root',
        question: 'Where is the spatial discrepancy being observed?',
        contextHint: 'Place the navigated verification probe tip firmly on a known bony landmark (e.g., spinous process tip or superior facet).',
        options: [
          {
            label: 'Off at ALL vertebral levels (Global shift)',
            description: 'Verification probe is inaccurate across every spinal level including the reference level.',
            nextNodeId: 'check-drb-stability'
          },
          {
            label: 'Off only at distant/adjacent levels, but ACCURATE at reference level',
            description: 'Accuracy is confirmed on the reference vertebra, but progressively deviates 2-3 levels away.',
            nextNodeId: 'check-segmental-drift'
          },
          {
            label: 'Trajectory is correct on surface bone, but drill/tap skives sideways during insertion',
            description: 'Initial entry point is accurate, but tool deflects laterally into facet or muscle.',
            nextNodeId: 'check-facet-skive'
          }
        ]
      },
      'check-drb-stability': {
        id: 'check-drb-stability',
        question: 'Is the Dynamic Reference Base (DRB) clamp or surveillance marker loose/toggled?',
        contextHint: 'Grasp the clamp base firmly and test for manual micro-motion or rotation.',
        options: [
          {
            label: 'YES - DRB clamp or pin has physical play or toggle',
            description: 'The clamp loosened or surveillance marker deflected due to accidental bump.',
            resolution: {
              title: 'DRB Skeletal Fixation Failure / Clamp Displacement',
              diagnosis: 'The reference base has lost rigid dual-cortical fixation with patient anatomy. Any subsequent robotic movements will possess unpredictable spatial error.',
              criticalActions: [
                'Do not proceed with instrumentation under current registration.',
                'Re-tighten clamp into solid bone (iliac crest or intact spinous process) with dual-cortex purchase.',
                'Acquire a new 3D fluoroscopy / CT spin or execute a full landmark re-registration sequence.',
                'Perform multi-point anatomical verification check before resuming.'
              ],
              verificationCheck: 'Place verification probe on spinous process tip. Coordinate mismatch on axial and sagittal views must be < 1.0mm.',
              escalationFallback: 'If pelvic clamp repeatedly loosens in osteoporotic bone, convert to spinous process clamp or navigated manual pedicle preparation with fluoroscopic confirmation.',
              isCritical: true
            }
          },
          {
            label: 'NO - DRB clamp is rock-solid and surveillance marker shows zero alert',
            description: 'Clamp is rigidly fixed, but global coordinates still do not align with patient anatomy.',
            nextNodeId: 'check-instrument-calibration'
          }
        ]
      },
      'check-instrument-calibration': {
        id: 'check-instrument-calibration',
        question: 'Does the verification probe or instrument pass divot calibration check?',
        contextHint: 'Insert the instrument tip into the robot base divot calibration port.',
        options: [
          {
            label: 'Divot check FAILS (Error > 0.5mm) or Array Bent',
            description: 'Instrument tip calibration is distorted due to bent shaft or dirty tracker array.',
            resolution: {
              title: 'Instrument Geometry Deformation / Calibration Offset',
              diagnosis: 'The tool active array geometry is offset from stored factory calibration, causing false visual discrepancy on screen while anatomy remains registered.',
              criticalActions: [
                'Inspect instrument tip under magnification for subtle bending.',
                'Re-seat the active LED tracker array firmly into the handle quick-connect collar.',
                'Re-run divot calibration routine on robot base.',
                'If error persists, replace with backup sterile instrument.'
              ],
              verificationCheck: 'Robot console displays "Instrument Divot Check: PASSED (Residual = 0.2mm)".',
              escalationFallback: 'Switch to secondary calibrated probe from sterile backup kit.',
              isCritical: false
            }
          },
          {
            label: 'Divot check PASSES, but visual overlay remains shifted',
            description: 'Instrument geometry is true, indicating an underlying registration volume distortion.',
            resolution: {
              title: 'Patient Position Shift vs. Pre-Op CT Volumetric Distortion',
              diagnosis: 'Patient lordosis or spinal alignment changed significantly between preoperative supine scan and intraoperative prone positioning.',
              criticalActions: [
                'Perform 2D/3D fluoroscopic landmark re-alignment in the registration workspace.',
                'Select 3 distinct bony fiducial points (pedicle eye, inferior endplate, spinous tip) to optimize local transformation.',
                'If discrepancy exceeds 2mm, take an intraoperative 3D fluoroscopic scan.'
              ],
              verificationCheck: 'Verify endplate and pedicle contour alignment across both AP and Lateral live fluoro views.',
              escalationFallback: 'Switch to intraoperative 3D spin registration or standard fluoro-guided navigation.',
              isCritical: true
            }
          }
        ]
      },
      'check-segmental-drift': {
        id: 'check-segmental-drift',
        question: 'Was an aggressive interbody distraction or facetectomy performed between registered levels?',
        contextHint: 'Spine flexibility can cause motion between lumbar levels (e.g. L4-L5 disc prep alters L4 relative to L5).',
        options: [
          {
            label: 'YES - Disc space distracted or interbody trials placed',
            description: 'Surgical manipulation altered relative intersegmental alignment.',
            resolution: {
              title: 'Intersegmental Kinematic Shift Post-Disc Preparation',
              diagnosis: 'The distance between the reference vertebra and instrumented level changed during surgical release.',
              criticalActions: [
                'Do not rely on single-level DRB registration across distracted disc spaces.',
                'Perform level-by-level planar registration matching for the operative segment.',
                'Move the reference clamp closer to the target level if working > 3 levels away.'
              ],
              verificationCheck: 'Touch the facet joint of the specific target vertebra with probe; verify crosshair aligns exactly with target level.',
              escalationFallback: 'Acquire a fresh intraoperative 3D spin with interbody spacers in-situ before pedicle screw instrumentation.',
              isCritical: true
            }
          },
          {
            label: 'NO - No distraction performed; pure percutaneous case',
            description: 'Intersegmental motion caused by table break or patient respiratory excursion.',
            resolution: {
              title: 'Segmental Flexibility / Table Sag Artifact',
              diagnosis: 'Physiological motion or table flexion induced non-rigid spinal deviation.',
              criticalActions: [
                'Ensure patient abdomen hangs free and table position has not changed.',
                'Re-register the operative motion segment individually.',
                'Lock DRB directly onto the index vertebra whenever possible.'
              ],
              verificationCheck: 'Segmental landmark test on operative lamina confirms < 1.0mm registration overlay.',
              escalationFallback: 'Re-align using level-specific 2D fluoro matching.',
              isCritical: false
            }
          }
        ]
      },
      'check-facet-skive': {
        id: 'check-facet-skive',
        question: 'What is the bone morphology at the pedicle docking entry site?',
        contextHint: 'Inspect the steepness of the superior articular process (SAP) facet slope.',
        options: [
          {
            label: 'Steep, sclerotic facet slope or steep lateral approach angle',
            description: 'Tool tip slips along the angled cortical bone rather than biting perpendicularly.',
            resolution: {
              title: 'Facet Skiving / Trajectory Deflection',
              diagnosis: 'Lateral force against sloping bone exceeds guide sleeve stiffness, causing lateral deviation.',
              criticalActions: [
                'Retract drill and clear all overlying soft tissue from the entry point.',
                'Use a 3mm matchstick or high-speed burr to decorticate a flat horizontal bony shelf at the entry point.',
                'Re-dock guide sleeve securely into the flattened trough before advancing the drill/tap.',
                'Reduce axial downward pressure; let the high-speed drill perform the cutting.'
              ],
              verificationCheck: 'Force load cell stays in the green zone (< 10N) and trajectory remains on planned trajectory vector.',
              escalationFallback: 'Use a navigated awl-tap technique under live crosshairs to establish the initial pedicle pilot tract.',
              isCritical: false
            }
          },
          {
            label: 'Dense hypertrophic bone with soft tissue impingement in cannula',
            description: 'Fascial bands catching in the guide tube sleeve.',
            resolution: {
              title: 'Soft Tissue Impingement Deflection',
              diagnosis: 'Fascia caught in the guide tube creates asymmetric torque on the robotic end-effector.',
              criticalActions: [
                'Retract guide tube and lengthen fascial incision by 5mm.',
                'Use electrocautery to sweep paraspinal muscle clean from the entry zone.',
                'Re-seat cannula directly against bare bone.'
              ],
              verificationCheck: 'Cannula rotates freely without elastic soft tissue recoil.',
              escalationFallback: 'Insert a sharp trocar sleeve to establish clear bony docking before instrumenting.',
              isCritical: false
            }
          }
        ]
      }
    }
  },
  {
    id: 'mazor-trajectory-off',
    platform: 'MAZOR_X',
    symptomTitle: 'Robotic Trajectory Off / Target Deviation (Mazor X Stealth)',
    category: 'TRAJECTORY_ACCURACY',
    nodes: {
      root: {
        id: 'root',
        question: 'What type of spatial mismatch is observed on the Mazor X Stealth console?',
        contextHint: 'Use the StealthStation navigated pointer to touch the anatomical verification target on the index vertebra.',
        options: [
          {
            label: 'Navigated pointer does NOT match virtual anatomy on Stealth screen',
            description: 'Global navigation registration offset observed across the segment.',
            nextNodeId: 'check-mount-rigidity'
          },
          {
            label: 'Stealth navigation is accurate, but Mazor robotic arm cannula is offset from plan',
            description: 'Navigation agrees with anatomy, but robotic arm trajectory guide deviates.',
            nextNodeId: 'check-arm-registration'
          },
          {
            label: 'Cannula deflects during high-speed drilling or screw insertion',
            description: 'Initial trajectory alignment is good, but tool wanders during bone penetration.',
            nextNodeId: 'check-cannula-skive'
          }
        ]
      },
      'check-mount-rigidity': {
        id: 'check-mount-rigidity',
        question: 'Is the bone-mounted Schanz pin or bed-mount bridge rigid?',
        contextHint: 'Apply gentle manual force to the reference frame post and bridge arm.',
        options: [
          {
            label: 'YES - Schanz pin or bridge clamp has toggle or looseness',
            description: 'Mechanical play in the bone mount or bridge clamp joint.',
            resolution: {
              title: 'Bone Mount Schanz Pin Instability / Bridge Cam Loosening',
              diagnosis: 'The physical reference anchor has toggled in bone or a quick-release cam lever has slipped, corrupting spatial transformation.',
              criticalActions: [
                'Tighten all bridge joints and verify cam levers are fully seated in lock position.',
                'If Schanz pin has toggled in bone, re-anchor pin in solid iliac crest or pedicle cortex.',
                'Re-acquire 3D O-arm spin or perform landmark re-registration.',
                'Verify rigidity with dual-point pointer check.'
              ],
              verificationCheck: 'StealthStation tracking overlay shows green status with target registration error < 0.8mm.',
              escalationFallback: 'Add a secondary triangulation stabilizing pin or convert to bed-mount frame.',
              isCritical: true
            }
          },
          {
            label: 'NO - Mount is rigid, but O-arm registration overlay is shifted',
            description: 'Bone mount is solid, but 3D volumetric matching has rotational error.',
            resolution: {
              title: 'O-arm 3D Scan-and-Plan Registration Convergence Error',
              diagnosis: 'Registration volume did not align properly with patient coordinate system due to tracker movement during spin or metal artifact.',
              criticalActions: [
                'Review reconstructed O-arm volume to verify reference spheres were stationary during spin.',
                'Perform manual landmark pairing on index level spinous process and facet.',
                'If error > 1.5mm, re-spin index levels with O-arm.'
              ],
              verificationCheck: 'Pointer check on 3 distinct anatomical points matches CT within 0.8mm.',
              escalationFallback: 'Re-acquire O-arm 3D spin ensuring tracker is isolated from table vibration.',
              isCritical: true
            }
          }
        ]
      },
      'check-arm-registration': {
        id: 'check-arm-registration',
        question: 'Did the robotic arm complete Hover-T spatial calibration with the Stealth camera?',
        contextHint: 'Check the 3D camera line of sight to the robotic arm tracking array.',
        options: [
          {
            label: 'Camera line of sight to robotic arm was interrupted or glare detected',
            description: 'Stealth camera lost tracking of arm optical target during approach.',
            resolution: {
              title: 'Robotic Arm Optical Tracking Occlusion / Glare',
              diagnosis: 'The optical camera lost visibility of the robotic arm tracker, preventing dynamic closed-loop positioning.',
              criticalActions: [
                'Ensure direct unobstructed line of sight from Stealth camera to robot arm array.',
                'Defocus overhead surgical lights away from reflective spheres.',
                'Replace any smudged or wet passive spheres on the arm array with dry ones.'
              ],
              verificationCheck: 'Robotic arm tracking ring turns solid green on StealthStation console.',
              escalationFallback: 'Reposition camera cart 20cm higher and angle downward at 40 degrees.',
              isCritical: false
            }
          },
          {
            label: 'Arm reached kinematic joint limit or table collision boundary',
            description: 'Joint angle exceeded maximum articulation envelope.',
            resolution: {
              title: 'Arm Kinematic Workspace Saturation',
              diagnosis: 'The planned entry angle requires an articulated arm pose that is close to a mechanical singularity or collision limit.',
              criticalActions: [
                'Adjust table height to center operative spine in the Mazor vertical sweet spot.',
                'Unlock bridge base and reposition arm mount 5cm toward the operative side.',
                'Re-execute trajectory sequence.'
              ],
              verificationCheck: 'Hover-T positioning indicator confirms target acquisition within 0.3mm.',
              escalationFallback: 'Modify trajectory plan slightly (1-2° angulation) to avoid joint singularity.',
              isCritical: false
            }
          }
        ]
      },
      'check-cannula-skive': {
        id: 'check-cannula-skive',
        question: 'Is the cannula flexing against steep sloping facet cortical bone?',
        contextHint: 'Observe cannula stability during high-speed drill or tap engagement.',
        options: [
          {
            label: 'YES - Steep lateral trajectory skiving off facet slope',
            description: 'Cannula flexes laterally when drill bites into hard cortical facet.',
            resolution: {
              title: 'High-Angle Facet Skiving on Mazor Cannula',
              diagnosis: 'The lateral vector of the cannula causes the drill tip to deflect along the steep superior articular process.',
              criticalActions: [
                'Retract cannula and clear soft tissue down to bare lamina/facet.',
                'Use high-speed matchstick burr to create a flat cortical docking notch.',
                'Firmly dock Mazor cannula into the prepared notch before drilling.',
                'Advance drill with high RPM and gentle axial pressure.'
              ],
              verificationCheck: 'Cannula stays concentric with planned trajectory crosshair (< 0.5mm deviation).',
              escalationFallback: 'Use navigated hand drill guide with tactile surgeon feedback.',
              isCritical: false
            }
          },
          {
            label: 'NO - Soft tissue / muscle catching in cannula guide',
            description: 'Fascia drag causing trajectory deviation.',
            resolution: {
              title: 'Soft Tissue Drag Trajectory Distortion',
              diagnosis: 'Tight fascial band exerts continuous lateral torque on the guide tube.',
              criticalActions: [
                'Extend fascial release incision by 5-10mm.',
                'Insert blunt tissue dilator through cannula to verify free path to bone.',
                'Re-dock cannula solidly on lamina.'
              ],
              verificationCheck: 'Guide sleeve sits passively on bone without spring-back deflection.',
              escalationFallback: 'Use electrocautery to perform wider subperiosteal pocket release.',
              isCritical: false
            }
          }
        ]
      }
    }
  }
];
