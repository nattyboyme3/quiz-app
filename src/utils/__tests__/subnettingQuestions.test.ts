import { generateSubnettingQuestions } from '../subnettingQuestions';
import { Address4 } from 'ip-address';
import { 
  generateBroadcastAddressQuestion, 
  generateNetworkAddressQuestion,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  ipToString,
  stringToIP,
  IPAddress
} from '../subnettingQuestions';

describe('Subnetting Questions', () => {
  // Helper function to check if an IP is in a subnet
  const isIPInSubnet = (ip: string, network: string, cidr: number): boolean => {
    try {
      const ipAddr = new Address4(ip);
      const networkAddr = new Address4(network + '/' + cidr);
      return ipAddr.isInSubnet(networkAddr);
    } catch (e) {
      return false;
    }
  };

  // Helper function to calculate usable hosts
  const calculateUsableHosts = (cidr: number): number => {
    return Math.pow(2, 32 - cidr) - 2;
  };

  // Helper function to calculate network address
  const calculateNetworkAddress = (ip: string, cidr: number): string => {
    const ipAddr = new Address4(ip);
    return ipAddr.startAddress().address;
  };

  // Helper function to calculate broadcast address
  const calculateBroadcastAddress = (ip: string, cidr: number): string => {
    const ipAddr = new Address4(ip);
    return ipAddr.endAddress().address;
  };

  // Helper function to calculate CIDR from subnet mask
  const calculateCIDRFromMask = (mask: string): number => {
    try {
      // Convert mask to binary and count 1s
      const octets = mask.split('.').map(Number);
      if (octets.length !== 4 || octets.some(o => o < 0 || o > 255)) {
        throw new Error('Invalid subnet mask');
      }

      // Convert to 32-bit number
      const maskNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
      
      let cidr = 0;
      let foundZero = false;
      
      for (let i = 31; i >= 0; i--) {
        const bit = (maskNum & (1 << i)) !== 0;
        if (bit && !foundZero) {
          cidr++;
        } else if (!bit) {
          foundZero = true;
        } else if (bit && foundZero) {
          throw new Error('Invalid subnet mask pattern');
        }
      }
      
      return cidr;
    } catch (e) {
      throw new Error(`Invalid subnet mask: ${mask}`);
    }
  };

  // Helper function to calculate subnet mask from CIDR
  const calculateSubnetMask = (cidr: number): string => {
    if (cidr < 0 || cidr > 32) {
      throw new Error(`Invalid CIDR: ${cidr}`);
    }

    // Calculate the subnet mask by shifting bits
    const mask = ~((1 << (32 - cidr)) - 1) >>> 0;
    
    // Convert to dotted decimal notation
    return [
      (mask >>> 24) & 255,
      (mask >>> 16) & 255,
      (mask >>> 8) & 255,
      mask & 255
    ].join('.');
  };

  describe('IP Containment Questions', () => {
    it('should have exactly one correct answer', () => {
      const questions = generateSubnettingQuestions(100)
        .filter(q => q.text.includes('Which IP address is contained within the subnet'));

      for (const question of questions) {
        // Extract network address and CIDR from question text
        const match = question.text.match(/subnet ([\d.]+)\/(\d+)/);
        if (!match) continue;
        
        const [_, network, cidrStr] = match;
        const cidr = parseInt(cidrStr);

        // Count how many options are actually in the subnet
        const correctCount = question.options.filter(option => 
          isIPInSubnet(option, network, cidr)
        ).length;

        expect(correctCount).toBe(1);
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
      }
    });
  });

  describe('Usable Hosts Questions', () => {
    it('should have exactly one correct answer', () => {
      const questions = generateSubnettingQuestions(100)
        .filter(q => q.text.includes('how many usable host addresses'));

      for (const question of questions) {
        // Extract CIDR from question text
        const match = question.text.match(/\/(\d+)/);
        if (!match) continue;
        
        const cidr = parseInt(match[1]);
        const correctAnswer = calculateUsableHosts(cidr).toString();

        // Count how many options match the correct answer
        const correctCount = question.options.filter(option => 
          option === correctAnswer
        ).length;

        expect(correctCount).toBe(1);
        expect(question.options[question.correctAnswer]).toBe(correctAnswer);
      }
    });
  });

  describe('Host Range Questions', () => {
    it('should have exactly one correct answer', () => {
      const questions = generateSubnettingQuestions(100)
        .filter(q => q.text.includes('what is the range of usable host addresses'));

      for (const question of questions) {
        // Extract IP and CIDR from question text
        const match = question.text.match(/([\d.]+)\/(\d+)/);
        if (!match) continue;
        
        const [_, ip, cidrStr] = match;
        const cidr = parseInt(cidrStr);

        // Create Address4 objects for network and broadcast
        const ipAddr = new Address4(ip + '/' + cidr);
        const networkAddr = ipAddr.startAddress();
        const broadcastAddr = ipAddr.endAddress();

        // Calculate first and last usable hosts
        const firstUsableNum = parseInt(networkAddr.address.split('.')[3]) + 1;
        const lastUsableNum = parseInt(broadcastAddr.address.split('.')[3]) - 1;
        
        const firstUsable = networkAddr.address.split('.');
        firstUsable[3] = firstUsableNum.toString();
        const lastUsable = broadcastAddr.address.split('.');
        lastUsable[3] = lastUsableNum.toString();

        // Format the range string
        const correctRange = `${firstUsable.join('.')} - ${lastUsable.join('.')}`;

        // Count how many options match the correct range
        const correctCount = question.options.filter(option => 
          option === correctRange
        ).length;

        expect(correctCount).toBe(1);
        expect(question.options[question.correctAnswer]).toBe(correctRange);
      }
    });
  });

  describe('CIDR Notation Questions', () => {
    it('should have exactly one correct answer', () => {
      const questions = generateSubnettingQuestions(100)
        .filter(q => q.text.includes('What is the CIDR notation for the subnet mask'));

      for (const question of questions) {
        // Extract subnet mask from question text
        const match = question.text.match(/mask ([\d.]+)\?/);
        if (!match) continue;
        
        const [_, mask] = match;
        const correctCIDR = calculateCIDRFromMask(mask).toString();

        // Count how many options match the correct CIDR
        const correctCount = question.options.filter(option => 
          option === correctCIDR
        ).length;

        expect(correctCount).toBe(1);
        expect(question.options[question.correctAnswer]).toBe(correctCIDR);
      }
    });
  });

  describe('Subnet Mask Questions', () => {
    it('should have exactly one correct answer', () => {
      const questions = generateSubnettingQuestions(100)
        .filter(q => q.text.includes('What is the subnet mask in dotted decimal notation'));

      for (const question of questions) {
        // Extract CIDR from question text
        const match = question.text.match(/\/([\d]+)/);
        if (!match) continue;
        
        const [_, cidrStr] = match;
        const cidr = parseInt(cidrStr);
        const correctMask = calculateSubnetMask(cidr);

        // Count how many options match the correct subnet mask
        const correctCount = question.options.filter(option => 
          option === correctMask
        ).length;

        expect(correctCount).toBe(1);
        expect(question.options[question.correctAnswer]).toBe(correctMask);
      }
    });
  });
});

