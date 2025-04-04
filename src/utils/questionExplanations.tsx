import React from 'react';
import { QuestionType } from '../types/quiz';

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
          <li>Perform bitwise AND</li>
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
    <div className="mb-6 text-gray-700 bg-gray-50 p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">How to solve this type of question:</h3>
          <div className="text-gray-700 leading-relaxed">
            {getQuestionTypeExplanation(questionType)}
          </div>
        </div>
        {questionType === 'cidrNotation' && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Quick Tip:</h4>
            <p className="text-blue-800 text-sm">
              CIDR notation is a compact way to represent subnet masks. Instead of writing out the full subnet mask (like 255.255.255.0), 
              we just write the number of network bits after a forward slash (like /24). This makes it easier to work with and understand subnet sizes.
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
      isCorrect ? 'text-green-600' : 'text-red-600'
    }`}>
      {isCorrect
        ? "Correct! Well done! 🎉"
        : `Incorrect. The correct answer was: ${correctAnswer}`}
    </div>
  );
} 