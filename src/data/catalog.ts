// All content in this file is taken from the QBeeMind 2026 catalogues.
// Do not add ratings, enrolment counts or placement percentages here —
// the catalogue explicitly commits to not quoting numbers it cannot back up.

export type Domain = 'vlsi' | 'embedded' | 'edge';

export const DOMAINS: Record<Domain, { name: string; short: string; series: string; blurb: string }> = {
  vlsi: {
    name: 'VLSI Design',
    short: 'VLSI',
    series: 'VLSI series',
    blurb: 'From transistor-level CMOS through RTL design, verification, physical design, timing, and FPGA — the full VLSI skill set, each course project-based.',
  },
  embedded: {
    name: 'Embedded Systems',
    short: 'Embedded',
    series: 'EMB series',
    blurb: 'Self-contained, project-based courses that take you from code to working hardware — bare-metal C, ARM Cortex-M, RTOS, protocols, embedded Linux and automotive.',
  },
  edge: {
    name: 'Edge AI',
    short: 'Edge AI',
    series: 'EDGE series',
    blurb: 'From machine-learning fundamentals to running optimized models on real edge hardware — microcontrollers, Jetson, Zynq and camera pipelines.',
  },
};

export interface Course {
  code: string;
  slug: string;
  domain: Domain;
  title: string;
  tagline: string;
  level: string;
  levelTier: 'Foundation' | 'Intermediate' | 'Advanced';
  weeks: number;
  hours: number;
  prerequisites: string;
  tools: string;
  mode: string;
  overview: string;
  modules: { title: string; body: string }[];
  capstone: string;
  outcomes: string[];
  roles?: string;
}

export const COURSE_FEE = 15000;

const c = (x: Omit<Course, 'slug'>): Course => ({ ...x, slug: x.code.toLowerCase() });

