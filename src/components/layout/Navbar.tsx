"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";

export default function Navbar() {
  const [activeSection, setActiveSection] = useState("pendahuluan");
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = [
    { id: "pendahuluan", label: "Pendahuluan" },
    { id: "dataset", label: "Dataset" },
    { id: "metodologi", label: "Metodologi" },
    { id: "hasil", label: "Hasil" },
    { id: "kesimpulan", label: "Kesimpulan" },
    { id: "rekomendasi", label: "Rekomendasi" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll progress
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);

      // Detect active section
      const sections = navItems.map((item) => document.getElementById(item.id));
      const currentSection = sections.find((section) => {
        if (section) {
          const rect = section.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection.id);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-[var(--bg-secondary)]/80 backdrop-blur-lg border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[var(--accent-blue)]" />
            <span>StatReport</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-sm transition-colors ${
                  activeSection === item.id
                    ? "text-[var(--accent-blue)] font-semibold"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-[var(--bg-primary)]">
        <div
          className="h-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-cyan)] transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </nav>
  );
}
