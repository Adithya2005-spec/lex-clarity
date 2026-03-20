import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Scale, TrendingUp, BookOpen, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Scale,
    title: "Case Analysis",
    description: "Submit your case details and receive AI-powered analysis including verdict prediction and risk assessment.",
  },
  {
    icon: TrendingUp,
    title: "Verdict Prediction",
    description: "Get data-driven predictions on case outcomes with likelihood percentages and supporting reasoning.",
  },
  {
    icon: BookOpen,
    title: "Legal Guidance",
    description: "Receive suggested arguments, relevant precedents, and recommended next steps for your case.",
  },
];

export default function Index() {
  return (
    <div>
      {/* Hero */}
      <section className="gradient-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-gold-light rounded-full blur-3xl" />
        </div>
        <div className="container relative py-24 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 bg-navy-light/50 mb-8">
              <Shield className="h-4 w-4 text-gold" />
              <span className="text-sm text-gold">AI-Powered Legal Intelligence</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              AI-Powered Legal Insights
              <br />
              <span className="text-gradient-gold">At Your Fingertips</span>
            </h1>
            <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
              Analyze cases, predict outcomes, and get actionable legal guidance powered by advanced AI. Make informed decisions with confidence.
            </p>
            <Link to="/analyze">
              <Button variant="gold" size="lg" className="text-base px-8 py-6 animate-pulse-gold">
                Analyze a Case
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Powerful Legal Tools
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Everything you need to analyze and understand your legal position.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-xl p-8 hover:shadow-xl transition-shadow group"
              >
                <div className="w-12 h-12 rounded-lg gradient-navy flex items-center justify-center mb-5 group-hover:animate-pulse-gold transition-all">
                  <feature.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer Banner */}
      <section className="bg-muted border-y border-border">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            ⚠️ <strong>Important:</strong> This tool is for informational purposes only. It is not a substitute for professional legal advice. Always consult a qualified attorney for legal matters.
          </p>
        </div>
      </section>
    </div>
  );
}