export const COURSES: Course[] = [
  // ───────────────────────── VLSI ─────────────────────────
  c({
    code: 'VLSI-101', domain: 'vlsi', title: 'Digital Design with Verilog & SystemVerilog',
    tagline: 'The RTL foundation every VLSI engineer needs.',
    level: 'Foundation — graduates & final-year students', levelTier: 'Foundation', weeks: 6, hours: 45,
    prerequisites: 'Basic digital electronics (logic gates, flip-flops), any C-family language helps',
    tools: 'Icarus Verilog / ModelSim, GTKWave, Xilinx Vivado (simulation)',
    mode: 'Instructor-led with weekly hands-on labs',
    overview: 'This course builds the ability to describe real hardware in Verilog and SystemVerilog and to think in terms of clocks, registers, and parallelism rather than sequential software. You start from combinational and sequential building blocks and progress to synthesizable, reusable RTL for complete digital blocks — the skill every downstream VLSI role, from design to verification to physical design, depends on.',
    modules: [
      { title: 'Verilog Essentials', body: 'Data types, operators, module structure, continuous vs procedural assignments, and the difference between simulation and synthesis.' },
      { title: 'Combinational & Sequential RTL', body: 'Designing adders, multiplexers, decoders, counters, and shift registers; blocking vs non-blocking assignments and why it matters.' },
      { title: 'Finite State Machines', body: 'Moore and Mealy machines, one-hot vs binary encoding, and writing FSMs that synthesize cleanly.' },
      { title: 'SystemVerilog for Design', body: 'logic type, always_comb / always_ff, packed and unpacked arrays, interfaces, and parameterized reusable modules.' },
      { title: 'Testbenches & Simulation', body: 'Writing self-checking testbenches, stimulus generation, waveform debugging, and assertion basics.' },
      { title: 'Synthesis Awareness', body: 'Coding for synthesis, inferring latches vs registers, reset strategies, and reading a synthesis report.' },
    ],
    capstone: 'Design and verify a synthesizable digital block of moderate complexity — for example a UART transmitter/receiver or a traffic-light controller with configurable timing — complete with a self-checking testbench and a short design document explaining your choices.',
    outcomes: ['Fluency writing clean, synthesizable Verilog and SystemVerilog RTL.', 'A working, verified design you can show in interviews.', 'The vocabulary and habits that make the advanced VLSI tracks far easier.'],
    roles: 'RTL Design Engineer, Design Verification (DV) Engineer (with VLSI-102)',
  }),
  c({
    code: 'VLSI-102', domain: 'vlsi', title: 'Functional Verification with SystemVerilog & UVM',
    tagline: 'Verification is where most VLSI jobs actually are.',
    level: 'Intermediate — after VLSI-101 or equivalent RTL experience', levelTier: 'Intermediate', weeks: 8, hours: 55,
    prerequisites: 'Comfort with Verilog/SystemVerilog RTL and basic testbenches',
    tools: 'Synopsys VCS / Mentor Questa (or EDA Playground), UVM 1.2 library',
    mode: 'Instructor-led with build-as-you-go testbench labs',
    overview: 'Verification consumes the majority of effort in a modern chip project, and UVM is the industry-standard methodology for it. This course takes you from object-oriented SystemVerilog through a complete, reusable UVM testbench, so you can verify a design methodically with constrained-random stimulus, functional coverage, and a scoreboard — the exact skill set verification teams hire for.',
    modules: [
      { title: 'OOP in SystemVerilog', body: 'Classes, inheritance, polymorphism, virtual methods, and randomization constraints — the language layer UVM is built on.' },
      { title: 'UVM Architecture', body: 'Agents, drivers, monitors, sequencers, and the environment; the UVM phases and factory.' },
      { title: 'Stimulus & Sequences', body: 'Writing sequences and sequence items, virtual sequences, and layering constrained-random stimulus.' },
      { title: 'Checking & Coverage', body: 'Scoreboards, reference models, functional coverage, and covergroups tied to a verification plan.' },
      { title: 'Configuration & Reuse', body: 'The config DB, overrides via the factory, and building a testbench you can reuse across projects.' },
      { title: 'Debug & Closure', body: 'Reading logs, waveform and transaction-level debug, regression runs, and reaching coverage closure.' },
    ],
    capstone: 'Build a complete UVM testbench for a provided DUT (e.g. an APB/AHB peripheral or a FIFO), including a driver, monitor, scoreboard, and a functional-coverage model, then demonstrate coverage closure with a short verification report.',
    outcomes: ['A reusable UVM environment you built yourself, end to end.', 'The ability to read a spec and write a verification plan.', 'Direct readiness for Design Verification (DV) engineer roles.'],
    roles: 'Design Verification (DV) Engineer',
  }),
  c({
    code: 'VLSI-103', domain: 'vlsi', title: 'ASIC Physical Design — RTL to GDSII',
    tagline: 'Turn RTL into a manufacturable layout.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 8, hours: 55,
    prerequisites: 'VLSI-101 or solid RTL knowledge; basic understanding of CMOS',
    tools: 'Open-source flow (Yosys, OpenROAD/OpenLane) with commercial-flow concepts explained',
    mode: 'Instructor-led, flow-driven labs on a real standard-cell design',
    overview: 'Physical design is the back-end path that converts a verified netlist into the geometry a foundry can fabricate. This course walks the full RTL-to-GDSII flow — synthesis, floorplanning, placement, clock tree synthesis, routing, and sign-off — so you understand not just the push-button steps but the trade-offs in timing, power, and area that decide whether a chip closes.',
    modules: [
      { title: 'Flow & Library Basics', body: 'The ASIC flow overview, standard cells, technology libraries, LEF/DEF, and timing libraries (.lib).' },
      { title: 'Logic Synthesis', body: 'Constraints (SDC), mapping RTL to gates, and reading area/timing/power from synthesis.' },
      { title: 'Floorplanning & Power', body: 'Die/core area, placement of macros and pins, power planning, and the power grid.' },
      { title: 'Placement & CTS', body: 'Standard-cell placement, congestion, clock tree synthesis, skew, and clock-tree quality.' },
      { title: 'Routing', body: 'Global and detailed routing, DRC-clean routing, and resolving congestion and shorts.' },
      { title: 'Sign-off', body: 'Static timing analysis for setup/hold, IR-drop and EM awareness, and generating GDSII.' },
    ],
    capstone: 'Take a provided RTL block through the complete flow to a routed, DRC-clean GDSII layout, documenting your floorplan decisions and the timing results at each stage.',
    outcomes: ['Hands-on experience of the full RTL-to-GDSII flow on a real design.', 'The ability to read and reason about timing, power, and area reports.', 'A layout and flow report that demonstrates back-end capability.'],
    roles: 'Physical Design Engineer (with VLSI-104)',
  }),
  c({
    code: 'VLSI-104', domain: 'vlsi', title: 'Static Timing Analysis (STA)',
    tagline: 'The discipline that decides if a chip runs at speed.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 5, hours: 35,
    prerequisites: 'RTL knowledge and basic familiarity with the ASIC flow',
    tools: 'OpenSTA / PrimeTime-style flow, example libraries and SDC sets',
    mode: 'Instructor-led with report-analysis labs',
    overview: 'Static timing analysis is how teams prove, without exhaustive simulation, that every path in a design meets its timing. This focused course builds a precise mental model of setup and hold, clock definitions, and constraints, and then trains you to read timing reports and fix real violations — a skill valued across both front-end and back-end roles.',
    modules: [
      { title: 'Timing Fundamentals', body: 'Setup and hold, launch and capture, slack, and the single-clock timing path.' },
      { title: 'Clocks & Constraints', body: 'Defining clocks, generated clocks, input/output delays, and writing correct SDC.' },
      { title: 'Path Types & Exceptions', body: 'Reg-to-reg, I/O paths, multicycle and false paths, and when each applies.' },
      { title: 'Analyzing Reports', body: 'Reading a timing report line by line, identifying the critical path, and interpreting slack.' },
      { title: 'Fixing Violations', body: 'Closing setup and hold violations, understanding on-chip variation and corners (PVT).' },
    ],
    capstone: 'Analyze the timing of a provided gate-level design across corners, identify the critical paths and violations, and present a report proposing concrete fixes with their expected effect on slack.',
    outcomes: ['Confidence reading and debugging STA reports.', 'A clear grasp of constraints, corners, and timing closure.', 'A timing-analysis report you can discuss in depth in interviews.'],
    roles: 'STA / Timing Engineer (with VLSI-103)',
  }),
  c({
    code: 'VLSI-105', domain: 'vlsi', title: 'FPGA Prototyping & Design',
    tagline: 'From RTL to a design running on real silicon you can touch.',
    level: 'Foundation to intermediate', levelTier: 'Intermediate', weeks: 6, hours: 45,
    prerequisites: 'VLSI-101 or basic Verilog; an FPGA board is helpful but not required',
    tools: 'Xilinx Vivado (Artix/Zynq class), on-board or simulated targets',
    mode: 'Instructor-led, board-oriented labs',
    overview: 'FPGAs let you take RTL all the way to working hardware without a foundry, which makes them the fastest route to demonstrable, real-world VLSI work. This course covers the FPGA design flow, on-chip resources, and timing constraints, and gets your design running and verified on an actual (or emulated) board.',
    modules: [
      { title: 'FPGA Architecture', body: 'LUTs, flip-flops, block RAM, DSP slices, and clocking resources — how your RTL maps to the fabric.' },
      { title: 'Design Flow', body: 'The Vivado flow: synthesis, implementation, bitstream, and programming the device.' },
      { title: 'Constraints & I/O', body: 'Pin assignment, I/O standards, and timing constraints for an FPGA target.' },
      { title: 'On-Chip Memory & IP', body: 'Using block RAM, FIFOs, and vendor IP cores in your design.' },
      { title: 'Debug on Hardware', body: 'Integrated logic analyzer, observing signals on real hardware, and closing timing on the device.' },
    ],
    capstone: 'Implement a self-contained design — for example a VGA/HDMI pattern generator or a sensor-driven data path — and bring it up on an FPGA board (or emulation), verified against expected behavior.',
    outcomes: ['The complete FPGA flow from RTL to a programmed device.', 'A working hardware demo you can literally show.', 'A strong bridge toward embedded and Edge AI acceleration work.'],
    roles: 'FPGA Design / Prototyping Engineer',
  }),
  c({
    code: 'VLSI-106', domain: 'vlsi', title: 'CMOS VLSI Design Fundamentals',
    tagline: 'Understand the transistor-level reality under every digital design.',
    level: 'Foundation', levelTier: 'Foundation', weeks: 5, hours: 35,
    prerequisites: 'Basic electronic devices and circuits',
    tools: 'SPICE-class simulator (ngspice / LTspice), layout concepts',
    mode: 'Instructor-led with circuit-simulation labs',
    overview: 'Before the RTL and the flows, VLSI is transistors. This course grounds you in CMOS: how a MOSFET switches, how logic gates are built from them, and what drives delay, power, and area at the device level. It gives front-end engineers the physical intuition that makes timing, power, and sign-off make sense later.',
    modules: [
      { title: 'The MOSFET', body: 'NMOS and PMOS operation, regions of operation, and threshold voltage — the switch at the heart of CMOS.' },
      { title: 'CMOS Logic Gates', body: 'Building inverters, NAND, NOR, and complex gates; pull-up and pull-down networks.' },
      { title: 'Delay & Power', body: 'Propagation delay, RC modeling, dynamic and static power, and the switching-energy trade-off.' },
      { title: 'Sizing & Drive Strength', body: 'Transistor sizing, fan-out, logical effort, and driving loads.' },
      { title: 'Layout Basics', body: 'Stick diagrams, design rules, and how a schematic becomes a physical cell.' },
    ],
    capstone: 'Design and simulate a small CMOS cell or logic block in SPICE, characterize its delay and power, and present how sizing choices change the result.',
    outcomes: ['Solid transistor-level intuition for CMOS logic.', 'The ability to reason about delay, power, and sizing.', 'A foundation that makes every other VLSI track deeper and clearer.'],
  }),

  // ─────────────────────── EMBEDDED ───────────────────────
  c({
    code: 'EMB-101', domain: 'embedded', title: 'Embedded C Programming',
    tagline: 'The language the whole embedded world runs on.',
    level: 'Foundation — graduates & final-year students', levelTier: 'Foundation', weeks: 6, hours: 45,
    prerequisites: 'Basic programming in any language; C familiarity helps',
    tools: 'GCC, GDB, a dev board or simulator', mode: 'Instructor-led with weekly hands-on labs',
    overview: 'Embedded C is C used close to the hardware, where you manage memory yourself and read and write device registers directly. This course builds that low-level fluency — pointers, memory layout, bit manipulation, and memory-mapped I/O — so you can write firmware that talks to real peripherals rather than just running on a PC.',
    modules: [
      { title: 'C for Embedded', body: 'Data types and sizes, storage classes, and the compile-link-load picture for a target device.' },
      { title: 'Pointers & Memory', body: 'Pointers, arrays, structs, and the stack/heap/static memory layout, with manual memory management.' },
      { title: 'Bit Manipulation', body: 'Bitwise operators, masks, and setting, clearing, and reading individual register bits.' },
      { title: 'Registers & Memory-Mapped I/O', body: 'The volatile keyword, accessing peripheral registers, and reading a datasheet.' },
      { title: 'Modular Firmware', body: 'Headers and source organization, and writing portable, reusable driver code.' },
      { title: 'Debugging', body: 'GDB, breakpoints, inspecting memory, and the bugs that are specific to embedded C.' },
    ],
    capstone: 'Write a small register-level driver — for example a GPIO LED-and-button driver — in bare-metal C with a clean header/source split, and test it on a board or simulator.',
    outcomes: ['Fluency in hardware-facing embedded C.', 'Register-level, datasheet-driven thinking.', 'A driver you wrote and tested yourself.'],
    roles: 'Embedded Firmware / Software Engineer (with EMB-102, EMB-103)',
  }),
  c({
    code: 'EMB-102', domain: 'embedded', title: 'Microcontroller Programming (ARM Cortex-M)',
    tagline: 'Bare-metal firmware on a real ARM microcontroller.',
    level: 'Foundation to intermediate', levelTier: 'Intermediate', weeks: 7, hours: 50,
    prerequisites: 'EMB-101 or embedded C experience',
    tools: 'STM32 (Nucleo/Discovery), STM32CubeIDE / ARM GCC', mode: 'Instructor-led, board-oriented labs',
    overview: 'This course gets you writing firmware directly on an ARM Cortex-M microcontroller — the core of most modern embedded products. You learn the architecture, bring up clocks and GPIO, handle interrupts, and drive timers and ADCs, building the ability to configure any peripheral from its datasheet.',
    modules: [
      { title: 'Cortex-M Architecture', body: 'The core, memory map, key registers, and the startup code and vector table.' },
      { title: 'GPIO & Clocks', body: 'Configuring the clock tree, driving GPIO, and basic timing.' },
      { title: 'Interrupts', body: 'The NVIC, interrupt service routines, priorities, and interrupt-driven design.' },
      { title: 'Timers & PWM', body: 'Timer peripherals, PWM generation, and input capture.' },
      { title: 'ADC & Peripherals', body: 'Analog input, an introduction to DMA, and integrating multiple peripherals.' },
      { title: 'Power & Low-Power Modes', body: 'Sleep and low-power modes, and writing power-aware firmware.' },
    ],
    capstone: 'Build an interrupt- and timer-driven application — for example a PWM LED or motor controller that responds to an ADC sensor input — running on an STM32 board.',
    outcomes: ['Bare-metal firmware on a real MCU.', 'Datasheet-driven peripheral configuration.', 'A working board application you built.'],
    roles: 'Embedded Firmware / Software Engineer',
  }),
  c({
    code: 'EMB-103', domain: 'embedded', title: 'Real-Time Operating Systems (FreeRTOS)',
    tagline: 'Run many tasks on one microcontroller, on time.',
    level: 'Intermediate', levelTier: 'Intermediate', weeks: 6, hours: 45,
    prerequisites: 'EMB-102 or microcontroller experience',
    tools: 'FreeRTOS on STM32 / ESP32', mode: 'Instructor-led with build-as-you-go labs',
    overview: 'When firmware has to do several things at once with timing guarantees, an RTOS is the answer. This course teaches real-time multitasking with FreeRTOS — tasks, scheduling, and safe communication between them — so you can structure complex firmware that still meets its deadlines.',
    modules: [
      { title: 'RTOS Concepts', body: 'Tasks, the scheduler, context switching, and when an RTOS is actually needed.' },
      { title: 'Tasks & Scheduling', body: 'Task priorities, preemption, the system tick, and timing behavior.' },
      { title: 'Synchronization', body: 'Queues, semaphores, mutexes, and avoiding priority inversion.' },
      { title: 'Inter-Task Communication', body: 'Event groups, task notifications, and safe sharing of resources.' },
      { title: 'Memory & Timing', body: 'Heap options, stack sizing, and measuring real-time performance.' },
      { title: 'Debugging an RTOS', body: 'Tracing, common concurrency bugs, and avoiding deadlock.' },
    ],
    capstone: 'Build a multi-task FreeRTOS application in which sensor-acquisition, processing, and output tasks communicate through queues, and measure its real-time timing.',
    outcomes: ['Design and debug multi-tasking firmware.', 'A clear grasp of real-time scheduling.', 'A working RTOS application.'],
    roles: 'Embedded Firmware / Software Engineer',
  }),
  c({
    code: 'EMB-104', domain: 'embedded', title: 'Embedded Communication Protocols',
    tagline: 'How embedded devices actually talk to each other.',
    level: 'Intermediate', levelTier: 'Intermediate', weeks: 5, hours: 35,
    prerequisites: 'EMB-102 or microcontroller experience',
    tools: 'STM32 / ESP32, logic analyzer, CAN transceiver', mode: 'Instructor-led with bus-debugging labs',
    overview: 'Embedded systems are built from parts that have to communicate — sensors, memories, controllers, and other ECUs. This course covers the core serial protocols (UART, SPI, I2C) and the automotive/industrial CAN bus, and trains you to debug them with a logic analyzer.',
    modules: [
      { title: 'UART', body: 'Framing, baud rate, and building a reliable serial link.' },
      { title: 'SPI', body: 'Master and slave roles, the SPI modes, and high-speed peripheral interfacing.' },
      { title: 'I2C', body: 'Addressing, clock stretching, and multi-device buses.' },
      { title: 'CAN', body: 'The CAN frame, arbitration, and automotive/industrial networking.' },
      { title: 'Debugging Buses', body: 'Capturing traffic with a logic analyzer, decoding protocols, and fixing bus faults.' },
    ],
    capstone: 'Interface several peripherals over SPI and I2C and exchange messages over a CAN link, using a logic analyzer to verify and debug each bus.',
    outcomes: ['Confidence with the core embedded buses.', 'Practical bus-debugging skill.', 'A multi-protocol project — directly relevant to automotive work.'],
    roles: 'Embedded & Automotive Communication roles',
  }),
  c({
    code: 'EMB-105', domain: 'embedded', title: 'Embedded Linux & Device Drivers',
    tagline: 'From bare metal to a full Linux system on a board.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 8, hours: 55,
    prerequisites: 'Embedded C and basic Linux command-line comfort',
    tools: 'Raspberry Pi / BeagleBone, cross-toolchain', mode: 'Instructor-led, bring-up-oriented labs',
    overview: 'Many modern embedded products run Linux. This course takes you through the embedded Linux stack — boot flow, cross-compilation, the device model — and into writing a real kernel-space device driver, the skill that separates embedded Linux engineers from application developers.',
    modules: [
      { title: 'Embedded Linux Overview', body: 'The bootloader, kernel, and root filesystem, and how a board boots.' },
      { title: 'Cross-Compilation & Toolchains', body: 'Building for a target device and an introduction to Buildroot/Yocto.' },
      { title: 'The Linux Device Model', body: 'User space versus kernel space, sysfs, and device trees.' },
      { title: 'Writing Character Drivers', body: 'A simple loadable kernel module and a character device driver.' },
      { title: 'Interfacing Hardware', body: 'GPIO, I2C, and SPI from Linux, and handling interrupts in a driver.' },
      { title: 'Debugging', body: 'Kernel logs, debugging modules, and bringing up a system.' },
    ],
    capstone: 'Bring up a peripheral on an embedded Linux board and write a working character driver for it, loaded as a kernel module.',
    outcomes: ['Embedded Linux bring-up experience.', 'A working device driver you wrote.', 'Readiness for Linux-based embedded roles.'],
    roles: 'Embedded Linux / BSP / Driver Engineer',
  }),
  c({
    code: 'EMB-106', domain: 'embedded', title: 'Automotive Embedded & Functional Safety',
    tagline: 'Embedded engineering where safety is the specification.',
    level: 'Advanced', levelTier: 'Advanced', weeks: 6, hours: 45,
    prerequisites: 'EMB-102/103 or equivalent embedded experience',
    tools: 'CAN tools; AUTOSAR & QNX-class RTOS concepts', mode: 'Instructor-led, concept- and design-driven',
    overview: 'Automotive embedded software is built under safety and reliability requirements that ordinary firmware is not. This course introduces the automotive software landscape — in-vehicle networks, AUTOSAR, and the ISO 26262 functional-safety lifecycle — and the defensive design practices that safety-critical firmware depends on.',
    modules: [
      { title: 'Automotive E/E Architecture', body: 'ECUs, in-vehicle networks, and the layered automotive software stack.' },
      { title: 'CAN & Automotive Networking', body: 'CAN in depth, with an introduction to CAN-FD and other automotive buses.' },
      { title: 'AUTOSAR Concepts', body: 'The layered AUTOSAR architecture and where application software sits.' },
      { title: 'Functional Safety (ISO 26262)', body: 'Hazard analysis, ASIL levels, and the safety lifecycle, at an awareness level.' },
      { title: 'Safety-Critical Firmware', body: 'Defensive coding, diagnostics, fault handling, watchdogs, and safe states.' },
      { title: 'RTOS for Safety', body: 'Real-time and safety considerations, including QNX-class RTOS concepts.' },
    ],
    capstone: 'Design a small safety-aware automotive ECU function — for example a sensor interlock with fault detection and a defined safe state — accompanied by a short safety rationale.',
    outcomes: ['The vocabulary of automotive embedded software.', 'Functional-safety awareness (ISO 26262 at awareness, not certification, level).', 'A safety-aware design you can discuss in interviews.'],
    roles: 'Automotive Embedded / Functional-Safety roles (entry)',
  }),

  // ──────────────────────── EDGE AI ────────────────────────
  c({
    code: 'EDGE-101', domain: 'edge', title: 'Python & ML Foundations for Edge AI',
    tagline: 'The groundwork: data, Python, and classical ML.',
    level: 'Foundation', levelTier: 'Foundation', weeks: 5, hours: 35,
    prerequisites: 'Basic programming; no ML background needed',
    tools: 'Python, NumPy, pandas, scikit-learn, Jupyter', mode: 'Instructor-led with notebook-based labs',
    overview: 'Before deep learning and deployment, Edge AI rests on a solid grasp of data and the machine-learning workflow. This course builds Python-for-ML skills and classical machine learning, so you can prepare data, train a model, and evaluate it honestly — the foundation every later course assumes.',
    modules: [
      { title: 'Python for ML', body: 'NumPy and pandas, and working efficiently with numerical and tabular data.' },
      { title: 'The ML Workflow', body: 'Data, features, train/test splits, and choosing evaluation metrics.' },
      { title: 'Classical ML', body: 'Regression, classification, and tree-based models.' },
      { title: 'Feature Engineering', body: 'Preparing sensor and tabular data so a model can learn from it.' },
      { title: 'Model Evaluation', body: 'Overfitting, validation, and interpreting what the numbers mean.' },
    ],
    capstone: 'Build and evaluate a classical machine-learning model on a sensor or tabular dataset, end to end, and report its performance honestly.',
    outcomes: ['A solid, repeatable ML workflow.', 'Practical Python and data-handling skill.', 'A trained, evaluated model you built.'],
  }),
  c({
    code: 'EDGE-102', domain: 'edge', title: 'Deep Learning Essentials',
    tagline: 'Neural networks from the ground up — the Edge AI core.',
    level: 'Intermediate', levelTier: 'Intermediate', weeks: 7, hours: 50,
    prerequisites: 'EDGE-101 or Python-plus-ML basics',
    tools: 'PyTorch or TensorFlow, GPU/Colab', mode: 'Instructor-led with training labs',
    overview: 'Deep learning is the engine behind most Edge AI. This course builds neural networks from first principles and then convolutional networks for images, taking you through training a model properly — losses, optimizers, and transfer learning — and exporting it ready for the edge.',
    modules: [
      { title: 'Neural Network Basics', body: 'Neurons, layers, activations, and the intuition behind forward and backward passes.' },
      { title: 'Training', body: 'Loss functions, optimizers, gradient descent, and learning-rate behavior.' },
      { title: 'Convolutional Networks', body: 'Convolution, pooling, and image classification.' },
      { title: 'Building & Training Models', body: 'Data pipelines, augmentation, and training a CNN end to end.' },
      { title: 'Transfer Learning', body: 'Using pretrained models and fine-tuning them on your own data.' },
      { title: 'Evaluation & Export', body: 'Validating a model and exporting it in a deployment-ready format.' },
    ],
    capstone: 'Train a CNN image classifier using transfer learning and export it in a format ready for edge deployment.',
    outcomes: ['The ability to build and train CNNs.', 'A trained model you can carry into the optimization and deployment courses.', 'Readiness for real Edge AI work.'],
    roles: 'Edge AI / TinyML / ML Engineer (with EDGE-103, EDGE-104)',
  }),
  c({
    code: 'EDGE-103', domain: 'edge', title: 'Model Optimization for the Edge',
    tagline: 'Make big models small enough to run on tiny hardware.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 5, hours: 35,
    prerequisites: 'EDGE-102 or deep-learning experience',
    tools: 'TensorFlow Lite, ONNX, quantization tooling', mode: 'Instructor-led with benchmarking labs',
    overview: "Edge devices have tight memory, latency, and power budgets, so models trained on a GPU usually can't be deployed as-is. This course teaches the techniques that shrink them — quantization and pruning — and, just as importantly, how to measure the size, latency, and accuracy trade-offs each one brings.",
    modules: [
      { title: 'Why Optimize', body: 'The memory, latency, and power limits that define the edge.' },
      { title: 'Quantization', body: 'Post-training quantization and quantization-aware training.' },
      { title: 'Pruning & Compression', body: 'Removing redundancy, and structured versus unstructured pruning.' },
      { title: 'Formats & Runtimes', body: 'TFLite and ONNX, and converting models between them.' },
      { title: 'Benchmarking', body: 'Measuring model size, inference latency, and the accuracy you trade away.' },
    ],
    capstone: 'Take a trained model and optimize it — quantize and prune — to meet a size or latency target, and report the resulting accuracy trade-off.',
    outcomes: ['The ability to fit models to edge constraints.', 'Hands-on quantization and pruning skill.', 'A benchmarked, optimized model.'],
    roles: 'Edge AI / TinyML / ML Engineer',
  }),
  c({
    code: 'EDGE-104', domain: 'edge', title: 'TinyML — Edge AI on Microcontrollers',
    tagline: 'Run neural networks on a microcontroller.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 6, hours: 45,
    prerequisites: 'EDGE-102; some microcontroller exposure (EMB-102) helps',
    tools: 'ML-capable MCU board, TensorFlow Lite Micro', mode: 'Instructor-led, device-oriented labs',
    overview: 'TinyML runs machine-learning inference on microcontrollers — devices with kilobytes of memory and no operating system. This course walks the full pipeline, from collecting sensor data on-device to deploying a small model that runs inference in real time on the microcontroller itself.',
    modules: [
      { title: 'TinyML Concepts', body: 'What it means to run ML under microcontroller constraints.' },
      { title: 'Data Collection', body: 'Capturing sensor data — motion, audio — directly on the device.' },
      { title: 'Model for an MCU', body: 'Training a small model and converting it to TensorFlow Lite Micro.' },
      { title: 'On-Device Inference', body: 'Running inference on the MCU and acting on the result.' },
      { title: 'Integration', body: 'Wiring inference into real firmware alongside sensors and outputs.' },
      { title: 'On-Device Optimization', body: 'Fitting the model into the memory and timing budget.' },
    ],
    capstone: 'Build an end-to-end TinyML application — for example gesture recognition or keyword spotting — running inference on a microcontroller in real time.',
    outcomes: ['The ability to deploy ML on microcontrollers.', 'The complete TinyML pipeline, hands-on.', 'A working on-device demo.'],
    roles: 'Edge AI / TinyML / ML Engineer',
  }),
  c({
    code: 'EDGE-105', domain: 'edge', title: 'Edge AI on SoC & FPGA Accelerators',
    tagline: 'Accelerate inference on Jetson and Zynq-class hardware.',
    level: 'Advanced', levelTier: 'Advanced', weeks: 7, hours: 50,
    prerequisites: 'EDGE-102/103',
    tools: 'Jetson (Nano/Orin) and/or Zynq SoC, vendor toolchains', mode: 'Instructor-led, hardware-benchmarking labs',
    overview: 'When an application needs real throughput at the edge, inference moves onto accelerators — GPUs, NPUs, and FPGA fabric. This course covers deploying optimized models on SoC-class edge hardware and measuring what you actually gain in throughput, latency, and power against a CPU baseline.',
    modules: [
      { title: 'Edge Accelerators', body: 'GPUs, NPUs, and FPGA fabric, and how inference maps onto each.' },
      { title: 'Deploying on Jetson', body: 'The Jetson software stack, running optimized models, and measuring throughput.' },
      { title: 'FPGA Acceleration Concepts', body: 'Mapping neural workloads onto FPGA fabric and dataflow thinking.' },
      { title: 'Runtime & Optimization', body: 'Engine-level optimization and batching-versus-latency trade-offs.' },
      { title: 'Pipelines', body: 'Building camera/sensor to inference to output pipelines on the device.' },
      { title: 'Benchmarking & Power', body: 'Throughput, latency, and power measured on real hardware.' },
    ],
    capstone: 'Deploy an optimized model on a Jetson- or Zynq-class board and benchmark its throughput, latency, and power against a CPU baseline.',
    outcomes: ['The ability to deploy accelerated inference on SoC/FPGA.', 'Hardware-aware optimization skill.', 'A benchmarked edge deployment.'],
    roles: 'Edge AI Deployment / Acceleration Engineer',
  }),
  c({
    code: 'EDGE-106', domain: 'edge', title: 'Computer Vision at the Edge',
    tagline: 'Real-time vision on devices, not in the cloud.',
    level: 'Intermediate to advanced', levelTier: 'Advanced', weeks: 6, hours: 45,
    prerequisites: 'EDGE-102 or deep-learning basics',
    tools: 'OpenCV, TFLite/ONNX, Raspberry Pi + camera or Jetson', mode: 'Instructor-led, pipeline-building labs',
    overview: 'A large share of Edge AI is vision — reading a camera and acting on what it sees, on the device, in real time. This course builds that full pipeline: image processing, detection and classification models, and the optimization needed to hit a real frame rate on constrained hardware.',
    modules: [
      { title: 'Image Processing', body: 'OpenCV fundamentals and the preprocessing a vision model needs.' },
      { title: 'Detection & Classification', body: 'Object-detection models and running them at the edge.' },
      { title: 'Real-Time Pipelines', body: 'Camera capture, inference, and output together, in real time.' },
      { title: 'Optimizing Vision Models', body: 'Reaching a frame-rate target on constrained hardware.' },
      { title: 'Deployment', body: 'Packaging a vision application on a Pi- or Jetson-class device.' },
    ],
    capstone: 'Build a real-time edge-vision application — for example object detection on a live camera feed — running on a Pi- or Jetson-class board at a target frame rate.',
    outcomes: ['The ability to build edge-vision pipelines.', 'Real-time optimization skill.', 'A working vision demo on real hardware.'],
    roles: 'Edge Computer Vision Engineer',
  }),
];

