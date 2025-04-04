import { Question } from '../types/quiz.ts';

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
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 32
  const subnetMask = calculateSubnetMask(cidr);
  const maskString = ipToString(subnetMask);
  
  // Generate incorrect CIDR values
  const incorrectOptions = [
    (cidr + 1).toString(),
    (cidr - 1).toString(),
    (cidr + 2).toString()
  ];
  
  // Combine correct and incorrect options
  const options = [cidr.toString(), ...incorrectOptions];
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the CIDR notation for the subnet mask ${maskString}?`,
    options,
    correctAnswer: options.indexOf(cidr.toString())
  };
}

function generateUsableHostsQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const ip = generateRandomIP();
  const subnetMask = calculateSubnetMask(cidr);
  
  // Calculate number of usable hosts (2^n - 2)
  const usableHosts = Math.pow(2, 32 - cidr) - 2;
  
  // Generate options (one correct, three incorrect)
  const options = [
    usableHosts.toString(),
    (usableHosts + 2).toString(),
    (usableHosts - 2).toString(),
    (usableHosts * 2).toString()
  ];
  
  // Shuffle options
  const correctAnswer = 0;
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Given the IP address ${ipToString(ip)}/${cidr}, how many usable host addresses are available in this subnet?`,
    options,
    correctAnswer: options.indexOf(usableHosts.toString())
  };
}

function generateHostRangeQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  
  // Calculate the size of the subnet
  const subnetSize = 1 << (32 - cidr);
  const halfSubnetSize = Math.ceil(subnetSize / 2);
  
  // Calculate first and last usable hosts (network + 1 and broadcast - 1)
  const firstUsable = numberToIP(ipToNumber(networkAddress) + 1);
  const lastUsable = numberToIP(ipToNumber(broadcastAddress) - 1);
  
  // Generate wrong answers with various patterns
  const wrongOptions = [
    // Wrong answer 1: network to broadcast
    `${ipToString(networkAddress)} - ${ipToString(broadcastAddress)}`,
    
    // Wrong answer 2: first usable to broadcast
    `${ipToString(firstUsable)} - ${ipToString(broadcastAddress)}`,
    
    // Wrong answer 3: network to last usable
    `${ipToString(networkAddress)} - ${ipToString(lastUsable)}`,
    
    // Wrong answer 4: random start in first half to random end in second half
    `${ipToString(numberToIP(ipToNumber(networkAddress) + Math.floor(Math.random() * halfSubnetSize)))} - ${ipToString(numberToIP(ipToNumber(broadcastAddress) - Math.floor(Math.random() * halfSubnetSize)))}`,
    
    // Wrong answer 5: extends into next subnet
    `${ipToString(firstUsable)} - ${ipToString(numberToIP(ipToNumber(broadcastAddress) + Math.floor(Math.random() * halfSubnetSize)))}`,
    
    // Wrong answer 6: starts in previous subnet
    `${ipToString(numberToIP(ipToNumber(networkAddress) - Math.floor(Math.random() * halfSubnetSize)))} - ${ipToString(lastUsable)}`
  ];
  
  // Shuffle wrong options and keep only 3
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3; // Keep only 3 wrong options
  
  // Combine correct answer with wrong options
  const correctAnswer = `${ipToString(firstUsable)} - ${ipToString(lastUsable)}`;
  const options = [correctAnswer, ...wrongOptions];
  
  // Shuffle all options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Given the IP address ${ipToString(ip)}/${cidr}, what is the range of usable host addresses in this subnet?`,
    options,
    correctAnswer: options.indexOf(correctAnswer)
  };
}

function generateSubnetMaskQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const correctMask = ipToString(calculateSubnetMask(cidr));
  
  // Generate three incorrect masks
  const options: string[] = [correctMask];
  const usedMasks = new Set([correctMask]);
  
  while (options.length < 4) {
    // Generate a random CIDR that's different from the correct one
    let wrongCIDR = getRandomCIDR();
    while (wrongCIDR === cidr) {
      wrongCIDR = getRandomCIDR();
    }
    
    const wrongMask = ipToString(calculateSubnetMask(wrongCIDR));
    
    // Only add the mask if it's not already used
    if (!usedMasks.has(wrongMask)) {
      options.push(wrongMask);
      usedMasks.add(wrongMask);
    }
  }
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the subnet mask in dotted decimal notation for a /${cidr} network?`,
    options,
    correctAnswer: options.indexOf(correctMask)
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

function generateIPContainmentQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const networkIP = generateRandomIP();
  const networkAddress = calculateNetworkAddress(networkIP, cidr);
  const broadcastAddress = calculateBroadcastAddress(networkIP, cidr);
  
  // Calculate the size of the subnet
  const subnetSize = 1 << (32 - cidr);
  const halfSubnetSize = Math.ceil(subnetSize / 2);
  
  // Generate a random valid host IP within the subnet
  const networkNum = ipToNumber(networkAddress);
  const broadcastNum = ipToNumber(broadcastAddress);
  const randomOffset = Math.floor(Math.random() * (broadcastNum - networkNum - 1)) + 1; // +1 to skip network address
  const correctIP = numberToIP(networkNum + randomOffset);
  
  // Generate three IPs that are outside the subnet
  const outsideIPs = [
    // Randomly choose between previous subnet or next subnet, with random offset
    Math.random() < 0.5 
      ? numberToIP(ipToNumber(networkAddress) - Math.floor(Math.random() * halfSubnetSize) - 1)  // IP from previous subnet
      : numberToIP(ipToNumber(broadcastAddress) + Math.floor(Math.random() * halfSubnetSize) + 1),  // IP from next subnet
    
    // IP in next subnet block (network + subnetSize + random offset)
    numberToIP(ipToNumber(networkAddress) + subnetSize + 
      Math.floor(Math.random() * subnetSize)),
    
    // IP in previous subnet block (network - subnetSize - random offset)
    numberToIP(ipToNumber(networkAddress) - subnetSize - 
      Math.floor(Math.random() * subnetSize))
  ];
  
  // Combine all IPs
  const options = [correctIP, ...outsideIPs].map(ip => ipToString(ip));
  
  // Shuffle options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `Which usable IP address is contained within the subnet ${ipToString(networkAddress)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(ipToString(correctIP))
  };
}

