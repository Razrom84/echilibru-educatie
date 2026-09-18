-- MannyQ + Răzvan lock: S4 V Fizic is a gentle hand slide on the pillow
-- (not whole-body crawl). Only s4-2-3-z5-fizic. Other S4 titles unchanged.
update public.activities
set
  titlu = 'Alunecăm cu mâna ușor pe pernă.',
  pasi = ARRAY[
    'Pune mâna pe pernă.',
    'Alunecă ușor mâna pe pernă.',
    'Scurt — gata.'
  ]::text[],
  gata_cand = 'A alunecat mâna pe pernă.',
  nota = 'Vârsta 1–2: doar mâna, blând; el poate refuza.'
where id = 's4-2-3-z5-fizic';