export const courseByCode = (code: string) => COURSES.find((x) => x.code === code || x.slug === code.toLowerCase());

// ───────────────────── Tracks (fixed bundle prices) ─────────────────────
export interface Track {
  id: string;
  domain: Domain;
  name: string;
  codes: string[];
  standard: number;
  bundle: number;
}

export const TRACKS: Track[] = [
  { id: 'vlsi-verification', domain: 'vlsi', name: 'Verification Track', codes: ['VLSI-101', 'VLSI-102'], standard: 30000, bundle: 27000 },
  { id: 'vlsi-frontend', domain: 'vlsi', name: 'Front-End Design Track', codes: ['VLSI-106', 'VLSI-101', 'VLSI-105'], standard: 45000, bundle: 38000 },
  { id: 'vlsi-physical', domain: 'vlsi', name: 'Physical Design Track', codes: ['VLSI-101', 'VLSI-103', 'VLSI-104'], standard: 45000, bundle: 38000 },
  { id: 'vlsi-complete', domain: 'vlsi', name: 'Complete VLSI Track', codes: ['VLSI-101', 'VLSI-102', 'VLSI-103', 'VLSI-104', 'VLSI-105', 'VLSI-106'], standard: 90000, bundle: 65000 },
  { id: 'emb-firmware', domain: 'embedded', name: 'Firmware Track', codes: ['EMB-101', 'EMB-102'], standard: 30000, bundle: 27000 },
  { id: 'emb-rtos', domain: 'embedded', name: 'RTOS & Protocols Track', codes: ['EMB-102', 'EMB-103', 'EMB-104'], standard: 45000, bundle: 38000 },
  { id: 'emb-linux', domain: 'embedded', name: 'Embedded Linux Track', codes: ['EMB-101', 'EMB-105'], standard: 30000, bundle: 27000 },
  { id: 'emb-complete', domain: 'embedded', name: 'Complete Embedded Track', codes: ['EMB-101', 'EMB-102', 'EMB-103', 'EMB-104', 'EMB-105', 'EMB-106'], standard: 90000, bundle: 65000 },
  { id: 'edge-foundations', domain: 'edge', name: 'Foundations Track', codes: ['EDGE-101', 'EDGE-102'], standard: 30000, bundle: 27000 },
  { id: 'edge-tinyml', domain: 'edge', name: 'TinyML Track', codes: ['EDGE-102', 'EDGE-103', 'EDGE-104'], standard: 45000, bundle: 38000 },
  { id: 'edge-vision', domain: 'edge', name: 'Edge Vision Track', codes: ['EDGE-102', 'EDGE-106'], standard: 30000, bundle: 27000 },
  { id: 'edge-complete', domain: 'edge', name: 'Complete Edge AI Track', codes: ['EDGE-101', 'EDGE-102', 'EDGE-103', 'EDGE-104', 'EDGE-105', 'EDGE-106'], standard: 90000, bundle: 65000 },
];

