import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import AnalysisResults, { type AnalysisData } from "@/components/case-analysis/AnalysisResults";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type CaseRow = Tables<"case_analyses">;

export default function CaseHistory() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<CaseRow | null>(null);

  useEffect(() => {
    supabase
      .from("case_analyses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCases(data || []);
        setLoading(false);
      });
  }, []);

  const toAnalysisData = (c: CaseRow): AnalysisData => ({
    verdictLikelihood: c.verdict_likelihood,
    riskLevel: c.risk_level as AnalysisData["riskLevel"],
    keyFactors: c.key_factors,
    suggestedArguments: c.suggested_arguments,
    similarPrecedents: c.similar_precedents,
    recommendedNextSteps: c.recommended_next_steps,
  });

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

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 text-gold animate-spin" />
        </div>
      ) : cases.length === 0 ? (
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
              {cases.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono text-xs">{c.id.slice(0, 8)}</TableCell>
                  <TableCell>{c.case_type}</TableCell>
                  <TableCell>{c.created_at.slice(0, 10)}</TableCell>
                  <TableCell>{riskBadge(c.risk_level)}</TableCell>
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
            <DialogTitle className="font-display">{selected?.case_type} Case</DialogTitle>
          </DialogHeader>
          {selected && <AnalysisResults data={toAnalysisData(selected)} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
