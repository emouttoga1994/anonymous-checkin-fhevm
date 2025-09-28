"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { useLanguage } from "@/hooks/useLanguage";
import { useWallet } from "@/hooks/useWallet";
import { formatAddress } from "@/lib/utils";
import { 
  Home, 
  Calendar, 
  Plus, 
  User, 
  Wallet, 
  Globe,
  Menu,
  X,
  LogOut
} from "lucide-react";

interface NavigationProps {
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

export function Navigation({ onConnectWallet, onDisconnectWallet }: NavigationProps) {
  const pathname = usePathname();
  const { t, currentLanguage, languages, changeLanguage } = useLanguage();
  const { isConnected, account } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: t("nav.home"), icon: Home },
    { href: "/sessions", label: t("nav.sessions"), icon: Calendar },
    { href: "/create", label: t("nav.create"), icon: Plus },
    { href: "/profile", label: t("nav.profile"), icon: User },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">CheckIn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <div className="hidden sm:flex items-center space-x-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <select
                value={currentLanguage}
                onChange={(e) => changeLanguage(e.target.value as 'en' | 'zh')}
                className="bg-transparent text-sm border-none outline-none cursor-pointer"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Wallet Connection */}
            {isConnected ? (
              <Card className="px-3 py-2">
                <div className="flex items-center space-x-2">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">
                    {formatAddress(account || "")}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDisconnectWallet}
                    className="h-6 w-6 p-0"
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            ) : (
              <Button onClick={onConnectWallet} size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                {t("wallet.connect")}
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Mobile Language Selector */}
              <div className="flex items-center space-x-2 px-3 py-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <select
                  value={currentLanguage}
                  onChange={(e) => changeLanguage(e.target.value as 'en' | 'zh')}
                  className="bg-transparent text-sm border-none outline-none cursor-pointer flex-1"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