// ───────────────────── Headline programmes ─────────────────────
export const PROGRAMMES = [
  { id: 'single', name: 'Single course', includes: 'Any one certificate course, in any domain', price: 15000, standard: 15000 },
  { id: 'domain', name: 'Complete Domain Track', includes: 'All 6 courses in one domain (VLSI, Embedded, or Edge AI)', price: 65000, standard: 90000 },
  { id: 'two-domain', name: 'Two-Domain Bundle', includes: 'Any two Complete Domain Tracks (12 courses)', price: 115000, standard: 180000 },
  { id: 'all-access', name: 'All-Access Career Program', includes: 'All 18 courses, all three domains, + internship + placement support', price: 165000, standard: 270000 },
];

// ───────────────────── Course + board packages ─────────────────────
export interface Kit {
  id: string;
  domain: Domain;
  name: string;
  includes: string;
  price: number;
  codes: string[];
  board: string;
}

export const KITS: Kit[] = [
  { id: 'fpga-essentials', domain: 'vlsi', name: 'FPGA Essentials', includes: 'VLSI-105 (FPGA Prototyping & Design) + entry-level Artix-7-class FPGA board', price: 21000, codes: ['VLSI-105'], board: 'Artix-7-class FPGA board' },
  { id: 'soc-edge-ready', domain: 'vlsi', name: 'SoC / Edge-Ready', includes: 'VLSI-105 + Zynq-class SoC board (ARM + FPGA, suitable for Edge AI work)', price: 38000, codes: ['VLSI-105'], board: 'Zynq-class SoC board' },
  { id: 'backend-board', domain: 'vlsi', name: 'Back-End + Board', includes: 'Physical Design Track (VLSI-101/103/104) + entry FPGA board for hands-on bring-up', price: 44000, codes: ['VLSI-101', 'VLSI-103', 'VLSI-104'], board: 'Entry FPGA board' },
  { id: 'vlsi-complete-hw', domain: 'vlsi', name: 'Complete + Hardware', includes: 'Complete VLSI Track (all 6) + Zynq-class SoC board', price: 85000, codes: ['VLSI-101', 'VLSI-102', 'VLSI-103', 'VLSI-104', 'VLSI-105', 'VLSI-106'], board: 'Zynq-class SoC board' },
  { id: 'mcu-starter', domain: 'embedded', name: 'MCU Starter', includes: 'EMB-102 (Microcontroller Programming) + STM32 Nucleo/Discovery board', price: 20000, codes: ['EMB-102'], board: 'STM32 Nucleo/Discovery' },
  { id: 'protocols-lab', domain: 'embedded', name: 'Protocols Lab', includes: 'EMB-104 + logic analyzer + CAN transceiver module kit', price: 22000, codes: ['EMB-104'], board: 'Logic analyzer + CAN kit' },
  { id: 'linux-kit', domain: 'embedded', name: 'Embedded Linux Kit', includes: 'EMB-105 + Raspberry Pi / BeagleBone board with accessories', price: 24000, codes: ['EMB-105'], board: 'Raspberry Pi / BeagleBone' },
  { id: 'emb-complete-hw', domain: 'embedded', name: 'Complete + Hardware', includes: 'Complete Embedded Track (all 6) + MCU board + embedded-Linux board kit', price: 80000, codes: ['EMB-101', 'EMB-102', 'EMB-103', 'EMB-104', 'EMB-105', 'EMB-106'], board: 'MCU board + embedded-Linux kit' },
  { id: 'tinyml-kit', domain: 'edge', name: 'TinyML Kit', includes: 'EDGE-104 (TinyML) + sensor-equipped ML microcontroller board (e.g. Nano 33 BLE Sense class)', price: 20000, codes: ['EDGE-104'], board: 'Nano 33 BLE Sense-class board' },
  { id: 'vision-kit', domain: 'edge', name: 'Edge Vision Kit', includes: 'EDGE-106 + Raspberry Pi board with camera module', price: 24000, codes: ['EDGE-106'], board: 'Raspberry Pi + camera' },
  { id: 'accelerator-kit', domain: 'edge', name: 'Accelerator Kit', includes: 'EDGE-105 + Jetson-class edge AI board (GPU/NPU)', price: 45000, codes: ['EDGE-105'], board: 'Jetson-class board' },
  { id: 'edge-complete-hw', domain: 'edge', name: 'Complete + Hardware', includes: 'Complete Edge AI Track (all 6) + Jetson-class edge AI board', price: 90000, codes: ['EDGE-101', 'EDGE-102', 'EDGE-103', 'EDGE-104', 'EDGE-105', 'EDGE-106'], board: 'Jetson-class board' },
];

