-- Lock A / GO A: S32 banda 2–3 copy → balon (tema Balonul afară).
-- KEEP character Balonaș in chrome. Copy = locked banda 1–2 S32.
-- Seed catalog slug remaps to live s32-b23-* (docs/IMPORT-BANDA-2-3-ID-MAP.md).
-- Ticket table live column repeats seed ids — ignore; live is b23.
-- ONLY banda='2-3'. Does not touch banda 1–2 or ids without b23.
-- Do not apply to Familie/production from this PR; Cristina QA pe preview.

update public.activities as a
set
  titlu = v.titlu,
  materiale = v.materiale,
  pasi = v.pasi,
  gata_cand = v.gata_cand,
  tema_saptamana = v.tema_saptamana
from (values
  ('s32-b23-z1-fizic', 'Ținem balonul de sfoară', ARRAY['balon cu sfoară']::text[], ARRAY['În curte: țineți sfoara împreună pe scurt.', '„Balon.” 10–20 de secunde.']::text[], 'A ținut sfoara sau a atins balonul.', 'Balonul afară'),
  ('s32-b23-z1-mental', 'Balonul e ușor', ARRAY['balon cu sfoară']::text[], ARRAY['Arătați balonul: „Balon.”', '„Ușor.” pe scurt.']::text[], 'A auzit balon și ușor.', 'Balonul afară'),
  ('s32-b23-z1-resurse', 'Balonul lângă ușă', ARRAY['balon cu sfoară']::text[], ARRAY['Așezați balonul (sfoara strânsă) lângă ușă înainte să ieșiți.', '„Balon. Aici.”']::text[], 'A ajutat să așeze balonul.', 'Balonul afară'),
  ('s32-b23-z1-social', 'Ținem balonul împreună', ARRAY['balon cu sfoară']::text[], ARRAY['Stați afară lângă adult, amândoi pe sfoară.', '„Împreună. Balon.” fără forțare.']::text[], 'A fost prezent cu balonul afară.', 'Balonul afară'),
  ('s32-b23-z2-fizic', 'Bătem ușor în balon', ARRAY['balon cu sfoară']::text[], ARRAY['Bateți ușor o dată în balon, cu adult.', '„Balon. Bătut.” fără grabă.']::text[], 'A bătut în balon sau a atins-o.', 'Balonul afară'),
  ('s32-b23-z2-mental', 'Balonul e moale', ARRAY['balon cu sfoară']::text[], ARRAY['Atingeți balonul: „Moale.” pe scurt.', '„Balon.”']::text[], 'A auzit moale (și balon).', 'Balonul afară'),
  ('s32-b23-z2-resurse', 'Balonul pe scaun, la loc', ARRAY['balon cu sfoară']::text[], ARRAY['Așezați balonul pe scaun când nu jucați (sfoara strânsă).', '„Balon. Aici.”']::text[], 'A așezat balonul sau a privit.', 'Balonul afară'),
  ('s32-b23-z2-social', 'Bătem pe rând', ARRAY['balon cu sfoară']::text[], ARRAY['Voi bateți ușor. „Acum tu.”', 'Așteptați fără forțare.']::text[], 'A bătut sau a privit rândul.', 'Balonul afară'),
  ('s32-b23-z3-fizic', 'Balonul sus, deasupra capului', ARRAY['balon cu sfoară']::text[], ARRAY['Ridicați balonul deasupra capului pe scurt, cu adult.', '„Sus. Balon.”']::text[], 'A privit balonul sus sau a ținut sfoara.', 'Balonul afară'),
  ('s32-b23-z3-mental', 'Sus — sau jos?', ARRAY['balon cu sfoară']::text[], ARRAY['Ridicați: „Sus.”', 'Coborâți aproape de sol: „Jos.”']::text[], 'A auzit sus și jos.', 'Balonul afară'),
  ('s32-b23-z3-resurse', 'Sfoara strânsă în mână', ARRAY['balon cu sfoară']::text[], ARRAY['Înfășurați sfoara pe scurt în mână.', '„Sfoară. Strâns.”']::text[], 'A atins sfoara strânsă sau a privit.', 'Balonul afară'),
  ('s32-b23-z3-social', 'Ridicăm balonul împreună', ARRAY['balon cu sfoară']::text[], ARRAY['Ridicați împreună pe scurt.', '„Împreună. Sus.” fără forțare.']::text[], 'A ținut sfoara la ridicare sau a privit.', 'Balonul afară'),
  ('s32-b23-z4-fizic', 'Umblăm cu balonul în curte', ARRAY['balon cu sfoară']::text[], ARRAY['Mergeți câțiva pași ținând sfoara.', '„Balon. Pași.”']::text[], 'A mers cu sfoara sau a privit.', 'Balonul afară'),
  ('s32-b23-z4-mental', 'Balonul pe iarbă', ARRAY['balon cu sfoară']::text[], ARRAY['Lăsați balonul să atingă iarba pe scurt. „Balon. Iarbă.”', 'Întrebați: „Unde e?”']::text[], 'A privit sau a arătat balonul.', 'Balonul afară'),
  ('s32-b23-z4-resurse', 'Balonul nu rămâne afară', ARRAY['balon cu sfoară']::text[], ARRAY['Aduceți balonul lângă ușă după joacă.', '„Balon. La ușă.”']::text[], 'A adus balonul sau a ajutat.', 'Balonul afară'),
  ('s32-b23-z4-social', 'Ne jucăm cu balonul', ARRAY['balon cu sfoară']::text[], ARRAY['Căutați / arătați balonul pe scurt lângă adult.', '„Împreună. Unde e?” fără grabă.']::text[], 'A căutat sau a arătat balonul.', 'Balonul afară'),
  ('s32-b23-z5-fizic', 'Mergem ținând sfoara', ARRAY['balon cu sfoară']::text[], ARRAY['Mergeți ținând sfoara (nu loviți cu piciorul).', '„Sfoară. Pași.”']::text[], 'A ținut sfoara la mers sau a privit.', 'Balonul afară'),
  ('s32-b23-z5-mental', 'Sfoară lungă — sau scurtă?', ARRAY['balon cu sfoară']::text[], ARRAY['Arătați sfoara desfășurată: „Lungă.”', 'Apoi strânsă: „Scurtă.”']::text[], 'A auzit lungă și scurtă.', 'Balonul afară'),
  ('s32-b23-z5-resurse', 'Sfoara înfășurată, la loc', ARRAY['balon cu sfoară', 'cui sau cutie']::text[], ARRAY['Înfășurați sfoara; puneți balonul pe cui / în cutie.', '„La loc.”']::text[], 'A ajutat să pună balonul la loc.', 'Balonul afară'),
  ('s32-b23-z5-social', 'Mergem cu balonul împreună', ARRAY['balon cu sfoară']::text[], ARRAY['Mergeți amândoi pe sfoară pe scurt.', '„Împreună. Pași.” fără forțare.']::text[], 'A mers lângă adult cu sfoara sau a privit.', 'Balonul afară'),
  ('s32-b23-z6-fizic', 'Balonul se leagănă', ARRAY['balon cu sfoară']::text[], ARRAY['Legănați ușor balonul de sfoară pe scurt.', '„Balon. Legăn.”']::text[], 'A privit legănatul sau a ținut sfoara.', 'Balonul afară'),
  ('s32-b23-z6-mental', 'Se mișcă în aer', ARRAY['balon cu sfoară']::text[], ARRAY['Arătați mișcarea: „Aer.”', '„Balon.” pe scurt.']::text[], 'A auzit aer / balon.', 'Balonul afară'),
  ('s32-b23-z6-resurse', 'Balonul în casă, la loc', ARRAY['balon cu sfoară', 'cui sau cutie']::text[], ARRAY['Intrați; puneți balonul pe cui / în cutie.', '„Balon. La loc.”']::text[], 'A pus balonul la loc sau a ajutat.', 'Balonul afară'),
  ('s32-b23-z6-social', 'Arătăm balonul', ARRAY['balon cu sfoară']::text[], ARRAY['Intrați lângă adult cu balonul.', '„Împreună. Uite.” fără grabă.']::text[], 'A intrat cu balonul sau a privit.', 'Balonul afară'),
  ('s32-b23-z7-fizic', 'Plimbare cu balonul', ARRAY['balon cu sfoară dacă vrea']::text[], ARRAY['El dictează direcția în curte pe scurt, cu adult.', 'La final: sfoara în mână dacă vrea.']::text[], 'A mers liber pe scurt în curte.', 'Balonul afară'),
  ('s32-b23-z7-mental', 'Cartea cu balonul', ARRAY['carte cu imagini']::text[], ARRAY['El întoarce pagina.', 'Arătați balon / sfoară / afară dacă e clar: „Balon.”']::text[], 'A întors pagina sau a privit.', 'Balonul afară'),
  ('s32-b23-z7-resurse', 'Balonul pe cui', ARRAY['balon cu sfoară', 'pantofi']::text[], ARRAY['Balonul pe cui; pantofii lângă ușă.', '„La loc. Gata.”']::text[], 'A ajutat să pună la loc.', 'Balonul afară'),
  ('s32-b23-z7-social', 'Noapte bună', '{}'::text[], ARRAY['„Noapte bună.”', 'Lumină mică, fără grabă.']::text[], 'A auzit ritualul de noapte.', 'Balonul afară')
) as v(id, titlu, materiale, pasi, gata_cand, tema_saptamana)
where a.id = v.id
  and a.banda = '2-3';
