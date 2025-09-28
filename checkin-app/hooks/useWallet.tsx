import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

export interface WalletState {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  provider: ethers.Eip1193Provider | null;
  signer: ethers.Signer | null;
  error: string | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    account: null,
    chainId: null,
    provider: null,
    signer: null,
    error: null,
  });

  const connectWallet = useCallback(async () => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const network = await provider.getNetwork();

      setWalletState({
        isConnected: true,
        account: accounts[0],
        chainId: Number(network.chainId),
        provider: window.ethereum,
        signer,
        error: null,
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setWalletState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      account: null,
      chainId: null,
      provider: null,
      signer: null,
      error: null,
    });
  }, []);

  const switchChain = useCallback(async (chainId: number) => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletState(prev => ({
          ...prev,
          account: accounts[0],
        }));
      }
    };

    const handleChainChanged = (chainId: string) => {
      setWalletState(prev => ({
        ...prev,
        chainId: parseInt(chainId, 16),
      }));
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnectWallet]);

  // Check if already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return;

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const network = await provider.getNetwork();
          
          setWalletState({
            isConnected: true,
            account: accounts[0],
            chainId: Number(network.chainId),
            provider: window.ethereum,
            signer,
            error: null,
          });
        }
      } catch (error) {
        console.error("Failed to check wallet connection:", error);
      }
    };

    checkConnection();
  }, []);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    switchChain,
  };
}
