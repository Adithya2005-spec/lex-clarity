import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = ["Case Details", "Key Facts", "Legal Sections", "Review & Analyze"];

export default function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                i < current && "bg-accent text-accent-foreground",
                i === current && "bg-primary text-primary-foreground ring-4 ring-gold/30",
                i > current && "bg-muted text-muted-foreground"
              )}
            >
              {i < current ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs mt-1 hidden md:block text-muted-foreground">{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn("w-12 h-0.5 mb-5 md:mb-0", i < current ? "bg-accent" : "bg-muted")} />
          )}
        </div>
      ))}
    </div>
  );
}
