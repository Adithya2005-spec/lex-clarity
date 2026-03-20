import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import AnalysisResults, { type AnalysisData } from "@/components/case-analysis/AnalysisResults";

interface CaseRecord {
  id: string;
  caseType: string;
  date: string;
  riskLevel: "Low" | "Medium" | "High";
  analysis: AnalysisData;
}

// Sample data — will be replaced with Lovable Cloud data
const sampleCases: CaseRecord[] = [
  {
    id: "VRD-001",
    caseType: "Criminal",
    date: "2024-03-15",
    riskLevel: "High",
    analysis: {
      verdictLikelihood: 35,
      riskLevel: "High",
      keyFactors: ["Limited documentary evidence", "Conflicting witness statements"],
      suggestedArguments: ["Challenge evidence admissibility", "Highlight procedural irregularities"],
      similarPrecedents: ["State v. Mehta (2020) - Similar evidentiary challenges"],
      recommendedNextSteps: ["Retain experienced criminal defense attorney", "File for bail"],
    },
  },
  {
    id: "VRD-002",
    caseType: "Civil",
    date: "2024-03-10",
    riskLevel: "Low",
    analysis: {
      verdictLikelihood: 78,
      riskLevel: "Low",
      keyFactors: ["Strong contractual evidence", "Clear breach documentation"],
      suggestedArguments: ["Present contract terms clearly", "Quantify damages precisely"],
      similarPrecedents: ["Patel v. ABC Corp (2021) - Contract enforcement"],
      recommendedNextSteps: ["File civil suit", "Prepare damage calculation report"],
    },
  },
];

export default function CaseHistory() {
  const [selected, setSelected] = useState<CaseRecord | null>(null);

  const riskBadge = (level: string) => {
    const colors: Record<string, string> = {
      Low: "bg-success/10 text-success",
      Medium: "bg-warning/10 text-warning",
      High: "bg-danger/10 text-danger",
    };
    return <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", colors[level])}>{level}</span>;
  };

  return (
    <div className="container py-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Case History</h1>
        <p className="text-muted-foreground text-sm mt-2">View all your previously analyzed cases</p>
      </motion.div>

      {sampleCases.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Cases Yet</h3>
          <p className="text-muted-foreground text-sm">Your analyzed cases will appear here</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Case ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleCases.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-sm">{c.id}</TableCell>
                  <TableCell>{c.caseType}</TableCell>
                  <TableCell>{c.date}</TableCell>
                  <TableCell>{riskBadge(c.riskLevel)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(c)}>
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Case {selected?.id} — {selected?.caseType}</DialogTitle>
          </DialogHeader>
          {selected && <AnalysisResults data={selected.analysis} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
