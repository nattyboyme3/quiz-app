import { Question } from '../types/quiz.ts';
import { QUESTION_POINTS } from './questionExplanations.tsx';

export interface IPAddress {
  octets: number[];
}

export function generateRandomIP(): IPAddress {
  // Randomly choose between 10.10.x.x and 192.168.x.x
  const isTenTen = Math.random() < 0.5;
  
  if (isTenTen) {
    return {
      octets: [
        10,
        10,
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ]
    };
  } else {
    return {
      octets: [
        192,
        168,
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
      ]
    };
  }
}

export function ipToString(ip: IPAddress): string {
  return ip.octets.join('.');
}

export function ipToNumber(ip: IPAddress): number {
  return ((ip.octets[0] << 24) | (ip.octets[1] << 16) | (ip.octets[2] << 8) | ip.octets[3]) >>> 0;
}

export function numberToIP(num: number): IPAddress {
  return {
    octets: [
      (num >>> 24) & 0xFF,
      (num >>> 16) & 0xFF,
      (num >>> 8) & 0xFF,
      num & 0xFF
    ]
  };
}

export function calculateSubnetMask(cidr: number): IPAddress {
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32');
  }
  const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr));
  return numberToIP(mask >>> 0);
}

export function calculateNetworkAddress(ip: IPAddress, cidr: number): IPAddress {
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32');
  }
  const ipNum = ipToNumber(ip);
  const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr));
  return numberToIP((ipNum & mask) >>> 0);
}

export function calculateBroadcastAddress(ip: IPAddress, cidr: number): IPAddress {
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32');
  }
  const ipNum = ipToNumber(ip);
  if (cidr === 32) {
    return numberToIP(ipNum);
  }
  const mask = cidr === 0 ? 0 : (0xFFFFFFFF << (32 - cidr));
  return numberToIP((ipNum | ~mask) >>> 0);
}

export function calculateCIDRFromMask(subnetMask: IPAddress): number {
  const maskNum = ipToNumber(subnetMask);
  let cidr = 0;
  let foundZero = false;
  
  for (let i = 31; i >= 0; i--) {
    const bit = (maskNum & (1 << i)) !== 0;
    if (bit && !foundZero) {
      cidr++;
    } else if (!bit) {
      foundZero = true;
    } else if (bit && foundZero) {
      throw new Error('Invalid subnet mask: must be continuous 1s followed by continuous 0s');
    }
  }
  return cidr;
}

// Helper function to get a random CIDR value with weighted distribution
function getRandomCIDR(): number {
  // Define the CIDR ranges and their weights
  const ranges = [
    { min: 16, max: 21, weight: 1 },  // Lower range
    { min: 22, max: 26, weight: 2 },  // Middle range (twice as likely)
    { min: 27, max: 29, weight: 1 }   // Upper range
  ];

  // Calculate total weight
  const totalWeight = ranges.reduce((sum, range) => sum + range.weight, 0);

  // Generate a random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Find which range the random number falls into
  for (const range of ranges) {
    if (random < range.weight) {
      // Return a random number within this range
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
    }
    random -= range.weight;
  }

  // Fallback to middle range if something goes wrong
  return Math.floor(Math.random() * 5) + 22;
}

function generateCIDRNotationQuestion(): Question {
  const cidr = getRandomCIDR();
  const subnetMask = calculateSubnetMask(cidr);
  const maskString = ipToString(subnetMask);
  
  const incorrectOptions = [
    (cidr + 1).toString(),
    (cidr - 1).toString(),
    (cidr + 2).toString()
  ];
  
  const options = [cidr.toString(), ...incorrectOptions];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the CIDR notation for the subnet mask ${maskString}?`,
    options,
    correctAnswer: options.indexOf(cidr.toString()),
    questionType: 'cidrNotation',
    points: QUESTION_POINTS.cidrNotation
  };
}

function generateUsableHostsQuestion(): Question {
  const cidr = getRandomCIDR();
  const ip = generateRandomIP();
  const subnetMask = calculateSubnetMask(cidr);
  
  const usableHosts = Math.pow(2, 32 - cidr) - 2;
  
  const options = [
    usableHosts.toString(),
    (usableHosts + 2).toString(),
    (usableHosts - 2).toString(),
    (usableHosts * 2).toString()
  ];
  
  const correctAnswer = 0;
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Given the IP address ${ipToString(ip)}/${cidr}, how many usable host addresses are available in this subnet?`,
    options,
    correctAnswer: options.indexOf(usableHosts.toString()),
    questionType: 'usableHosts',
    points: QUESTION_POINTS.usableHosts
  };
}

