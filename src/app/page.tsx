"use client";

import React, { useState } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import FAQ from "@/components/home/FAQ";
import AuthModal from "@/components/home/AuthModal";

export default function Home() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header onLoginClick={() => setShowAuthModal(true)} />
      
      <main style={{ flex: 1 }}>
        <Hero onGetStartedClick={() => setShowAuthModal(true)} />
        <FAQ />
      </main>

      <Footer />

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
}
