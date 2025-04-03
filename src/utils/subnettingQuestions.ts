import { Question } from '../types/quiz.ts';

interface IPAddress {
  octets: number[];
}

function generateRandomIP(): IPAddress {
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

function ipToString(ip: IPAddress): string {
  return ip.octets.join('.');
}

function ipToNumber(ip: IPAddress): number {
  return (ip.octets[0] << 24) | (ip.octets[1] << 16) | (ip.octets[2] << 8) | ip.octets[3];
}

function numberToIP(num: number): IPAddress {
  return {
    octets: [
      (num >>> 24) & 0xFF,
      (num >>> 16) & 0xFF,
      (num >>> 8) & 0xFF,
      num & 0xFF
    ]
  };
}

function calculateSubnetMask(cidr: number): IPAddress {
  const mask = 0xFFFFFFFF << (32 - cidr);
  return numberToIP(mask);
}

function calculateNetworkAddress(ip: IPAddress, cidr: number): IPAddress {
  const ipNum = ipToNumber(ip);
  const mask = 0xFFFFFFFF << (32 - cidr);
  return numberToIP(ipNum & mask);
}

function calculateBroadcastAddress(ip: IPAddress, cidr: number): IPAddress {
  const ipNum = ipToNumber(ip);
  const mask = 0xFFFFFFFF << (32 - cidr);
  return numberToIP(ipNum | ~mask);
}

function calculateCIDRFromMask(subnetMask: IPAddress): number {
  const maskNum = ipToNumber(subnetMask);
  let cidr = 0;
  for (let i = 31; i >= 0; i--) {
    if ((maskNum & (1 << i)) === 0) break;
    cidr++;
  }
  return cidr;
}

function generateCIDRNotationQuestion(): Question {
  const cidr = Math.floor(Math.random() * 17) + 16; // Random CIDR between 16 and 32
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
  const cidr = Math.floor(Math.random() * 16) + 16; // Random CIDR between 16 and 31
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
  const cidr = Math.floor(Math.random() * 16) + 16; // Random CIDR between 16 and 31
  const ip = generateRandomIP();
  const networkAddress = calculateNetworkAddress(ip, cidr);
  const broadcastAddress = calculateBroadcastAddress(ip, cidr);
  
  // Calculate first and last usable hosts (network + 1 and broadcast - 1)
  const firstUsable = numberToIP(ipToNumber(networkAddress) + 1);
  const lastUsable = numberToIP(ipToNumber(broadcastAddress) - 1);
  
  const options = [
    `${ipToString(firstUsable)} - ${ipToString(lastUsable)}`,
    `${ipToString(networkAddress)} - ${ipToString(broadcastAddress)}`,
    `${ipToString(firstUsable)} - ${ipToString(broadcastAddress)}`,
    `${ipToString(networkAddress)} - ${ipToString(lastUsable)}`
  ];
  
  return {
    id: Math.random(),
    text: `Given the IP address ${ipToString(ip)}/${cidr}, what is the range of usable host addresses in this subnet?`,
    options,
    correctAnswer: 0
  };
}

function generateSubnetMaskQuestion(): Question {
  const cidr = Math.floor(Math.random() * 17) + 16; // Random CIDR between 16 and 32
  const subnetMask = calculateSubnetMask(cidr);
  const correctMask = ipToString(subnetMask);
  
  // Generate incorrect options by modifying the correct mask
  const incorrectOptions = [
    // Modify one octet by adding 1
    ipToString({
      octets: subnetMask.octets.map((octet, i) => 
        i === 0 ? (octet + 1) % 256 : octet
      )
    }),
    // Modify one octet by subtracting 1
    ipToString({
      octets: subnetMask.octets.map((octet, i) => 
        i === 1 ? (octet - 1 + 256) % 256 : octet
      )
    }),
    // Modify one octet by shifting bits
    ipToString({
      octets: subnetMask.octets.map((octet, i) => 
        i === 2 ? (octet << 1) % 256 : octet
      )
    })
  ];
  
  // Combine correct and incorrect options
  const options = [correctMask, ...incorrectOptions];
  
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

function isIPInSubnet(ip: IPAddress, networkAddress: IPAddress, cidr: number): boolean {
  const ipNum = ipToNumber(ip);
  const networkNum = ipToNumber(networkAddress);
  const mask = 0xFFFFFFFF << (32 - cidr);
  return (ipNum & mask) === (networkNum & mask);
}

function generateIPContainmentQuestion(): Question {
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
  const outsideIPs = [
    // IP before network address
    numberToIP(ipToNumber(networkAddress) - 1),
    // IP after broadcast address
    numberToIP(ipToNumber(broadcastAddress) + 1),
    // IP in different subnet
    numberToIP(ipToNumber(networkAddress) ^ (1 << (31 - cidr)))
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
    correctAnswer: options.indexOf(ipToString(inSubnetIP))
  };
}

function generateSubnettingQuestion(): Question {
  // Randomly choose between the five question types
  const questionType = Math.random();
  if (questionType < 0.2) {
    return generateUsableHostsQuestion();
  } else if (questionType < 0.4) {
    return generateHostRangeQuestion();
  } else if (questionType < 0.6) {
    return generateSubnetMaskQuestion();
  } else if (questionType < 0.8) {
    return generateCIDRNotationQuestion();
  } else {
    return generateIPContainmentQuestion();
  }
}

export function generateSubnettingQuestions(count: number): Question[] {
  return Array.from({ length: count }, (_, index) => ({
    ...generateSubnettingQuestion(),
    id: index + 1
  }));
} 