function generateHostRangeQuestion(): Question {
  const cidr = getRandomCIDR();
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  
  const subnetSize = 1 << (32 - cidr);
  const halfSubnetSize = Math.ceil(subnetSize / 2);
  
  const firstUsable = numberToIP(ipToNumber(networkAddress) + 1);
  const lastUsable = numberToIP(ipToNumber(broadcastAddress) - 1);
  
  const wrongOptions = [
    `${ipToString(networkAddress)} - ${ipToString(broadcastAddress)}`,
    `${ipToString(firstUsable)} - ${ipToString(broadcastAddress)}`,
    `${ipToString(networkAddress)} - ${ipToString(lastUsable)}`,
    `${ipToString(numberToIP(ipToNumber(networkAddress) + Math.floor(Math.random() * halfSubnetSize)))} - ${ipToString(numberToIP(ipToNumber(broadcastAddress) - Math.floor(Math.random() * halfSubnetSize)))}`,
    `${ipToString(firstUsable)} - ${ipToString(numberToIP(ipToNumber(broadcastAddress) + Math.floor(Math.random() * halfSubnetSize)))}`,
    `${ipToString(numberToIP(ipToNumber(networkAddress) - Math.floor(Math.random() * halfSubnetSize)))} - ${ipToString(lastUsable)}`
  ];
  
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3;
  
  const correctAnswer = `${ipToString(firstUsable)} - ${ipToString(lastUsable)}`;
  const options = [correctAnswer, ...wrongOptions];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Given the IP address ${ipToString(ip)}/${cidr}, what is the range of usable host addresses in this subnet?`,
    options,
    correctAnswer: options.indexOf(correctAnswer),
    questionType: 'hostRange',
    points: QUESTION_POINTS.hostRange
  };
}

function generateSubnetMaskQuestion(): Question {
  const cidr = getRandomCIDR();
  const subnetMask = calculateSubnetMask(cidr);
  const maskString = ipToString(subnetMask);
  
  const options = [
    maskString,
    ipToString(calculateSubnetMask(cidr + 1)),
    ipToString(calculateSubnetMask(cidr - 1)),
    ipToString(calculateSubnetMask(cidr + 2))
  ];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the subnet mask for the CIDR notation /${cidr}?`,
    options,
    correctAnswer: options.indexOf(maskString),
    questionType: 'subnetMask',
    points: QUESTION_POINTS.subnetMask
  };
}

export function isIPInSubnet(ip: IPAddress, networkAddress: IPAddress, cidr: number): boolean {
  if (cidr < 0 || cidr > 32) {
    throw new Error('CIDR must be between 0 and 32');
  }
  if (cidr === 0) return true;  // Default route matches everything
  const ipNum = ipToNumber(ip);
  const networkNum = ipToNumber(networkAddress);
  const mask = (0xFFFFFFFF << (32 - cidr)) >>> 0;
  return (ipNum & mask) === (networkNum & mask);
}

export function generateIPContainmentQuestion(): Question {
  const cidr = Math.floor(Math.random() * 16) + 16; // Random CIDR between 16 and 31
  const networkIP = generateRandomIP();
  const networkAddress = calculateNetworkAddress(networkIP, cidr);
  const broadcastAddress = calculateBroadcastAddress(networkIP, cidr);
  
  // Generate a random IP that's in the subnet
  const inSubnetIP = numberToIP(
    ipToNumber(networkAddress) + 
    Math.floor(Math.random() * (ipToNumber(broadcastAddress) - ipToNumber(networkAddress) - 1)) + 1
  );
  
  // Generate three IPs that are outside the subnet
  const subnetSize = 1 << (32 - cidr);
  const outsideIPs = [
    // IP before network address
    numberToIP(ipToNumber(networkAddress) - Math.floor(Math.random() * subnetSize + 1)),
    // IP after broadcast address
    numberToIP(ipToNumber(broadcastAddress) + Math.floor(Math.random() * subnetSize + 1)),
    // IP in a completely different subnet
    numberToIP(ipToNumber(networkAddress) + (subnetSize * (Math.floor(Math.random() * 10) + 2)))
  ];
  
  // Combine all IPs
  const options = [inSubnetIP, ...outsideIPs].map(ip => ipToString(ip));
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Which IP address is contained within the subnet ${ipToString(networkAddress)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(ipToString(inSubnetIP)),
    questionType: 'ipContainment',
    points: QUESTION_POINTS.ipContainment
  };
}