// ───────────────────── Apply directly ─────────────────────
export interface Service {
  id: string;
  name: string;
  price: number;
  includes: string;
  points: string[];
}

export const SERVICES: Service[] = [
  {
    id: 'guided-project', name: 'Guided Project', price: 10000,
    includes: 'A defined VLSI / Embedded / Edge AI project built with mentor guidance — working code or design, documentation, a demo, and a project certificate',
    points: ['Choose, or be assigned, a project scoped to your level', 'Regular mentor guidance while you build', 'Finish with a working deliverable, documentation, a short demo and a project certificate'],
  },
  {
    id: 'internship-3', name: 'Internship — 3 months', price: 5000,
    includes: 'Structured internship on an assigned real-world project, with mentorship, periodic reviews, an internship certificate and a letter',
    points: ['Work on an assigned, real-world project under mentorship', 'A focused project and deliverable with periodic progress reviews', 'Internship certificate and a letter describing the work done'],
  },
  {
    id: 'internship-6', name: 'Internship — 6 months', price: 8000,
    includes: 'The 6-month internship — a larger project, deeper involvement, and the same certificate and letter',
    points: ['A larger project with deeper, more independent involvement', 'Can build on a Guided Project, or run alongside a course', 'Internship certificate and a letter describing the work done'],
  },
  {
    id: 'paper-writing', name: 'Paper-Writing Support', price: 5000,
    includes: 'Mentored help turning your project into a technical / research paper — structure, drafting guidance, review, and formatting for a target venue',
    points: ['Guidance on structuring the paper', 'Support through drafting and revision, and a review of results and figures', 'Formatting for a target conference or journal'],
  },
];

