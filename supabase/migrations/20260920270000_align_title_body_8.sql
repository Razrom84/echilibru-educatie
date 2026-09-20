-- Lock B: align materiale/pasi/gata_cand for 8 banda 1–2 residual ids (title↔body).
-- KEEP titlu + tema_saptamana. 8× P1 (cizmă / șosete / rufe).
-- Do not apply to Familie/production from this PR; Cristina QA pe preview.
update public.activities as a
set
  materiale = v.materiale,
  pasi = v.pasi,
  gata_cand = v.gata_cand
from (values
  ('s27-2-3-z3-fizic', ARRAY['cizme']::text[], ARRAY['Puneți cizmele la ușă pe scurt.', '„Cizme. Ușă.”']::text[], 'A ajutat cu cizmele sau a privit.'),
  ('s27-2-3-z3-resurse', ARRAY['cizme']::text[], ARRAY['După geam: cizmele la loc.', '„Cizme. La loc.”']::text[], 'A ajutat cu cizmele.'),
  ('s27-2-3-z6-resurse', ARRAY['șosete']::text[], ARRAY['După geam: șosetele la loc.', '„Șosete. La loc.”']::text[], 'A ajutat cu șosetele.'),
  ('s28-2-3-z3-social', ARRAY['cizmă']::text[], ARRAY['Arătați cizma împreună.', '„Împreună. Cizmă.”']::text[], 'A privit cizma cu adultul.'),
  ('s28-2-3-z4-resurse', ARRAY['cizme']::text[], ARRAY['După băltoacă: cizmele la loc.', '„Cizme. La loc.”']::text[], 'A ajutat cu cizmele.'),
  ('s28-2-3-z6-resurse', ARRAY['cizme']::text[], ARRAY['După curte: cizmele la loc.', '„Cizme. La loc.”']::text[], 'A ajutat cu cizmele.'),
  ('s35-2-3-z3-resurse', ARRAY['cizme']::text[], ARRAY['După băltoacă: cizmele la loc.', '„Cizme. La loc.”']::text[], 'A ajutat cu cizmele.'),
  ('s23-2-3-z4-resurse', ARRAY['rufe', 'coș']::text[], ARRAY['Puneți rufele în coș.', '„Rufele. Coș.”']::text[], 'A ajutat cu rufele în coș.')
) as v(id, materiale, pasi, gata_cand)
where a.id = v.id;
