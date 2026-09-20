-- Lock B: align materiale/pasi/gata_cand for 35 banda 1–2 ids (title↔body).
-- KEEP titlu + tema_saptamana. Do not apply to production from this PR; Cristina QA pe preview.
update public.activities as a
set
  materiale = v.materiale,
  pasi = v.pasi,
  gata_cand = v.gata_cand
from (values
  ('s1-2-3-z6-fizic', ARRAY['nisip, iarbă sau pietre']::text[], ARRAY['Atingeți pe scurt nisip, iarbă sau o piatră, cu adult.','„Moale. Aspru.”']::text[], 'A explorat 2 texturi denumite.'),
  ('s22-2-3-z6-resurse', ARRAY['pantofi de casă']::text[], ARRAY['Puneți pantofii de casă la loc lângă ușă sau pe raft.','„Pantofi. La loc.”']::text[], 'A ajutat cu pantofii de casă.'),
  ('s22-2-3-z7-resurse', ARRAY['pernă','carte']::text[], ARRAY['Puneți perna și cartea la loc după joacă.','„La loc. Gata.”']::text[], 'A ajutat cu perna sau cartea.'),
  ('s23-2-3-z6-mental', '{}'::text[], ARRAY['Arătați o floare: „Floare.”','Arătați o frunză: „Frunză.” pe scurt.']::text[], 'A auzit floare și frunză.'),
  ('s23-2-3-z7-resurse', ARRAY['cană','carte']::text[], ARRAY['Puneți cana și cartea la loc.','„La loc. Gata.”']::text[], 'A ajutat cu cana sau cartea.'),
  ('s24-2-3-z3-resurse', ARRAY['pantofi']::text[], ARRAY['Așezați pantofii lângă ușă.','„Pantofi. La ușă.”']::text[], 'A ajutat cu pantofii lângă ușă.'),
  ('s24-2-3-z7-resurse', ARRAY['pantofi','haină']::text[], ARRAY['Puneți pantofii și haina la loc.','„La loc. Gata.”']::text[], 'A ajutat cu pantofii sau haina.'),
  ('s26-2-3-z7-resurse', ARRAY['carte','minge']::text[], ARRAY['Puneți cartea și mingea pe raft.','„La loc. Gata.”']::text[], 'A ajutat să pună cartea sau mingea.'),
  ('s29-2-3-z2-resurse', ARRAY['pantofi']::text[], ARRAY['După iarbă: pantofii lângă ușă.','„Pantofi. La loc.”']::text[], 'A ajutat cu pantofii după iarbă.'),
  ('s29-2-3-z3-fizic', ARRAY['frunză pe plantă']::text[], ARRAY['Atingeți pe scurt o frunză mică, cu adult.','„Frunză.” 10–20 de secunde.']::text[], 'A atins frunza sau a privit.'),
  ('s29-2-3-z3-resurse', ARRAY['plantă cu frunze']::text[], ARRAY['Arătați: frunza rămâne pe plantă.','„Frunză. Pe plantă.” fără a smulge.']::text[], 'A privit frunza pe plantă.'),
  ('s29-2-3-z3-social', ARRAY['frunză pe plantă']::text[], ARRAY['Pe rând: atingeți frunza mică.','„Acum tu.” fără forțare.']::text[], 'A atins pe rând sau a privit.'),
  ('s29-2-3-z5-mental', '{}'::text[], ARRAY['Arătați un mugure: „Mugure.”','Arătați o frunză: „Frunză.” pe scurt.']::text[], 'A auzit mugure și frunză.'),
  ('s29-2-3-z6-resurse', ARRAY['pantofi']::text[], ARRAY['După iarbă: pantofii la ușă.','„Pantofi. La ușă.”']::text[], 'A ajutat cu pantofii la ușă.'),
  ('s29-2-3-z7-resurse', ARRAY['stropitoare','pantofi']::text[], ARRAY['Stropitoarea la loc; pantofii lângă ușă.','„La loc. Gata.”']::text[], 'A ajutat cu stropitoarea sau pantofii.'),
  ('s30-2-3-z3-resurse', ARRAY['pantofi']::text[], ARRAY['După ascultat: pantofii lângă ușă.','„Pantofi. Gata.”']::text[], 'A ajutat cu pantofii sau a privit.'),
  ('s35-2-3-z6-fizic', ARRAY['pahar cu puțină apă','frunză']::text[], ARRAY['Lăsați o picătură pe o frunză, cu adult.','„Picătură. Frunză.” pe scurt.']::text[], 'A lăsat picătura pe frunză sau a privit.'),
  ('s35-2-3-z6-resurse', ARRAY['frunză afară']::text[], ARRAY['Frunza rămâne afară — nu o aduceți în casă.','„Frunză. Afară.”']::text[], 'A lăsat frunza afară sau a privit.'),
  ('s36-2-3-z2-mental', '{}'::text[], ARRAY['Arătați pe frunză: „Pe frunză.”','Privire scurtă, fără atingere dacă e insectă.']::text[], 'A auzit pe frunză.'),
  ('s36-2-3-z6-mental', '{}'::text[], ARRAY['Arătați pământul: „Pământ.”','Arătați o frunză: „Frunză.” pe scurt.']::text[], 'A auzit pământ și frunză.'),
  ('s38-2-3-z4-resurse', ARRAY['pantofi']::text[], ARRAY['După pași: pantofii lângă ușă.','„Pantofi. Gata.”']::text[], 'A ajutat cu pantofii sau a privit.'),
  ('s38-2-3-z7-fizic', ARRAY['pantofi']::text[], ARRAY['Câțiva pași desculți pe iarbă, cu adult.','Apoi pantofii: „Pantofi.”']::text[], 'A mers desculț pe scurt, apoi pantofi.'),
  ('s40-2-3-z1-fizic', ARRAY['mătură de copil']::text[], ARRAY['Țineți mătura pe scurt, cu adult.','„Mătură.” 10–20 de secunde.']::text[], 'A ținut mătura sau a atins-o.'),
  ('s40-2-3-z1-resurse', ARRAY['mătură de copil']::text[], ARRAY['Puneți mătura lângă ușă sau la locul ei.','„Mătură. Aici.”']::text[], 'A ajutat să pună mătura.'),
  ('s40-2-3-z1-social', ARRAY['mătură de copil']::text[], ARRAY['Țineți mătura împreună pe scurt.','„Împreună. Mătură.” fără forțare.']::text[], 'A ținut mătura cu adultul sau a privit.'),
  ('s40-2-3-z4-fizic', ARRAY['haină','cuier']::text[], ARRAY['Puneți haina pe cuier, cu adult.','„Haină. Cuier.” pe scurt.']::text[], 'A ajutat cu haina pe cuier.'),
  ('s40-2-3-z4-mental', ARRAY['haină']::text[], ARRAY['Întrebați: „Unde e haina?”','Arătați: „Aici. La loc.”']::text[], 'A auzit unde și aici.'),
  ('s40-2-3-z4-social', ARRAY['haină','cuier']::text[], ARRAY['Puneți haina pe cuier împreună.','„Împreună. Haină.” fără forțare.']::text[], 'A ajutat cu haina sau a privit.'),
  ('s40-2-3-z5-fizic', ARRAY['mătură de copil']::text[], ARRAY['Măturați pe scurt trei fire / o zonă mică.','„Mătură. Trei.”']::text[], 'A măturat pe scurt sau a privit.'),
  ('s40-2-3-z5-social', ARRAY['mătură de copil']::text[], ARRAY['Voi măturați. „Acum tu.”','Așteptați fără forțare.']::text[], 'A măturat pe rând sau a privit.'),
  ('s40-2-3-z6-resurse', ARRAY['mătură de copil']::text[], ARRAY['Puneți mătura la loc.','„Mătură. Gata.”']::text[], 'A ajutat să pună mătura la loc.'),
  ('s40-2-3-z7-resurse', ARRAY['mătură de copil','cârpă']::text[], ARRAY['Mătura și cârpa la loc.','„La loc. Gata.”']::text[], 'A ajutat cu mătura sau cârpa.'),
  ('s42-2-3-z6-resurse', ARRAY['găleată']::text[], ARRAY['După frunze: găleata pe treaptă sau în casă.','„Găleată. La loc.”']::text[], 'A ajutat să pună găleata.'),
  ('s45-2-3-z2-resurse', ARRAY['pantofi']::text[], ARRAY['Pantofii lângă ușă.','„Pantofi. La ușă.”']::text[], 'A ajutat cu pantofii.'),
  ('s45-2-3-z4-resurse', ARRAY['pantofi']::text[], ARRAY['După curte: pantofii la loc.','„Pantofi. Gata.”']::text[], 'A ajutat cu pantofii după curte.')
) as v(id, materiale, pasi, gata_cand)
where a.id = v.id;
