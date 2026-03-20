import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertTriangle, CheckCircle, Lightbulb, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export interface AnalysisData {
  verdictLikelihood: number;
  riskLevel: "Low" | "Medium" | "High";
  keyFactors: string[];
  suggestedArguments: string[];
  similarPrecedents: string[];
  recommendedNextSteps: string[];
}

export default function AnalysisResults({ data }: { data: AnalysisData }) {
  const riskColors = {
    Low: "bg-success/10 text-success border-success/30",
    Medium: "bg-warning/10 text-warning border-warning/30",
    High: "bg-danger/10 text-danger border-danger/30",
  };

  const verdictColor =
    data.verdictLikelihood >= 60 ? "bg-success" : data.verdictLikelihood >= 40 ? "bg-warning" : "bg-danger";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="text-center mb-6">
        <h2 className="font-display text-2xl font-bold text-foreground">Analysis Complete</h2>
        <p className="text-muted-foreground text-sm mt-1">AI-generated insights based on your case details</p>
      </div>

      {/* Verdict Likelihood & Risk */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-gold" />
            <h3 className="font-display font-semibold text-foreground">Verdict Likelihood</h3>
          </div>
          <div className="text-4xl font-bold text-foreground mb-3">{data.verdictLikelihood}%</div>
          <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${data.verdictLikelihood}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={cn("h-full rounded-full", verdictColor)}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {data.verdictLikelihood >= 60 ? "Likely favorable" : data.verdictLikelihood >= 40 ? "Uncertain outcome" : "Likely unfavorable"}
          </p>
        </div>

        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-gold" />
            <h3 className="font-display font-semibold text-foreground">Risk Assessment</h3>
          </div>
          <span className={cn("inline-block px-4 py-2 rounded-full text-sm font-semibold border", riskColors[data.riskLevel])}>
            {data.riskLevel} Risk
          </span>
        </div>
      </div>

      {/* Sections */}
      {[
        { title: "Key Factors", icon: CheckCircle, items: data.keyFactors },
        { title: "Suggested Arguments", icon: Lightbulb, items: data.suggestedArguments },
        { title: "Similar Precedents", icon: BookOpen, items: data.similarPrecedents },
        { title: "Recommended Next Steps", icon: ArrowRight, items: data.recommendedNextSteps },
      ].map((section) => (
        <div key={section.title} className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="h-5 w-5 text-gold" />
            <h3 className="font-display font-semibold text-foreground">{section.title}</h3>
          </div>
          <ul className="space-y-2">
            {section.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-gold mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="flex justify-center pt-4">
        <Link to="/history">
          <Button variant="outline">View Case History</Button>
        </Link>
      </div>
    </motion.div>
  );
}
