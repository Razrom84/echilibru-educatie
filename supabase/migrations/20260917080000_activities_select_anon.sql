-- Shared curriculum catalog: demo preview (no auth session) must be able to
-- read `activities` by `banda`, including live `2-3` rows (`sN-b23-z…`).
-- Writes stay authenticated-only via existing policies (none for insert/update).

drop policy if exists activities_select_anon on public.activities;
create policy activities_select_anon
  on public.activities
  for select
  to anon
  using (true);
