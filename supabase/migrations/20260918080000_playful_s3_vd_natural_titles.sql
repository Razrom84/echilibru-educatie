-- PLAYFUL PILOT copy cleanup: natural RO invitation titles for S3 V–D only.
-- Ritual (Hai la sunete. Gata? / Sunete gata. Bravo.) and S4 stay unchanged.
update public.activities as a
set titlu = v.titlu
from (values
  ('s3-2-3-z5-fizic', 'Mergem pe vârfuri, încet.'),
  ('s3-2-3-z5-mental', 'Ascultăm trei sunete din casă.'),
  ('s3-2-3-z5-resurse', 'Telefonul pe silențios.'),
  ('s3-2-3-z5-social', 'Spunem „Bună” cu vocea.'),
  ('s3-2-3-z6-fizic', 'Ieșim afară. Auzi pașii?'),
  ('s3-2-3-z6-mental', 'Se aude vântul?'),
  ('s3-2-3-z6-resurse', 'Ținem o piatră. Liniște.'),
  ('s3-2-3-z6-social', 'Îți spun ce auzi tu.'),
  ('s3-2-3-z7-fizic', 'Plimbare liberă.'),
  ('s3-2-3-z7-mental', 'Cartea, liniștit.'),
  ('s3-2-3-z7-resurse', 'Stingem lumina încet.'),
  ('s3-2-3-z7-social', 'Noapte bună, șoptit.')
) as v(id, titlu)
where a.id = v.id;