// ───────────────────── Role → path mapping ─────────────────────
export interface RolePath {
  role: string;
  domain: Domain;
  codes: string[];
  trackId?: string;
}

export const ROLE_PATHS: RolePath[] = [
  { role: 'RTL Design Engineer', domain: 'vlsi', codes: ['VLSI-101'] },
  { role: 'Design Verification Engineer', domain: 'vlsi', codes: ['VLSI-101', 'VLSI-102'], trackId: 'vlsi-verification' },
  { role: 'Physical Design / STA Engineer', domain: 'vlsi', codes: ['VLSI-101', 'VLSI-103', 'VLSI-104'], trackId: 'vlsi-physical' },
  { role: 'FPGA Design Engineer', domain: 'vlsi', codes: ['VLSI-105'] },
  { role: 'Embedded Firmware Engineer', domain: 'embedded', codes: ['EMB-101', 'EMB-102', 'EMB-103'] },
  { role: 'Automotive Communication roles', domain: 'embedded', codes: ['EMB-104'] },
  { role: 'Embedded Linux / BSP Engineer', domain: 'embedded', codes: ['EMB-105'] },
  { role: 'Functional-Safety Engineer (entry)', domain: 'embedded', codes: ['EMB-106'] },
  { role: 'Edge AI / TinyML Engineer', domain: 'edge', codes: ['EDGE-102', 'EDGE-103', 'EDGE-104'], trackId: 'edge-tinyml' },
  { role: 'Edge AI Deployment Engineer', domain: 'edge', codes: ['EDGE-105'] },
  { role: 'Edge Computer Vision Engineer', domain: 'edge', codes: ['EDGE-106'] },
];

