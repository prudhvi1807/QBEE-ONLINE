// In-browser lab definitions. The preview runner checks code against these rules and
// renders the result. In production, POST the source to a sandboxed runner
// (iverilog/verilator, arm-none-eabi-gcc + QEMU, Python) and stream real output back.

export type LabView = 'waveform' | 'board' | 'console';

export interface LabCheck {
  id: string;
  label: string;
  test: RegExp;
  hint: string;
}

export interface Lab {
  id: string;
  course: string; // course code
  module: number; // 0-based module index
  title: string;
  language: 'verilog' | 'c' | 'python';
  fileName: string;
  view: LabView;
  brief: string;
  steps: string[];
  starter: string;
  checks: LabCheck[];
  successLog: string[];
}

export const LABS: Lab[] = [
  {
    id: 'vlsi101-counter',
    course: 'VLSI-101',
    module: 1,
    title: '4-bit counter with synchronous reset',
    language: 'verilog',
    fileName: 'counter.v',
    view: 'waveform',
    brief: 'Describe a 4-bit up-counter that increments on every rising clock edge and clears to zero when rst is high. Use non-blocking assignments in the sequential block.',
    steps: ['Trigger the always block on the rising edge of clk', 'Clear count to 0 when rst is high', 'Otherwise increment count by 1', 'Use non-blocking (<=) assignments'],
    starter: `module counter (
    input  wire       clk,
    input  wire       rst,
    output reg  [3:0] count
);

    // TODO: write the sequential logic
    always @(/* sensitivity */) begin

    end

endmodule
`,
    checks: [
      { id: 'edge', label: 'Sequential block triggers on posedge clk', test: /always\s*@\s*\(\s*posedge\s+clk\s*\)/, hint: 'Use `always @(posedge clk)` for a synchronous design.' },
      { id: 'reset', label: 'Synchronous reset clears count', test: /if\s*\(\s*rst\s*\)\s*(begin\s*)?count\s*<=\s*(4'(b0000|d0|h0)|0)\s*;/, hint: "Inside the block: `if (rst) count <= 4'd0;`" },
      { id: 'inc', label: 'Counter increments by one', test: /count\s*<=\s*count\s*\+\s*(1|4'(d1|b0001|h1)|1'b1)\s*;/, hint: 'In the else branch: `count <= count + 1;`' },
      { id: 'nba', label: 'No blocking assignments to count', test: /^(?![\s\S]*\bcount\s*=[^=])[\s\S]*$/, hint: 'Replace `count = …` with `count <= …` inside the clocked block.' },
    ],
    successLog: ['iverilog -g2012 -o sim counter.v tb_counter.v', 'vvp sim', 'VCD info: dumpfile counter.vcd opened for output.', 'PASS  reset holds count at 0', 'PASS  count increments 0 → 15', 'PASS  count wraps 15 → 0', '3/3 testbench checks passed'],
  },
  {
    id: 'emb101-gpio',
    course: 'EMB-101',
    module: 3,
    title: 'Register-level GPIO: LED follows button',
    language: 'c',
    fileName: 'main.c',
    view: 'board',
    brief: 'Using memory-mapped registers only (no HAL), turn the LED on pin 5 on while the button on pin 13 is pressed (active-low), and off otherwise.',
    steps: ['Declare register pointers as volatile', 'Read the button bit from GPIO_IDR', 'Set bit 5 of GPIO_ODR with |= when pressed', 'Clear bit 5 with &= ~ when released'],
    starter: `#include <stdint.h>

#define GPIO_BASE   0x40020000UL
#define GPIO_IDR    (*(uint32_t *)(GPIO_BASE + 0x10))   // TODO: is this safe?
#define GPIO_ODR    (*(uint32_t *)(GPIO_BASE + 0x14))

#define LED_PIN     5
#define BUTTON_PIN  13

int main(void) {
    while (1) {
        // TODO: if the button is pressed (bit reads 0), turn the LED on
        // otherwise turn it off
    }
}
`,
    checks: [
      { id: 'volatile', label: 'Registers are accessed through volatile pointers', test: /volatile\s+uint32_t\s*\*[\s\S]*volatile\s+uint32_t\s*\*/, hint: 'Hardware registers can change outside your code — cast to `(volatile uint32_t *)`.' },
      { id: 'read', label: 'Button bit is read from GPIO_IDR', test: /GPIO_IDR\s*&\s*\(\s*1(U|UL)?\s*<<\s*BUTTON_PIN\s*\)/, hint: 'Test the bit with `GPIO_IDR & (1U << BUTTON_PIN)`.' },
      { id: 'set', label: 'LED bit is set with |=', test: /GPIO_ODR\s*\|=\s*\(\s*1(U|UL)?\s*<<\s*LED_PIN\s*\)/, hint: 'Set a single bit with `GPIO_ODR |= (1U << LED_PIN);`' },
      { id: 'clear', label: 'LED bit is cleared with &= ~', test: /GPIO_ODR\s*&=\s*~\s*\(\s*1(U|UL)?\s*<<\s*LED_PIN\s*\)/, hint: 'Clear a single bit with `GPIO_ODR &= ~(1U << LED_PIN);`' },
    ],
    successLog: ['arm-none-eabi-gcc -mcpu=cortex-m4 -O1 -c main.c', 'arm-none-eabi-ld -T stm32.ld main.o -o main.elf', 'text 412  data 0  bss 0', 'Flashing to virtual board… done', 'Press the button on the virtual board to test.'],
  },
  {
    id: 'edge101-split',
    course: 'EDGE-101',
    module: 1,
    title: 'Honest evaluation with a held-out test set',
    language: 'python',
    fileName: 'evaluate.py',
    view: 'console',
    brief: 'Split the vibration-sensor dataset into train and test sets, fit a decision tree on the training set only, and report accuracy on the test set.',
    steps: ['Split X and y with train_test_split (test_size=0.2, random_state=42)', 'Fit the model on the training split only', 'Predict on the test split', 'Print accuracy with accuracy_score'],
    starter: `import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score
# TODO: import train_test_split

df = pd.read_csv("vibration.csv")
X = df.drop(columns=["fault"])
y = df["fault"]

model = DecisionTreeClassifier(max_depth=4)

# TODO: split, fit on train, evaluate on test
`,
    checks: [
      { id: 'import', label: 'train_test_split is imported', test: /from\s+sklearn\.model_selection\s+import\s+[^\n]*train_test_split/, hint: '`from sklearn.model_selection import train_test_split`' },
      { id: 'split', label: 'Data is split with a fixed seed', test: /train_test_split\s*\([^)]*test_size\s*=\s*0?\.2[^)]*random_state\s*=\s*42|train_test_split\s*\([^)]*random_state\s*=\s*42[^)]*test_size\s*=\s*0?\.2/, hint: 'Pass `test_size=0.2, random_state=42` so results are reproducible.' },
      { id: 'fit', label: 'Model is fitted on the training split only', test: /model\.fit\s*\(\s*X_train\s*,\s*y_train\s*\)/, hint: 'Fit with `model.fit(X_train, y_train)` — never on the full data.' },
      { id: 'score', label: 'Accuracy is computed on the test split', test: /accuracy_score\s*\(\s*y_test\s*,/, hint: 'Compare predictions against `y_test`, not `y_train`.' },
    ],
    successLog: ['python evaluate.py', 'Loaded 1,200 rows × 9 features', 'Train: 960 rows   Test: 240 rows', 'Test accuracy: 0.912', 'Lab checker: evaluation uses held-out data ✓'],
  },
];

export const labsForCourse = (code: string) => LABS.filter((l) => l.course === code);