describe('Subnetting Helper Functions', () => {
  describe('isIPInSubnet', () => {
    const isIPInSubnet = (ip: string, network: string, cidr: number): boolean => {
      try {
        const ipAddr = new Address4(ip);
        const networkAddr = new Address4(network + '/' + cidr);
        return ipAddr.isInSubnet(networkAddr);
      } catch (e) {
        return false;
      }
    };

    it('should correctly identify IPs within a subnet', () => {
      // Test cases for /24 network
      expect(isIPInSubnet('192.168.1.100', '192.168.1.0', 24)).toBe(true);
      expect(isIPInSubnet('192.168.1.254', '192.168.1.0', 24)).toBe(true);
      expect(isIPInSubnet('192.168.2.1', '192.168.1.0', 24)).toBe(false);
      
      // Test cases for /28 network
      expect(isIPInSubnet('192.168.1.17', '192.168.1.16', 28)).toBe(true);
      expect(isIPInSubnet('192.168.1.30', '192.168.1.16', 28)).toBe(true);
      expect(isIPInSubnet('192.168.1.32', '192.168.1.16', 28)).toBe(false);
    });
  });

  describe('calculateUsableHosts', () => {
    const calculateUsableHosts = (cidr: number): number => {
      return Math.pow(2, 32 - cidr) - 2;
    };

    it('should calculate correct number of usable hosts', () => {
      expect(calculateUsableHosts(24)).toBe(254); // 256 - 2 = 254 hosts for /24
      expect(calculateUsableHosts(28)).toBe(14);  // 16 - 2 = 14 hosts for /28
      expect(calculateUsableHosts(30)).toBe(2);   // 4 - 2 = 2 hosts for /30
      expect(calculateUsableHosts(31)).toBe(0);   // 2 - 2 = 0 hosts for /31
    });
  });

  describe('calculateSubnetMask', () => {
    const calculateSubnetMask = (cidr: number): string => {
      if (cidr < 0 || cidr > 32) {
        throw new Error(`Invalid CIDR: ${cidr}`);
      }

      // Calculate the subnet mask by shifting bits
      const mask = ~((1 << (32 - cidr)) - 1) >>> 0;
      
      // Convert to dotted decimal notation
      return [
        (mask >>> 24) & 255,
        (mask >>> 16) & 255,
        (mask >>> 8) & 255,
        mask & 255
      ].join('.');
    };

    it('should calculate correct subnet masks', () => {
      expect(calculateSubnetMask(24)).toBe('255.255.255.0');
      expect(calculateSubnetMask(25)).toBe('255.255.255.128');
      expect(calculateSubnetMask(28)).toBe('255.255.255.240');
      expect(calculateSubnetMask(30)).toBe('255.255.255.252');
    });

    it('should throw error for invalid CIDR values', () => {
      expect(() => calculateSubnetMask(33)).toThrow('Invalid CIDR');
      expect(() => calculateSubnetMask(-1)).toThrow('Invalid CIDR');
    });
  });

  describe('calculateCIDRFromMask', () => {
    const calculateCIDRFromMask = (mask: string): number => {
      try {
        // Convert mask to binary and count 1s
        const octets = mask.split('.').map(Number);
        if (octets.length !== 4 || octets.some(o => o < 0 || o > 255)) {
          throw new Error('Invalid subnet mask');
        }

        // Convert to 32-bit number
        const maskNum = (octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3];
        
        let cidr = 0;
        let foundZero = false;
        
        for (let i = 31; i >= 0; i--) {
          const bit = (maskNum & (1 << i)) !== 0;
          if (bit && !foundZero) {
            cidr++;
          } else if (!bit) {
            foundZero = true;
          } else if (bit && foundZero) {
            throw new Error('Invalid subnet mask pattern');
          }
        }
        
        return cidr;
      } catch (e) {
        throw new Error(`Invalid subnet mask: ${mask}`);
      }
    };

    it('should calculate correct CIDR from subnet masks', () => {
      expect(calculateCIDRFromMask('255.255.255.0')).toBe(24);
      expect(calculateCIDRFromMask('255.255.255.128')).toBe(25);
      expect(calculateCIDRFromMask('255.255.255.240')).toBe(28);
      expect(calculateCIDRFromMask('255.255.255.252')).toBe(30);
    });

    it('should throw error for invalid subnet masks', () => {
      expect(() => calculateCIDRFromMask('256.255.255.0')).toThrow();
      expect(() => calculateCIDRFromMask('255.255.253.0')).toThrow();
      expect(() => calculateCIDRFromMask('invalid')).toThrow();
    });
  });
});

