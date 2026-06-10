import React, { useState } from 'react';
import { QuestionType } from '../types/quiz';

export const QUESTION_POINTS: Record<QuestionType, number> = {
  usableHosts: 10,
  hostRange: 15,
  subnetMask: 10,
  cidrNotation: 10,
  ipContainment: 15,
  broadcastAddress: 15,
  networkAddress: 15,
  ipContainmentTF: 10,
};

interface GuidanceEntry {
  title: string;
  category: string;
  practical: React.ReactNode;
  math?: React.ReactNode;
}

// Shared between ipContainment and ipContainmentTF — same concept, different question format
const ipContainmentPractical = (
  <div className="space-y-3">
    <p>
      An IP "belongs" to a subnet when its neighborhood matches. Compare the network
      portion of the mystery IP to the subnet's network address.
    </p>
    <p><strong>For common CIDRs, just compare groups:</strong></p>
    <ul className="list-disc list-inside space-y-1">
      <li>/8 — first group must match</li>
      <li>/16 — first two groups must match</li>
      <li>/24 — first three groups must match</li>
    </ul>
    <p>
      <strong>For other CIDRs</strong> (/25, /26, /27…), find the subnet's network
      address and broadcast address, then check whether the mystery IP falls between
      them — inclusive on both ends.
    </p>
  </div>
);

const ipContainmentMath = (
  <p>
    Apply the subnet mask to the mystery IP: for each group, if the mask value is 255
    keep the IP group as-is; if it's 0 replace with 0; for partial values (like 192),
    keep only the "covered" portion. Compare the result to the network address — if
    they match, the IP is inside. (In technical terms, this is the bitwise AND operation.)
  </p>
);

