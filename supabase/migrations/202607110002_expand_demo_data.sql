-- Amplia a base demonstrativa com alunos, históricos, ações e compromissos.
-- IDs fixos e ON CONFLICT tornam esta carga segura para reexecução.

insert into public.students (
  id, name, masked_cpf, school_year, class_group, shift, attendance,
  grade_average, month_absences, disengaged, needs_to_work,
  transport_issue, family_support, follow_up_status,
  attendance_trend, grade_trend
) values
('10000000-0000-4000-8000-000000000013','Alana Abril','517.***.***-13','1º Ano','A','Matutino',94,8.7,1,false,false,false,true,'Concluído',array[88,90,92,94],array[7.8,8.1,8.4,8.7]),
('10000000-0000-4000-8000-000000000014','David Roberto','263.***.***-14','2º Ano','B','Vespertino',71,5.6,10,true,false,true,true,'Acompanhamento',array[84,80,76,71],array[6.7,6.3,5.9,5.6]),
('10000000-0000-4000-8000-000000000015','Gabriel Cândido','804.***.***-15','3º Ano','A','Matutino',82,7.4,4,false,false,false,true,'Acompanhamento',array[76,78,80,82],array[6.2,6.7,7.1,7.4]),
('10000000-0000-4000-8000-000000000016','Marco Antonio','391.***.***-16','3º Ano','C','Noturno',66,4.9,13,true,true,false,false,'Pendente',array[79,75,70,66],array[6.0,5.7,5.2,4.9]),
('10000000-0000-4000-8000-000000000017','Luísa Garra','675.***.***-17','2º Ano','A','Vespertino',89,8.2,2,false,false,false,true,'Concluído',array[83,85,87,89],array[7.3,7.6,7.9,8.2]),
('10000000-0000-4000-8000-000000000018','Helena Vitória','142.***.***-18','1º Ano','B','Matutino',77,6.4,6,true,false,false,true,'Acompanhamento',array[81,79,78,77],array[6.8,6.6,6.5,6.4]),
('10000000-0000-4000-8000-000000000019','Pedro Henrique','936.***.***-19','2º Ano','C','Noturno',91,7.9,2,false,true,false,true,'Concluído',array[86,88,89,91],array[7.1,7.4,7.7,7.9]),
('10000000-0000-4000-8000-000000000020','Yasmin Santos','480.***.***-20','1º Ano','C','Vespertino',74,5.7,9,true,false,true,false,'Pendente',array[82,79,76,74],array[6.4,6.1,5.9,5.7]),
('10000000-0000-4000-8000-000000000021','Enzo Pereira','728.***.***-21','3º Ano','B','Matutino',86,6.9,3,false,false,false,true,'Acompanhamento',array[80,82,84,86],array[6.1,6.4,6.7,6.9]),
('10000000-0000-4000-8000-000000000022','Beatriz Nunes','354.***.***-22','2º Ano','B','Vespertino',69,6.0,11,false,false,true,true,'Pendente',array[80,76,72,69],array[6.6,6.4,6.2,6.0]),
('10000000-0000-4000-8000-000000000023','Caio Vinícius','619.***.***-23','1º Ano','A','Matutino',96,9.1,0,false,false,false,true,'Concluído',array[91,93,95,96],array[8.2,8.5,8.8,9.1]),
('10000000-0000-4000-8000-000000000024','Júlia Menezes','207.***.***-24','3º Ano','C','Noturno',79,7.0,5,false,true,false,true,'Acompanhamento',array[73,75,77,79],array[6.2,6.5,6.8,7.0]),
('10000000-0000-4000-8000-000000000025','Samuel Rocha','861.***.***-25','2º Ano','A','Matutino',72,5.2,10,true,false,false,false,'Pendente',array[85,81,77,72],array[6.3,5.9,5.5,5.2]),
('10000000-0000-4000-8000-000000000026','Larissa Freitas','493.***.***-26','1º Ano','B','Vespertino',87,7.7,3,false,false,false,true,'Concluído',array[82,83,85,87],array[7.0,7.2,7.5,7.7]),
('10000000-0000-4000-8000-000000000027','Nicolas Teixeira','750.***.***-27','3º Ano','A','Noturno',76,5.9,7,true,true,false,true,'Acompanhamento',array[83,80,78,76],array[6.6,6.3,6.1,5.9])
on conflict (id) do update set
  name = excluded.name,
  masked_cpf = excluded.masked_cpf,
  school_year = excluded.school_year,
  class_group = excluded.class_group,
  shift = excluded.shift,
  attendance = excluded.attendance,
  grade_average = excluded.grade_average,
  month_absences = excluded.month_absences,
  disengaged = excluded.disengaged,
  needs_to_work = excluded.needs_to_work,
  transport_issue = excluded.transport_issue,
  family_support = excluded.family_support,
  follow_up_status = excluded.follow_up_status,
  attendance_trend = excluded.attendance_trend,
  grade_trend = excluded.grade_trend;

