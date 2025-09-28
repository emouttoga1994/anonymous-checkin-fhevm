"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Textarea } from "./ui/Textarea";
import { useLanguage } from "@/hooks/useLanguage";
import { useCheckIn } from "@/hooks/useCheckIn";
import { Calendar, Clock, FileText, Hash } from "lucide-react";
import type { CheckInFormData } from "@/fhevm/fhevmTypes";

interface CreateSessionProps {
  onCreateSession: (data: CheckInFormData) => Promise<number>;
  isCreating: boolean;
}

export function CreateSession({ onCreateSession, isCreating }: CreateSessionProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CheckInFormData>({
    title: "",
    description: "",
    duration: 1,
  });
  const [errors, setErrors] = useState<Partial<CheckInFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<CheckInFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.duration < 0.5) {
      (newErrors as any).duration = "Duration must be at least 0.5 hours";
    } else if (formData.duration > 168) {
      (newErrors as any).duration = "Duration must be less than 168 hours (7 days)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const sessionId = await onCreateSession(formData);
      console.log("Session created with ID:", sessionId);
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        duration: 1,
      });
      setErrors({});
    } catch (error) {
      console.error("Failed to create session:", error);
    }
  };

  const handleInputChange = (field: keyof CheckInFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const durationOptions = [
    { value: 0.5, label: "30 minutes" },
    { value: 1, label: "1 hour" },
    { value: 2, label: "2 hours" },
    { value: 4, label: "4 hours" },
    { value: 8, label: "8 hours" },
    { value: 24, label: "1 day" },
    { value: 72, label: "3 days" },
    { value: 168, label: "1 week" },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-6 w-6" />
            <span>{t("create.title")}</span>
          </CardTitle>
          <CardDescription>
            Create a new check-in session for your team or event. All data will be encrypted and private.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Session Title */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>{t("create.sessionTitle")}</span>
                <span className="text-destructive">*</span>
              </label>
              <Input
                id="title"
                type="text"
                placeholder="e.g., Daily Standup Meeting"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>{t("create.description")}</span>
                <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="description"
                placeholder="Describe the purpose and details of this check-in session..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className={errors.description ? "border-destructive" : ""}
                rows={4}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{errors.description || ""}</span>
                <span>{formData.description.length}/500</span>
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="text-sm font-medium flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>{t("create.duration")}</span>
                <span className="text-destructive">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {durationOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={formData.duration === option.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleInputChange("duration", option.value)}
                    className="justify-start"
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
              <Input
                id="duration"
                type="number"
                min="0.5"
                max="168"
                step="0.5"
                placeholder="Custom duration in hours"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", parseFloat(e.target.value) || 0)}
                className={errors.duration ? "border-destructive" : ""}
              />
              {errors.duration && (
                <p className="text-sm text-destructive">{errors.duration}</p>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                🔒 Privacy Notice
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                All check-in data will be encrypted using FHEVM technology. Only verification status 
                will be public - personal data remains completely private and encrypted.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    title: "",
                    description: "",
                    duration: 1,
                  });
                  setErrors({});
                }}
                disabled={isCreating}
              >
                {t("create.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isCreating || !formData.title || !formData.description}
                loading={isCreating}
              >
                {isCreating ? t("create.creating") : t("create.create")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
