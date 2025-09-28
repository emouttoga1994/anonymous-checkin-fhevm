// Global type definitions for window objects

interface Window {
  ethereum?: any;
  relayerSDK?: any;
}

// MetaMask types
declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean;
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, handler: (...args: any[]) => void) => void;
      removeListener: (event: string, handler: (...args: any[]) => void) => void;
      selectedAddress: string | null;
      chainId: string | null;
      networkVersion: string | null;
      isConnected: () => boolean;
    };
  }
}

export {};
