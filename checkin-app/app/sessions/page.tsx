"use client";

import React, { useEffect, useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useFhevm } from "@/fhevm/useFhevm";
import { useCheckIn } from "@/hooks/useCheckIn";
import { SessionList } from "@/components/SessionList";
import { Calendar, Users, Clock, Shield, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SessionsPage() {
  const [isInitialized, setIsInitialized] = useState(false);
  
  const { 
    isConnected, 
    account, 
    connectWallet, 
    disconnectWallet, 
    chainId,
    signer
  } = useWallet();
  
  const { 
    instance: fhevmInstance, 
    status: fhevmStatus, 
    error: fhevmError 
  } = useFhevm({
    provider: isConnected && typeof window !== 'undefined' ? window.ethereum : undefined,
    chainId: chainId || undefined,
    enabled: isConnected,
    initialMockChains: {
      31337: "http://localhost:8545", // Hardhat local network
      // Sepolia testnet will use real relayer automatically
    },
  });

  const {
    sessions,
    totalSessions,
    activeSessionsCount,
    isLoading,
    isCheckingIn,
    error,
    refreshSessions,
  } = useCheckIn(fhevmInstance || null, signer);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const formatTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString();
  };

  const getTimeRemaining = (endTime: number) => {
    const now = Math.floor(Date.now() / 1000);
    const remaining = endTime - now;
    
    if (remaining <= 0) return "Expired";
    
    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    } else {
      return `${minutes}m remaining`;
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Anonymous Check-In System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <button
                  onClick={connectWallet}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Connect Wallet
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Check-In Sessions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Connect your wallet to view and participate in sessions
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Wallet Required
              </h2>
              <p className="text-gray-500 mb-4">
                Please connect your wallet to view check-in sessions
              </p>
              <button
                onClick={connectWallet}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors w-full"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (fhevmStatus !== 'ready') {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  Anonymous Check-In System
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                  Home
                </Link>
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Disconnect Wallet
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Check-In Sessions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Initializing encryption system...
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                FHEVM Initializing
              </h2>
              <p className="text-gray-500 mb-4">
                Status: {fhevmStatus}
              </p>
              {fhevmError && (
                <p className="text-sm text-red-500">
                  Error: {fhevmError.message}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Anonymous Check-In System
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/create" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Create Session
              </Link>
              <button
                onClick={disconnectWallet}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Check-In Sessions
            </h1>
            <p className="text-lg text-gray-600">
              View and participate in anonymous check-in sessions
            </p>
          </div>
          <button
            onClick={refreshSessions}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-800">
              <div className="h-4 w-4 rounded-full bg-red-500"></div>
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Sessions ({sessions.length})
          </h2>
          
          <SessionList
            sessions={sessions}
            isLoading={isLoading}
            isCheckingIn={isCheckingIn}
            onCheckIn={async (sessionId: number) => {
              console.log('Check-in requested for session:', sessionId);
              // The actual check-in will be handled by the CheckInModal in SessionList component
            }}
            onEndSession={async (sessionId: number) => {
              console.log('End session requested for session:', sessionId);
              // This will be implemented later if needed
            }}
            isUserCheckedIn={async (sessionId: number, userAddress: string) => {
              // Check if user is already checked in
              return false; // For now, always allow check-in
            }}
            userAddress={account || null}
            fhevmInstance={fhevmInstance}
            walletSigner={signer}
          />
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            System Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
              <div className="text-sm text-gray-500">Total Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{activeSessionsCount}</div>
              <div className="text-sm text-gray-500">Active Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {sessions.reduce((sum, session) => sum + session.participantCount, 0)}
              </div>
              <div className="text-sm text-gray-500">Total Participants</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
