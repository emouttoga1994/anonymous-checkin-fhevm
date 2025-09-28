"use client";

import React, { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { CreateSession } from "@/components/CreateSession";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/hooks/useWallet";
import { useFhevm } from "@/fhevm/useFhevm";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useLanguage } from "@/hooks/useLanguage";
import { Calendar, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const { t } = useLanguage();
  const router = useRouter();
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
  });

  const {
    createSession,
    isCreating,
    error,
  } = useCheckIn(fhevmInstance || null, signer);

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    setIsInitialized(true);
  }, []);

  const handleCreateSession = async (data: any): Promise<number> => {
    try {
      const sessionId = await createSession(data);
      console.log("Session created with ID:", sessionId);
      
      // Redirect to sessions page after a brief delay
      setTimeout(() => router.push("/sessions"), 1000);
      
      return sessionId;
    } catch (error) {
      console.error("Failed to create session:", error);
      throw error; // Re-throw to maintain error handling
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
                <span>{t("create.title")}</span>
              </CardTitle>
              <CardDescription>
                Connect your wallet to create check-in sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={connectWallet} className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                {t("wallet.connect")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (fhevmStatus !== 'ready') {
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
                <Shield className="h-6 w-6" />
                <span>FHEVM Initializing</span>
              </CardTitle>
              <CardDescription>
                Please wait while we initialize the encryption system...
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                <span>Status: {fhevmStatus}</span>
              </div>
              {fhevmError && (
                <p className="text-sm text-destructive mt-2">
                  Error: {fhevmError.message}
                </p>
              )}
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
        <div className="flex items-center space-x-4 mb-8">
          <Link href="/sessions">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sessions
            </Button>
          </Link>
          
          <div>
            <h1 className="text-3xl font-bold flex items-center space-x-2">
              <Calendar className="h-8 w-8" />
              <span>{t("create.title")}</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a new privacy-preserving check-in session
            </p>
          </div>
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

        {/* Create Session Form */}
        <CreateSession
          onCreateSession={handleCreateSession}
          isCreating={isCreating}
        />
      </div>
    </div>
  );
}