export function generateBroadcastAddressQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  
  // Calculate first and last usable addresses
  const firstUsable = numberToIP(ipToNumber(networkAddress) + 1);
  const lastUsable = numberToIP(ipToNumber(broadcastAddress) - 1);
  
  // Generate wrong answers
  const wrongOptions = [
    // Last usable address
    ipToString(lastUsable),
    
    // Network address
    ipToString(networkAddress),
    
    // First usable address
    ipToString(firstUsable),
    
    // Broadcast address of a different subnet
    ipToString(calculateBroadcastAddress(
      numberToIP(ipToNumber(networkAddress) + (1 << (32 - cidr))),
      cidr
    )),
    
    // Network address of next subnet
    ipToString(numberToIP(ipToNumber(networkAddress) + (1 << (32 - cidr)))),
    
    // Random usable address in the subnet
    ipToString(numberToIP(ipToNumber(networkAddress) + 
      Math.floor(Math.random() * ((1 << (32 - cidr)) - 2)) + 1)),
    
    // Random usable address in next subnet
    ipToString(numberToIP(ipToNumber(networkAddress) + (1 << (32 - cidr)) + 
      Math.floor(Math.random() * ((1 << (32 - cidr)) - 2)) + 1))
  ];
  
  // Shuffle wrong options and keep only 3
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3;
  
  // Combine correct answer with wrong options
  const correctAnswer = ipToString(broadcastAddress);
  const options = [correctAnswer, ...wrongOptions];
  
  // Shuffle all options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the broadcast address for the subnet containing ${ipToString(ip)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(correctAnswer)
  };
}

export function generateNetworkAddressQuestion(): Question {
  const cidr = getRandomCIDR(); // Random CIDR between 16 and 29
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  
  // Calculate first and last usable addresses
  const firstUsable = numberToIP(ipToNumber(networkAddress) + 1);
  const lastUsable = numberToIP(ipToNumber(broadcastAddress) - 1);
  
  // Generate wrong answers
  const wrongOptions = [
    // Last usable address
    ipToString(lastUsable),
    
    // Broadcast address
    ipToString(broadcastAddress),
    
    // First usable address
    ipToString(firstUsable),
    
    // Network address of a different subnet
    ipToString(calculateNetworkAddress(
      numberToIP(ipToNumber(networkAddress) + (1 << (32 - cidr))),
      cidr
    )),
    
    // Broadcast address of previous subnet
    ipToString(calculateBroadcastAddress(
      numberToIP(ipToNumber(networkAddress) - (1 << (32 - cidr))),
      cidr
    )),
    
    // Random usable address in the subnet
    ipToString(numberToIP(ipToNumber(networkAddress) + 
      Math.floor(Math.random() * ((1 << (32 - cidr)) - 2)) + 1)),
    
    // Random usable address in previous subnet
    ipToString(numberToIP(ipToNumber(networkAddress) - (1 << (32 - cidr)) + 
      Math.floor(Math.random() * ((1 << (32 - cidr)) - 2)) + 1))
  ];
  
  // Shuffle wrong options and keep only 3
  for (let i = wrongOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongOptions[i], wrongOptions[j]] = [wrongOptions[j], wrongOptions[i]];
  }
  wrongOptions.length = 3;
  
  // Combine correct answer with wrong options
  const correctAnswer = ipToString(networkAddress);
  const options = [correctAnswer, ...wrongOptions];
  
  // Shuffle all options
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  
  return {
    id: Math.random(),
    text: `What is the network address for the subnet containing ${ipToString(ip)}/${cidr}?`,
    options,
    correctAnswer: options.indexOf(correctAnswer)
  };
}

function generateSubnettingQuestion(): Question {
  // Randomly choose between the seven question types
  const questionType = Math.random();
  if (questionType < 0.15) {
    return generateUsableHostsQuestion();
  } else if (questionType < 0.3) {
    return generateHostRangeQuestion();
  } else if (questionType < 0.45) {
    return generateSubnetMaskQuestion();
  } else if (questionType < 0.6) {
    return generateCIDRNotationQuestion();
  } else if (questionType < 0.75) {
    return generateIPContainmentQuestion();
  } else if (questionType < 0.85) {
    return generateBroadcastAddressQuestion();
  } else {
    return generateNetworkAddressQuestion();
  }
}

export function generateSubnettingQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, index) => ({
    ...generateSubnettingQuestion(),
    id: index + 1
  }));
}

export function stringToIP(ipString: string): IPAddress {
  const octets = ipString.split('.').map(Number);
  if (octets.length !== 4 || octets.some(octet => isNaN(octet) || octet < 0 || octet > 255)) {
    throw new Error('Invalid IP address string');
  }
  return { octets };
} 