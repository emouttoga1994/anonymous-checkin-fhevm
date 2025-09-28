export interface EncryptedInput {
  add32: (value: number) => void;
  encrypt: () => Promise<{ handles: string[]; inputProof: string }>;
}

export interface FhevmInstance {
  createEncryptedInput: (contractAddress: string, userAddress: string) => EncryptedInput;
  publicDecrypt: (encryptedData: string) => Promise<number>;
  userDecrypt: (encryptedData: string) => Promise<number>;
  generateKeypair: () => Promise<{ publicKey: string; privateKey: string }>;
  getPublicKey: () => string;
  getPublicParams: (size: number) => string;
  chainId: number;
}

export interface CheckInSession {
  sessionId: number;
  creator: string;
  title: string;
  description: string;
  startTime: number;
  endTime: number;
  isActive: boolean;
  participantCount: number;
}

export interface EncryptedCheckInData {
  encryptedData: string;
  signature: string;
}

export interface CheckInFormData {
  title: string;
  description: string;
  duration: number; // in hours
}

export interface Language {
  code: 'en' | 'zh';
  name: string;
  flag: string;
}
