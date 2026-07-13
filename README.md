<p align="center">
  <img src="public/img/EduPresenteLogo_nome.png" alt="Logotipo do EduPresente" width="360">
</p>

# EduPresente

O **EduPresente** é um painel preventivo para acompanhamento escolar. A aplicação reúne frequência, desempenho, faltas, fatores de atenção, ações pedagógicas e compromissos para ajudar a equipe escolar a identificar estudantes que precisam de apoio e organizar intervenções de forma rastreável.

O projeto foi desenvolvido com Angular e pode operar com dados locais de demonstração ou integrado ao Supabase para autenticação e persistência em PostgreSQL.

## Principais funcionalidades

- Login com Supabase Auth e proteção das rotas internas.
- Opção **manter conectado**, usando `localStorage` ou `sessionStorage`.
- Dashboard com indicadores, gráficos, estudantes prioritários e compromissos da semana.
- Classificação de estudantes nos níveis **Leve**, **Moderada** e **Prioritária**.
- Busca, filtros combinados, paginação e exportação CSV da lista de estudantes.
- Perfil individual com frequência, médias bimestrais, fatores de atenção e ações recentes.
- Histórico cronológico de intervenções pedagógicas.
- Agenda mensal com reuniões, visitas, ligações, reforços e outros compromissos.
- Cadastro de ações pedagógicas por meio de um modal reutilizável.
- Notificações configuráveis com persistência do estado de leitura.
- Tema escuro, fonte ampliada e redução de animações.
- Exportação dos dados em JSON e restauração das configurações locais.
- Página institucional de privacidade e governança de dados.
- Interface responsiva com navegação adaptada para desktop e dispositivos móveis.

## Como o sistema funciona

O frontend é organizado em páginas, componentes e serviços Angular. As telas não acessam diretamente o banco ou o armazenamento do navegador: elas utilizam serviços responsáveis por autenticação, dados, preferências e estado do layout.

```text
Usuário
  ↓
Página ou componente Angular
  ↓
Serviços da aplicação
  ├── cache em memória
  ├── localStorage/sessionStorage
  └── Supabase Auth + PostgreSQL
          ↓
       RLS e constraints
```

### Estratégia local-first

Os dados são carregados imediatamente do cache ou do `localStorage`, permitindo que a interface funcione sem aguardar a rede. Quando o Supabase está configurado, o sistema consulta o banco em segundo plano e notifica as telas quando os dados atualizados chegam.

Novas ações e compromissos são salvos localmente primeiro. Em seguida, a aplicação tenta sincronizá-los com o Supabase. Esse comportamento favorece uma demonstração rápida e tolerante a falhas de conexão, mas ainda não substitui uma fila offline completa com novas tentativas e resolução de conflitos.

## Regra de atenção escolar

A classificação é calculada por uma regra determinística e transparente. Ela serve como apoio à equipe pedagógica e não substitui avaliação humana.

| Critério | Pontos |
| --- | ---: |
| Frequência abaixo de 75% | +35 |
| Mais de 8 faltas no mês | +20 |
| Média abaixo de 6,0 | +20 |
| Desmotivação ou baixa participação | +15 |
| Necessidade de trabalhar | +15 |
| Problemas de transporte | +10 |
| Ausência de acompanhamento familiar | +10 |

| Pontuação | Nível de atenção |
| ---: | --- |
| 0 a 30 | Leve |
| 31 a 60 | Moderada |
| 61 ou mais | Prioritária |

A mesma regra existe na massa de dados local e em uma trigger PostgreSQL. Dessa forma, registros inseridos diretamente no banco também recebem pontuação, classificação e motivos consistentes.

## Tecnologias

- **Angular 22** — componentes standalone, roteamento, formulários, Signals, hidratação e SSR.
- **TypeScript 6** — tipagem dos modelos, serviços e componentes.
- **RxJS** — comunicação das atualizações assíncronas entre serviços e telas.
- **Supabase** — autenticação, PostgreSQL e Row Level Security.
- **Chart.js e ng2-charts** — gráficos de barras e linhas.
- **Tailwind CSS 4** — interface, responsividade e utilitários visuais.
- **Express e Angular SSR** — servidor Node e renderização híbrida.
- **Vitest e jsdom** — testes unitários e de componentes.

## Estrutura do projeto

```text
src/
  app/
    components/       Componentes reutilizáveis e estrutura visual
    data/             Massa de demonstração e regra local de prioridade
    guard/            Proteção das rotas autenticadas
    models/           Interfaces e tipos TypeScript
    pages/            Páginas carregadas pelo roteador
    services/         Autenticação, dados, preferências, layout e Supabase
  environments/       Exemplo de configuração local
  main.ts             Inicialização no navegador
  main.server.ts      Inicialização no servidor
  server.ts           Express e Angular SSR
supabase/
  migrations/         Schema, trigger, índices, policies e dados iniciais
public/img/            Logotipos e imagens utilizadas na interface
```

## Pré-requisitos

- Node.js em uma versão compatível com Angular 22.
- npm.
- Projeto Supabase, caso queira utilizar autenticação e banco reais.

## Executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Crie sua configuração local a partir do exemplo.

PowerShell:

```powershell
Copy-Item src/environments/environment.example.ts src/environments/environment.ts
```

Linux ou macOS:

