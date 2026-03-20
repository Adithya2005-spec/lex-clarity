import { Link, useLocation } from "react-router-dom";
import { Scale, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/", label: "Home" },
  { path: "/analyze", label: "Case Analysis" },
  { path: "/history", label: "Case History" },
  { path: "/glossary", label: "Legal Glossary" },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="gradient-navy sticky top-0 z-50 shadow-lg">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-gold" />
            <span className="font-display text-xl font-bold text-primary-foreground">
              Verdict <span className="text-gradient-gold">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-navy-light text-gold"
                    : "text-primary-foreground/80 hover:text-gold hover:bg-navy-light/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-primary-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav className="md:hidden border-t border-navy-light pb-4 px-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-navy-light text-gold"
                    : "text-primary-foreground/80 hover:text-gold"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="gradient-navy py-6">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-gold" />
              <span className="text-sm text-primary-foreground/70">
                © {new Date().getFullYear()} Verdict AI
              </span>
            </div>
            <p className="text-xs text-primary-foreground/50 text-center max-w-xl">
              ⚠️ Disclaimer: This tool is for informational purposes only. It does not constitute legal advice and is not a substitute for professional legal counsel. Always consult a qualified attorney for legal matters.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