insert into public.pedagogical_actions (
  id, student_id, action_type, title, responsible, action_date,
  status, description, tags, created_by
) values
('20000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000013','conversa','Acompanhamento de desempenho','Prof. Camila',current_date - 8,'Concluída','Alana apresentou evolução consistente nas avaliações e boa participação em sala.',array['Evolução positiva','Participação alta'],null),
('20000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000014','contato','Contato com responsável','Mariana Silva (Coord.)',current_date - 3,'Pendente','Conversar sobre faltas recentes e dificuldade de transporte relatada pelo estudante.',array['Frequência','Transporte'],null),
('20000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000015','reforco','Monitoria de Matemática','Prof. Roberto',current_date - 12,'Em andamento','Gabriel iniciou monitoria e apresentou melhora gradual nas atividades.',array['Matemática','Evolução'],null),
('20000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000016','encaminhamento','Plano integrado de acompanhamento','Núcleo Pedagógico',current_date - 2,'Pendente','Caso prioritário encaminhado para atendimento conjunto com orientação e família.',array['Prioridade','Busca ativa'],null),
('20000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000017','conversa','Devolutiva de desempenho','Prof. Helena',current_date - 6,'Concluída','Luísa manteve frequência e desempenho acima da média da turma.',array['Bom desempenho'],null),
('20000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000018','conversa','Escuta pedagógica','Orientação Escolar',current_date - 4,'Em andamento','Estudante relatou baixa motivação; foram combinadas metas semanais de participação.',array['Engajamento'],null),
('20000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000019','contato','Alinhamento de rotina','Mariana Silva (Coord.)',current_date - 14,'Concluída','Responsável confirmou apoio à rotina de estudos no período noturno.',array['Família'],null),
('20000000-0000-4000-8000-000000000013','10000000-0000-4000-8000-000000000020','encaminhamento','Solicitação de transporte escolar','Assistência Escolar',current_date - 1,'Pendente','Solicitada avaliação de rota para reduzir faltas associadas ao deslocamento.',array['Transporte','Frequência'],null),
('20000000-0000-4000-8000-000000000014','10000000-0000-4000-8000-000000000021','reforco','Oficina de produção textual','Prof. Denise',current_date - 9,'Em andamento','Participação satisfatória e melhora na organização das produções.',array['Língua Portuguesa'],null),
('20000000-0000-4000-8000-000000000015','10000000-0000-4000-8000-000000000022','contato','Reunião sobre frequência','Mariana Silva (Coord.)',current_date - 5,'Pendente','Agendar conversa com a família para tratar da queda de frequência.',array['Frequência'],null),
('20000000-0000-4000-8000-000000000016','10000000-0000-4000-8000-000000000023','conversa','Reconhecimento de desempenho','Direção Escolar',current_date - 7,'Concluída','Caio foi reconhecido pela frequência e pelo desempenho acadêmico.',array['Destaque'],null),
('20000000-0000-4000-8000-000000000017','10000000-0000-4000-8000-000000000024','conversa','Organização da rotina noturna','Orientação Escolar',current_date - 10,'Concluída','Definida rotina conciliando trabalho, descanso e atividades escolares.',array['Rotina'],null),
('20000000-0000-4000-8000-000000000018','10000000-0000-4000-8000-000000000025','reforco','Recuperação de aprendizagem','Prof. Roberto',current_date - 2,'Em andamento','Samuel iniciou plano de recuperação em Matemática e Ciências.',array['Recuperação','Prioridade'],null),
('20000000-0000-4000-8000-000000000019','10000000-0000-4000-8000-000000000026','conversa','Avaliação de progresso','Prof. Camila',current_date - 11,'Concluída','Larissa mantém evolução em frequência e notas.',array['Evolução positiva'],null),
('20000000-0000-4000-8000-000000000020','10000000-0000-4000-8000-000000000027','conversa','Plano de permanência escolar','Orientação Escolar',current_date - 3,'Em andamento','Foram definidas estratégias para reduzir cansaço e melhorar a entrega de atividades.',array['Permanência','Engajamento'],null)
on conflict (id) do update set
  student_id = excluded.student_id,
  action_type = excluded.action_type,
  title = excluded.title,
  responsible = excluded.responsible,
  action_date = excluded.action_date,
  status = excluded.status,
  description = excluded.description,
  tags = excluded.tags;

