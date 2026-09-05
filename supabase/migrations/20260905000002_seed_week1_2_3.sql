-- SUPERSEDED by 20260905000003 + content/seed-s1-banda-2-3.json
-- =============================================================================
-- CRISTINA SEED SWAP (historical placeholders — do not use)
-- Replace ONLY `title` and `body` below with the final Romanian copy.
-- Keep week_number, day_of_week, pillar, age_band, is_placeholder shape stable.
-- After the real text lands, set is_placeholder = false for those rows.
-- Canonical placeholder copy also lives in src/lib/seed/week1.ts (demo mode).
-- Style: yard / home, motor, naming, books, real chores. No worksheets.
-- =============================================================================

insert into public.activities
  (week_number, day_of_week, pillar, title, body, age_band, is_placeholder)
values
  (1, 1, 'fizic', 'Picioare goale pe iarbă',
   'Ieșiți în curte sau pe balcon. Copilul merge desculț pe iarbă, pământ sau covor aspru. Spuneți: rece, cald, moale.',
   '2-3', true),
  (1, 1, 'mental', 'Trei nume din curte',
   'Arătați și numiți împreună: pom, piatră, frunză. Copilul repetă după voi.',
   '2-3', true),
  (1, 1, 'resurse', 'Rufele în coș',
   'Adunați 4–5 haine de pe scaun sau pat. Copilul le duce, una câte una, în coș.',
   '2-3', true),
  (1, 1, 'social', 'Bună ziua la poartă',
   'Când ieșiți, opriți-vă la ușă sau poartă. Spuneți împreună «bună ziua» — chiar dacă e doar vântul.',
   '2-3', true),

  (1, 2, 'fizic', 'Minge în iarbă',
   'Rulați o minge spre copil, apoi spre un pom sau un perete. Fără țintă, doar alergare scurtă.',
   '2-3', true),
  (1, 2, 'mental', 'O carte, o pagină',
   'Stați jos. Deschideți o carte cu poze. Numiți ce vedeți pe o singură pagină.',
   '2-3', true),
  (1, 2, 'resurse', 'Udăm planta',
   'Umpleți o cană mică. Copilul toarnă încet la rădăcina unei plante.',
   '2-3', true),
  (1, 2, 'social', 'Împărțim o gustare',
   'Tăiați un măr sau o felie de pâine în două. Oferiți jumătate: «pentru tine, pentru mine».',
   '2-3', true),

  (1, 3, 'fizic', 'Trepte de mână',
   'Urcați și coborâți 3–4 trepte ținându-vă de mână. Numărați fiecare pas.',
   '2-3', true),
  (1, 3, 'mental', 'Rotund și lung',
   'Căutați în casă sau curte un lucru rotund și unul lung. Puneți-le unul lângă altul.',
   '2-3', true),
  (1, 3, 'resurse', 'Ștergem masa',
   'O cârpă umedă, masa după masă. Copilul șterge cât ajunge mâna lui.',
   '2-3', true),
  (1, 3, 'social', 'Un salut de departe',
   'Sunați un bunic sau ieșiți la gard. Copilul face cu mâna. Voi spuneți numele persoanei.',
   '2-3', true),

  (1, 4, 'fizic', 'Pietricele în găleată',
   'Strângeți pietricele sau conuri. Copilul le pune în găleată și o duce doi pași.',
   '2-3', true),
  (1, 4, 'mental', 'Cerul și iarba',
   'Ieșiți. Întrebați: ce culoare are cerul? Dar iarba? Așteptați răspunsul, nu-l corectați.',
   '2-3', true),
  (1, 4, 'resurse', 'Lingurile la loc',
   'După masă, copilul duce lingurile la sertar sau în chiuvetă. Una, două, gata.',
   '2-3', true),
  (1, 4, 'social', 'Mulțumesc după masă',
   'Când se ridică, spuneți împreună «mulțumesc». Privire, nu lecție.',
   '2-3', true),

  (1, 5, 'fizic', 'Un cântec, doi pași',
   'Puneți un cântec scurt. Bateți din palme și faceți doi pași în stânga, doi în dreapta.',
   '2-3', true),
  (1, 5, 'mental', 'Ascultăm afară',
   'Un minut pe prag. Ce se aude? Pasăre, mașină, vânt. Numiți un singur sunet.',
   '2-3', true),
  (1, 5, 'resurse', 'Hainele de mâine',
   'Alegeți împreună bluză și pantaloni. Copilul îi pune pe scaun.',
   '2-3', true),
  (1, 5, 'social', 'Un dar mic',
   'O frunză, o piatră sau un desen. Copilul îl dă cuiva din casă.',
   '2-3', true),

  (1, 6, 'fizic', 'Cărăm apa',
   'O sticlă mică sau stropitoare. De la chiuvetă până la plantă sau găleată.',
   '2-3', true),
  (1, 6, 'mental', 'Până la trei',
   'Trei mere, trei pietre sau trei linguri. Numărați cu degetul: unu, doi, trei.',
   '2-3', true),
  (1, 6, 'resurse', 'Farfuriile la chiuvetă',
   'Copilul duce propria farfurie. Voi primiți. Fără grabă.',
   '2-3', true),
  (1, 6, 'social', 'Vino cu mine',
   'Trei opriri: masă, fereastră, ușă. Copilul vă conduce de mână.',
   '2-3', true),

  (1, 7, 'fizic', 'Pisică și broască',
   'Întindeți-vă încet ca o pisică. Apoi trei sărituri scurte ca o broască.',
   '2-3', true),
  (1, 7, 'mental', 'Ce-am văzut afară',
   'La masă sau pe prag, spuneți un lucru văzut azi. Copilul adaugă altul, dacă vrea.',
   '2-3', true),
  (1, 7, 'resurse', 'Jucăriile în cutie',
   'Cinci lucruri înapoi în cutie. Când e plină, închideți capacul împreună.',
   '2-3', true),
  (1, 7, 'social', 'O îmbrățișare lungă',
   'Stați jos. O îmbrățișare până la trei. Spuneți «te iubesc».',
   '2-3', true);
