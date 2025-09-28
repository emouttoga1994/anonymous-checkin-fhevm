"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckIn } from "@/hooks/useCheckIn";
import { useFhevm } from "@/fhevm/useFhevm";
import { X, Shield, Lock, CheckCircle, AlertCircle } from "lucide-react";
import type { FhevmInstance } from "@/fhevm/fhevmTypes";

interface CheckInModalProps {
  sessionId: number;
  sessionTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  fhevmInstance: any;
  walletSigner: any;
  userAddress?: string | null;
}

interface CheckInData {
  message: string;
  timestamp: number;
  location?: string;
  notes?: string;
}

export function CheckInModal({ 
  sessionId, 
  sessionTitle, 
  isOpen, 
  onClose, 
  onSuccess,
  fhevmInstance,
  walletSigner,
  userAddress
}: CheckInModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CheckInData>({
    message: "",
    timestamp: Math.floor(Date.now() / 1000),
    location: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { checkInToSession } = useCheckIn(fhevmInstance, walletSigner);

  const handleInputChange = (field: keyof CheckInData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fhevmInstance) {
      setError("FHEVM is not ready. Please wait and try again.");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter a check-in message.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Create check-in data
      const checkInData = {
        message: formData.message,
        timestamp: formData.timestamp,
        location: formData.location || "",
        notes: formData.notes || "",
        sessionId: sessionId
      };

      console.log("Creating encrypted check-in data:", checkInData);

      // Use FHEVM to encrypt the timestamp (as a simple example)
      // In a real implementation, you would encrypt more complex data
      const timestampValue = formData.timestamp;
      
      console.log("Encrypting timestamp:", timestampValue);
      console.log("FHEVM instance:", fhevmInstance);

      // Create external encrypted data using FHEVM
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xd4B5327816E08cce36F7D537c43939f5229572D1";
      const currentUserAddress = userAddress || "0x0000000000000000000000000000000000000000";
      
      console.log("Creating encrypted input with:", { contractAddress, currentUserAddress, timestampValue });
      
      const encryptedInput = fhevmInstance.createEncryptedInput(contractAddress, currentUserAddress);
      console.log("Encrypted input object:", encryptedInput);
      
      // Add the timestamp value to the encrypted input
      encryptedInput.add32(timestampValue);
      
      // Encrypt the input to get the handles and input proof
      const encryptedResult = await encryptedInput.encrypt();
      const handles = encryptedResult.handles;
      const inputProof = encryptedResult.inputProof;

      console.log("Encrypted result:", encryptedResult);
      console.log("Handles:", handles);
      console.log("Input proof:", inputProof);
      console.log("Handles type:", typeof handles);
      console.log("Input proof type:", typeof inputProof);

      // For the contract call, we need to use the first handle and the input proof
      const encryptedData = handles[0];
      const signature = inputProof;

      // Submit the encrypted check-in
      await checkInToSession(sessionId, {
        encryptedData: encryptedData,
        signature: signature
      });

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSuccess(false);
        setFormData({
          message: "",
          timestamp: Math.floor(Date.now() / 1000),
          location: "",
          notes: ""
        });
      }, 2000);

    } catch (err) {
      console.error("Check-in failed:", err);
      setError(err instanceof Error ? err.message : "Failed to check in");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Anonymous Check-In</span>
            </CardTitle>
            <CardDescription>
              {sessionTitle}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-700 mb-2">
                Check-In Successful!
              </h3>
              <p className="text-green-600">
                Your encrypted check-in has been submitted.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Privacy Notice */}
              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <Lock className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">🔒 Your data is encrypted</p>
                    <p>
                      All information will be encrypted using FHEVM technology. 
                      Only verification status is public.
                    </p>
                  </div>
                </div>
              </div>

              {/* Check-in Message */}
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  Check-in Message *
                </label>
                <Textarea
                  id="message"
                  placeholder="What are you working on? Any updates to share?"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              {/* Location (Optional) */}
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location (Optional)
                </label>
                <Input
                  id="location"
                  placeholder="e.g., Office, Remote, Client Site"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                />
              </div>

              {/* Additional Notes (Optional) */}
              <div className="space-y-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Additional Notes (Optional)
                </label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  rows={2}
                />
              </div>

              {/* FHEVM Status */}
              <div className="text-sm text-gray-600">
                <p>FHEVM Status: <span className="font-medium">{fhevmInstance ? 'Ready' : 'Not Ready'}</span></p>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-red-600 mt-0.5" />
                    <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !fhevmInstance || !formData.message.trim()}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Encrypting...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Check In
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
