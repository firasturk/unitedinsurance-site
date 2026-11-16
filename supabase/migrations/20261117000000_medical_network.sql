-- Monthly NatHealth medical-network snapshots. Each upload from Admin → Medical Network stores the
-- whole network as one compact JSON document; the public page reads the newest row.
CREATE TABLE IF NOT EXISTS public.medical_network (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  period text NOT NULL,              -- "2026-11"
  data jsonb NOT NULL,               -- { updated, cities, areas, specs, rows }
  stats jsonb NOT NULL DEFAULT '{}', -- totals shown in the dashboard
  file_name text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS medical_network_created_at_idx ON public.medical_network (created_at DESC);

ALTER TABLE public.medical_network ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage medical network" ON public.medical_network;
CREATE POLICY "Admins manage medical network" ON public.medical_network
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Supabase no longer grants Data API access to new tables automatically (Oct 2026).
GRANT SELECT, INSERT, UPDATE, DELETE ON public.medical_network TO authenticated, service_role;
