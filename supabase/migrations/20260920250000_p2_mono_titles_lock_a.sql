-- P2 LOCK A: expand 12 mono-word titles to 2–4 words. UPDATE titlu only.
-- KEEP tema_saptamana + materiale + pasi + gata_cand (body untouched).
-- SKIP s32-2-3-z2-mental (already "Balonul e moale").
-- Do not apply to Familie/production from this PR; Cristina QA pe preview.
update public.activities as a
set titlu = v.titlu
from (values
  ('s1-2-3-z2-social', 'Spunem mulțumesc'),
  ('s30-2-3-z5-mental', 'Pasărea zboară'),
  ('s31-2-3-z4-mental', 'Umed și uscat'),
  ('s35-2-3-z5-mental', 'Apa e rece'),
  ('s36-2-3-z4-mental', 'Zumzet și liniște'),
  ('s38-2-3-z2-mental', 'Iarba e moale'),
  ('s38-2-3-z3-mental', 'Iarba gâdilă'),
  ('s38-2-3-z6-mental', 'Moale și tare'),
  ('s39-2-3-z4-mental', 'Coaja e netedă'),
  ('s39-2-3-z5-mental', 'Gust dulce'),
  ('s40-2-3-z1-mental', 'Ajutor pe scurt'),
  ('s52-2-3-z6-social', 'Spunem mulțumim')
) as v(id, titlu)
where a.id = v.id;
