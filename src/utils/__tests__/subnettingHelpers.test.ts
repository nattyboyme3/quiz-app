import { 
  IPAddress,
  generateRandomIP,
  ipToString,
  ipToNumber,
  numberToIP,
  calculateSubnetMask,
  calculateNetworkAddress,
  calculateBroadcastAddress,
  calculateCIDRFromMask,
  isIPInSubnet
} from '../subnettingQuestions';

describe('IP Address Helper Functions', () => {
  describe('generateRandomIP', () => {
    it('should generate a valid IP address in either 10.10.x.x or 192.168.x.x range', () => {
      // Test multiple times to ensure consistency
      for (let i = 0; i < 100; i++) {
        const ip = generateRandomIP();
        expect(ip.octets).toHaveLength(4);
        expect(ip.octets[0]).toBeGreaterThanOrEqual(0);
        expect(ip.octets[0]).toBeLessThanOrEqual(255);
        expect(ip.octets[1]).toBeGreaterThanOrEqual(0);
        expect(ip.octets[1]).toBeLessThanOrEqual(255);
        expect(ip.octets[2]).toBeGreaterThanOrEqual(0);
        expect(ip.octets[2]).toBeLessThanOrEqual(255);
        expect(ip.octets[3]).toBeGreaterThanOrEqual(0);
        expect(ip.octets[3]).toBeLessThanOrEqual(255);
        
        // Check if it's in one of the expected ranges
        const isTenTen = ip.octets[0] === 10 && ip.octets[1] === 10;
        const isOneNineTwo = ip.octets[0] === 192 && ip.octets[1] === 168;
        expect(isTenTen || isOneNineTwo).toBe(true);
      }
    });
  });

  describe('ipToString', () => {
    it('should convert IP address to string format', () => {
      const testCases = [
        { ip: { octets: [192, 168, 1, 1] }, expected: '192.168.1.1' },
        { ip: { octets: [0, 0, 0, 0] }, expected: '0.0.0.0' },
        { ip: { octets: [255, 255, 255, 255] }, expected: '255.255.255.255' },
        { ip: { octets: [10, 0, 0, 1] }, expected: '10.0.0.1' },
      ];

      testCases.forEach(({ ip, expected }) => {
        expect(ipToString(ip)).toBe(expected);
      });
    });
  });

  describe('ipToNumber and numberToIP', () => {
    it('should convert between IP address and number correctly', () => {
      const testCases = [
        { octets: [192, 168, 1, 1], number: 0xC0A80101 },
        { octets: [10, 0, 0, 1], number: 0x0A000001 },
        { octets: [172, 16, 0, 1], number: 0xAC100001 },
      ];

      testCases.forEach(({ octets, number }) => {
        const ip: IPAddress = { octets };
        expect(ipToNumber(ip)).toBe(number);
        expect(numberToIP(number).octets).toEqual(octets);
      });
    });

    it('should handle edge cases', () => {
      const testCases = [
        { octets: [0, 0, 0, 0], number: 0 },
        { octets: [255, 255, 255, 255], number: 0xFFFFFFFF },
        { octets: [128, 0, 0, 0], number: 0x80000000 },
        { octets: [127, 255, 255, 255], number: 0x7FFFFFFF },
      ];

      testCases.forEach(({ octets, number }) => {
        const ip: IPAddress = { octets };
        expect(ipToNumber(ip)).toBe(number);
        expect(numberToIP(number).octets).toEqual(octets);
      });
    });
  });

  describe('calculateSubnetMask', () => {
    it('should calculate correct subnet masks for various CIDR values', () => {
      const testCases = [
        { cidr: 32, expected: '255.255.255.255' },  // Most specific
        { cidr: 24, expected: '255.255.255.0' },    // Common class C
        { cidr: 16, expected: '255.255.0.0' },      // Common class B
        { cidr: 8, expected: '255.0.0.0' },         // Common class A
        { cidr: 0, expected: '0.0.0.0' },           // Least specific
        { cidr: 25, expected: '255.255.255.128' },  // Odd CIDR
        { cidr: 30, expected: '255.255.255.252' },  // Point-to-point
        { cidr: 31, expected: '255.255.255.254' },  // Special case
      ];

      testCases.forEach(({ cidr, expected }) => {
        const mask = calculateSubnetMask(cidr);
        expect(ipToString(mask)).toBe(expected);
      });
    });
  });

  describe('calculateNetworkAddress', () => {
    it('should calculate correct network addresses for various scenarios', () => {
      const testCases = [
        { 
          ip: { octets: [192, 168, 1, 100] }, 
          cidr: 24, 
          expected: '192.168.1.0' 
        },
        { 
          ip: { octets: [10, 10, 10, 10] }, 
          cidr: 8, 
          expected: '10.0.0.0' 
        },
        { 
          ip: { octets: [172, 16, 1, 1] }, 
          cidr: 12, 
          expected: '172.16.0.0' 
        },
        { 
          ip: { octets: [192, 168, 0, 1] }, 
          cidr: 32, 
          expected: '192.168.0.1' 
        },
        { 
          ip: { octets: [192, 168, 1, 1] }, 
          cidr: 0, 
          expected: '0.0.0.0' 
        },
      ];

      testCases.forEach(({ ip, cidr, expected }) => {
        const networkAddress = calculateNetworkAddress(ip, cidr);
        expect(ipToString(networkAddress)).toBe(expected);
      });
    });
  });

  describe('calculateBroadcastAddress', () => {
    it('should calculate correct broadcast addresses for various scenarios', () => {
      const testCases = [
        { 
          ip: { octets: [192, 168, 1, 100] }, 
          cidr: 24, 
          expected: '192.168.1.255' 
        },
        { 
          ip: { octets: [10, 10, 10, 10] }, 
          cidr: 8, 
          expected: '10.255.255.255' 
        },
        { 
          ip: { octets: [172, 16, 1, 1] }, 
          cidr: 12, 
          expected: '172.31.255.255' 
        },
        { 
          ip: { octets: [192, 168, 0, 1] }, 
          cidr: 32, 
          expected: '192.168.0.1' 
        },
        { 
          ip: { octets: [192, 168, 1, 1] }, 
          cidr: 0, 
          expected: '255.255.255.255' 
        },
      ];

      testCases.forEach(({ ip, cidr, expected }) => {
        const broadcastAddress = calculateBroadcastAddress(ip, cidr);
        expect(ipToString(broadcastAddress)).toBe(expected);
      });
    });
  });

  describe('calculateCIDRFromMask', () => {
    it('should calculate correct CIDR from subnet mask for all valid masks', () => {
      const testCases = [
        { mask: '0.0.0.0', expected: 0 },
        { mask: '128.0.0.0', expected: 1 },
        { mask: '192.0.0.0', expected: 2 },
        { mask: '255.0.0.0', expected: 8 },
        { mask: '255.128.0.0', expected: 9 },
        { mask: '255.255.0.0', expected: 16 },
        { mask: '255.255.128.0', expected: 17 },
        { mask: '255.255.255.0', expected: 24 },
        { mask: '255.255.255.128', expected: 25 },
        { mask: '255.255.255.192', expected: 26 },
        { mask: '255.255.255.224', expected: 27 },
        { mask: '255.255.255.240', expected: 28 },
        { mask: '255.255.255.248', expected: 29 },
        { mask: '255.255.255.252', expected: 30 },
        { mask: '255.255.255.254', expected: 31 },
        { mask: '255.255.255.255', expected: 32 },
      ];

      testCases.forEach(({ mask, expected }) => {
        const ip: IPAddress = {
          octets: mask.split('.').map(Number)
        };
        expect(calculateCIDRFromMask(ip)).toBe(expected);
      });
    });
  });

  describe('isIPInSubnet', () => {
    it('should correctly determine if an IP is in a subnet for various scenarios', () => {
      const testCases = [
        // Standard class C subnet
        {
          networkIP: { octets: [192, 168, 1, 0] },
          testIP: { octets: [192, 168, 1, 100] },
          cidr: 24,
          expected: true
        },
        // Edge of subnet
        {
          networkIP: { octets: [192, 168, 1, 0] },
          testIP: { octets: [192, 168, 1, 255] },
          cidr: 24,
          expected: true
        },
        // Just outside subnet
        {
          networkIP: { octets: [192, 168, 1, 0] },
          testIP: { octets: [192, 168, 2, 0] },
          cidr: 24,
          expected: false
        },
        // Large subnet (class A)
        {
          networkIP: { octets: [10, 0, 0, 0] },
          testIP: { octets: [10, 255, 255, 255] },
          cidr: 8,
          expected: true
        },
        // Host route (/32)
        {
          networkIP: { octets: [192, 168, 1, 1] },
          testIP: { octets: [192, 168, 1, 1] },
          cidr: 32,
          expected: true
        },
        // Host route (/32) - different IP
        {
          networkIP: { octets: [192, 168, 1, 1] },
          testIP: { octets: [192, 168, 1, 2] },
          cidr: 32,
          expected: false
        },
        // Default route (/0)
        {
          networkIP: { octets: [0, 0, 0, 0] },
          testIP: { octets: [192, 168, 1, 1] },
          cidr: 0,
          expected: true
        },
      ];

      testCases.forEach(({ networkIP, testIP, cidr, expected }) => {
        expect(isIPInSubnet(testIP, networkIP, cidr)).toBe(expected);
      });
    });
  });
}); 