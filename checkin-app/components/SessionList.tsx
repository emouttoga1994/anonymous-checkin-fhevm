"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckIn } from "@/hooks/useCheckIn";
import { CheckInModal } from "./CheckInModal";
import { formatTimeRemaining, formatDuration, formatDate } from "@/lib/utils";
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle, 
  Play,
  Pause,
  MoreVertical,
  UserCheck,
  Shield
} from "lucide-react";
import type { CheckInSession } from "@/fhevm/fhevmTypes";

interface SessionListProps {
  sessions: CheckInSession[];
  isLoading: boolean;
  isCheckingIn: boolean;
  onCheckIn: (sessionId: number) => Promise<void>;
  onEndSession: (sessionId: number) => Promise<void>;
  isUserCheckedIn: (sessionId: number, userAddress: string) => Promise<boolean>;
  userAddress: string | null;
  fhevmInstance: any;
  walletSigner: any;
}

export function SessionList({
  sessions,
  isLoading,
  isCheckingIn,
  onCheckIn,
  onEndSession,
  isUserCheckedIn,
  userAddress,
  fhevmInstance,
  walletSigner,
}: SessionListProps) {
  const { t } = useLanguage();
  const [checkedInSessions, setCheckedInSessions] = useState<Set<number>>(new Set());
  const [loadingSessions, setLoadingSessions] = useState<Set<number>>(new Set());
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<CheckInSession | null>(null);

  const handleCheckInClick = (session: CheckInSession) => {
    setSelectedSession(session);
    setShowCheckInModal(true);
  };

  const handleCheckInSuccess = () => {
    if (selectedSession) {
      setCheckedInSessions(prev => new Set(prev).add(selectedSession.sessionId));
    }
    setShowCheckInModal(false);
    setSelectedSession(null);
  };

  const handleEndSession = async (sessionId: number) => {
    try {
      await onEndSession(sessionId);
    } catch (error) {
      console.error("Failed to end session:", error);
    }
  };

  const getSessionStatus = (session: CheckInSession) => {
    const now = Date.now() / 1000;
    if (!session.isActive) return "ended";
    if (now < session.startTime) return "upcoming";
    if (now > session.endTime) return "ended";
    return "active";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-500 bg-green-50 dark:bg-green-950";
      case "ended":
        return "text-gray-500 bg-gray-50 dark:bg-gray-950";
      case "upcoming":
        return "text-blue-500 bg-blue-50 dark:bg-blue-950";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-950";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play className="h-4 w-4" />;
      case "ended":
        return <XCircle className="h-4 w-4" />;
      case "upcoming":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-6 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-muted rounded w-full mb-2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t("sessions.noSessions")}</h3>
          <p className="text-muted-foreground">
            No check-in sessions available at the moment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {sessions.map((session) => {
        const status = getSessionStatus(session);
        const isCheckedIn = checkedInSessions.has(session.sessionId);
        const isLoading = loadingSessions.has(session.sessionId);
        const canCheckIn = status === "active" && !isCheckedIn && userAddress;
        const canEndSession = session.isActive && userAddress === session.creator;

        return (
          <Card key={session.sessionId} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{session.title}</CardTitle>
                  <CardDescription className="text-base mb-3">
                    {session.description}
                  </CardDescription>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{session.participantCount} {t("sessions.participants")}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{formatDuration((session.endTime - session.startTime) / 3600)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {getStatusIcon(status)}
                    <span>{t(`time.${status}`)}</span>
                  </div>
                  
                  {isCheckedIn && (
                    <div className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium text-green-500 bg-green-50 dark:bg-green-950">
                      <UserCheck className="h-3 w-3" />
                      <span>{t("sessions.checkedIn")}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Start Time:</span>
                    <div className="font-medium">{formatDate(session.startTime)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">End Time:</span>
                    <div className="font-medium">{formatDate(session.endTime)}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Status:</span>
                    <div className="font-medium">
                      {status === "active" ? formatTimeRemaining(session.endTime) : t(`time.${status}`)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Created by {session.creator.slice(0, 6)}...{session.creator.slice(-4)}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {canCheckIn && (
                      <Button
                        onClick={() => handleCheckInClick(session)}
                        disabled={isLoading || !fhevmInstance}
                        size="sm"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {t("common.loading")}
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Anonymous Check-In
                          </>
                        )}
                      </Button>
                    )}
                    
                    {canEndSession && (
                      <Button
                        variant="outline"
                        onClick={() => handleEndSession(session.sessionId)}
                        size="sm"
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        {t("sessions.endSession")}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      </div>

      {/* Check-In Modal */}
      {selectedSession && (
        <CheckInModal
          sessionId={selectedSession.sessionId}
          sessionTitle={selectedSession.title}
          isOpen={showCheckInModal}
          onClose={() => {
            setShowCheckInModal(false);
            setSelectedSession(null);
          }}
          onSuccess={handleCheckInSuccess}
          fhevmInstance={fhevmInstance}
          walletSigner={walletSigner}
          userAddress={userAddress}
        />
      )}
    </>
  );
}