// ───────────────────── Schedule, payments, refunds ─────────────────────
export const BATCH_FORMATS = [
  { name: 'Weekday evenings', timing: '2–3 evenings per week, after work/college hours', bestFor: 'Working professionals, final-semester students' },
  { name: 'Weekend', timing: 'Saturday & Sunday sessions', bestFor: 'Those who prefer concentrated weekend learning' },
  { name: 'Self-paced + mentoring', timing: 'Recorded content with scheduled live doubt-clearing', bestFor: 'Learners who need flexible timing' },
];

export const PAYMENT_OPTIONS = [
  { name: 'Full payment', body: 'Pay the course, bundle, or programme fee in one instalment at enrolment.' },
  { name: 'Two-instalment plan (per course)', body: '60% at enrolment, 40% before the mid-point of the course.' },
  { name: 'Bundle & programme instalments', body: 'Larger bundles and the All-Access Career Program can be split across instalments by arrangement; bundle pricing applies when the full plan is committed at enrolment.' },
  { name: 'Payment modes', body: 'Bank transfer / UPI / card, with a receipt and enrolment confirmation issued for every payment.' },
];

export const REFUND_POLICY = [
  'Fees are refundable up to a short cut-off before the batch start date; after a batch begins, a seat may be transferred to a later batch instead of refunded.',
  'For course-plus-board packages, the board cost becomes non-refundable once the board has been dispatched.',
  'Exact refund cut-off dates and the full policy are confirmed in writing at enrolment.',
];