export function generateIPContainmentQuestionTF(): Question {
  const cidr = getRandomCIDR();
  const networkIP = generateRandomIP();
  const networkAddress = calculateNetworkAddress(networkIP, cidr);
  
  // Generate a random IP that might or might not be in the subnet
  const isInSubnet = Math.random() < 0.5;
  let testIP: IPAddress;
  
  if (isInSubnet) {
    // Generate an IP in the subnet
    const networkNum = ipToNumber(networkAddress);
    const broadcastNum = ipToNumber(calculateBroadcastAddress(networkIP, cidr));
    const randomOffset = Math.floor(Math.random() * (broadcastNum - networkNum - 1)) + 1;
    testIP = numberToIP(networkNum + randomOffset);
  } else {
    // Generate an IP outside the subnet with more variety
    const networkNum = ipToNumber(networkAddress);
    const subnetSize = 1 << (32 - cidr);
    const offset = Math.random() < 0.5 
      ? -Math.floor(Math.random() * subnetSize + 1)  // Before network
      : subnetSize + Math.floor(Math.random() * subnetSize);  // After broadcast
    testIP = numberToIP(networkNum + offset);
  }
  
  const options = [
    isInSubnet ? 'Yes' : 'No',
    isInSubnet ? 'No' : 'Yes'
  ];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Is the IP address ${ipToString(testIP)} in the subnet ${ipToString(networkIP)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(isInSubnet ? 'Yes' : 'No'),
    questionType: 'ipContainmentTF',
    points: QUESTION_POINTS.ipContainmentTF
  };
}

export function generateBroadcastAddressQuestion(): Question {
  const cidr = getRandomCIDR();
  const ip = generateRandomIP();
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  const broadcastString = ipToString(broadcastAddress);
  
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const networkNum = ipToNumber(networkAddress);
  const broadcastNum = ipToNumber(broadcastAddress);
  
  const wrongOptions = [
    ipToString(numberToIP(broadcastNum + 1)),
    ipToString(numberToIP(broadcastNum - 1)),
    ipToString(numberToIP(networkNum - 1)),
    ipToString(numberToIP(networkNum + 1))
  ];
  
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3;
  
  const options = [broadcastString, ...wrongOptions];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the broadcast address for the IP address ${ipToString(ip)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(broadcastString),
    questionType: 'broadcastAddress',
    points: QUESTION_POINTS.broadcastAddress
  };
}

export function generateNetworkAddressQuestion(): Question {
  const cidr = getRandomCIDR();
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const networkString = ipToString(networkAddress);
  
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  const networkNum = ipToNumber(networkAddress);
  const broadcastNum = ipToNumber(broadcastAddress);
  
  const wrongOptions = [
    ipToString(numberToIP(networkNum + 1)),
    ipToString(numberToIP(networkNum - 1)),
    ipToString(numberToIP(broadcastNum - 1)),
    ipToString(numberToIP(broadcastNum + 1))
  ];
  
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3;
  
  const options = [networkString, ...wrongOptions];
  
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the network address for the IP address ${ipToString(ip)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(networkString),
    questionType: 'networkAddress',
    points: QUESTION_POINTS.networkAddress
  };
}

function generateSubnettingQuestion(): Question {
  const questionTypes = [
    generateCIDRNotationQuestion,
    generateUsableHostsQuestion,
    generateHostRangeQuestion,
    generateSubnetMaskQuestion,
    generateIPContainmentQuestion,
    generateBroadcastAddressQuestion,
    generateNetworkAddressQuestion,
    generateIPContainmentQuestionTF
  ];
  
  const randomType = Math.floor(Math.random() * questionTypes.length);
  return questionTypes[randomType]();
}

export function generateSubnettingQuestions(count: number): Question[] {
  return Array.from({ length: count }, () => generateSubnettingQuestion());
}

export function stringToIP(ipString: string): IPAddress {
  const octets = ipString.split('.').map(Number);
  if (octets.length !== 4 || octets.some(octet => isNaN(octet) || octet < 0 || octet > 255)) {
    throw new Error('Invalid IP address string');
  }
  return { octets };
} 