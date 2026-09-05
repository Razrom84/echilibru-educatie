import type { Activity, Pillar } from "@/lib/types";

/**
 * PLACEHOLDER seed — Week 1, age band 2–3.
 * Cristina replaces `title` + `body` with final RO copy.
 * Keep week_number, day_of_week, pillar, age_band stable.
 */
type SeedRow = {
  day_of_week: number;
  pillar: Pillar;
  title: string;
  body: string;
};

export const WEEK1_PLACEHOLDER_ROWS: SeedRow[] = [
  {
    day_of_week: 1,
    pillar: "fizic",
    title: "Picioare goale pe iarbă",
    body: "Ieșiți în curte sau pe balcon. Copilul merge desculț pe iarbă, pământ sau covor aspru. Spuneți: rece, cald, moale.",
  },
  {
    day_of_week: 1,
    pillar: "mental",
    title: "Trei nume din curte",
    body: "Arătați și numiți împreună: pom, piatră, frunză. Copilul repetă după voi.",
  },
  {
    day_of_week: 1,
    pillar: "resurse",
    title: "Rufele în coș",
    body: "Adunați 4–5 haine de pe scaun sau pat. Copilul le duce, una câte una, în coș.",
  },
  {
    day_of_week: 1,
    pillar: "social",
    title: "Bună ziua la poartă",
    body: "Când ieșiți, opriți-vă la ușă sau poartă. Spuneți împreună «bună ziua» — chiar dacă e doar vântul.",
  },
  {
    day_of_week: 2,
    pillar: "fizic",
    title: "Minge în iarbă",
    body: "Rulați o minge spre copil, apoi spre un pom sau un perete. Fără țintă, doar alergare scurtă.",
  },
  {
    day_of_week: 2,
    pillar: "mental",
    title: "O carte, o pagină",
    body: "Stați jos. Deschideți o carte cu poze. Numiți ce vedeți pe o singură pagină.",
  },
  {
    day_of_week: 2,
    pillar: "resurse",
    title: "Udăm planta",
    body: "Umpleți o cană mică. Copilul toarnă încet la rădăcina unei plante.",
  },
  {
    day_of_week: 2,
    pillar: "social",
    title: "Împărțim o gustare",
    body: "Tăiați un măr sau o felie de pâine în două. Oferiți jumătate: «pentru tine, pentru mine».",
  },
  {
    day_of_week: 3,
    pillar: "fizic",
    title: "Trepte de mână",
    body: "Urcați și coborâți 3–4 trepte ținându-vă de mână. Numărați fiecare pas.",
  },
  {
    day_of_week: 3,
    pillar: "mental",
    title: "Rotund și lung",
    body: "Căutați în casă sau curte un lucru rotund și unul lung. Puneți-le unul lângă altul.",
  },
  {
    day_of_week: 3,
    pillar: "resurse",
    title: "Ștergem masa",
    body: "O cârpă umedă, masa după masă. Copilul șterge cât ajunge mâna lui.",
  },
  {
    day_of_week: 3,
    pillar: "social",
    title: "Un salut de departe",
    body: "Sunați un bunic sau ieșiți la gard. Copilul face cu mâna. Voi spuneți numele persoanei.",
  },
  {
    day_of_week: 4,
    pillar: "fizic",
    title: "Pietricele în găleată",
    body: "Strângeți pietricele sau conuri. Copilul le pune în găleată și o duce doi pași.",
  },
  {
    day_of_week: 4,
    pillar: "mental",
    title: "Cerul și iarba",
    body: "Ieșiți. Întrebați: ce culoare are cerul? Dar iarba? Așteptați răspunsul, nu-l corectați.",
  },
  {
    day_of_week: 4,
    pillar: "resurse",
    title: "Lingurile la loc",
    body: "După masă, copilul duce lingurile la sertar sau în chiuvetă. Una, două, gata.",
  },
  {
    day_of_week: 4,
    pillar: "social",
    title: "Mulțumesc după masă",
    body: "Când se ridică, spuneți împreună «mulțumesc». Privire, nu lecție.",
  },
  {
    day_of_week: 5,
    pillar: "fizic",
    title: "Un cântec, doi pași",
    body: "Puneți un cântec scurt. Bateți din palme și faceți doi pași în stânga, doi în dreapta.",
  },
  {
    day_of_week: 5,
    pillar: "mental",
    title: "Ascultăm afară",
    body: "Un minut pe prag. Ce se aude? Pasăre, mașină, vânt. Numiți un singur sunet.",
  },
  {
    day_of_week: 5,
    pillar: "resurse",
    title: "Hainele de mâine",
    body: "Alegeți împreună bluză și pantaloni. Copilul îi pune pe scaun.",
  },
  {
    day_of_week: 5,
    pillar: "social",
    title: "Un dar mic",
    body: "O frunză, o piatră sau un desen. Copilul îl dă cuiva din casă.",
  },
  {
    day_of_week: 6,
    pillar: "fizic",
    title: "Cărăm apa",
    body: "O sticlă mică sau stropitoare. De la chiuvetă până la plantă sau găleată.",
  },
  {
    day_of_week: 6,
    pillar: "mental",
    title: "Până la trei",
    body: "Trei mere, trei pietre sau trei linguri. Numărați cu degetul: unu, doi, trei.",
  },
  {
    day_of_week: 6,
    pillar: "resurse",
    title: "Farfuriile la chiuvetă",
    body: "Copilul duce propria farfurie. Voi primiți. Fără grabă.",
  },
  {
    day_of_week: 6,
    pillar: "social",
    title: "Vino cu mine",
    body: "Trei opriri: masă, fereastră, ușă. Copilul vă conduce de mână.",
  },
  {
    day_of_week: 7,
    pillar: "fizic",
    title: "Pisică și broască",
    body: "Întindeți-vă încet ca o pisică. Apoi trei sărituri scurte ca o broască.",
  },
  {
    day_of_week: 7,
    pillar: "mental",
    title: "Ce-am văzut afară",
    body: "La masă sau pe prag, spuneți un lucru văzut azi. Copilul adaugă altul, dacă vrea.",
  },
  {
    day_of_week: 7,
    pillar: "resurse",
    title: "Jucăriile în cutie",
    body: "Cinci lucruri înapoi în cutie. Când e plină, închideți capacul împreună.",
  },
  {
    day_of_week: 7,
    pillar: "social",
    title: "O îmbrățișare lungă",
    body: "Stați jos. O îmbrățișare până la trei. Spuneți «te iubesc».",
  },
];

export function demoActivityId(dayOfWeek: number, pillar: Pillar): string {
  return `seed-w1-d${dayOfWeek}-${pillar}`;
}

export function getWeek1Activities(): Activity[] {
  return WEEK1_PLACEHOLDER_ROWS.map((row) => ({
    id: demoActivityId(row.day_of_week, row.pillar),
    week_number: 1,
    day_of_week: row.day_of_week,
    pillar: row.pillar,
    title: row.title,
    body: row.body,
    age_band: "2-3",
    is_placeholder: true,
  }));
}
