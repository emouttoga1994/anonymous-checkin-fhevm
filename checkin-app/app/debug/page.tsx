"use client";

import React, { useEffect, useState } from "react";

export default function DebugPage() {
  const [renderCount, setRenderCount] = useState(0);
  const [fhevmStatus, setFhevmStatus] = useState("unknown");
  const [contractStatus, setContractStatus] = useState("unknown");

  useEffect(() => {
    setRenderCount(prev => prev + 1);
    console.log(`Debug page rendered ${renderCount + 1} times`);
  });

  useEffect(() => {
    setFhevmStatus("checking");
    // Simulate FHEVM check
    setTimeout(() => {
      setFhevmStatus("ready");
    }, 1000);
  }, []);

  useEffect(() => {
    setContractStatus("checking");
    // Simulate contract check
    setTimeout(() => {
      setContractStatus("ready");
    }, 2000);
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Render Information</h2>
            <p className="text-lg">
              <strong>Render Count:</strong> {renderCount}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              If this number keeps increasing rapidly, there's an infinite re-render issue.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">FHEVM Status</h2>
            <p className="text-lg">
              <strong>Status:</strong> {fhevmStatus}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contract Status</h2>
            <p className="text-lg">
              <strong>Status:</strong> {contractStatus}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Environment</h2>
            <p className="text-sm">
              <strong>Contract Address:</strong> {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "Not set"}
            </p>
            <p className="text-sm">
              <strong>Chain ID:</strong> {process.env.NEXT_PUBLIC_CHAIN_ID || "Not set"}
            </p>
            <p className="text-sm">
              <strong>Relayer URL:</strong> {process.env.NEXT_PUBLIC_RELAYER_URL || "Not set"}
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
          <p className="text-sm text-gray-600">
            Check the browser console for any error messages or warnings.
          </p>
        </div>
      </div>
    </div>
  );
}
