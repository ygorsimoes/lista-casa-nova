grant delete on public.reservations to authenticated;

create policy "admin deletes reservations"
on public.reservations for delete to authenticated
using ((select public.is_admin()));
