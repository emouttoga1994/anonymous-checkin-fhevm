"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import { useLanguage } from "@/hooks/useLanguage";
import { 
  Shield, 
  Eye, 
  Lock, 
  Calendar, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle
} from "lucide-react";

interface WelcomePageProps {
  isWalletConnected: boolean;
  onConnectWallet: () => void;
}

export function WelcomePage({ isWalletConnected, onConnectWallet }: WelcomePageProps) {
  const { t } = useLanguage();

  const features = [
    {
      icon: Shield,
      title: t("welcome.features.privacy"),
      description: t("welcome.features.privacy.desc"),
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      icon: Eye,
      title: t("welcome.features.anonymous"),
      description: t("welcome.features.anonymous.desc"),
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      icon: Lock,
      title: t("welcome.features.secure"),
      description: t("welcome.features.secure.desc"),
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-950",
    },
  ];

  const stats = [
    { label: "Sessions Created", value: "1,000+", icon: Calendar },
    { label: "Active Users", value: "500+", icon: Users },
    { label: "Privacy Score", value: "100%", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="h-4 w-4" />
            <span>Powered by FHEVM Technology</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-6">
            {t("welcome.title")}
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t("welcome.subtitle")}
          </p>
          
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto">
            {t("welcome.description")}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isWalletConnected ? (
              <Link href="/sessions">
                <Button size="lg" className="w-full sm:w-auto">
                  {t("welcome.getStarted")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button size="lg" onClick={onConnectWallet} className="w-full sm:w-auto">
                <Shield className="mr-2 h-5 w-5" />
                {t("wallet.connect")}
              </Button>
            )}
            
            <Link href="/sessions">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Calendar className="mr-2 h-5 w-5" />
                View Sessions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("welcome.features.title")}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the future of privacy-preserving attendance tracking
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    <span>Fully implemented</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Users Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of users who value their privacy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Connect your wallet and start creating or participating in check-in sessions today.
          </p>
          
          {isWalletConnected ? (
            <Link href="/create">
              <Button size="lg">
                <Calendar className="mr-2 h-5 w-5" />
                Create Your First Session
              </Button>
            </Link>
          ) : (
            <Button size="lg" onClick={onConnectWallet}>
              <Shield className="mr-2 h-5 w-5" />
              Connect Wallet to Continue
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
