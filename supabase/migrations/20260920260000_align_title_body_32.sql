-- Lock B: align materiale/pasi/gata_cand for 32 banda 1–2 residual ids (title↔body).
-- KEEP titlu + tema_saptamana. 3× P0 S40 leftovers + 27× P1 + 2× P2 ghiveci soft.
-- Do not apply to Familie/production from this PR; Cristina QA pe preview.
update public.activities as a
set
  materiale = v.materiale,
  pasi = v.pasi,
  gata_cand = v.gata_cand
from (values
  ('s14-2-3-z7-resurse', ARRAY['pantofi', 'haină']::text[], ARRAY['Puneți pantofii și haina la loc.', '„La loc. Gata.”']::text[], 'A ajutat cu pantofii sau haina.'),
  ('s21-2-3-z5-resurse', ARRAY['floare pe pervaz']::text[], ARRAY['Luați floarea pe scurt.', 'Puneți-o la loc: „Floare. Pervaz.”']::text[], 'A ajutat cu floarea pe pervaz.'),
  ('s23-2-3-z5-resurse', ARRAY['lingură']::text[], ARRAY['Puneți lingura la chiuvetă.', '„Lingură. La loc.”']::text[], 'A ajutat cu lingura.'),
  ('s23-2-3-z6-fizic', ARRAY['floare (sau plantă cu floare)']::text[], ARRAY['Mirosiți pe scurt o floare, cu adult.', '„Floare. Miros.”']::text[], 'A mirosit sau a privit floarea.'),
  ('s23-2-3-z6-resurse', ARRAY['floare afară']::text[], ARRAY['Floarea rămâne afară — nu o aduceți în casă.', '„Floare. Afară.”']::text[], 'A lăsat floarea afară sau a privit.'),
  ('s24-2-3-z5-resurse', ARRAY['haină', 'cuier']::text[], ARRAY['Puneți haina oaspetelui pe cuier.', '„Haină. Cuier.”']::text[], 'A ajutat cu haina pe cuier.'),
  ('s24-2-3-z6-resurse', ARRAY['haină', 'cuier']::text[], ARRAY['După vizită: haina pe cuier.', '„Haină. La loc.”']::text[], 'A ajutat cu haina după vizită.'),
  ('s27-2-3-z4-resurse', ARRAY['cârpă de geam']::text[], ARRAY['Puneți cârpa de geam la loc.', '„Cârpă. La loc.”']::text[], 'A ajutat cu cârpa.'),
  ('s27-2-3-z5-fizic', ARRAY['haină de ploaie']::text[], ARRAY['Puneți haina de ploaie pe umeri pe scurt, cu adult.', '„Haină.” 10–20 de secunde.']::text[], 'A purtat haina pe scurt sau a privit.'),
  ('s27-2-3-z5-mental', ARRAY['haină de ploaie']::text[], ARRAY['Arătați haina: „Haină.”', 'Arătați fără: „Fără.” pe scurt.']::text[], 'A auzit haină și fără.'),
  ('s27-2-3-z5-resurse', ARRAY['haină']::text[], ARRAY['Puneți haina pe cârlig.', '„Haină. La loc.”']::text[], 'A ajutat să pună haina.'),
  ('s27-2-3-z5-social', ARRAY['haină']::text[], ARRAY['Voi țineți haina. „Acum tu.”', 'Așteptați fără forțare.']::text[], 'A ajutat la haină sau a privit.'),
  ('s27-2-3-z7-resurse', ARRAY['haină', 'carte']::text[], ARRAY['Puneți haina pe cârlig, cartea pe raft.', '„La loc.”']::text[], 'A ajutat cu haina sau cartea.'),
  ('s28-2-3-z3-resurse', ARRAY['cârpă', 'cizme']::text[], ARRAY['Ștergeți pe scurt cizma cu cârpa.', '„Cârpă. La loc.”']::text[], 'A ajutat cu cârpa sau a privit.'),
  ('s28-2-3-z5-resurse', ARRAY['prosop']::text[], ARRAY['Puneți prosopul la loc după șters.', '„Prosop. La loc.”']::text[], 'A ajutat cu prosopul.'),
  ('s28-2-3-z7-resurse', ARRAY['cizme', 'haină']::text[], ARRAY['Puneți cizmele lângă ușă, haina pe cârlig.', '„La loc. Gata.”']::text[], 'A ajutat cu cizmele sau haina.'),
  ('s29-2-3-z1-fizic', ARRAY['mugure pe plantă']::text[], ARRAY['Atingeți pe scurt un mugure, cu adult.', '„Mugure.” 10–20 de secunde.']::text[], 'A atins mugurele sau a privit.'),
  ('s29-2-3-z1-social', ARRAY['mugure pe plantă']::text[], ARRAY['Arătați mugurele împreună.', '„Împreună. Mugure.” fără grabă.']::text[], 'A privit mugurele cu adultul.'),
  ('s29-2-3-z5-fizic', ARRAY['mugure pe plantă']::text[], ARRAY['Aplecați-vă pe scurt spre mugure, cu adult.', '„Mugure.”']::text[], 'A privit mugurele de aproape.'),
  ('s31-2-3-z3-fizic', ARRAY['ghiveci']::text[], ARRAY['Stați lângă ghiveci pe scurt.', '„Ghiveci.” 10–20 de secunde.']::text[], 'A stat lângă ghiveci sau a privit.'),
  ('s31-2-3-z3-resurse', ARRAY['ghiveci']::text[], ARRAY['Puneți ghiveciul pe pervaz.', '„Ghiveci. Pervaz.”']::text[], 'A ajutat cu ghiveciul.'),
  ('s31-2-3-z3-social', ARRAY['ghiveci']::text[], ARRAY['Priviti ghiveciul împreună pe scurt.', '„Împreună. Ghiveci.”']::text[], 'A privit ghiveciul cu adultul.'),
  ('s31-2-3-z7-fizic', ARRAY['ghiveci']::text[], ARRAY['Mergeți pe scurt până la ghiveci, cu adult.', '„Ghiveci.” la final.']::text[], 'A ajuns la ghiveci sau a privit.'),
  ('s33-2-3-z6-resurse', ARRAY['prosop']::text[], ARRAY['Ștergeți mâinile pe prosop pe scurt.', '„Prosop. La loc.”']::text[], 'A atins prosopul sau a privit.'),
  ('s35-2-3-z1-resurse', ARRAY['prosop']::text[], ARRAY['Prosopul afară pe scurt, apoi la loc.', '„Prosop. La loc.”']::text[], 'A ajutat cu prosopul.'),
  ('s35-2-3-z7-resurse', ARRAY['pahar', 'prosop']::text[], ARRAY['Puneți paharul și prosopul la loc.', '„La loc. Gata.”']::text[], 'A ajutat cu paharul sau prosopul.'),
  ('s37-2-3-z5-resurse', ARRAY['haină']::text[], ARRAY['Puneți haina pe braț la umbră pe scurt.', '„Haină. Umbră.”']::text[], 'A ținut haina sau a privit.'),
  ('s39-2-3-z5-resurse', ARRAY['șervețel']::text[], ARRAY['După gust: șervețelul la loc.', '„Șervețel. La loc.”']::text[], 'A ajutat cu șervețelul.'),
  ('s40-2-3-z4-resurse', ARRAY['cuier']::text[], ARRAY['Arătați: cuierul e gata.', '„Cuier. Gata.”']::text[], 'A privit cuierul sau a arătat.'),
  ('s40-2-3-z5-mental', ARRAY['făraș', 'mătură de copil']::text[], ARRAY['Arătați: „Jos.”', '„În făraș.” pe scurt.']::text[], 'A auzit jos și făraș.'),
  ('s40-2-3-z5-resurse', ARRAY['făraș']::text[], ARRAY['Goliți fărașul pe scurt, apoi la loc.', '„Făraș. La loc.”']::text[], 'A ajutat cu fărașul.'),
  ('s45-2-3-z6-resurse', ARRAY['haină']::text[], ARRAY['După plimbare: haina pe cârlig sau cuier.', '„Haină. La loc.”']::text[], 'A ajutat cu haina.')
) as v(id, materiale, pasi, gata_cand)
where a.id = v.id;
