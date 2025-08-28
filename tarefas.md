```markdown
# Configurações e Fluxo de Trabalho - Projeto AI Assistant

## 1. Configurações de Comunicação:

**Idioma**: Responda sempre em português do Brasil (PT-BR).

## 2. Fluxo de Trabalho e Processo:

### Planejamento Inicial
Antes de iniciar qualquer tarefa de correção ou modificação, crie um **Checklist detalhado** e um **Roteiro de execução** em formato Markdown (.md). Apresente este planejamento para validação seguindo o formato estabelecido em `rules.md`.

### Execução Autônoma
Prossiga com a execução das tarefas de forma autônoma após aprovação explícita do plano.

### Ciclos de Feedback
A cada **3 tarefas concluídas**, ou menos, pause para fornecer um **feedback de progresso**, informando:
- Status atual do projeto
- Número de etapas restantes
- Próximas tarefas a serem executadas
- Possíveis bloqueios ou dificuldades encontradas

Após o feedback, continue o processo sem interrupções.

### Finalização do Ciclo
Ao concluir um ciclo de tarefas, realize um **teste de acesso completo** para garantir que:
- As alterações funcionem corretamente
- Não há erros de execução
- Todos os serviços estão operacionais
- A integridade do sistema foi mantida

## 3. Gerenciamento de Arquivos e Diretórios:

### Diretório de Relatórios
Salve todos os documentos Markdown criados no diretório `/report`.

### Nomenclatura de Arquivos
Use a seguinte convenção para nomear os arquivos:
[nome_do_arquivo]log[hora--data].md


**Exemplo**: `correcao_cabecalho_log_06_12--29-08_25.md`

### Unificação de Logs
**Quando o diretório `/report` atingir 15 arquivos de log** que **NÃO** tiverem a palavra "**context**" no nome:

1. **Mover Arquivos**: Mova todos esses 15 arquivos diferentes para `/report/unused`
2. **Criar Resumo**: Faça um resumo desses 15 arquivos .md movidos para `/report` com o seguinte formato:
resumo_[data]_context.md

3. **Conteúdo do Resumo**: Monte esse resumo com uma revisão enxuta e direta de todos os 15 logs, incluindo as datas de cada tópico resumido.

**Quando tiver 15 arquivos de resumo do tipo "context"**: Mova tudo para `/report/context`.

**Objetivo**: Mantenha o diretório `/report` sempre limpo e organizado.

## 4. Regras de Sistema:

### Serviços Repetidos
Se um **serviço ativo** for detectado em uma porta, e houver uma tentativa de executar o **mesmo serviço em outra porta**, encerre o serviço anterior antes de iniciar o novo.

**Verificações Obrigatórias**:
- Verificar portas ativas antes de iniciar novos serviços
- Mapear conflitos potenciais
- Documentar mudanças de porta nos logs

## 5. Protocolo de Continuidade de Sessão:

### Início de Nova Sessão
**SEMPRE** execute esta sequência ao iniciar uma nova sessão:

1. **Ler Configurações**: Ler este arquivo (`tarefas.md`) completamente
2. **Verificar Contexto**: Verificar último log em `/report` para contexto histórico
3. **Apresentar Status**: Apresentar resumo do estado atual do projeto
4. **Aguardar Confirmação**: Aguardar confirmação antes de prosseguir com novas tarefas

### Verificação de Estado
**Sempre apresente**:
- Listar últimas 3 tarefas concluídas (baseado nos logs)
- Identificar próxima tarefa pendente
- Confirmar configurações ativas (portas, serviços, dependências)
- Status de integridade do sistema

### Template de Início de Sessão
```markdown
## 🔄 RESUMO DA SESSÃO ANTERIOR

### 📋 Últimas Tarefas Concluídas:
1. [Tarefa 1 - Data/Hora]
2. [Tarefa 2 - Data/Hora] 
3. [Tarefa 3 - Data/Hora]

### ⚡ Estado Atual do Sistema:
- **Serviços Ativos**: [Lista de serviços e portas]
- **Arquivos Modificados**: [Últimas modificações]
- **Testes**: [Status dos testes]

### 🎯 Próximas Tarefas Pendentes:
- [Lista de tarefas identificadas nos logs]

### ✅ Sistema Íntegro:
- [x] Todos os serviços funcionando
- [x] Testes passando
- [x] Sem erros críticos

**Posso prosseguir com as próximas tarefas ou há algo específico que você gostaria de abordar?**
6. Protocolo de Erro e Recuperação:
Detecção de Problemas
Se durante a execução forem detectados:

Erros de execução
Conflitos de dependências
Falhas de teste
Problemas de integridade
PARE IMEDIATAMENTE e:

Documente o problema no log atual
Apresente análise do erro
Proponha soluções alternativas
Aguarde aprovação antes de continuar
Rollback de Emergência
Mantenha sempre um ponto de restauração conhecido:

Documente estado funcional antes de modificações críticas
Mantenha backup de configurações importantes
Registre comandos de rollback nos logs
7. Integração com rules.md:
Consulta Obrigatória
SEMPRE consulte rules.md para diretrizes de desenvolvimento
SEMPRE siga o protocolo de planejamento obrigatório
SEMPRE mantenha consistência entre os dois arquivos
Hierarquia de Prioridade
Segurança: Regras de segurança em rules.md têm prioridade máxima
Integridade: Regras de preservação de dependências
Processo: Fluxo de trabalho definido neste arquivo
Qualidade: Padrões de código e documentação
IMPORTANTE: Este arquivo (tarefas.md) deve ser consultado no início de cada sessão e suas diretrizes seguidas rigorosamente para manter consistência e evitar alucinações do AI assistant.

LEMBRE-SE: A combinação deste arquivo com rules.md cria um sistema robusto de desenvolvimento assistido por IA. Nunca ignore essas diretrizes.

