import { useState, useCallback, useEffect } from "react";
import { ethers } from "ethers";
import type { FhevmInstance, CheckInSession, CheckInFormData, EncryptedCheckInData } from "../fhevm/fhevmTypes";
import contractABI from "../abi/AnonymousCheckIn.json";

// Use the actual contract ABI
const CONTRACT_ABI = contractABI;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x...";

export interface UseCheckInReturn {
  // Session management
  sessions: CheckInSession[];
  totalSessions: number;
  activeSessionsCount: number;
  
  // Loading states
  isLoading: boolean;
  isCreating: boolean;
  isCheckingIn: boolean;
  
  // Error handling
  error: string | null;
  
  // Actions
  createSession: (data: CheckInFormData) => Promise<number>;
  endSession: (sessionId: number) => Promise<void>;
  checkInToSession: (sessionId: number, encryptedData: EncryptedCheckInData) => Promise<void>;
  batchCheckIn: (sessionIds: number[], encryptedDataArray: EncryptedCheckInData[]) => Promise<void>;
  refreshSessions: () => Promise<void>;
  
  // Verification
  isUserCheckedIn: (sessionId: number, userAddress: string) => Promise<boolean>;
  getUserScore: (userAddress: string) => Promise<number>;
}

export function useCheckIn(
  fhevmInstance: FhevmInstance | null,
  walletSigner: ethers.Signer | null
): UseCheckInReturn {
  const [sessions, setSessions] = useState<CheckInSession[]>([]);
  const [totalSessions, setTotalSessions] = useState(0);
  const [activeSessionsCount, setActiveSessionsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create contract instance for read operations (view functions)
  // Use a standard ethers provider for contract calls
  const [provider, setProvider] = useState<ethers.JsonRpcProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  
  // Update provider and contract when fhevmInstance changes
  useEffect(() => {
    // Always create provider and contract, regardless of fhevmInstance status
    console.log("Creating contract instance...");
    console.log("Contract address:", CONTRACT_ADDRESS);
    console.log("Contract ABI length:", CONTRACT_ABI.length);
    
    const newProvider = new ethers.JsonRpcProvider("http://localhost:8545");
    const newContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, newProvider);
    
    console.log("Contract created:", newContract);
    setProvider(newProvider);
    setContract(newContract);
  }, []);
  
  // Create contract instance for write operations (requires signer)
  const [contractWithSigner, setContractWithSigner] = useState<ethers.Contract | null>(null);
  
  // Update contractWithSigner when walletSigner changes
  useEffect(() => {
    if (walletSigner) {
      const newContractWithSigner = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletSigner);
      setContractWithSigner(newContractWithSigner);
    } else {
      setContractWithSigner(null);
    }
  }, [walletSigner]);

  const refreshSessions = useCallback(async () => {
    console.log("refreshSessions called, contract:", contract);
    if (!contract) {
      console.log("No contract available, skipping refresh");
      return;
    }

    try {
      console.log("Starting to refresh sessions...");
      setIsLoading(true);
      setError(null);

      console.log("Calling getTotalSessions...");
      const total = await contract.getTotalSessions();
      console.log("Total sessions result:", total.toString());
      
      console.log("Calling getActiveSessionsCount...");
      const active = await contract.getActiveSessionsCount();
      console.log("Active sessions result:", active.toString());
      
      setTotalSessions(Number(total));
      setActiveSessionsCount(Number(active));

      // Load session details
      const sessionPromises = [];
      for (let i = 1; i <= Number(total); i++) {
        sessionPromises.push(contract.getSessionInfo(i));
      }

      const sessionData = await Promise.all(sessionPromises);
      const sessionList: CheckInSession[] = sessionData.map((data, index) => ({
        sessionId: index + 1,
        creator: data.creator,
        title: data.title,
        description: data.description,
        startTime: Number(data.startTime),
        endTime: Number(data.endTime),
        isActive: data.isActive,
        participantCount: Number(data.participantCount),
      }));

      setSessions(sessionList);
    } catch (err) {
      console.error("Failed to refresh sessions:", err);
      setError(err instanceof Error ? err.message : "Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  }, [contract]);

  const createSession = useCallback(async (data: CheckInFormData): Promise<number> => {
    if (!contractWithSigner || !fhevmInstance) {
      throw new Error("Contract or FHEVM not available");
    }

    try {
      setIsCreating(true);
      setError(null);

      const duration = data.duration * 3600; // Convert hours to seconds
      
      // Call the function and get the return value directly
      const sessionId = await contractWithSigner.createCheckInSession(
        data.title,
        data.description,
        duration
      );

      // Refresh sessions after creation
      await refreshSessions();

      return Number(sessionId);
    } catch (err) {
      console.error("Failed to create session:", err);
      setError(err instanceof Error ? err.message : "Failed to create session");
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, [contractWithSigner, fhevmInstance, refreshSessions]);

  const endSession = useCallback(async (sessionId: number): Promise<void> => {
    if (!contract) {
      throw new Error("Contract not available");
    }

    try {
      setError(null);
      const tx = await contractWithSigner.endCheckInSession(sessionId);
      await tx.wait();

      // Refresh sessions after ending
      await refreshSessions();
    } catch (err) {
      console.error("Failed to end session:", err);
      setError(err instanceof Error ? err.message : "Failed to end session");
      throw err;
    }
  }, [contractWithSigner, refreshSessions]);

  const checkInToSession = useCallback(async (
    sessionId: number, 
    encryptedData: EncryptedCheckInData
  ): Promise<void> => {
    if (!contractWithSigner || !fhevmInstance) {
      throw new Error("Contract or FHEVM not available");
    }

    try {
      console.log("Starting check-in process...");
      console.log("Session ID:", sessionId);
      console.log("Encrypted data:", encryptedData);
      
      setIsCheckingIn(true);
      setError(null);

      console.log("Calling contract.checkIn...");
      console.log("Session ID:", sessionId);
      console.log("Encrypted data object:", encryptedData);
      console.log("Encrypted data value:", encryptedData.encryptedData);
      console.log("Signature value:", encryptedData.signature);
      console.log("Encrypted data type:", typeof encryptedData.encryptedData);
      console.log("Signature type:", typeof encryptedData.signature);
      
      // Validate parameters before calling contract
      if (!encryptedData.encryptedData) {
        throw new Error("Encrypted data is undefined");
      }
      if (!encryptedData.signature) {
        throw new Error("Signature is undefined");
      }
      
      const tx = await contractWithSigner.checkIn(
        sessionId,
        encryptedData.encryptedData,
        encryptedData.signature
      );

      console.log("Transaction sent:", tx.hash);
      console.log("Waiting for transaction confirmation...");
      await tx.wait();
      console.log("Transaction confirmed!");

      // Refresh sessions after check-in
      await refreshSessions();
    } catch (err) {
      console.error("Failed to check in:", err);
      setError(err instanceof Error ? err.message : "Failed to check in");
      throw err;
    } finally {
      setIsCheckingIn(false);
    }
  }, [contractWithSigner, fhevmInstance, refreshSessions]);

  const batchCheckIn = useCallback(async (
    sessionIds: number[],
    encryptedDataArray: EncryptedCheckInData[]
  ): Promise<void> => {
    if (!contract || !fhevmInstance) {
      throw new Error("Contract or FHEVM not available");
    }

    try {
      setIsCheckingIn(true);
      setError(null);

      const encryptedData = encryptedDataArray.map(data => data.encryptedData);
      const signatures = encryptedDataArray.map(data => data.signature);

      const tx = await contractWithSigner.batchCheckIn(sessionIds, encryptedData, signatures);
      await tx.wait();

      // Refresh sessions after batch check-in
      await refreshSessions();
    } catch (err) {
      console.error("Failed to batch check in:", err);
      setError(err instanceof Error ? err.message : "Failed to batch check in");
      throw err;
    } finally {
      setIsCheckingIn(false);
    }
  }, [contractWithSigner, fhevmInstance, refreshSessions]);

  const isUserCheckedIn = useCallback(async (
    sessionId: number,
    userAddress: string
  ): Promise<boolean> => {
    if (!contract) {
      throw new Error("Contract not available");
    }

    try {
      const result = await contract.isUserCheckedIn(sessionId, userAddress);
      return result;
    } catch (err) {
      console.error("Failed to check user status:", err);
      return false;
    }
  }, [contract]);

  const getUserScore = useCallback(async (userAddress: string): Promise<number> => {
    if (!contract || !fhevmInstance) {
      throw new Error("Contract or FHEVM not available");
    }

    try {
      const encryptedScore = await contract.getEncryptedUserScore(userAddress);
      const score = await fhevmInstance.publicDecrypt(encryptedScore);
      return score;
    } catch (err) {
      console.error("Failed to get user score:", err);
      return 0;
    }
  }, [contract, fhevmInstance]);

  // Load sessions on mount
  useEffect(() => {
    if (contract) {
      refreshSessions();
    }
  }, [contract, refreshSessions]);

  return {
    sessions,
    totalSessions,
    activeSessionsCount,
    isLoading,
    isCreating,
    isCheckingIn,
    error,
    createSession,
    endSession,
    checkInToSession,
    batchCheckIn,
    refreshSessions,
    isUserCheckedIn,
    getUserScore,
  };
}
