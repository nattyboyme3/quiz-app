import React from 'react';
import { QuestionType } from '../types/quiz';

// Define points for each question type based on difficulty
export const QUESTION_POINTS: Record<QuestionType, number> = {
  usableHosts: 10,    // Basic calculation
  hostRange: 15,      // Requires understanding of network and broadcast addresses
  subnetMask: 10,     // Binary conversion required
  cidrNotation: 10,   // Conceptual understanding
  ipContainment: 15, // Requires multiple steps and binary operations
  broadcastAddress: 15, // Complex binary operations
  networkAddress: 15,  // Most complex, requires full understanding of subnetting
  ipContainmentTF: 10
};

export const getQuestionTypeExplanation = (type: QuestionType): string | JSX.Element => {
  switch (type) {
    case 'usableHosts':
      return "To find the number of usable hosts, use the formula 2^(32-CIDR) - 2. We subtract 2 because the network address and broadcast address can't be used as host addresses.";
    case 'hostRange':
      return "The host range goes from the first usable IP (network address + 1) to the last usable IP (broadcast address - 1). Remember that network and broadcast addresses can't be used for hosts.";
    case 'subnetMask':
      return "For subnet masks, convert the CIDR to binary (1s for network bits, 0s for host bits), then convert each octet back to decimal. For example, /24 is 11111111.11111111.11111111.00000000 or 255.255.255.0";
    case 'cidrNotation':
      return "CIDR (Classless Inter-Domain Routing) notation represents the number of network bits in a subnet mask. It's written as a forward slash followed by the number of 1s in the binary subnet mask. For example, 255.255.255.0 in binary has 24 consecutive 1s, so it's written as /24. The higher the CIDR number, the smaller the subnet.";
    case 'ipContainment':
      return (
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the IP and subnet mask to binary</li>
          <li>Perform bitwise AND against the IP</li>
          <li>If the result equals the network address, the IP is in the subnet</li>
        </ol>
      );
    case 'ipContainmentTF':
      return (
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the IP and subnet mask to binary</li>
          <li>Perform bitwise AND against the IP</li>
          <li>If the result equals the network address, the IP is in the subnet</li>
        </ol>
      );
    case 'broadcastAddress':
      return (
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the network address to binary</li>
          <li>Set all host bits (determined by CIDR) to 1</li>
          <li>Convert back to decimal</li>
          <li>Or simply subtract 1 from the next network address</li>
        </ol>
      );
    case 'networkAddress':
      return (
        <ol className="list-decimal list-inside space-y-2">
          <li>Convert the IP and subnet mask to binary</li>
          <li>Perform bitwise AND between them</li>
          <li>Convert the result back to decimal</li>
          <li>All host bits will be 0</li>
        </ol>
      );
    default:
      return "";
  }
};

interface QuestionExplanationProps {
  questionType: QuestionType;
}

export function QuestionExplanation({ questionType }: QuestionExplanationProps): JSX.Element {
  return (
    <div className="mb-6 text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm dark:shadow-gray-900/50">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">How to solve this type of question:</h3>
          <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {getQuestionTypeExplanation(questionType)}
          </div>
        </div>
        {questionType === 'cidrNotation' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              CIDR notation is a compact way to represent subnet masks. Instead of writing out the full subnet mask (like 255.255.255.0), 
              we just write the number of network bits after a forward slash (like /24). This makes it easier to work with and understand subnet sizes.
            </p>
          </div>
        )}
        {questionType === 'ipContainment' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Think of the subnet mask as a filter. When you perform a bitwise AND between an IP and its subnet mask, 
              you're essentially "filtering out" the host bits, leaving only the network portion. If this matches the network address, 
              the IP belongs to that subnet!
            </p>
          </div>
        )}
        {questionType === 'ipContainmentTF' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Think of the subnet mask as a filter. When you perform a bitwise AND between an IP and its subnet mask, 
              you're essentially "filtering out" the host bits, leaving only the network portion. If this matches the network address, 
              the IP belongs to that subnet!
            </p>
          </div>
        )}
        {questionType === 'broadcastAddress' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              Remember this mnemonic: "Broadcast is all ones in the host bits." When converting to binary, 
              the network bits stay the same as the network address, but all host bits become 1s. 
              Alternatively, you can find it by subtracting 1 from the next network address.
            </p>
          </div>
        )}
        {questionType === 'networkAddress' && (
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-md">
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 dark:text-blue-200 text-sm">
              The network address is like the "floor" of a subnet - it's the lowest possible address in that subnet. 
              When you perform a bitwise AND between an IP and its subnet mask, you're essentially "zeroing out" 
              all the host bits, which gives you the network address.
            </p>
          </div>
        )}
        {questionType === 'hostRange' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 text-sm">
              Think of the host range as the "usable space" between the network address and broadcast address. 
              The first usable host is always network address + 1, and the last usable host is broadcast address - 1. 
              Remember: network and broadcast addresses are like the "walls" of the subnet - you can't use them for hosts!
            </p>
          </div>
        )}
        {questionType === 'usableHosts' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 text-sm">
              The formula 2^(32-CIDR) - 2 might look intimidating, but here's a simple way to think about it: 
              CIDR is the number of network bits in the subnet mask. Since there's 32 bits in an IP address, 
              the number of host bits (32-CIDR) tells you how many unique addresses you can make without changing the network portion. 
              We subtract 2 because the network and broadcast addresses are reserved. For example, in a /24 network, 
              you have 8 host bits (32-24), so 2^8 = 256 total addresses, minus 2 reserved addresses = 254 usable hosts.
            </p>
          </div>
        )}
        {questionType === 'subnetMask' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 text-sm">
              A subnet mask is like a "template" that shows which bits are for the network and which are for hosts. 
              The 1s in the mask represent network bits, and the 0s represent host bits. 
              Common subnet masks like 255.255.255.0 (/24) are easy to remember, but for others, 
              you can break them down into octets and convert each to binary.
            </p>
          </div>
        )}
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
        ? "Correct! Well done! 🎉"
        : `Incorrect. The correct answer was: ${correctAnswer}`}
    </div>
  );
} 