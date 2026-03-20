CREATE TABLE public.case_analyses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  case_type TEXT NOT NULL,
  summary TEXT NOT NULL,
  incident_date DATE,
  key_facts TEXT[] NOT NULL DEFAULT '{}',
  party1_name TEXT NOT NULL,
  party1_role TEXT,
  party2_name TEXT NOT NULL,
  party2_role TEXT,
  legal_sections TEXT,
  jurisdiction TEXT NOT NULL,
  verdict_likelihood INTEGER NOT NULL,
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  key_factors TEXT[] NOT NULL DEFAULT '{}',
  suggested_arguments TEXT[] NOT NULL DEFAULT '{}',
  similar_precedents TEXT[] NOT NULL DEFAULT '{}',
  recommended_next_steps TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cases" ON public.case_analyses FOR SELECT USING (true);
CREATE POLICY "Anyone can insert cases" ON public.case_analyses FOR INSERT WITH CHECK (true);