insert into public.appointments (
  id, student_id, title, description, event_date, event_time,
  appointment_type, priority, responsible, completed, created_by
) values
('30000000-0000-4000-8000-000000000006','10000000-0000-4000-8000-000000000014','Ligação para responsável','Alinhar medidas para recuperar frequência e apoiar o transporte.',current_date + 1,'08:30','ligacao','Alta','Mariana Silva',false,null),
('30000000-0000-4000-8000-000000000007','10000000-0000-4000-8000-000000000016','Reunião de acompanhamento prioritário','Construir plano conjunto de permanência escolar.',current_date + 2,'10:00','reuniao','Alta','Núcleo Pedagógico',false,null),
('30000000-0000-4000-8000-000000000008','10000000-0000-4000-8000-000000000015','Monitoria de Matemática','Revisão dos conteúdos do bimestre.',current_date + 2,'14:30','reforco','Normal','Prof. Roberto',false,null),
('30000000-0000-4000-8000-000000000009','10000000-0000-4000-8000-000000000020','Visita de busca ativa','Verificar condições de deslocamento e rotina familiar.',current_date + 3,'09:00','visita','Alta','Assistência Escolar',false,null),
('30000000-0000-4000-8000-000000000010','10000000-0000-4000-8000-000000000018','Escuta pedagógica','Reavaliar as metas semanais de participação.',current_date + 4,'11:00','outro','Normal','Orientação Escolar',false,null),
('30000000-0000-4000-8000-000000000011','10000000-0000-4000-8000-000000000022','Reunião com a família','Tratar da queda de frequência observada no período.',current_date + 5,'15:30','reuniao','Alta','Mariana Silva',false,null),
('30000000-0000-4000-8000-000000000012','10000000-0000-4000-8000-000000000025','Reforço de Ciências','Atividade dirigida do plano de recuperação.',current_date + 6,'13:30','reforco','Normal','Prof. Helena',false,null),
('30000000-0000-4000-8000-000000000013','10000000-0000-4000-8000-000000000027','Contato de acompanhamento','Verificar adaptação à nova rotina de estudos.',current_date + 7,'18:30','ligacao','Normal','Orientação Escolar',false,null),
('30000000-0000-4000-8000-000000000014','10000000-0000-4000-8000-000000000013','Devolutiva à família','Compartilhar evolução acadêmica e próximos objetivos.',current_date + 8,'09:30','reuniao','Normal','Prof. Camila',false,null),
('30000000-0000-4000-8000-000000000015','10000000-0000-4000-8000-000000000017','Acompanhamento preventivo','Conferir continuidade do bom desempenho.',current_date + 10,'10:30','outro','Normal','Coordenação Pedagógica',false,null)
on conflict (id) do update set
  student_id = excluded.student_id,
  title = excluded.title,
  description = excluded.description,
  event_date = excluded.event_date,
  event_time = excluded.event_time,
  appointment_type = excluded.appointment_type,
  priority = excluded.priority,
  responsible = excluded.responsible,
  completed = excluded.completed;