```bash
cp src/environments/environment.example.ts src/environments/environment.ts
```

3. Inicie o servidor de desenvolvimento:

```bash
npm start
```

4. Abra `http://localhost:4200`.

### Acesso local de demonstração

Quando `supabaseUrl` e `supabaseAnonKey` estiverem vazios, o projeto utiliza dados fictícios e o acesso local abaixo:

```text
E-mail: coordenador@escola.com
Senha: 123456
```

Essas credenciais existem apenas para demonstração. Elas não devem ser utilizadas como mecanismo de autenticação em produção.

## Configurar o Supabase

Edite o arquivo local `src/environments/environment.ts`:

```ts
export const environment = {
  production: false,
  supabaseUrl: 'https://SEU-PROJETO.supabase.co',
  supabaseAnonKey: 'SUA-CHAVE-ANONIMA'
};
```

Depois, execute as migrations da pasta `supabase/migrations` no projeto Supabase e crie os usuários que poderão acessar a aplicação.

### Observação importante sobre chaves

A `supabaseAnonKey` é uma chave pública destinada ao frontend. Ela será incluída no JavaScript compilado e poderá ser visualizada por quem acessar a aplicação, mesmo que o arquivo `environment.ts` não esteja no GitHub.

A segurança dos dados depende de:

- autenticação dos usuários;
- policies de Row Level Security;
- permissões concedidas às roles `anon` e `authenticated`;
- validações, constraints e regras no banco.

Nunca coloque a chave `service_role`, senhas, tokens privados ou credenciais administrativas no frontend. A `service_role` ignora o RLS e deve existir somente em ambientes seguros de backend.

## Rotas

| Rota | Página |
| --- | --- |
| `/login` | Autenticação |
| `/lgpd` | Política pública de privacidade |
| `/app/dashboard` | Visão geral e indicadores |
| `/app/alunos` | Lista, busca e filtros |
| `/app/perfil/:id` | Perfil individual |
| `/app/historico/:id` | Histórico de ações |
| `/app/agenda` | Agenda de acompanhamentos |
| `/app/configuracoes` | Perfil e preferências |

Todas as rotas em `/app` são protegidas pelo `authGuard`. No Supabase, a proteção efetiva dos registros é complementada pelas policies RLS.

## Persistência no navegador

O modo de demonstração utiliza as seguintes chaves:

- `edupresente_auth` — sessão local de demonstração.
- `edupresente_alunos` — estudantes.
- `edupresente_acoes` — ações pedagógicas.
- `edupresente_compromissos` — agenda.
- `edupresente_preferencias` — tema, acessibilidade e notificações.
- `edupresente_perfil` — informações da equipe.
- `edupresente_notificacoes_lidas` — notificações já visualizadas.

## Scripts disponíveis

```bash
npm start                      # servidor de desenvolvimento
npm run build                  # build otimizado de produção
npm run watch                  # build contínuo em desenvolvimento
npm test -- --watch=false      # executa os testes uma vez
npm run serve:ssr:EduPresente  # executa o bundle SSR compilado
```

## Testes e build

Na revisão atual do projeto:

- 17 arquivos de teste foram aprovados.
- 37 testes foram aprovados.
- O build de navegador e servidor foi concluído.
- As páginas são geradas em chunks lazy separados.

O build apresenta um aviso de orçamento porque o bundle inicial bruto ultrapassa o limite de aviso configurado de 500 kB. A compilação continua válida, mas a análise e redução dos chunks iniciais fazem parte das melhorias recomendadas.

## Tema e acessibilidade

As preferências são persistidas no navegador e aplicadas como classes no elemento `<html>`:

- `edupresente-dark` altera fundos, textos, bordas, campos e gráficos.
- `edupresente-fonte-grande` aumenta a escala tipográfica base.
- `edupresente-reduzir-animacoes` reduz animações, transições e rolagem suave.

O serviço utiliza `PLATFORM_ID` e `isPlatformBrowser` antes de acessar `document` ou `localStorage`, mantendo compatibilidade com a renderização no servidor.

## Privacidade e segurança

O projeto inclui CPF mascarado, autenticação, RLS, exportação de dados e uma página institucional de privacidade. Esses recursos apoiam a proteção de dados, mas uma implantação real também precisa definir:

- finalidade e base legal de cada tratamento;
- perfis de acesso por escola e função;
- política de retenção e descarte;
- auditoria e resposta a incidentes;
- atendimento aos direitos dos titulares;
- processo de revisão dos critérios de prioridade.

## Limitações conhecidas

- O acesso local com credenciais fixas é exclusivo do modo de demonstração.
- A sincronização offline ainda não possui fila, novas tentativas ou resolução de conflitos.
- As notificações são geradas apenas dentro da aplicação.
- A periodicidade de resumo é persistida, mas não dispara mensagens externas.
- As policies atuais podem ser ampliadas para separar instituições, papéis e equipes.
- A classificação de atenção é uma regra de negócio, não um diagnóstico ou modelo de inteligência artificial.

## Próximas evoluções

- Suporte a múltiplas escolas e papéis de usuário.
- Fila de sincronização offline com indicador de estado.
- Auditoria de alterações e histórico de versões.
- Testes end-to-end e testes automatizados das policies RLS.
- Notificações por e-mail ou push conforme consentimento.
- Melhorias de desempenho e redução do bundle inicial.