const GUIDANCE: Partial<Record<QuestionType, GuidanceEntry>> = {
  cidrNotation: {
    title: 'Reading CIDR Notation',
    category: 'CIDR Notation',
    practical: (
      <div className="space-y-3">
        <p>
          CIDR is a shortcut. The number after the{' '}
          <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">/</code>{' '}
          counts how many bits belong to the network. Instead of writing{' '}
          <em>255.255.255.0</em>, you write <em>/24</em>.
        </p>
        <p>
          To convert a subnet mask <strong>to</strong> CIDR, each of the four groups
          contributes a fixed amount. Add left to right, stop at the first 0:
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-auto">
            <caption className="sr-only">Subnet mask group value to CIDR contribution</caption>
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/60">
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-left font-semibold">Group value</th>
                <th className="border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-left font-semibold">Adds to CIDR</th>
              </tr>
            </thead>
            <tbody>
              {(['255','254','252','248','240','224','192','128','0'] as const).map((v, i) => (
                <tr key={v} className={i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/40' : ''}>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 font-mono">{v}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-3 py-1">{[8,7,6,5,4,3,2,1,0][i]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          <strong>Example:</strong>{' '}
          <span className="font-mono">255.255.255.128</span> → 8 + 8 + 8 + 1 = <strong>/25</strong>
        </p>
      </div>
    ),
    math: (
      <div className="space-y-2">
        <p>
          Those table values come from binary. Each group is 8 bits, and the values
          represent how many leading 1-bits are in that byte:{' '}
          <span className="font-mono">255 = 11111111</span> (8 ones),{' '}
          <span className="font-mono">192 = 11000000</span> (2 ones),{' '}
          <span className="font-mono">128 = 10000000</span> (1 one).
          CIDR counts all those leading 1-bits across all four groups, left to right, until
          the first 0 is reached.
        </p>
      </div>
    ),
  },

  subnetMask: {
    title: 'Converting CIDR to Subnet Mask',
    category: 'Subnet Mask',
    practical: (
      <div className="space-y-3">
        <p>
          A subnet mask labels which part of an address is the network and which is the
          device. Given a CIDR number, here's how to find the mask:
        </p>
        <p><strong>Divide the CIDR by 8.</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Whole-number result → that many full <span className="font-mono">255</span>s from the left.</li>
          <li>Remainder → partial group value (see below).</li>
          <li>Remaining groups → all <span className="font-mono">0</span>.</li>
        </ul>
        <p className="text-sm">
          <strong>Remainder → partial group:</strong>{' '}
          <span className="font-mono">1→128&nbsp; 2→192&nbsp; 3→224&nbsp; 4→240&nbsp; 5→248&nbsp; 6→252&nbsp; 7→254</span>
        </p>
        <p>
          <strong>Example:</strong> /26 → 26 ÷ 8 = <em>3 remainder 2</em> → three 255s,
          then 192, then 0 →{' '}
          <span className="font-mono font-semibold">255.255.255.192</span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Cheat sheet (last group): /24→0 &nbsp;/25→128 &nbsp;/26→192 &nbsp;/27→224 &nbsp;/28→240 &nbsp;/29→248 &nbsp;/30→252
        </p>
      </div>
    ),
    math: (
      <div className="space-y-2">
        <p>
          In binary, a subnet mask is always a block of 1s followed by a block of 0s.
          /26 = 26 ones then 6 zeros:{' '}
          <span className="font-mono">11111111.11111111.11111111.11000000</span>.
          The last group <span className="font-mono">11000000</span> = 128 + 64 = 192.
          The remainder table is just the decimal value of a byte with that many leading 1-bits.
        </p>
      </div>
    ),
  },

  networkAddress: {
    title: 'Finding the Network Address',
    category: 'Network Address',
    practical: (
      <div className="space-y-3">
        <p>
          An IP address has two parts: a <strong>neighborhood</strong> (the network) and a{' '}
          <strong>house number</strong> (the device). The network address is the neighborhood
          with the house number set to all zeros — it names the subnet, not any device.
        </p>
        <p><strong>For whole-group CIDRs:</strong></p>
        <ul className="list-disc list-inside space-y-1 text-sm font-mono">
          <li>/8 → keep 1st group, zero rest: <strong>10</strong>.45.23.100 → <strong>10.0.0.0</strong></li>
          <li>/16 → keep first 2 groups: 10.<strong>45</strong>.23.100 → <strong>10.45.0.0</strong></li>
          <li>/24 → keep first 3 groups: 192.168.<strong>5</strong>.99 → <strong>192.168.5.0</strong></li>
        </ul>
        <p>
          <strong>For in-between CIDRs</strong> (/25, /26, /27…), the split falls inside a
          group. Find the subnet mask, then for the split group: round the IP's value{' '}
          <em>down</em> to the nearest multiple of (256 − mask value for that group).
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Example: 192.168.1.200/25 → mask is 255.255.255.128, step = 256−128 = 128.
          Round 200 down to nearest 128 → 128. Network address: 192.168.1.128.
        </p>
      </div>
    ),
    math: (
      <div className="space-y-2">
        <p>
          Textbook method: convert both the IP and the subnet mask to binary, then AND them
          — keep a bit only if it's 1 in both. This zeroes out all the host bits. Convert
          back to decimal for the answer. The "round down" shortcut produces the exact same
          result without the binary conversion.
        </p>
      </div>
    ),
  },

  broadcastAddress: {
    title: 'Finding the Broadcast Address',
    category: 'Broadcast Address',
    practical: (
      <div className="space-y-3">
        <p>
          The broadcast address is the very <strong>last</strong> address in a subnet —
          a built-in "message to everyone" address. No device can be assigned it.
        </p>
        <p>
          <strong>Method:</strong> Start from the network address and set the host portion
          to its highest possible value.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            /24: last group → <span className="font-mono">255</span>.{' '}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              (192.168.5.0/24 → broadcast 192.168.5.255)
            </span>
          </li>
          <li>
            /25: host portion is half the last group → ends at{' '}
            <span className="font-mono">127</span> or <span className="font-mono">255</span>{' '}
            depending on whether the network starts at .0 or .128.
          </li>
        </ul>
        <p>
          <strong>Shortcut:</strong> subnet size = 2<sup>(32−CIDR)</sup>.
          Broadcast = network address + subnet size − 1. Or: next network address − 1.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Subnet sizes: /24→256, /25→128, /26→64, /27→32, /28→16, /29→8, /30→4
        </p>
      </div>
    ),
    math: (
      <div className="space-y-2">
        <p>
          In binary: take the network address, flip every 0 in the host portion to a 1
          — all host bits become 1s. Convert back to decimal. Equivalently: invert the
          subnet mask (swap all 1s and 0s), then OR it with the IP address. The OR
          operation sets any bit to 1 if either input is 1, filling all the host bits.
        </p>
      </div>
    ),
  },

  usableHosts: {
    title: 'Counting Usable Hosts',
    category: 'Usable Hosts',
    practical: (
      <div className="space-y-3">
        <p>
          Every subnet has a pool of addresses, but <strong>two are always reserved</strong>:
          the network address (first) and the broadcast address (last). Every address in
          between can be assigned to a device.
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-collapse w-auto">
            <caption className="sr-only">CIDR notation to usable host count reference</caption>
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700/60">
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-center font-semibold">CIDR</th>
                <th className="border border-gray-300 dark:border-gray-600 px-4 py-1.5 text-center font-semibold">Usable hosts</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['/24','254'],['/25','126'],['/26','62'],['/27','30'],
                ['/28','14'],['/29','6'],['/30','2'],
              ] as [string,string][]).map(([c, h], i) => (
                <tr key={c} className={i % 2 === 1 ? 'bg-gray-50 dark:bg-gray-800/40' : ''}>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-1 font-mono text-center">{c}</td>
                  <td className="border border-gray-300 dark:border-gray-600 px-4 py-1 text-center">{h}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pattern: each +1 step in CIDR roughly halves the count. Memorize /24 = 254,
          then halve it for each step up.
        </p>
      </div>
    ),
    math: (
      <div className="space-y-2">
        <p>
          Formula: <strong>2<sup>(32 − CIDR)</sup> − 2</strong>
        </p>
        <p>
          IPv4 addresses are 32 bits. The CIDR number is how many are used for the network.
          The remaining (32 − CIDR) host bits can each independently be 0 or 1, giving
          2<sup>(32−CIDR)</sup> total addresses. Subtract 2 for the reserved all-zeros
          (network) and all-ones (broadcast) addresses.
        </p>
      </div>
    ),
  },

  hostRange: {
    title: 'Finding the Host Range',
    category: 'Host Range',
    practical: (
      <div className="space-y-3">
        <p>
          The host range is every address you can assign to a device — everything between
          the two <strong>reserved fenceposts</strong> at each end of the subnet.
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>First usable host</strong> = network address + 1</li>
          <li><strong>Last usable host</strong> = broadcast address − 1</li>
        </ul>
        <p>
          For /24: network is <span className="font-mono">x.x.x.0</span>, broadcast is{' '}
          <span className="font-mono">x.x.x.255</span>, range is{' '}
          <span className="font-mono">x.x.x.1 – x.x.x.254</span>.
        </p>
        <p>
          For other CIDRs: find the network address and broadcast address first, then
          nudge each one step inward.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Common mistake: including the network or broadcast address in the range.
          They're the fenceposts — no device can use them.
        </p>
      </div>
    ),
    math: (
      <p>
        In binary, the first usable host has all host bits at 0 except the final bit,
        which is 1 (all-zeros would be the network address itself). The last usable host
        has all host bits at 1 except the final bit, which is 0 (all-ones = broadcast).
        In practice, network + 1 and broadcast − 1 is all you need.
      </p>
    ),
  },

  ipContainment: {
    title: 'Checking Subnet Membership',
    category: 'IP Containment',
    practical: ipContainmentPractical,
    math: ipContainmentMath,
  },

  ipContainmentTF: {
    title: 'Checking Subnet Membership',
    category: 'IP Containment',
    practical: ipContainmentPractical,
    math: ipContainmentMath,
  },
};

interface QuestionExplanationProps {
  questionType: QuestionType;
  questionText?: string;
}

export function QuestionExplanation({ questionType, questionText }: QuestionExplanationProps): JSX.Element {
  const [mathOpen, setMathOpen] = useState(false);
  const entry = GUIDANCE[questionType];
  if (!entry) return <></>;

  return (
    <div className="mb-6 rounded-xl border border-amber-200 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/30 overflow-hidden text-left shadow-sm">

      {/* Card header */}
      <div className="px-5 pt-5 pb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 mb-1">
          {entry.category}
        </p>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50 leading-tight">
          {entry.title}
        </h3>
        {questionText && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 italic leading-relaxed line-clamp-2">
            {questionText}
          </p>
        )}
      </div>

      {/* Practical zone — dominant */}
      <div className="mx-4 mb-4 rounded-lg bg-white/80 dark:bg-gray-900/60 border border-amber-100 dark:border-amber-900/40 px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2.5">
          How to solve it
        </p>
        <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
          {entry.practical}
        </div>
      </div>

      {/* Math disclosure — secondary, collapsed by default */}
      {entry.math && (
        <div className="border-t border-amber-100 dark:border-amber-900/40">
          <button
            onClick={() => setMathOpen(o => !o)}
            aria-expanded={mathOpen}
            className="w-full px-5 py-3 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400 hover:bg-amber-100/60 dark:hover:bg-amber-900/20 transition-colors text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-inset"
          >
            <span
              aria-hidden="true"
              className="text-[10px] select-none transition-transform duration-200"
              style={{ display: 'inline-block', transform: mathOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              ▶
            </span>
            {mathOpen ? 'Hide the math' : 'Show me the math'}
          </button>
          <div
            className="grid"
            style={{
              gridTemplateRows: mathOpen ? '1fr' : '0fr',
              transition: 'grid-template-rows 200ms ease-out',
            }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-4 pt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
                {entry.math}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AnswerFeedbackProps {
  isCorrect: boolean;
  correctAnswer: string;
}

export function AnswerFeedback({ isCorrect, correctAnswer }: AnswerFeedbackProps): JSX.Element {
  return (
    <div className={`text-lg font-medium mb-4 ${
      isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
    }`}>
      {isCorrect
        ? 'Correct! Well done!'
        : `Incorrect. The correct answer was: ${correctAnswer}`}
    </div>
  );
}
