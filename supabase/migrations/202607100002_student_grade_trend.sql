alter table public.students
add column if not exists grade_trend numeric[] not null default '{}';

update public.students set grade_trend = case id
  when '10000000-0000-4000-8000-000000000001' then array[6.0, 5.4]
  when '10000000-0000-4000-8000-000000000002' then array[5.5, 4.8]
  when '10000000-0000-4000-8000-000000000003' then array[4.1, 2.8]
  when '10000000-0000-4000-8000-000000000004' then array[7.5, 7.2]
  when '10000000-0000-4000-8000-000000000005' then array[8.1, 8.5]
  when '10000000-0000-4000-8000-000000000006' then array[6.4, 6.1]
  when '10000000-0000-4000-8000-000000000007' then array[8.7, 9.0]
  when '10000000-0000-4000-8000-000000000008' then array[7.0, 6.7]
  when '10000000-0000-4000-8000-000000000009' then array[6.2, 5.8]
  when '10000000-0000-4000-8000-000000000010' then array[6.5, 6.2]
  when '10000000-0000-4000-8000-000000000011' then array[7.2, 7.6]
  when '10000000-0000-4000-8000-000000000012' then array[8.6, 8.9]
  else case when cardinality(grade_trend) = 0 then array[grade_average] else grade_trend end
end;