describe('Broadcast Address Question', () => {
  it('should generate a valid broadcast address question', () => {
    const question = generateBroadcastAddressQuestion();
    
    // Check basic question structure
    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('text');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswer');
    expect(question.options).toHaveLength(4);
    
    // Extract IP and CIDR from question text
    const match = question.text.match(/subnet containing ([\d.]+)\/(\d+)/);
    expect(match).not.toBeNull();
    const [_, ip, cidr] = match!;
    
    // Calculate expected broadcast address
    const networkAddress = calculateNetworkAddress(stringToIP(ip), parseInt(cidr));
    const expectedBroadcast = calculateBroadcastAddress(stringToIP(ip), parseInt(cidr));
    
    // Verify correct answer is the broadcast address
    expect(question.options[question.correctAnswer]).toBe(ipToString(expectedBroadcast));
    
    // Verify all options are valid IP addresses
    question.options.forEach((option: string) => {
      expect(option).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });
  });
  
  it('should have unique options', () => {
    const question = generateBroadcastAddressQuestion();
    const uniqueOptions = new Set(question.options);
    expect(uniqueOptions.size).toBe(4);
  });
});

describe('Network Address Question', () => {
  it('should generate a valid network address question', () => {
    const question = generateNetworkAddressQuestion();
    
    // Check basic question structure
    expect(question).toHaveProperty('id');
    expect(question).toHaveProperty('text');
    expect(question).toHaveProperty('options');
    expect(question).toHaveProperty('correctAnswer');
    expect(question.options).toHaveLength(4);
    
    // Extract IP and CIDR from question text
    const match = question.text.match(/subnet containing ([\d.]+)\/(\d+)/);
    expect(match).not.toBeNull();
    const [_, ip, cidr] = match!;
    
    // Calculate expected network address
    const expectedNetwork = calculateNetworkAddress(stringToIP(ip), parseInt(cidr));
    
    // Verify correct answer is the network address
    expect(question.options[question.correctAnswer]).toBe(ipToString(expectedNetwork));
    
    // Verify all options are valid IP addresses
    question.options.forEach((option: string) => {
      expect(option).toMatch(/^\d+\.\d+\.\d+\.\d+$/);
    });
  });
  
  it('should have unique options', () => {
    const question = generateNetworkAddressQuestion();
    const uniqueOptions = new Set(question.options);
    expect(uniqueOptions.size).toBe(4);
  });
}); 