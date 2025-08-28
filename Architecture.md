Arquitetura do Sistema Lojas DAORA
Este documento descreve a arquitetura técnica completa para o MVP da Lojas DAORA, incluindo a pilha de tecnologia, a estrutura do banco de dados, a organização do projeto e a lógica principal de cada funcionalidade.

1. Pilha de Tecnologia e Arquitetura de Alto Nível
O projeto é baseado em uma arquitetura moderna e escalável, utilizando tecnologias que permitem um desenvolvimento ágil.

Frontend: A interface do usuário será construída com React e estilizada com Tailwind CSS, garantindo uma experiência responsiva e de alta performance.

Backend & Banco de Dados: O Supabase será o nosso backend como serviço (BaaS), fornecendo banco de dados PostgreSQL, autenticação e APIs em tempo real.

Automação: A integração com o n8n e a MegaAPI será central para a automação dos fluxos de comunicação via WhatsApp.

Estrutura de Pastas
A estrutura de pastas segue as melhores práticas do React, com uma organização modular que facilita a manutenção e a escalabilidade.

Plaintext

lojas-daora/
├── public/                # Arquivos estáticos (imagens, etc.)
├── src/
│   ├── api/               # Lógica de integração com Supabase, n8n, etc.
│   │   └── supabase.ts
│   ├── assets/            # Imagens, ícones
│   ├── components/        # Componentes reutilizáveis (formulários, cards)
│   ├── hooks/             # Custom hooks (gerenciamento de autenticação, etc.)
│   │   └── useAuth.ts
│   ├── layouts/           # Layout base da aplicação
│   │   └── AppLayout.tsx
│   ├── pages/             # Páginas da aplicação (Dashboard, PDV, Relatórios)
│   ├── styles/            # Arquivos de configuração do Tailwind
│   ├── types/             # Tipos de dados (TypeScript)
│   ├── App.tsx            # Roteamento principal
│   └── main.tsx           # Ponto de entrada
├── .env.local             # Variáveis de ambiente
├── package.json
├── tailwind.config.js
└── README.md
2. Diagramas e Wireframes
Abaixo estão os wireframes e diagramas que representam a interface e os fluxos principais do sistema.

2.1 Ponto de Venda (PDV)
Este wireframe ilustra a interface de vendas para o Caixa (Atendente).

Fragmento do código

graph TD
    A[Barra de Busca de Produto]
    B[Lista de Produtos Disponíveis]
    C[Carrinho de Compras]
    D[Total da Venda]
    E[Formas de Pagamento]
    F[Dinheiro]
    G[Pix]
    H[Cartão]
    I[Crediário]
    J[Formulário de Crediário]

    A -- "Filtra" --> B
    B -- "Adiciona" --> C
    C -- "Atualiza" --> D
    D -- "Escolhe" --> E
    E -- "Opções de Pagamento" --> F
    E -- "Opções de Pagamento" --> G
    E -- "Opções de Pagamento" --> H
    E -- "Opções de Pagamento" --> I
    I -- "Abre" --> J
2.2 Gerenciamento de Produtos
Este painel é para o Admin, que gerencia produtos e estoque.

Fragmento do código

graph TD
    A[Painel de Controle do Admin]
    B[Menu Lateral]
    C[Seção: Gerenciar Produtos]
    D[Formulário: Adicionar/Editar Produto]
    E[Lista de Produtos]
    F[Card de Produto: Nome, Preço, Estoque]
    G[Badge: "Estoque Baixo"]

    B -- "Seleciona" --> C
    C -- "Adicionar Novo" --> D
    C -- "Visualiza" --> E
    E -- "Mostra" --> F
    F -- "Se Estoque < Mínimo" --> G
2.3 Dashboard de Vendas (Ranking)
Este dashboard é para o Admin acompanhar o desempenho da equipe de vendas.

Fragmento do código

graph TD
    A[Painel de Controle do Admin]
    B[Menu Lateral]
    C[Seção: Dashboard de Vendas]
    D[Filtro de Período]
    E[Gráfico de Barras: Ranking de Vendedores]
    F[Legenda do Gráfico]
    G[Tabela de Detalhes]

    B -- "Seleciona" --> C
    C -- "Filtra por Data" --> D
    D -- "Atualiza" --> E
    E -- "Mostra" --> F
    F -- "Detalha Dados" --> G
