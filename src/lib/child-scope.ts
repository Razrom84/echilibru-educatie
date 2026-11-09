/**
 * Bife, note, fotografii și statusuri țin de copil.
 * Rândurile vechi fără copil ajung la copilul activ, dacă e singurul.
 * Dacă sunt mai mulți copii, ajung la primul, iar apelantul scrie în jurnal.
 */

export type ScopeChild = {
  id: string;
  name?: string | null;
  active?: boolean | null;
  created_at?: string | null;
};

export type ChildScopeKind = "bife" | "note" | "zile" | "fotografii";

type WithChildId = {
  child_id?: string | null;
  childId?: string | null;
};

const SCOPE_SUBJECT: Record<ChildScopeKind, string> = {
  bife: "Bifele vechi, fără copil,",
  note: "Notele vechi, fără copil,",
  zile: "Zilele de arhivă vechi, fără copil,",
  fotografii: "Fotografiile vechi, fără copil,",
};

export function childScopeNotice(args: {
  kind: ChildScopeKind;
  childName: string;
  severalChildren: boolean;
  count: number;
}): string | null {
  if (args.count <= 0) return null;
  const subject = SCOPE_SUBJECT[args.kind];
  const name = args.childName.trim() || "copilul din familie";
  if (!args.severalChildren) {
    return `${subject} au fost puse la ${name}.`;
  }
  return `${subject} au fost puse la primul copil, ${name}. În familie sunt mai mulți copii; verifică dacă acolo le vrei.`;
}

/** Copilul care primește rândurile vechi: singurul activ, sau primul dintre mai mulți. */
export function childForUnscopedRows(children: readonly ScopeChild[]): {
  child: ScopeChild | null;
  several: boolean;
} {
  const withId = children.filter((child) => child.id.trim().length > 0);
  const active = withId.filter((child) => child.active !== false);
  const pool = active.length > 0 ? active : withId;
  if (pool.length === 0) return { child: null, several: false };
  const sorted = [...pool].sort((a, b) => {
    const ac = a.created_at ?? "";
    const bc = b.created_at ?? "";
    if (!ac && !bc) return a.id.localeCompare(b.id);
    if (!ac) return 1;
    if (!bc) return -1;
    return ac.localeCompare(bc) || a.id.localeCompare(b.id);
  });
  return { child: sorted[0] ?? null, several: pool.length > 1 };
}

export function normalizeChildId(row: WithChildId): string | null {
  const raw = row.child_id ?? row.childId ?? null;
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  return id.length > 0 ? id : null;
}

export function attributeMissingChildId<T extends WithChildId>(
  rows: readonly T[],
  childId: string | null,
): { rows: T[]; assigned: number; normalized: boolean } {
  let assigned = 0;
  let normalized = false;
  const next = rows.map((row) => {
    const existing = normalizeChildId(row);
    if (existing) {
      const alias = "childId" in row && row.childId != null;
      if (!alias && row.child_id === existing) return row;
      normalized = true;
      const copy = { ...row, child_id: existing } as T & { childId?: string };
      delete copy.childId;
      return copy as T;
    }
    if (!childId) return row;
    assigned += 1;
    const copy = { ...row, child_id: childId } as T & { childId?: string };
    delete copy.childId;
    return copy as T;
  });
  return { rows: next, assigned, normalized };
}

export function completionsForChild<T extends { child_id?: string | null }>(
  rows: readonly T[],
  childId: string | null | undefined,
): T[] {
  if (!childId) return [];
  return rows.filter((row) => row.child_id === childId);
}

export function completionForActivity<
  T extends { child_id?: string | null; activity_id: string },
>(
  rows: readonly T[],
  childId: string | null | undefined,
  activityId: string,
): T | null {
  if (!childId) return null;
  return (
    rows.find((row) => row.child_id === childId && row.activity_id === activityId) ??
    null
  );
}

export function scopeFamilyRecords<
  C extends WithChildId,
  N extends WithChildId,
>(
  children: readonly ScopeChild[],
  records: { completions: readonly C[]; notes: readonly N[] },
): { completions: C[]; notes: N[]; notices: string[] } {
  const { child, several } = childForUnscopedRows(children);
  const name = child?.name?.trim() || "copilul din familie";
  const completions = attributeMissingChildId(records.completions, child?.id ?? null);
  const notes = attributeMissingChildId(records.notes, child?.id ?? null);
  const notices = [
    childScopeNotice({
      kind: "bife",
      childName: name,
      severalChildren: several,
      count: completions.assigned,
    }),
    childScopeNotice({
      kind: "note",
      childName: name,
      severalChildren: several,
      count: notes.assigned,
    }),
  ].filter((line): line is string => Boolean(line));
  return { completions: completions.rows, notes: notes.rows, notices };
}
