export type Pillar = "fizic" | "mental" | "resurse" | "social";
export type CompletionMode = "A" | "B";
export type AgeBand = "2-3";

export type Family = {
  id: string;
  parent_id: string;
  display_name: string | null;
  default_mode: CompletionMode;
  created_at: string;
};

export type Child = {
  id: string;
  family_id: string;
  name: string;
  birthdate: string | null;
  age_band: string;
  active: boolean;
  created_at: string;
};

export type Activity = {
  id: string;
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