2.4 Conexões de WhatsApp
Este painel de controle é exclusivo para o Super Admin.

Fragmento do código

graph TD
    A[Painel de Controle do Super Admin]
    B[Menu Lateral]
    C[Seção: Conexões]
    D[Formulário: Adicionar Nova Conexão]
    E[Card de Conexão: Host, Instância, Status]
    F[Ícone: Conectado/Desconectado]
    G[Botão: Editar]

    B -- "Seleciona" --> C
    C -- "Adicionar Novo" --> D
    C -- "Visualiza" --> E
    E -- "Mostra" --> F
    E -- "Ação" --> G
    G -- "Abre" --> D
3. Banco de Dados (Supabase)
O esquema do banco de dados utiliza a autenticação padrão do Supabase e as seguintes tabelas, com RLS (Row Level Security) ativado para garantir a segurança dos dados de cada loja.

SQL

create table profiles (
  id uuid primary key references auth.users (id),
  full_name text,
  role text,
  store_id uuid
);

create table whatsapp_connections (
  id uuid primary key default gen_random_uuid(),
  host text not null,
  instance text not null,
  token text not null,
  webhook_url text not null,
  is_connected boolean default false,
  created_at timestamptz default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  stock_quantity integer not null default 0,
  normal_price numeric(10, 2) not null,
  credit_price numeric(10, 2) not null,
  min_stock_alert integer not null default 10,
  store_id uuid references stores(id),
  created_at timestamptz default now()
);

create table inventory_alerts (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id),
  alert_sent_at timestamptz default now(),
  store_id uuid references stores(id)
);

create table sales (
  id uuid primary key default gen_random_uuid(),
  sale_date timestamptz not null default now(),
  total_amount numeric(10, 2) not null,
  payment_method text not null,
  is_credit_sale boolean not null default false,
  cashier_id uuid references auth.users(id),
  store_id uuid references stores(id)
);

create table credit_sales (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid references sales(id),
  total_amount numeric(10, 2) not null,
  entry_amount numeric(10, 2) not null default 0,
  installments_number integer not null,
  status text not null default 'pending',
  due_date timestamptz not null,
  paid_at timestamptz,
  last_reminder_sent timestamptz,
  created_at timestamptz default now()
);

create table promotions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  message text not null,
  product_ids uuid[],
  sent_to_groups text[],
  store_id uuid references stores(id),
  created_at timestamptz default now()
);

create table cash_adjustments (
  id uuid primary key default gen_random_uuid(),
  adjustment_type text not null,
  amount numeric(10, 2) not null,
  description text,
  cashier_id uuid references auth.users(id),
  store_id uuid references stores(id),
  authorized_by uuid references auth.users(id),
  created_at timestamptz default now()
);
4. Frontend e Lógica do Sistema
Autenticação e Autorização
O sistema usa Supabase Auth para gerenciamento de usuários.

A autorização é baseada em roles (Super Admin, Admin, Caixa), que são armazenadas na tabela profiles.

O roteamento é protegido com um PrivateRoute que verifica a autenticação e, em alguns casos, o perfil do usuário.

Gerenciamento de Produtos
A tela ManageProducts permite que o Admin cadastre produtos, defina o preço de venda e crediário, e a quantidade em estoque.

Alertas de estoque baixo são exibidos visualmente na lista de produtos.

PDV e Vendas
A tela Pos é a interface de vendas para o Caixa.

O sistema registra vendas de produtos, dá baixa automática no estoque e permite a escolha de múltiplas formas de pagamento.

Para vendas a crediário, a interface permite definir o número de parcelas e o valor de entrada, com o cálculo automático dos juros.

Automação via WhatsApp
O Super Admin gerencia as credenciais do WhatsApp através do painel WhatsappConnections.

O Admin pode criar promoções na tela ManagePromotions, que aciona um webhook do n8n para o envio de mensagens.

Lembretes de parcelas do crediário são disparados automaticamente por um fluxo do n8n que consulta o Supabase.

Relatórios e Dashboards
O Admin tem acesso a um dashboard de vendas com um ranking de vendedores e gráficos.

Relatórios financeiros detalhados (diários, mensais) são exibidos na tela FinancialReports.

O painel CreditSales permite o monitoramento de crediários (vencidos, a receber, pagos).

A tela ManageCashAdjustments é exclusiva para o Super Admin autorizar ou rejeitar solicitações de sangria e acerto no caixa.