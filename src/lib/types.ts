export type Pillar = "fizic" | "mental" | "resurse" | "social";
export type CompletionMode = "A" | "B";
export type AgeBand = "2-3";

export type Family = {
  id: string;
  parent_id: string;
  display_name: string | null;
  default_mode: CompletionMode;
  created_at: string;
  /** When the family joined the program (timestamptz). Ready after R1 migration. */
  joined_at?: string | null;
  /** Monday (YYYY-MM-DD) of the program year in force at join. */
  program_year_start?: string | null;
};

export type Child = {
  id: string;
  family_id: string;
  name: string;
  birthdate: string | null;
  age_band: string;
  active: boolean;
  created_at: string;
  /** Secret ICS subscribe token. Null until the parent copies the feed URL. */
  calendar_token?: string | null;
};

export type SeedActivity = {
  id: string;
  banda: string;
  saptamana: number;
  zi: number;
  zi_nume?: string;
  pilon: Pillar;
  titlu: string;
  durata_min: number;
  mod_default: CompletionMode;
  materiale: string[];
  pasi: string[];
  gata_cand: string;
  tema_saptamana: string;
  nota?: string | null;
};

export type Activity = SeedActivity & {
  week_number: number;
  day_of_week: number;
  pillar: Pillar;
  title: string;
  body: string;
  age_band: string;
  is_placeholder: boolean;
};

export type Completion = {
  id: string;
  child_id: string;
  activity_id: string;
  completed_at: string;
  mode: CompletionMode;
  parent_approved: boolean | null;
};

export type ActivityWithCompletion = Activity & {
  completion: Completion | null;
};
