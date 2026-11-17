-- Revenire pentru 20261117120000_stoc_materiale.sql. NU se rulează automat.
-- Șterge stocul familiei (tabele + bucket). Rulați doar dacă stocul e încă gol sau după export.
begin;
-- Familie are triggerul protect_buckets_delete pe storage.buckets; fără asta, rollback-ul cade.
set local storage.allow_delete_query = 'true';
drop policy if exists stoc_familie_select_own on storage.objects;
drop policy if exists stoc_familie_insert_own on storage.objects;
drop policy if exists stoc_familie_update_own on storage.objects;
drop policy if exists stoc_familie_delete_own on storage.objects;
-- Bucketul se golește din dashboard înainte (Storage API); aici se șterge doar dacă e gol.
delete from storage.buckets b where b.id = 'stoc-familie'
  and not exists (select 1 from storage.objects o where o.bucket_id = 'stoc-familie');
drop table if exists public.stoc_folosiri;
drop table if exists public.stoc_materiale;
drop function if exists public.stoc_materiale_touch();
drop index if exists public.materiale_produs_cheie_idx;
alter table public.materiale drop column if exists produs_cheie;
commit;
