-- Gifted S1–S4 (banda 2–3): retușuri de limbă din QA (NIT 8). Doar 3 câmpuri text.
-- Idempotent: replace() nu schimbă nimic dacă textul e deja corectat. Nu atinge copii, bife, note sau poze.
update public.activities
   set siguranta = replace(siguranta, 'la un braț distanță', 'la o lungime de braț')
 where id = 's1-b23-z1-fizic' and banda = '2-3' and siguranta like '%la un braț distanță%';

update public.activities
   set provocare = replace(provocare, 'Ce ne-a ajutat să fim repede?', 'Ce ne-a ajutat să terminăm repede?')
 where id = 's1-b23-z3-resurse' and banda = '2-3' and provocare like '%să fim repede?%';

update public.activities
   set gata_cand = replace(gata_cand, 'înainte de stins lumina', 'înainte de a stinge lumina')
 where id = 's3-b23-z7-resurse' and banda = '2-3' and gata_cand like '%înainte de stins lumina%';