export const CAREER_PILLARS = [
  { title: 'A portfolio of real work, not just a certificate', body: 'Every course ends in a capstone project — a verified RTL block, a working FreeRTOS application, a model running on a microcontroller — so you leave with concrete, demonstrable work and the ability to explain the engineering decisions behind it.' },
  { title: 'Learning paths mapped to real job roles', body: 'Courses are grouped into tracks that line up with the roles companies actually recruit for, so you train deliberately for a target position.' },
  { title: 'Internship and real deliverables', body: 'Projects paired with internship experience let you apply what you study to a defined, reviewed deliverable — something you can legitimately list as work experience.' },
  { title: 'Industry-ready curriculum and tools', body: 'Courses are taught on the tools and workflows teams actually use — the RTL-to-GDSII flow, FreeRTOS, CAN, TensorFlow Lite, and SoC/FPGA deployment.' },
  { title: 'Hardware experience as a differentiator', body: 'Candidates who have brought a design up on a real board — an FPGA, a microcontroller, a Jetson — stand out against those who have only simulated.' },
  { title: 'Interview and career support', body: 'Help shaping a project-focused resume, mock interviews, and domain-specific interview preparation (common RTL, verification, embedded, and ML questions).' },
];

export const OUTCOMES_NOTE =
  'QBeeMind provides training, projects, and placement assistance — not a placement guarantee. Your result depends on your work and the market. We focus on making you genuinely employable and well-prepared; we do not quote placement percentages we cannot stand behind.';

export const OFFERINGS = [
  { title: 'Courses', body: 'Structured programs in VLSI, Embedded Systems, and Edge AI Engineering for graduate students, post-graduate students, and industry professionals — each pitched at the right depth, from fundamentals to advanced, application-focused modules.' },
  { title: 'Projects with Internship', body: 'Hands-on projects paired with internship experience, so learners finish with something concrete to show — code, a design, a working prototype, and the reasoning behind it.' },
  { title: 'University Core Training', body: "Programs delivered in partnership with colleges and universities to strengthen students' core technical foundation, aligned with what employers in VLSI, embedded, and Edge AI actually look for." },
  { title: 'Industry-Ready Curriculum Development', body: 'Curricula for institutions and teams, grounded in project-based learning — a syllabus that moves a learner from concept to capability through a sequence of real, buildable projects.' },
];

export const AUDIENCES = [
  { title: 'Graduates', body: 'Entering the electronics and semiconductor industry and want a practical foundation.' },
  { title: 'Post-graduates', body: 'Looking to specialize and build a strong project portfolio.' },
  { title: 'Industry professionals', body: 'Adding VLSI, embedded, or Edge AI skills to their existing work.' },
  { title: 'Universities and institutions', body: 'Seeking core training programs or custom, industry-aligned curricula.' },
];

// Placeholders the client still has to supply. Shown clearly as "to be confirmed".
export const CONTACT = {
  email: 'hello@qbeemind.com', // TODO(client): confirm
  phone: '+91 00000 00000', // TODO(client): confirm
  whatsapp: '910000000000', // TODO(client): confirm
  city: 'Office address to be confirmed', // TODO(client): confirm
};
