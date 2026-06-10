import React from 'react';
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

const GUIDANCE: Partial<Record<QuestionType, React.ReactNode>> = {
  cidrNotation: (
    <div className="space-y-3">
      <p>
        CIDR notation is just a shortcut. The number after the <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/</code> tells
        you how much of the address identifies the network vs. the individual device. Instead of
        writing out a full subnet mask like <em>255.255.255.0</em>, you just write <em>/24</em>.
      </p>
      <p>
        To convert a subnet mask <strong>to</strong> CIDR notation, use this table — each group
        (the four numbers separated by dots) contributes a fixed amount. Add them up left to right,
        stopping at the first 0:
      </p>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-left">Group value</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-left">Adds to CIDR</th>
            </tr>
          </thead>
          <tbody>
            {[['255','8'],['254','7'],['252','6'],['248','5'],['240','4'],['224','3'],['192','2'],['128','1'],['0','0']].map(([v,a]) => (
              <tr key={v} className="even:bg-gray-50 dark:even:bg-gray-800/50">
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 font-mono">{v}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-1">{a}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        <strong>Example:</strong> <span className="font-mono">255.255.255.128</span> → 8 + 8 + 8 + 1 = <strong>/25</strong>
      </p>
    </div>
  ),

  subnetMask: (
    <div className="space-y-3">
      <p>
        A subnet mask labels which part of an IP address is the "neighborhood" (network) and
        which part is the "house number" (device). This question is the reverse of CIDR notation —
        you're converting a <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/</code>number back into four dotted groups.
      </p>
      <p>
        <strong>Method:</strong> Divide the CIDR number by 8.
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>The <strong>whole number</strong> result = how many full <span className="font-mono">255</span>s you have, starting from the left.</li>
        <li>The <strong>remainder</strong> = look it up in the table below to get the partial group.</li>
        <li>Fill any remaining groups with <span className="font-mono">0</span>.</li>
      </ul>
      <p className="text-sm">
        <strong>Remainder → group value:</strong>{' '}
        0→255, 1→128, 2→192, 3→224, 4→240, 5→248, 6→252, 7→254
      </p>
      <p>
        <strong>Example:</strong> /26 → 26 ÷ 8 = 3 remainder 2 → three 255s, then 192, then 0 →{' '}
        <span className="font-mono font-semibold">255.255.255.192</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Common cheat sheet: /24→.0 &nbsp;/25→.128 &nbsp;/26→.192 &nbsp;/27→.224 &nbsp;/28→.240 &nbsp;/29→.248 &nbsp;/30→.252
        (these are the values of the last non-zero group)
      </p>
    </div>
  ),

  networkAddress: (
    <div className="space-y-3">
      <p>
        Think of an IP address like a street address — part of it names the neighborhood, and part
        of it names the house. The network address is the "neighborhood name" with all the house
        numbers replaced by zeros. It's not assigned to any device; it just names the subnet.
      </p>
      <p>
        <strong>For common CIDRs, it's straightforward:</strong>
      </p>
      <ul className="list-disc list-inside space-y-1 font-mono text-sm">
        <li>/8 → keep only the 1st group, zero the rest: <span className="font-semibold">10</span>.45.23.100/8 → <span className="font-semibold">10.0.0.0</span></li>
        <li>/16 → keep the first 2 groups: 10.<span className="font-semibold">45</span>.23.100/16 → <span className="font-semibold">10.45.0.0</span></li>
        <li>/24 → keep the first 3 groups: 192.168.<span className="font-semibold">5</span>.99/24 → <span className="font-semibold">192.168.5.0</span></li>
      </ul>
      <p>
        <strong>When the CIDR falls in between</strong> (like /25 or /27), the split happens inside
        one of the groups. Find the subnet mask for that CIDR, then for the "split" group: round
        the IP's value <em>down</em> to the nearest multiple of (256 − mask value).
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Example: 192.168.1.200/25 → mask is 255.255.255.128, split group value is 128, 256−128=128.
        200 rounded down to nearest multiple of 128 = 128. Network address: 192.168.1.128.
      </p>
    </div>
  ),

  broadcastAddress: (
    <div className="space-y-3">
      <p>
        The broadcast address is the very last address in a subnet. It acts like a megaphone —
        a message sent to this address reaches every device on the network at once. Because of
        that special role, no individual device can use it as its own address.
      </p>
      <p>
        <strong>Method:</strong> Start from the network address and set the "host portion" (everything
        after the network split) to its highest possible value.
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>/24: the last group goes from 0–255, so set it to <span className="font-mono">255</span>. &nbsp;<span className="text-sm text-gray-500 dark:text-gray-400">(e.g., 192.168.5.0/24 → broadcast 192.168.5.255)</span></li>
        <li>/25: the host portion covers half a group (0–127 or 128–255), so the last group ends at <span className="font-mono">127</span> or <span className="font-mono">255</span> respectively.</li>
      </ul>
      <p>
        <strong>Shortcut:</strong> The subnet size is 2<sup>(32−CIDR)</sup>.
        Broadcast = network address + subnet size − 1.
        Or: find what the <em>next</em> network address would be (add the subnet size), then subtract 1.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Common subnet sizes: /24→256, /25→128, /26→64, /27→32, /28→16, /29→8, /30→4
      </p>
    </div>
  ),

  usableHosts: (
    <div className="space-y-3">
      <p>
        Every subnet has a pool of addresses, but two are always reserved and can't be assigned
        to any device: the <strong>network address</strong> (the very first one) and the{' '}
        <strong>broadcast address</strong> (the very last one). Everything in between is fair game.
      </p>
      <p>
        <strong>Formula:</strong> 2<sup>(32 − CIDR)</sup> − 2
      </p>
      <p>
        A handy pattern: each step up in CIDR roughly halves the count.
      </p>
      <div className="overflow-x-auto">
        <table className="text-sm border-collapse w-auto">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-1">CIDR</th>
              <th className="border border-gray-300 dark:border-gray-600 px-3 py-1">Usable hosts</th>
            </tr>
          </thead>
          <tbody>
            {[['/24','254'],['/25','126'],['/26','62'],['/27','30'],['/28','14'],['/29','6'],['/30','2']].map(([c,h]) => (
              <tr key={c} className="even:bg-gray-50 dark:even:bg-gray-800/50">
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 font-mono text-center">{c}</td>
                <td className="border border-gray-300 dark:border-gray-600 px-3 py-1 text-center">{h}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Tip: memorize /24 = 254 hosts, then each /1 increase roughly halves it.
      </p>
    </div>
  ),

  hostRange: (
    <div className="space-y-3">
      <p>
        The host range is the set of addresses you can actually assign to devices — everything
        between the two "fenceposts" at each end of the subnet (which are reserved and unusable).
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li><strong>First usable host</strong> = network address + 1</li>
        <li><strong>Last usable host</strong> = broadcast address − 1</li>
      </ul>
      <p>
        For a /24 subnet it's easy: if the network address is <span className="font-mono">x.x.x.0</span> and
        broadcast is <span className="font-mono">x.x.x.255</span>, the host range is{' '}
        <span className="font-mono">x.x.x.1 – x.x.x.254</span>.
      </p>
      <p>
        For other CIDRs, the steps are the same — first find the network address and broadcast
        address for the given IP and CIDR, then nudge each one step inward.
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        A common mistake: including the network or broadcast address in the range. Remember —
        those fenceposts aren't usable hosts!
      </p>
    </div>
  ),

  ipContainment: (
    <div className="space-y-3">
      <p>
        Checking whether an IP "belongs" to a subnet means asking: does this address share the
        same neighborhood? You compare the network portion of the mystery IP to the subnet's
        network address.
      </p>
      <p>
        <strong>For common CIDRs, just compare groups:</strong>
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>/8: the first group must match the network address.</li>
        <li>/16: the first two groups must match.</li>
        <li>/24: the first three groups must match.</li>
      </ul>
      <p>
        <strong>For other CIDRs</strong> (/25, /26, /27, etc.), the split falls inside a group.
        The most reliable approach: find the subnet's network address and broadcast address, then
        check whether the mystery IP falls between them (inclusive on both ends).
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        The math: zero out the "host portion" of the mystery IP using the subnet mask (the same
        process as finding a network address), then compare to the subnet's network address. If
        they match, the IP is inside the subnet.
      </p>
    </div>
  ),

  ipContainmentTF: (
    <div className="space-y-3">
      <p>
        Checking whether an IP "belongs" to a subnet means asking: does this address share the
        same neighborhood? You compare the network portion of the mystery IP to the subnet's
        network address.
      </p>
      <p>
        <strong>For common CIDRs, just compare groups:</strong>
      </p>
      <ul className="list-disc list-inside space-y-1">
        <li>/8: the first group must match the network address.</li>
        <li>/16: the first two groups must match.</li>
        <li>/24: the first three groups must match.</li>
      </ul>
      <p>
        <strong>For other CIDRs</strong> (/25, /26, /27, etc.), the split falls inside a group.
        The most reliable approach: find the subnet's network address and broadcast address, then
        check whether the mystery IP falls between them (inclusive on both ends).
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        The math: zero out the "host portion" of the mystery IP using the subnet mask (the same
        process as finding a network address), then compare to the subnet's network address. If
        they match, the IP is inside the subnet.
      </p>
    </div>
  ),
};

interface QuestionExplanationProps {
  questionType: QuestionType;
}

export function QuestionExplanation({ questionType }: QuestionExplanationProps): JSX.Element {
  const guidance = GUIDANCE[questionType];
  if (!guidance) return <></>;

  return (
    <div className="mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to solve this type of question:</h3>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {guidance}
      </div>
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
        ? "Correct! Well done!"
        : `Incorrect. The correct answer was: ${correctAnswer}`}
    </div>
  );
}
