create extension if not exists pgcrypto;

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  masked_cpf text not null,
  school_year text not null,
  class_group text not null,
  shift text not null check (shift in ('Matutino', 'Vespertino', 'Noturno')),
  attendance numeric(5,2) not null check (attendance between 0 and 100),
  grade_average numeric(4,2) not null check (grade_average between 0 and 10),
  month_absences integer not null default 0 check (month_absences >= 0),
  disengaged boolean not null default false,
  needs_to_work boolean not null default false,
  transport_issue boolean not null default false,
  family_support boolean not null default true,
  follow_up_status text not null default 'Pendente' check (follow_up_status in ('Pendente', 'Acompanhamento', 'Concluído')),
  attention_score integer not null default 0,
  attention_level text not null default 'Leve' check (attention_level in ('Leve', 'Moderada', 'Prioritária')),
  reasons text[] not null default '{}',
  attendance_trend numeric[] not null default '{}',
  grade_trend numeric[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pedagogical_actions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  action_type text not null check (action_type in ('contato', 'conversa', 'reforco', 'encaminhamento')),
  title text not null,
  responsible text not null,
  action_date date not null default current_date,
  status text not null default 'Pendente' check (status in ('Pendente', 'Em andamento', 'Concluída')),
  description text not null,
  tags text[],
  created_by uuid references auth.users(id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.calculate_student_attention()
returns trigger language plpgsql set search_path = '' as $$
declare
  score integer := 0;
  generated_reasons text[] := '{}';
begin
  if new.attendance < 75 then score := score + 35; generated_reasons := array_append(generated_reasons, 'Frequência abaixo de 75%'); end if;
  if new.month_absences > 8 then score := score + 20; generated_reasons := array_append(generated_reasons, 'Mais de 8 faltas no mês'); end if;
  if new.grade_average < 6 then score := score + 20; generated_reasons := array_append(generated_reasons, 'Média abaixo de 6,0'); end if;
  if new.disengaged then score := score + 15; generated_reasons := array_append(generated_reasons, 'Desmotivação ou baixa participação'); end if;
  if new.needs_to_work then score := score + 15; generated_reasons := array_append(generated_reasons, 'Necessidade de trabalhar'); end if;
  if new.transport_issue then score := score + 10; generated_reasons := array_append(generated_reasons, 'Problemas de transporte'); end if;
  if not new.family_support then score := score + 10; generated_reasons := array_append(generated_reasons, 'Sem acompanhamento familiar registrado'); end if;
  new.attention_score := score;
  new.attention_level := case when score >= 61 then 'Prioritária' when score >= 31 then 'Moderada' else 'Leve' end;
  new.reasons := case when cardinality(generated_reasons) = 0 then array['Acompanhamento preventivo de rotina'] else generated_reasons end;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists students_calculate_attention on public.students;
create trigger students_calculate_attention before insert or update of attendance, grade_average, month_absences, disengaged, needs_to_work, transport_issue, family_support on public.students for each row execute function public.calculate_student_attention();

create index if not exists students_attention_level_idx on public.students(attention_level);
create index if not exists students_class_idx on public.students(school_year, class_group);
create index if not exists actions_student_date_idx on public.pedagogical_actions(student_id, action_date desc);

alter table public.students enable row level security;
alter table public.pedagogical_actions enable row level security;

drop policy if exists "Authenticated staff can read students" on public.students;
create policy "Authenticated staff can read students" on public.students for select to authenticated using (true);
drop policy if exists "Authenticated staff can read actions" on public.pedagogical_actions;
create policy "Authenticated staff can read actions" on public.pedagogical_actions for select to authenticated using (true);
drop policy if exists "Authenticated staff can create actions" on public.pedagogical_actions;
create policy "Authenticated staff can create actions" on public.pedagogical_actions for insert to authenticated with check ((select auth.uid()) = created_by);
drop policy if exists "Action authors can update actions" on public.pedagogical_actions;
create policy "Action authors can update actions" on public.pedagogical_actions for update to authenticated using ((select auth.uid()) = created_by) with check ((select auth.uid()) = created_by);

grant select on public.students to authenticated;
grant select, insert, update on public.pedagogical_actions to authenticated;

insert into public.students (id, name, masked_cpf, school_year, class_group, shift, attendance, grade_average, month_absences, disengaged, needs_to_work, transport_issue, family_support, follow_up_status, attendance_trend) values
('10000000-0000-4000-8000-000000000001','Lucas Andrade','452.***.***-01','2º Ano','B','Matutino',68,5.4,10,true,false,false,true,'Pendente',array[86,82,75,68]),
('10000000-0000-4000-8000-000000000002','Mariana Souza','128.***.***-54','1º Ano','A','Matutino',62,4.8,12,false,true,true,false,'Acompanhamento',array[78,74,69,62]),
('10000000-0000-4000-8000-000000000003','Roberto Martins','832.***.***-12','3º Ano','C','Noturno',75,2.8,9,true,true,false,true,'Acompanhamento',array[88,84,78,75]),
('10000000-0000-4000-8000-000000000004','Ana Beatriz Silva','622.***.***-99','3º Ano','A','Matutino',81,7.2,7,true,false,false,true,'Acompanhamento',array[88,85,83,81]),
('10000000-0000-4000-8000-000000000005','Rafael Lima Santos','341.***.***-28','3º Ano','B','Matutino',92,8.5,1,false,false,false,true,'Concluído',array[87,89,90,92]),
('10000000-0000-4000-8000-000000000006','Mariana Mendes','940.***.***-06','2º Ano','A','Vespertino',78,6.1,4,true,false,true,true,'Acompanhamento',array[84,82,80,78]),
('10000000-0000-4000-8000-000000000007','João Pedro Costa','713.***.***-45','1º Ano','C','Vespertino',88,9.0,2,false,false,false,true,'Concluído',array[84,85,87,88]),
('10000000-0000-4000-8000-000000000008','Camila Oliveira','205.***.***-73','2º Ano','B','Vespertino',73,6.7,9,false,false,true,true,'Pendente',array[82,80,76,73]),
('10000000-0000-4000-8000-000000000009','Gabriel Ferreira','604.***.***-19','1º Ano','B','Matutino',84,5.8,5,true,false,false,true,'Acompanhamento',array[86,85,83,84]),
('10000000-0000-4000-8000-000000000010','Isabela Rocha','458.***.***-91','3º Ano','C','Noturno',70,6.2,11,false,true,true,false,'Pendente',array[81,77,74,70]),
('10000000-0000-4000-8000-000000000011','Thiago Nascimento','117.***.***-30','2º Ano','C','Noturno',86,7.6,3,false,true,false,true,'Acompanhamento',array[82,83,85,86]),
('10000000-0000-4000-8000-000000000012','Sofia Almeida','389.***.***-67','1º Ano','A','Vespertino',95,8.9,0,false,false,false,true,'Concluído',array[91,92,94,95])
on conflict (id) do update set name = excluded.name, attendance = excluded.attendance, grade_average = excluded.grade_average, month_absences = excluded.month_absences, attendance_trend = excluded.attendance_trend;

insert into public.pedagogical_actions (id, student_id, action_type, title, responsible, action_date, status, description, created_by) values
('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001','contato','Contato com responsável','Mariana Silva (Coord.)','2026-06-14','Pendente','Agendada reunião presencial para conversar sobre as faltas recorrentes e as dificuldades de transporte.',null),
('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000001','conversa','Conversa individual','Prof. Roberto','2026-06-10','Concluída','O estudante relatou desmotivação por dificuldades em Matemática e se mostrou receptivo ao apoio extra.',null),
('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001','reforco','Início do reforço escolar','Núcleo Pedagógico','2026-06-05','Em andamento','Início das sessões de reforço em Matemática.',null),
('20000000-0000-4000-8000-000000000004','10000000-0000-4000-8000-000000000002','encaminhamento','Apoio para transporte','Assistência Escolar','2026-06-16','Em andamento','Encaminhamento para avaliação de acesso ao transporte escolar.',null),
('20000000-0000-4000-8000-000000000005','10000000-0000-4000-8000-000000000003','conversa','Plano de recuperação','Prof. Helena','2026-06-18','Pendente','Preparar plano de recuperação para o próximo ciclo.',null)
on conflict (id) do nothing;
