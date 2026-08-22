import { SurgicalProcedure } from '../types';

export const PROCEDURES: SurgicalProcedure[] = [
  {
    id: 'proc-01',
    name: 'Prone Lateral Lumbar Interbody Fusion (PTP / Prone-XLIF)',
    shortCode: 'PTP-L4L5',
    subspecialty: 'Minimally Invasive Spine',
    anatomicalRegion: 'Lumbar Spine (L1-L5)',
    typicalDurationMinutes: 140,
    description: 'Single-position lateral access with the patient prone, allowing simultaneous anterior column reconstruction and posterior robotic percutaneous fixation.',
    steps: [
      {
        id: 's1-1',
        phase: 'Pre-Op & Robotic Planning',
        stepName: 'Pre-Op CT to Intra-Op Prone Non-Rigid Registration',
        standardPractice: 'Rigid fiducial Dynamic Reference Array (DRA) clamped to iliac crest.',
        clinicalBottleneck: 'Fiducial clamp knocked by assistant; prone position alters lordosis vs supine CT scan.',
        bottleneckId: 'bn-01',
        relevantInnovationIds: ['inn-01', 'inn-56']
      },
      {
        id: 's1-2',
        phase: 'Table Kinematics & Positioning',
        stepName: 'Lateral Flank Positioning & Psoas Stretch Mitigation',
        standardPractice: 'Static bolsters; manual jackknife table break.',
        clinicalBottleneck: 'Static hip position maintains excessive passive tension on lumbar plexus during retroperitoneal transit.',
        bottleneckId: 'bn-02',
        relevantInnovationIds: ['inn-41', 'inn-42']
      },
      {
        id: 's1-3',
        phase: 'Corridor Access & Retraction',
        stepName: 'Retroperitoneal Psoas Dilator & Blade Expansion',
        standardPractice: 'Rigid 2/3-blade cylindrical retractor with continuous neuromonitoring.',
        clinicalBottleneck: 'Sustained ischemic pressure on femoral nerve branches and muscle creep under blade tips.',
        bottleneckId: 'bn-03',
        relevantInnovationIds: ['inn-02', 'inn-03', 'inn-04']
      },
      {
        id: 's1-4',
        phase: 'Visualization, Lighting & Optics',
        stepName: 'Deep 90mm Disc Corridor Illumination',
        standardPractice: 'Exoscope or overhead light at 400mm focal distance.',
        clinicalBottleneck: 'Severe shadow cast by retractor rims; exoscope line-of-sight obstructed by surgeon hands.',
        bottleneckId: 'bn-04',
        relevantInnovationIds: ['inn-57', 'inn-58']
      },
      {
        id: 's1-5',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Contralateral Annulotomy & Endplate Scraping',
        standardPractice: 'Long straight Cobb elevators and mechanical ring curettes.',
        clinicalBottleneck: 'Risk of contralateral great vessel injury or vertebral endplate breach during blind scraping.',
        bottleneckId: 'bn-05',
        relevantInnovationIds: ['inn-21', 'inn-22', 'inn-76']
      },
      {
        id: 's1-6',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'High-Lordosis Cage Insertion around Iliac Crest',
        standardPractice: 'Straight rigid inserter tapped with surgical mallet.',
        clinicalBottleneck: 'High iliac crest obstructs L4-L5 straight trajectory; articulating inserters shear under heavy impaction.',
        bottleneckId: 'bn-06',
        relevantInnovationIds: ['inn-77', 'inn-78']
      },
      {
        id: 's1-7',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Retroperitoneal Muscular & Fascial Closure',
        standardPractice: 'Hand-tied interrupted heavy braided sutures in deep pocket.',
        clinicalBottleneck: 'Difficult knot security in deep corridor; post-op abdominal muscle flank bulge and seroma.',
        bottleneckId: 'bn-07',
        relevantInnovationIds: ['inn-91', 'inn-92']
      }
    ]
  },
  {
    id: 'proc-02',
    name: 'MIS Tubular Lumbar Microdiscectomy',
    shortCode: 'MIS-MD',
    subspecialty: 'Minimally Invasive Spine',
    anatomicalRegion: 'Lumbar Spine (L4-S1)',
    typicalDurationMinutes: 65,
    description: 'Targeted nerve root decompression and herniated fragment excision through an expandable 14-16mm tubular port under operative exoscope/microscope.',
    steps: [
      {
        id: 's2-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Sequential Serial Dilation and Tubular Port Lock',
        standardPractice: 'Table-mounted flexible arm clamping a 16mm cylindrical tube.',
        clinicalBottleneck: 'Tube drift over facet joint during table bump; paraspinal tissue creep into bottom of tube.',
        bottleneckId: 'bn-03',
        relevantInnovationIds: ['inn-02', 'inn-05']
      },
      {
        id: 's2-2',
        phase: 'Visualization, Lighting & Optics',
        stepName: 'High-Magnification Visualization of Thecal Sac Margin',
        standardPractice: 'Binocular operative microscope with 300mm lens.',
        clinicalBottleneck: 'Surgeon neck fatigue with fixed oculars; shadow at the shoulder of the S1 traversing nerve root.',
        bottleneckId: 'bn-04',
        relevantInnovationIds: ['inn-57', 'inn-59']
      },
      {
        id: 's2-3',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Flavotomy & Laminar Hemiresection',
        standardPractice: 'High-speed 3mm matchstick burr and Kerrison rongeurs.',
        clinicalBottleneck: 'Bone dust clogging suction; thermal transfer to thecal sac; foot-pedal cord clutter in OR.',
        bottleneckId: 'bn-08',
        relevantInnovationIds: ['inn-23', 'inn-24']
      },
      {
        id: 's2-4',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Axilla & Shoulder Nerve Root Retraction and Fragment Removal',
        standardPractice: 'Handheld nerve root retractor and straight micro-pituitary rongeurs.',
        clinicalBottleneck: 'Inability to reach migrated sub-ligamentous fragments without excessive dural retraction.',
        bottleneckId: 'bn-09',
        relevantInnovationIds: ['inn-79', 'inn-80']
      },
      {
        id: 's2-5',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Incidental Durotomy Repair & Fascial Closure',
        standardPractice: 'Fibrin glue with muscle pledget or complex micro-suturing inside 16mm tube.',
        clinicalBottleneck: 'Needle holder maneuvering inside 16mm tube is nearly impossible; high risk of persistent CSF leak.',
        bottleneckId: 'bn-10',
        relevantInnovationIds: ['inn-93', 'inn-94']
      }
    ]
  },
  {
    id: 'proc-03',
    name: 'Anterior Cervical Discectomy and Fusion (ACDF)',
    shortCode: 'ACDF-C5C6',
    subspecialty: 'Degenerative Spine',
    anatomicalRegion: 'Subaxial Cervical Spine (C3-C7)',
    typicalDurationMinutes: 85,
    description: 'Anterior Smith-Robinson approach for cervical nerve root and spinal cord decompression with interbody cage and anterior plate fixation.',
    steps: [
      {
        id: 's3-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Visceral & Carotid Retraction',
        standardPractice: 'Cloward or blade retractors held under continuous tension.',
        clinicalBottleneck: 'Prolonged esophageal retraction pressure leads to post-op dysphagia and recurrent laryngeal neuropraxia.',
        bottleneckId: 'bn-11',
        relevantInnovationIds: ['inn-06', 'inn-07']
      },
      {
        id: 's3-2',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Posterior Osteophyte Drilling and PLL Resection',
        standardPractice: 'Diamond burr and micro-curettes adjacent to dura.',
        clinicalBottleneck: 'Thermal bone injury and mechanical kick-back when burr grabs posterior osteophyte edge.',
        bottleneckId: 'bn-08',
        relevantInnovationIds: ['inn-25', 'inn-26']
      },
      {
        id: 's3-3',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Uncinate Resection & Foraminal Decompression',
        standardPractice: 'Straight micro-punches angled into the neural foramen.',
        clinicalBottleneck: 'Straight shafts occlude exoscope line-of-sight to the vertebral artery wall.',
        bottleneckId: 'bn-09',
        relevantInnovationIds: ['inn-81', 'inn-82']
      },
      {
        id: 's3-4',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Platysma & Subcuticular Skin Seal',
        standardPractice: 'Absorbable running suture and dermabond.',
        clinicalBottleneck: 'Sub-fascial dead space leading to anterior neck hematoma with airway compromise risk.',
        bottleneckId: 'bn-07',
        relevantInnovationIds: ['inn-91', 'inn-95']
      }
    ]
  },
  {
    id: 'proc-04',
    name: 'Endoscopic Transsphenoidal Skull Base Pituitary Resection',
    shortCode: 'ETS-Pituitary',
    subspecialty: 'Cranial Skull Base',
    anatomicalRegion: 'Sella Turcica & Sphenoid Sinus',
    typicalDurationMinutes: 150,
    description: 'Bi-nostril endoscopic approach to sella turcica, clivus, and suprasellar space for adenoma and craniopharyngioma resection.',
    steps: [
      {
        id: 's4-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Nasal Turbinate Lateralization & Sphenoidotomy',
        standardPractice: 'Rigid endoscope sheath with free-hand suction instruments.',
        clinicalBottleneck: 'Endoscope lens soiling by blood mist and bone debris requiring frequent removal and wiping.',
        bottleneckId: 'bn-12',
        relevantInnovationIds: ['inn-60', 'inn-61']
      },
      {
        id: 's4-2',
        phase: 'Visualization, Lighting & Optics',
        stepName: '4K 30° / 45° Angled Panoramic Sellur Inspection',
        standardPractice: 'Rigid rod-lens endoscope held by assistant or robotic arm.',
        clinicalBottleneck: 'Clashing between surgeon micro-instruments and assistant endoscope in narrow nasal corridor.',
        bottleneckId: 'bn-13',
        relevantInnovationIds: ['inn-62', 'inn-63']
      },
      {
        id: 's4-3',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Sellur Floor Sellar-Carotid Bone Drilling',
        standardPractice: 'Curved high-speed diamond burr.',
        clinicalBottleneck: 'Thermal transmission to optic chiasm and internal carotid artery adventitia; bone slurry clogging.',
        bottleneckId: 'bn-08',
        relevantInnovationIds: ['inn-27', 'inn-28']
      },
      {
        id: 's4-4',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Suprasellar & Cavernous Sinus Micro-Curettage',
        standardPractice: 'Ring and malleable curettes.',
        clinicalBottleneck: 'Blind scraping in medial cavernous sinus pocket risking abducens nerve or carotid laceration.',
        bottleneckId: 'bn-09',
        relevantInnovationIds: ['inn-83', 'inn-84']
      },
      {
        id: 's4-5',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Sellar Reconstruction & Nasoseptal Flap Fixation',
        standardPractice: 'Fat graft, fascia lata, tissue glue, and nasal packing.',
        clinicalBottleneck: 'Post-op high-flow CSF leak and pneumocephalus if hydrostatic pressure exceeds glue seal.',
        bottleneckId: 'bn-10',
        relevantInnovationIds: ['inn-96', 'inn-97']
      }
    ]
  },
  {
    id: 'proc-05',
    name: 'Retrosigmoid Craniotomy for Vestibular Schwannoma / MVD',
    shortCode: 'RS-Acoustic',
    subspecialty: 'Cranial Skull Base',
    anatomicalRegion: 'Cerebellopontine Angle (CPA)',
    typicalDurationMinutes: 240,
    description: 'Suboccipital lateral corridor to the cerebellopontine angle for microvascular decompression or acoustic neuroma resection with cranial nerve monitoring.',
    steps: [
      {
        id: 's5-1',
        phase: 'Table Kinematics & Positioning',
        stepName: 'Park Bench / Lateral Decubitus Head Fixation',
        standardPractice: '3-pin Mayfield skull clamp with shoulder taping.',
        clinicalBottleneck: 'Brachial plexus traction stretch; jugular venous outflow obstruction from excessive cervical rotation.',
        bottleneckId: 'bn-02',
        relevantInnovationIds: ['inn-43', 'inn-44']
      },
      {
        id: 's5-2',
        phase: 'Corridor Access & Retraction',
        stepName: 'Cerebellar Dynamic Retraction without Brain Injury',
        standardPractice: 'Leyla or Greenberg flexible retractor blade on cerebellum.',
        clinicalBottleneck: 'Cerebellar contusion and edema from fixed mechanical retractor pressure over hours.',
        bottleneckId: 'bn-03',
        relevantInnovationIds: ['inn-08', 'inn-09']
      },
      {
        id: 's5-3',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Internal Auditory Canal (IAC) Posterior Lip Drilling',
        standardPractice: 'Long-shank diamond burr near semicircular canals and facial nerve.',
        clinicalBottleneck: 'Burr shaft oscillation/chatter in deep corridor risking labyrinth violation or facial nerve stretch.',
        bottleneckId: 'bn-14',
        relevantInnovationIds: ['inn-29', 'inn-30']
      },
      {
        id: 's5-4',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Facial-Acoustic Nerve Dissection from Tumor Capsule',
        standardPractice: 'Micro-scissors, bayoneted micro-instruments under high magnification.',
        clinicalBottleneck: 'Hand tremor and instrument glare under microscope; lack of real-time nerve proximity warning.',
        bottleneckId: 'bn-15',
        relevantInnovationIds: ['inn-85', 'inn-86']
      },
      {
        id: 's5-5',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Aerosinus Watertight Dural Closure over Mastoid Air Cells',
        standardPractice: 'Pericranial graft or dural substitute with bone wax in air cells.',
        clinicalBottleneck: 'Pseudomeningocele and intractable post-op CSF otorrhea/rhinorrhea through unsealed petrous cells.',
        bottleneckId: 'bn-10',
        relevantInnovationIds: ['inn-98', 'inn-99']
      }
    ]
  },
  {
    id: 'proc-06',
    name: 'Adult Spinal Deformity Correction (PSO / 3-Column Osteotomy)',
    shortCode: 'ASD-PSO',
    subspecialty: 'Complex Spine Deformity',
    anatomicalRegion: 'Thoracolumbar Spine (T10-Pelvis)',
    typicalDurationMinutes: 360,
    description: 'Complex multi-level posterior column osteotomies (PCO) and pedicle subtraction osteotomy (PSO) for severe sagittal and coronal malalignment.',
    steps: [
      {
        id: 's6-1',
        phase: 'Pre-Op & Robotic Planning',
        stepName: 'Sagittal Spinopelvic Parameter Trajectory Alignment',
        standardPractice: '2D static whole-spine x-rays with manual rod contouring.',
        clinicalBottleneck: 'Inability to predict intra-op rod flattening and proximal junctional kyphosis (PJK) stress points.',
        bottleneckId: 'bn-01',
        relevantInnovationIds: ['inn-01', 'inn-64']
      },
      {
        id: 's6-2',
        phase: 'Table Kinematics & Positioning',
        stepName: 'Dynamic Table Lordosis Extension during Osteotomy Closure',
        standardPractice: 'Manual table repositioning while holding corrective cantilever forces on rods.',
        clinicalBottleneck: 'Uncoordinated table motion causes sudden laminar impingement or thecal sac buckling.',
        bottleneckId: 'bn-16',
        relevantInnovationIds: ['inn-45', 'inn-46']
      },
      {
        id: 's6-3',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Vertebral Wedge Resection & Medial Wall Decancellation',
        standardPractice: 'Osteotomes, high-speed drills, and large rongeurs.',
        clinicalBottleneck: 'Massive cancellous bone bleeding; high risk of dural kinking during wedge closure.',
        bottleneckId: 'bn-17',
        relevantInnovationIds: ['inn-31', 'inn-32']
      },
      {
        id: 's6-4',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'High-Torque Dual Rod Cantilever Reduction & Set-Screw Lock',
        standardPractice: 'Heavy reduction towers with long torque wrenches.',
        clinicalBottleneck: 'Massive wrist strain, set screw cross-threading, and bone-screw interface pullout in osteoporotic bone.',
        bottleneckId: 'bn-18',
        relevantInnovationIds: ['inn-87', 'inn-88']
      },
      {
        id: 's6-5',
        phase: 'Dural Reconstruction & Wound Closure',
        stepName: 'Extensive Multi-Layer Myofascial Dead Space Closure',
        standardPractice: 'Heavy #2 absorbable sutures with deep drains.',
        clinicalBottleneck: 'Massive dead space seromas, high wound breakdown rates, and persistent surgical site infection.',
        bottleneckId: 'bn-07',
        relevantInnovationIds: ['inn-91', 'inn-100']
      }
    ]
  },
  {
    id: 'proc-07',
    name: 'Pterional Craniotomy for Anterior Circulation Aneurysm Clipping',
    shortCode: 'Pterional-Aneurysm',
    subspecialty: 'Cerebrovascular',
    anatomicalRegion: 'Sylvian Fissure & Circle of Willis',
    typicalDurationMinutes: 210,
    description: 'Microsurgical trans-sylvian dissection of MCA, ACom, or PCom aneurysms with temporary and permanent clip application under ICG flow verification.',
    steps: [
      {
        id: 's7-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Sylvian Fissure Micro-Dissection and Frontal/Temporal Mobilization',
        standardPractice: 'Sharp arachnoid dissection with fixed micro-spatulas.',
        clinicalBottleneck: 'Brain parenchymal retraction injury and bridging vein avulsion during deep corridor maintenance.',
        bottleneckId: 'bn-03',
        relevantInnovationIds: ['inn-09', 'inn-10']
      },
      {
        id: 's7-2',
        phase: 'Visualization, Lighting & Optics',
        stepName: 'Deep Carotid Cistern & Perforator Inspection',
        standardPractice: 'Operating microscope with integrated near-infrared ICG fluorescence.',
        clinicalBottleneck: 'Inability to see behind the aneurysm neck to verify perforating lenticulostriate vessel patency.',
        bottleneckId: 'bn-19',
        relevantInnovationIds: ['inn-65', 'inn-66']
      },
      {
        id: 's7-3',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Multi-Angle Clip Applier Deployment in Tight Cistern',
        standardPractice: 'Bayoneted spring-clip applier with fixed shaft geometry.',
        clinicalBottleneck: 'Clip applier jaws block microscope line of sight at the exact moment of vessel occlusion.',
        bottleneckId: 'bn-20',
        relevantInnovationIds: ['inn-89', 'inn-90']
      }
    ]
  },
  {
    id: 'proc-08',
    name: 'Posterior Cervical Laminoplasty',
    shortCode: 'Cervical-Lamino',
    subspecialty: 'Degenerative Spine',
    anatomicalRegion: 'Cervical Spine (C3-C7)',
    typicalDurationMinutes: 110,
    description: 'Expansion of cervical canal for multi-level cervical spondylotic myelopathy using open-door hinge and mini-plate fixation.',
    steps: [
      {
        id: 's8-1',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Open and Hinge Gutter Drilling',
        standardPractice: 'High-speed diamond burr cutting unicortical greenstick vs bicortical troughs.',
        clinicalBottleneck: 'Drill slippage into spinal canal or premature complete fracture of the hinge side.',
        bottleneckId: 'bn-08',
        relevantInnovationIds: ['inn-25', 'inn-33']
      },
      {
        id: 's8-2',
        phase: 'Maneuvering & Micro-Instruments',
        stepName: 'Laminar Elevation and Mini-Plate Screw Fixation',
        standardPractice: 'Handheld laminar spreaders and micro-screwdrivers.',
        clinicalBottleneck: 'Narrow corridor makes lateral screw driver trajectory awkward, risking facet joint penetration.',
        bottleneckId: 'bn-09',
        relevantInnovationIds: ['inn-82', 'inn-87']
      }
    ]
  },
  {
    id: 'proc-09',
    name: 'Endoscopic Third Ventriculostomy (ETV) & Colloid Cyst Resection',
    shortCode: 'ETV-Ventricle',
    subspecialty: 'Neuro-Oncology & Eloquence',
    anatomicalRegion: 'Third Ventricle & Foramen of Monro',
    typicalDurationMinutes: 75,
    description: 'Rigid or flexible neuroendoscopic fenestration of third ventricle floor for obstructive hydrocephalus or intraventricular lesion excision.',
    steps: [
      {
        id: 's9-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Stereotactic Burr Hole and Ventricular Cannulation',
        standardPractice: 'Peel-away sheath into frontal horn of lateral ventricle.',
        clinicalBottleneck: 'Fornix contusion at the Foramen of Monro during endoscope torqueing and manipulation.',
        bottleneckId: 'bn-21',
        relevantInnovationIds: ['inn-11', 'inn-12']
      },
      {
        id: 's9-2',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Ventricular Floor Blunt Fenestration & Fogarty Balloon Dilation',
        standardPractice: 'Blunt bipolar probe and 3F Fogarty catheter.',
        clinicalBottleneck: 'Risk of tearing the underlying basilar artery tip or perforators due to blind balloon expansion.',
        bottleneckId: 'bn-22',
        relevantInnovationIds: ['inn-34', 'inn-35']
      }
    ]
  },
  {
    id: 'proc-10',
    name: 'Intramedullary Spinal Cord Tumor Resection (Ependymoma / Astrocytoma)',
    shortCode: 'Spinal-Cord-Tumor',
    subspecialty: 'Neuro-Oncology & Eloquence',
    anatomicalRegion: 'Cervical & Thoracic Cord',
    typicalDurationMinutes: 280,
    description: 'Midline dorsal myelotomy with microscopic ultrasonic aspiration of intrinsic spinal cord mass under continuous D-wave and SSEP/MEP neuro-monitoring.',
    steps: [
      {
        id: 's10-1',
        phase: 'Corridor Access & Retraction',
        stepName: 'Pial Stitch Elevation & Spinal Cord Flap Retraction',
        standardPractice: '6-0 monofilament pial traction sutures to the dura.',
        clinicalBottleneck: 'Asymmetrical traction tears fragile cord parenchyma and causes dorsal column ischemia.',
        bottleneckId: 'bn-03',
        relevantInnovationIds: ['inn-13', 'inn-14']
      },
      {
        id: 's10-2',
        phase: 'Drills, Resection & Cavitation',
        stepName: 'Micro-Ultrasonic Tumor Debulking at Cord Interface',
        standardPractice: 'Cavitron Ultrasonic Surgical Aspirator (CUSA) micro-tip.',
        clinicalBottleneck: 'Thermal cavitation spread and cavitation fluid pressure waves causing sudden MEP signal dropouts.',
        bottleneckId: 'bn-23',
        relevantInnovationIds: ['inn-36', 'inn-37']
      }
    ]
  }
];
