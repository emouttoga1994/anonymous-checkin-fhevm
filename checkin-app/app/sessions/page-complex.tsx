"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { SessionList } from "@/components/SessionList";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useWallet } from "@/hooks/useWallet";
import { useFhevm } from "@/fhevm/useFhevm";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar, Plus, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function SessionsPage() {
  const { t } = useLanguage();
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
    provider: isConnected ? window.ethereum : undefined,
    chainId: chainId || undefined,
    enabled: isConnected,
  });

  const {
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
    refreshSessions,
    isUserCheckedIn,
    getUserScore,
  } = useCheckIn(fhevmInstance || null, signer);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleCheckIn = async (sessionId: number) => {
    if (!fhevmInstance || !account) return;

    try {
      // Create encrypted check-in data (timestamp + random data for privacy)
      const checkInData = Date.now() + Math.floor(Math.random() * 1000);
      
      // Use the correct FHEVM API for creating encrypted inputs
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";
      const currentUserAddress = account || "0x0000000000000000000000000000000000000000";
      
      const encryptedInput = fhevmInstance.createEncryptedInput(contractAddress, currentUserAddress);
      encryptedInput.add32(checkInData);
      const encryptedResult = await encryptedInput.encrypt();
      
      await checkInToSession(sessionId, { 
        encryptedData: encryptedResult.handles[0], 
        signature: encryptedResult.inputProof 
      });
    } catch (error) {
      console.error("Check-in failed:", error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation 
          onConnectWallet={connectWallet}
          onDisconnectWallet={disconnectWallet}
        />
        <div className="container mx-auto px-4 py-20">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>{t("sessions.title")}</span>
              </CardTitle>
              <CardDescription>
                Connect your wallet to view and participate in check-in sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                {t("wallet.connect")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        onConnectWallet={connectWallet}
        onDisconnectWallet={disconnectWallet}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Calendar className="h-8 w-8" />
              <span>{t("sessions.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              View and participate in check-in sessions
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Button
              variant="outline"
              onClick={refreshSessions}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {t("common.refresh")}
            </Button>
            
            <Link href="/create">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("sessions.create")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSessions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeSessionsCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                FHEVM Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${
                fhevmStatus === 'ready' ? 'text-green-600' : 
                fhevmStatus === 'error' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>
                {fhevmStatus}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 text-destructive">
                <div className="h-4 w-4 rounded-full bg-destructive"></div>
                <span className="font-medium">Error:</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sessions List */}
        <SessionList
          sessions={sessions}
          isLoading={isLoading}
          isCheckingIn={isCheckingIn}
          onCheckIn={handleCheckIn}
          onEndSession={endSession}
          isUserCheckedIn={isUserCheckedIn}
          userAddress={account || null}
          fhevmInstance={fhevmInstance}
          walletSigner={signer}
        />
      </div>
    </div>
  );
}
