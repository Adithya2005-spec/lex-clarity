import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { CalendarIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import StepIndicator from "@/components/case-analysis/StepIndicator";
import AnalysisResults, { type AnalysisData } from "@/components/case-analysis/AnalysisResults";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const caseTypes = ["Criminal", "Civil", "Family", "Property", "Consumer", "Labour"];
const jurisdictions = ["State High Court", "District Court", "Supreme Court", "Consumer Forum"];

export interface CaseFormData {
  caseType: string;
  summary: string;
  incidentDate: Date | undefined;
  keyFacts: string[];
  party1Name: string;
  party1Role: string;
  party2Name: string;
  party2Role: string;
  legalSections: string;
  jurisdiction: string;
}

const initialFormData: CaseFormData = {
  caseType: "",
  summary: "",
  incidentDate: undefined,
  keyFacts: [""],
  party1Name: "",
  party1Role: "",
  party2Name: "",
  party2Role: "",
  legalSections: "",
  jurisdiction: "",
};

export default function CaseAnalysis() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<CaseFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AnalysisData | null>(null);

  const updateForm = <K extends keyof CaseFormData>(key: K, value: CaseFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addFact = () => updateForm("keyFacts", [...form.keyFacts, ""]);
  const removeFact = (i: number) => updateForm("keyFacts", form.keyFacts.filter((_, idx) => idx !== i));
  const updateFact = (i: number, value: string) => {
    const facts = [...form.keyFacts];
    facts[i] = value;
    updateForm("keyFacts", facts);
  };

  const canProceed = () => {
    if (step === 0) return form.caseType && form.summary;
    if (step === 1) return form.keyFacts.some((f) => f.trim()) && form.party1Name && form.party2Name;
    if (step === 2) return form.jurisdiction;
    return true;
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-case", {
        body: {
          caseType: form.caseType,
          summary: form.summary,
          incidentDate: form.incidentDate ? format(form.incidentDate, "yyyy-MM-dd") : null,
          keyFacts: form.keyFacts.filter((f) => f.trim()),
          party1Name: form.party1Name,
          party1Role: form.party1Role,
          party2Name: form.party2Name,
          party2Role: form.party2Role,
          legalSections: form.legalSections,
          jurisdiction: form.jurisdiction,
        },
      });

      if (error) throw error;
      if (data.error) {
        toast.error(data.error);
        return;
      }

      const analysis: AnalysisData = data.analysis;

      // Save to database
      await supabase.from("case_analyses").insert({
        case_type: form.caseType,
        summary: form.summary,
        incident_date: form.incidentDate ? format(form.incidentDate, "yyyy-MM-dd") : null,
        key_facts: form.keyFacts.filter((f) => f.trim()),
        party1_name: form.party1Name,
        party1_role: form.party1Role,
        party2_name: form.party2Name,
        party2_role: form.party2Role,
        legal_sections: form.legalSections,
        jurisdiction: form.jurisdiction,
        verdict_likelihood: analysis.verdictLikelihood,
        risk_level: analysis.riskLevel,
        key_factors: analysis.keyFactors,
        suggested_arguments: analysis.suggestedArguments,
        similar_precedents: analysis.similarPrecedents,
        recommended_next_steps: analysis.recommendedNextSteps,
      });

      setResults(analysis);
      toast.success("Analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-16 w-16 text-gold" />
        </motion.div>
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Analyzing Case...</h2>
          <p className="text-muted-foreground text-sm">Our AI is reviewing your case details and generating insights</p>
        </div>
      </div>
    );
  }

  if (results) {
    return (
      <div className="container py-10 max-w-3xl">
        <AnalysisResults data={results} />
      </div>
    );
  }

  const stepContent = [
    <div key="step1" className="space-y-6">
      <div>
        <Label>Case Type</Label>
        <Select value={form.caseType} onValueChange={(v) => updateForm("caseType", v)}>
          <SelectTrigger><SelectValue placeholder="Select case type" /></SelectTrigger>
          <SelectContent>
            {caseTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Brief Case Summary</Label>
        <Textarea
          value={form.summary}
          onChange={(e) => updateForm("summary", e.target.value)}
          placeholder="Describe your case in detail..."
          rows={5}
        />
      </div>
      <div>
        <Label>Date of Incident</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !form.incidentDate && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {form.incidentDate ? format(form.incidentDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={form.incidentDate}
              onSelect={(d) => updateForm("incidentDate", d)}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>,

    <div key="step2" className="space-y-6">
      <div>
        <Label>Key Facts</Label>
        <div className="space-y-2 mt-2">
          {form.keyFacts.map((fact, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={fact}
                onChange={(e) => updateFact(i, e.target.value)}
                placeholder={`Fact ${i + 1}`}
              />
              {form.keyFacts.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeFact(i)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addFact}>
            <Plus className="h-4 w-4 mr-1" /> Add Fact
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Party 1 Name</Label>
          <Input value={form.party1Name} onChange={(e) => updateForm("party1Name", e.target.value)} placeholder="Name" />
        </div>
        <div>
          <Label>Party 1 Role</Label>
          <Input value={form.party1Role} onChange={(e) => updateForm("party1Role", e.target.value)} placeholder="e.g. Plaintiff" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Party 2 Name</Label>
          <Input value={form.party2Name} onChange={(e) => updateForm("party2Name", e.target.value)} placeholder="Name" />
        </div>
        <div>
          <Label>Party 2 Role</Label>
          <Input value={form.party2Role} onChange={(e) => updateForm("party2Role", e.target.value)} placeholder="e.g. Defendant" />
        </div>
      </div>
    </div>,

    <div key="step3" className="space-y-6">
      <div>
        <Label>IPC/CrPC Sections (Optional)</Label>
        <Input
          value={form.legalSections}
          onChange={(e) => updateForm("legalSections", e.target.value)}
          placeholder="e.g. Section 420, 120B IPC"
        />
        <p className="text-xs text-muted-foreground mt-1">Enter relevant legal sections if known</p>
      </div>
      <div>
        <Label>Jurisdiction</Label>
        <Select value={form.jurisdiction} onValueChange={(v) => updateForm("jurisdiction", v)}>
          <SelectTrigger><SelectValue placeholder="Select jurisdiction" /></SelectTrigger>
          <SelectContent>
            {jurisdictions.map((j) => <SelectItem key={j} value={j}>{j}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
    </div>,

    <div key="step4" className="space-y-4">
      <h3 className="font-display text-lg font-semibold text-foreground">Review Your Case</h3>
      {[
        { label: "Case Type", value: form.caseType },
        { label: "Summary", value: form.summary },
        { label: "Incident Date", value: form.incidentDate ? format(form.incidentDate, "PPP") : "Not specified" },
        { label: "Key Facts", value: form.keyFacts.filter((f) => f.trim()).join("; ") },
        { label: "Party 1", value: `${form.party1Name} (${form.party1Role})` },
        { label: "Party 2", value: `${form.party2Name} (${form.party2Role})` },
        { label: "Legal Sections", value: form.legalSections || "Not specified" },
        { label: "Jurisdiction", value: form.jurisdiction },
      ].map((item) => (
        <div key={item.label} className="flex flex-col sm:flex-row sm:items-start gap-1 py-2 border-b border-border last:border-0">
          <span className="text-sm font-medium text-muted-foreground w-36 shrink-0">{item.label}:</span>
          <span className="text-sm text-foreground">{item.value}</span>
        </div>
      ))}
    </div>,
  ];

  return (
    <div className="container py-10 max-w-2xl">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Case Analysis</h1>
        <p className="text-muted-foreground text-sm mt-2">Fill in your case details for AI-powered analysis</p>
      </div>

      <StepIndicator current={step} />

      <div className="glass-card rounded-xl p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {stepContent[step]}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-8 pt-6 border-t border-border">
          <Button variant="outline" onClick={() => setStep((s) => s - 1)} disabled={step === 0}>
            Previous
          </Button>
          {step < 3 ? (
            <Button variant="gold" onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
              Next
            </Button>
          ) : (
            <Button variant="gold" onClick={handleAnalyze} disabled={!canProceed()}>
              Analyze Case
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
