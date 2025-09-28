"use client";

import React, { useEffect, useState } from "react";

export default function HomePage() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    // Check if wallet is connected
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then((accounts: string[]) => {
          setIsWalletConnected(accounts.length > 0);
        })
        .catch(() => {
          setIsWalletConnected(false);
        });
    }
    setIsInitialized(true);
  }, []);

  const connectWallet = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
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
              {isWalletConnected ? (
                <button
                  onClick={disconnectWallet}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Disconnect Wallet
                </button>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Anonymous Check-In System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Privacy-preserving attendance tracking with FHEVM technology
          </p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                System Status
              </h2>
              <div className="space-y-2">
                <p className="text-lg">
                  <span className="font-medium">Wallet:</span> 
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${
                    isWalletConnected 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {isWalletConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </p>
                <p className="text-lg">
                  <span className="font-medium">FHEVM:</span> 
                  <span className="ml-2 px-2 py-1 rounded text-sm bg-yellow-100 text-yellow-800">
                    Mock Mode
                  </span>
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <a 
                href="/sessions" 
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-medium"
              >
                View Sessions
              </a>
              <a 
                href="/create" 
                className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
              >
                Create Session
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
