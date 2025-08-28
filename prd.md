Lojas DAORA Product Requirements Document (PRD)
Goals and Background Context
Goals
Digitalizar a operação da Lojas DAORA, centralizando o controle de vendas, estoque e fluxo de caixa.

Automatizar o processo de cobrança de parcelas de crediário através de notificações via WhatsApp.

Implementar uma ferramenta de marketing digital no WhatsApp para promover produtos e gerar leads de vendas.

Fornecer ao comerciante e ao super admin relatórios e dashboards para decisões de negócio estratégicas, como ranking de vendas de caixas e fechamento de caixa.

Background Context
A Lojas DAORA, uma varejista de tênis, roupas, calçados e serviços de conserto/venda de celulares, busca modernizar suas operações. O principal desafio é consolidar a gestão de vendas, estoque e o complexo sistema de crediário em uma única plataforma. Além disso, a empresa deseja alavancar o seu forte canal de marketing e relacionamento com o cliente através do WhatsApp.

Este projeto visa construir um sistema integrado de Ponto de Venda (PDV) que unifique essas funcionalidades, permitindo o controle de crediário, o envio automatizado de lembretes de parcelas via WhatsApp, e a criação e envio de ofertas promocionais para grupos de clientes. A integração com ferramentas como n8n e MegaAPI será crucial para a automação da comunicação via WhatsApp.

Change Log
Date	Version	Description	Author
2025-08-27	1.0	Versão inicial do PRD	Master

Exportar para Sheets
Requirements
Functional
FR1: O sistema deve permitir o cadastro e a gestão de produtos, incluindo nome, descrição, preço de venda normal, preço de crediário, e quantidade em estoque.

FR2: O sistema deve alertar o usuário (Admin) quando o estoque de um produto atingir um limite mínimo configurável.

FR3: A tela de vendas (PDV) deve permitir que o atendente de caixa selecione produtos e aplique diferentes formas de pagamento: dinheiro, Pix, cartão de crédito e crediário.

FR4: Para vendas a crediário, o sistema deve calcular automaticamente o valor das parcelas com base em um preço de crediário predefinido e o número de parcelas escolhido.

FR5: O sistema deve permitir que o atendente de caixa registre um valor de entrada para vendas a crediário.

FR6: O sistema deve ter uma área de relatórios para o Admin, com resumos de fluxo de caixa (diário e mensal), vendas por tipo de pagamento, e status dos crediários (criados, vencidos, a receber).

FR7: O sistema deve permitir que o Admin gere e visualize um ranking de vendas dos atendentes de caixa.

FR8: O Super Admin deve ter uma interface para cadastrar e gerenciar as conexões de WhatsApp, incluindo o host, instância, token e link do webhook do n8n.

FR9: O Admin deve poder re-gerar o QR Code para a sua conexão de WhatsApp, mas não deve ter permissão para alterar o host, instância, token ou webhook.

FR10: O sistema deve permitir que o Admin crie promoções de produtos para serem enviadas em massa via WhatsApp.

FR11: O sistema deve ter um recurso de "Criar Texto do Anúncio" que utilize uma IA (Gemini) para gerar sugestões de texto para as promoções.

FR12: O sistema deve permitir a impressão de relatórios de estoque para conferência manual.

FR13: O sistema deve enviar alertas de estoque baixo diretamente para o WhatsApp do comerciante, utilizando a conexão configurada.

FR14: O sistema deve permitir que o Admin (Comerciante) crie e gerencie os usuários do perfil Caixa (Atendente).

Non Functional
NFR1: O sistema deve ser escalável para suportar múltiplas lojas (o que, a princípio, será gerenciado pelo Super Admin).

NFR2: O sistema deve manter a segurança das credenciais de conexão do WhatsApp, restringindo o acesso apenas ao Super Admin. A comunicação com o WhatsApp deve ser realizada através de fluxos dedicados do n8n.

NFR3: A interface de usuário deve ser intuitiva e fácil de usar, especialmente para os atendentes de caixa, para agilizar o processo de venda.

NFR4: A integração com o n8n e o Supabase deve ser robusta e eficiente, garantindo a consistência dos dados.

NFR5: O sistema deve garantir a privacidade e segurança dos dados dos clientes, em conformidade com a legislação aplicável.

Epic List
Epic 1: Fundação e Infraestrutura do Projeto: Criar o setup inicial, o cadastro de usuários com os perfis de Super Admin, Admin e Caixa, e a integração básica com o Supabase e a API do WhatsApp.

Epic 2: Gestão de Produtos e PDV: Construir as funcionalidades de cadastro de produtos, controle de estoque com alertas, e a tela de vendas com as diferentes formas de pagamento, incluindo a lógica do crediário.

Epic 3: Módulo de Marketing e Automação: Desenvolver o envio de promoções para grupos do WhatsApp e a lógica de atendimento do bot com IA, além dos lembretes de parcelas do crediário.

Epic 4: Relatórios e Dashboards: Implementar os dashboards de fluxo de caixa, relatórios de vendas e o ranking de desempenho dos caixas.

Epic 1 Fundação e Infraestrutura do Projeto
Epic Goal: Estabelecer a arquitetura inicial do projeto, configurar o ambiente, e implementar o sistema de autenticação e gerenciamento de perfis de usuário (Super Admin, Admin e Caixa).

Story 1.1: Configuração do Projeto e Autenticação de Usuário
As a desenvolvedor,
I want configurar o projeto, a conexão com o Supabase e o sistema de autenticação,
so that possamos iniciar o desenvolvimento com segurança.

Acceptance Criteria
O projeto deve ser inicializado com as tecnologias acordadas (React, Tailwind, etc.).

O banco de dados do Supabase deve ser configurado e acessível.

A autenticação de usuários (login/logout) deve estar funcional.

O sistema de rotas deve direcionar os usuários autenticados para uma página inicial e os não autenticados para a página de login.

Story 1.2: Gerenciamento de Perfis de Acesso
As a Super Admin (criador dos comerciantes),
I want criar e gerenciar usuários com os perfis de Admin (Comerciante) e Caixa (Atendente),
so that cada um tenha acesso apenas às funcionalidades de sua responsabilidade.

Acceptance Criteria
O Super Admin deve ter uma tela para adicionar novos usuários.

Ao adicionar um usuário, o Super Admin deve poder atribuir a ele um dos seguintes perfis: Admin ou Caixa.

A autenticação deve validar o perfil do usuário e conceder as permissões adequadas.

Usuários do tipo Admin e Caixa não devem ter acesso a esta funcionalidade.

Story 1.3: Interface do Super Admin para Conexão com o WhatsApp
As a Super Admin,
I want uma interface para configurar as conexões do WhatsApp,
so that eu possa facilmente gerenciar os canais de comunicação de cada loja.

Acceptance Criteria
Deve existir um item no menu para o Super Admin chamado "Conexões".

Nesta tela, o Super Admin deve poder inserir o host, instância, token e link do webhook do n8n para cada conexão de WhatsApp.

Cada conexão deve ser exibida em um card com um resumo dos dados e um ícone que indique se está ativa ou não.

O Super Admin deve poder editar os dados das conexões.

