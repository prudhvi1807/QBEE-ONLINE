/**
 * Centralized mapping for all 18 QBee course images and metadata.
 * Images are stored locally under /assets/courses/<domain>/<code-lowercase>.webp
 */

export interface CourseImageMeta {
  src: string;
  alt: string;
}

export const FALLBACK_COURSE_IMAGE = '/assets/courses/fallback.webp';

export const COURSE_IMAGES: Record<string, CourseImageMeta> = {
  // VLSI Design
  'VLSI-101': {
    src: '/assets/courses/vlsi/vlsi-101.webp',
    alt: 'Digital logic circuits, Verilog RTL design and hardware simulation',
  },
  'VLSI-102': {
    src: '/assets/courses/vlsi/vlsi-102.webp',
    alt: 'SystemVerilog verification, UVM testbench and simulation waveforms',
  },
  'VLSI-103': {
    src: '/assets/courses/vlsi/vlsi-103.webp',
    alt: 'ASIC chip layout, semiconductor floorplanning and routing',
  },
  'VLSI-104': {
    src: '/assets/courses/vlsi/vlsi-104.webp',
    alt: 'Static timing analysis, timing diagrams and signal paths',
  },
  'VLSI-105': {
    src: '/assets/courses/vlsi/vlsi-105.webp',
    alt: 'FPGA development board, programmable logic and hardware prototyping',
  },
  'VLSI-106': {
    src: '/assets/courses/vlsi/vlsi-106.webp',
    alt: 'CMOS transistor architecture, semiconductor chip design and fabrication',
  },

  // Embedded Systems
  'EMB-101': {
    src: '/assets/courses/embedded/emb-101.webp',
    alt: 'Embedded C programming and microcontroller development board',
  },
  'EMB-102': {
    src: '/assets/courses/embedded/emb-102.webp',
    alt: 'ARM Cortex-M microcontroller and development hardware',
  },
  'EMB-103': {
    src: '/assets/courses/embedded/emb-103.webp',
    alt: 'Real-time operating systems and RTOS architecture',
  },
  'EMB-104': {
    src: '/assets/courses/embedded/emb-104.webp',
    alt: 'UART, SPI, I2C and CAN communication interfaces',
  },
  'EMB-105': {
    src: '/assets/courses/embedded/emb-105.webp',
    alt: 'Embedded Linux development board and device drivers',
  },
  'EMB-106': {
    src: '/assets/courses/embedded/emb-106.webp',
    alt: 'Automotive ECU, vehicle electronics and embedded control systems',
  },

  // Edge AI
  'EDGE-101': {
    src: '/assets/courses/edge-ai/edge-101.webp',
    alt: 'Python programming, machine learning and data visualization',
  },
  'EDGE-102': {
    src: '/assets/courses/edge-ai/edge-102.webp',
    alt: 'Deep learning neural networks and AI architecture',
  },
  'EDGE-103': {
    src: '/assets/courses/edge-ai/edge-103.webp',
    alt: 'AI model optimization, quantization and pruning',
  },
  'EDGE-104': {
    src: '/assets/courses/edge-ai/edge-104.webp',
    alt: 'TinyML running on microcontrollers and edge devices',
  },
  'EDGE-105': {
    src: '/assets/courses/edge-ai/edge-105.webp',
    alt: 'SoC, FPGA AI acceleration and hardware computing',
  },
  'EDGE-106': {
    src: '/assets/courses/edge-ai/edge-106.webp',
    alt: 'Computer vision, camera-based object detection and edge processing',
  },
};

export function getCourseImage(courseCode: string): CourseImageMeta {
  const normalized = courseCode.toUpperCase().trim();
  if (COURSE_IMAGES[normalized]) {
    return COURSE_IMAGES[normalized];
  }

  // Fallback if not found
  return {
    src: FALLBACK_COURSE_IMAGE,
    alt: 'QBee Online professional engineering course',
  };
}
