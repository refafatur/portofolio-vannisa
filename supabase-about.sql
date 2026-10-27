-- Jalankan skrip ini di Supabase SQL Editor.
-- Skrip mempertahankan data pada tbl_timeline lama dengan mengganti namanya.
DO $$
BEGIN
  IF to_regclass('public.tbl_timelines') IS NOT NULL
     AND to_regclass('public.tbl_timeline') IS NOT NULL THEN
    RAISE EXCEPTION 'Both tbl_timeline and tbl_timelines exist. Merge the tables before continuing.';
  ELSIF to_regclass('public.tbl_timelines') IS NULL
     AND to_regclass('public.tbl_timeline') IS NOT NULL THEN
    ALTER TABLE public.tbl_timeline RENAME TO tbl_timelines;
  END IF;
END;
$$;

CREATE TABLE IF NOT EXISTS public.tbl_timelines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year VARCHAR(50) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.tbl_timelines
  ADD COLUMN IF NOT EXISTS year VARCHAR(50),
  ADD COLUMN IF NOT EXISTS title VARCHAR(200),
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  DROP COLUMN IF EXISTS tipe,
  DROP COLUMN IF EXISTS urutan;

-- Isi contoh hanya saat tabel masih kosong; data lama tidak ditimpa atau digandakan.
INSERT INTO public.tbl_timelines (year, title, description)
SELECT sample.year, sample.title, sample.description
FROM (VALUES
  ('2016 - 2019', 'SMP', 'Menempuh pendidikan menengah pertama.'),
  ('2019 - 2022', 'SMA', 'Menempuh pendidikan menengah atas.'),
  ('2022 - Sekarang', 'Universitas Binaniaga Indonesia', 'Mahasiswa S1 Teknik Informatika.'),
  ('2024', 'Magang', 'Pengalaman magang sebagai Software Developer / IT Support.')
) AS sample(year, title, description)
WHERE NOT EXISTS (SELECT 1 FROM public.tbl_timelines);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_tbl_timeline_updated_at ON public.tbl_timelines;
DROP TRIGGER IF EXISTS update_tbl_timelines_updated_at ON public.tbl_timelines;
CREATE TRIGGER update_tbl_timelines_updated_at
  BEFORE UPDATE ON public.tbl_timelines
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER TABLE public.tbl_timelines ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tbl_timelines'
      AND policyname = 'Allow public read access on tbl_timelines'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public read access on tbl_timelines"
      ON public.tbl_timelines FOR SELECT USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tbl_timelines'
      AND policyname = 'Allow public insert on tbl_timelines'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public insert on tbl_timelines"
      ON public.tbl_timelines FOR INSERT WITH CHECK (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tbl_timelines'
      AND policyname = 'Allow public update on tbl_timelines'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public update on tbl_timelines"
      ON public.tbl_timelines FOR UPDATE USING (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tbl_timelines'
      AND policyname = 'Allow public delete on tbl_timelines'
  ) THEN
    EXECUTE 'CREATE POLICY "Allow public delete on tbl_timelines"
      ON public.tbl_timelines FOR DELETE USING (true)';
  END IF;
END;
$$;
