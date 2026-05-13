"use client";

import React, { useEffect, useState } from "react";

export function PrivacyShield({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(document.visibilityState === "visible");
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className={`transition-all duration-500 ${!isVisible ? "blur-2xl grayscale scale-[1.02]" : "blur-0"}`}>
      {children}
      {!isVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/20 backdrop-blur-sm">
          <div className="bg-zinc-900/90 border border-zinc-800 p-6 rounded-2xl shadow-2xl flex flex-col items-center gap-3 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="w-3 h-3 bg-primary rounded-full animate-ping" />
            </div>
            <p className="text-sm font-bold text-white tracking-tight">Privacy Shield Active</p>
            <p className="text-[10px] text-zinc-500 uppercase font-black">Workspace Hidden</p>
          </div>
        </div>
      )}
    </div>
  );
}
