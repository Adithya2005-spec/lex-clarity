import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GlossaryResult {
  term: string;
  explanation: string;
  example: string;
  relatedTerms: string[];
}

export default function LegalGlossary() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GlossaryResult | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      // Mock — will be replaced with edge function call
      await new Promise((r) => setTimeout(r, 1500));
      setResult({
        term: query,
        explanation: `${query} is a fundamental legal concept that refers to a principle or rule established in law. It is commonly used in legal proceedings to describe specific legal standards or requirements that must be met.`,
        example: `In the case of State v. Smith, the court applied the principle of ${query.toLowerCase()} to determine the outcome, ruling that the defendant's actions met the legal threshold.`,
        relatedTerms: ["Due Process", "Habeas Corpus", "Mens Rea", "Res Judicata"],
      });
    } catch {
      toast.error("Failed to fetch definition");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-10 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <h1 className="font-display text-3xl font-bold text-foreground">Legal Glossary</h1>
        <p className="text-muted-foreground text-sm mt-2">Search any legal term for a plain English explanation</p>
      </motion.div>

      <div className="flex gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="e.g. Habeas Corpus, Tort, Injunction..."
            className="pl-10"
          />
        </div>
        <Button variant="gold" onClick={handleSearch} disabled={loading || !query.trim()}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Loader2 className="h-8 w-8 text-gold animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Looking up definition...</p>
          </motion.div>
        )}

        {!loading && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-xl p-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-gold" />
              <h2 className="font-display text-xl font-bold text-foreground">{result.term}</h2>
            </div>

            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Simple Explanation</h4>
                <p className="text-foreground text-sm leading-relaxed">{result.explanation}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Example</h4>
                <p className="text-foreground text-sm leading-relaxed italic bg-muted/50 p-4 rounded-lg">{result.example}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Related Terms</h4>
                <div className="flex flex-wrap gap-2">
                  {result.relatedTerms.map((term) => (
                    <button
                      key={term}
                      onClick={() => { setQuery(term); }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
