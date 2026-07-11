create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete set null,
  title text not null,
  description text not null default '',
  event_date date not null,
  event_time time not null,
  appointment_type text not null check (appointment_type in ('reuniao', 'visita', 'ligacao', 'reforco', 'outro')),
  priority text not null default 'Normal' check (priority in ('Normal', 'Alta')),
  responsible text not null,
  completed boolean not null default false,
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists appointments_date_time_idx on public.appointments(event_date, event_time);
create index if not exists appointments_student_idx on public.appointments(student_id);

alter table public.appointments enable row level security;

drop policy if exists "Authenticated staff can read appointments" on public.appointments;
create policy "Authenticated staff can read appointments" on public.appointments for select to authenticated using (true);
drop policy if exists "Authenticated staff can create appointments" on public.appointments;
create policy "Authenticated staff can create appointments" on public.appointments for insert to authenticated with check ((select auth.uid()) = created_by);
drop policy if exists "Authenticated staff can update appointments" on public.appointments;
create policy "Authenticated staff can update appointments" on public.appointments for update to authenticated using (true) with check (true);
drop policy if exists "Authenticated staff can delete appointments" on public.appointments;
create policy "Authenticated staff can delete appointments" on public.appointments for delete to authenticated using (true);

grant select, insert, update, delete on public.appointments to authenticated;

insert into public.appointments (id, student_id, title, description, event_date, event_time, appointment_type, priority, responsible, completed, created_by) values
('30000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','Contato com responsável','Alinhar estratégias para melhorar a frequência.',current_date,'09:00','ligacao','Alta','Mariana Silva',false,null),
('30000000-0000-4000-8000-000000000002',null,'Reunião pedagógica - 1º A','Revisar estudantes que precisam de acompanhamento.',current_date + 1,'09:30','reuniao','Normal','Coordenação Pedagógica',false,null),
('30000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000003','Reforço escolar','Acompanhamento específico em Matemática.',current_date + 2,'14:00','reforco','Normal','Prof. Roberto',false,null),
('30000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000002','Visita de acompanhamento','Visita combinada com a família.',current_date + 4,'10:30','visita','Alta','Ana Beatriz',false,null),
('30000000-0000-4000-8000-000000000005',null,'Relatório mensal','Consolidar os indicadores da Busca Ativa.',current_date + 6,'16:00','outro','Normal','Núcleo Pedagógico',false,null)
on conflict (id) do update set event_date = excluded.event_date, event_time = excluded.event_time;
