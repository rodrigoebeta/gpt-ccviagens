# Prompt curto com Skill verificada

**Rota recomendada após escolher e instalar o plugin.** O onboarding oferece plugin + Skill + este prompt curto, verificando disponibilidade cloud conforme SKILLS.md. Se a pessoa não quiser instalar ou faltar suporte, entregue PROMPT_SCHEDULED_TASK.md integral. A execução real do agendador deve ser comprovada depois de salvar; não substituir automaticamente uma tarefa existente.

Instalador: use somente depois de instalar/habilitar o plugin no ambiente **cloud** e confirmar acesso à Skill ccviagens-importar e às referências da mesma versão. Siga SKILLS.md. No ChatGPT e no formulário de Scheduled Tasks, digite @ e selecione o plugin **Centro de Comando de Viagens**, conferindo o item reconhecido; se a Skill for oferecida separadamente, pode selecioná-la. O texto solicita a Skill de importação incluída nesse plugin. No desktop/Codex, use a invocação real disponível ($ ou seletor). Escrever apenas o nome não prova vínculo. Preencha todos os campos e entregue somente o bloco abaixo, substituindo a primeira linha pelo item nativo reconhecido na conta; na colagem manual, a pessoa seleciona esse item no próprio campo antes de colar as demais linhas. Sem suporte da Skill/referências no executor, use PROMPT_SCHEDULED_TASK.md integral; não entregar um prompt curto dependente de pasta local. A programação é configurada no agendador, separadamente do texto.

```text
[MENCAO_NATIVA_CONFIRMADA_DO_PLUGIN_OU_SKILL]
Execute a Skill ccviagens-importar no modo acompanhamento incremental autorizado, aplicando todo o procedimento operacional e os recursos versionados dela.

Projeto Sites exato: [PROJETO_DESTA_INSTALACAO]
Origem HTTPS confirmada: [URL_COMPLETA_DESTA_CENTRAL]
Skill/plugin e versão verificados na nuvem: [IDENTIFICACAO_E_VERSAO]
Fontes/contas autorizadas e campo temporal: [SERVICO_CONEXAO_CONTA_ESCOPO_CAMPO_E_METODOS_DE_LEITURA_ORIGINAIS]
Escopo de viagens: [TODAS_AS_ELEGIVEIS_OU_IDS_CONFIRMADOS]
INICIO_MONITORAMENTO_UTC: [T0_FIXO_EM_ISO_8601_COM_Z]
Origem de T0: [INSTANTE_DE_CADASTRO_OU_ATIVACAO_EXPLICITADO]
Programação confirmada: [TRES_EXECUCOES_DIARIAS_ESPACADAS_8H_HORARIOS_E_FUSO_IANA]
Avisos: [POLITICA_CONFIRMADA]

Em cada execução, obtenha a credencial desta instalação via get_site somente em memória, confira a origem e consulte /api/sync/capabilities e viagens/permissões atuais. Use apenas /api/sync e fontes autorizadas. Pesquise T0–T1 com paginação, preserve T0 e deduplicação, versões mais recentes comprovadas, ajustes manuais e originais dos anexos; importe pelo contrato atual e releia para verificar. Não criar/excluir/alterar viagens, compartilhar, administrar, modificar mensagens, código, tarefas ou credenciais. Não usar JSON local ou memória como checkpoint. Sem Skill/referências/fonte/API aptas, pare com a limitação específica; não declare sucesso. Relate novidades, pendências, falhas e cobertura parcial; sem novidades nem falhas, permaneça em silêncio quando suportado.
```

Sugestão de horários: 00:00, 08:00 e 16:00 no fuso da pessoa, ou outro conjunto confirmado com intervalos de oito horas. Isso são três horários diários locais; mudanças de horário de verão podem alterar o intervalo real em UTC. Se a pessoa exigir oito horas reais contínuas, confirme suporte a intervalo UTC/âncora no agendador e explique a diferença antes de salvar. Reutilize horários/fuso já escolhidos, confira próxima execução e não criar tarefas nesta instalação apenas para demonstrar.
