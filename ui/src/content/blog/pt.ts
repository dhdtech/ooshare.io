import type { BlogPostTranslation } from "../blog-posts";

export const ptTranslations: Record<string, BlogPostTranslation> = {
  "why-email-is-not-safe-for-passwords": {
    title: "Por que o e-mail não é seguro para compartilhar senhas",
    description: "O e-mail nunca foi projetado para transferência segura de dados. Descubra por que enviar senhas por e-mail é perigoso e o que usar no lugar.",
    content: `
<p>Todos os dias, milhões de senhas são compartilhadas por e-mail. Departamentos de TI enviam credenciais de login para novos funcionários. Freelancers recebem senhas de banco de dados em suas caixas de entrada. Equipes trocam chaves de API em longos tópicos de e-mail. Parece conveniente, mas é uma das formas mais perigosas de compartilhar informações sensíveis.</p>

<h2>Como o e-mail realmente funciona</h2>
<p>Para entender por que o e-mail é inseguro para senhas, você precisa entender como o e-mail funciona internamente. Quando você envia um e-mail, ele não viaja diretamente do seu computador para o destinatário. Ele passa por múltiplos servidores:</p>
<ol>
<li>Seu cliente de e-mail envia a mensagem para o servidor de e-mail de saída (SMTP)</li>
<li>Seu servidor de e-mail encaminha para o servidor do destinatário, frequentemente através de servidores intermediários</li>
<li>O servidor do destinatário armazena até que ele baixe ou visualize</li>
</ol>
<p>Em cada salto, o conteúdo do e-mail pode potencialmente ser lido, registrado ou interceptado. Embora a criptografia TLS proteja dados em trânsito entre servidores que a suportam, não há garantia de que cada servidor na cadeia use TLS. E mesmo com TLS, cada servidor descriptografa a mensagem para processá-la.</p>

<h2>O problema da persistência</h2>
<p>Talvez o maior risco não seja a interceptação — é a persistência. E-mails vivem para sempre por padrão:</p>
<ul>
<li><strong>Pasta "Enviados"</strong> — A senha fica nos seus e-mails enviados indefinidamente</li>
<li><strong>Caixa de entrada do destinatário</strong> — A senha permanece até ser excluída manualmente</li>
<li><strong>Backups do servidor</strong> — Provedores de e-mail fazem backup dos dados, o que significa que e-mails excluídos podem ainda existir</li>
<li><strong>Encaminhamento</strong> — O destinatário pode encaminhar o e-mail (e sua senha) para qualquer pessoa</li>
<li><strong>Indexação de busca</strong> — Índices de busca de e-mail facilitam encontrar "senha" na conta de alguém</li>
</ul>
<p>Se qualquer uma das contas for comprometida meses ou anos depois, o atacante obtém todas as senhas já compartilhadas por e-mail. Este não é um risco teórico — violações de contas de e-mail estão consistentemente entre os vetores de ataque mais comuns.</p>

<h2>Capturas de tela e espionagem visual</h2>
<p>Quando uma senha é exibida em um e-mail, ela pode ser capturada em screenshot, fotografada ou lida por cima do ombro. Não há como controlar o que acontece com a informação uma vez exibida na tela em um e-mail persistente.</p>

<h2>Riscos de conformidade</h2>
<p>Para organizações sujeitas a frameworks de conformidade como GDPR, HIPAA, SOC 2 ou PCI DSS, compartilhar credenciais por e-mail pode constituir uma violação. Esses frameworks exigem que dados sensíveis sejam transmitidos usando criptografia apropriada e controles de acesso — o e-mail tipicamente não atende a nenhum dos requisitos.</p>

<h2>A alternativa: links criptografados autodestrutivos</h2>
<p>A solução é compartilhar senhas através de um canal criptografado de ponta a ponta que destrói automaticamente os dados após serem acessados. Ferramentas de compartilhamento de segredos autodestrutivos como <a href="/">Only Once Share</a> funcionam assim:</p>
<ol>
<li>Criptografam a senha no seu navegador usando AES-256-GCM</li>
<li>Armazenam apenas os dados criptografados no servidor (conhecimento zero)</li>
<li>Geram um link de uso único que se autodestrói após a visualização</li>
<li>Mantêm a chave de descriptografia apenas no fragmento da URL (nunca enviada ao servidor)</li>
</ol>
<p>Esta abordagem elimina todos os riscos do e-mail: não há cópia persistente, não há risco de encaminhamento, não há texto simples no servidor, e os dados são automaticamente destruídos após uma visualização.</p>

<h2>Melhores práticas para compartilhamento de senhas</h2>
<ul>
<li><strong>Nunca envie senhas em texto simples</strong> por e-mail, Slack, SMS ou qualquer plataforma de mensagens</li>
<li><strong>Use um link autodestrutivo</strong> de uma ferramenta de conhecimento zero como <a href="/">Only Once Share</a></li>
<li><strong>Defina a expiração mais curta possível</strong> — se o destinatário lerá em uma hora, defina um TTL de 1 hora</li>
<li><strong>Rotacione credenciais</strong> após compartilhar — altere senhas depois que o destinatário as usar para configuração inicial</li>
<li><strong>Use um gerenciador de senhas</strong> para acesso compartilhado contínuo em vez de compartilhar senhas brutas</li>
</ul>

<h2>Conclusão</h2>
<p>E-mail é uma ferramenta de comunicação fantástica, mas foi projetado para mensagens, não para segredos. Senhas compartilhadas por e-mail persistem indefinidamente, passam por múltiplos servidores e se tornam uma vulnerabilidade em cada futura violação. Usando links criptografados autodestrutivos, você pode compartilhar credenciais com segurança sem deixar rastro.</p>
`
  },
  "what-is-zero-knowledge-encryption": {
    title: "O que é criptografia de conhecimento zero? Um guia simples",
    description: "Criptografia de conhecimento zero significa que o provedor de serviço não pode acessar seus dados. Saiba como funciona e por que é importante para compartilhamento de segredos.",
    content: `
<p>Você provavelmente já viu o termo "conhecimento zero" usado por ferramentas e serviços focados em privacidade. Mas o que realmente significa? E como você pode saber se um serviço realmente implementa criptografia de conhecimento zero versus apenas usá-la como termo de marketing?</p>

<h2>O conceito central</h2>
<p>Criptografia de conhecimento zero é uma arquitetura onde <strong>o provedor de serviço não pode acessar seus dados</strong> — não por causa de uma política, mas por causa da matemática. O provedor literalmente não possui as chaves necessárias para descriptografar suas informações.</p>
<p>Pense nisso como um cofre em um banco. O banco armazena o cofre, mas só você tem a chave. Nem o gerente do banco pode abri-lo. A criptografia de conhecimento zero aplica este mesmo princípio aos dados digitais.</p>

<h2>Como funciona na prática</h2>
<p>Em um sistema de conhecimento zero, a criptografia e a descriptografia acontecem no <strong>lado do cliente</strong> — seu navegador ou dispositivo. O fluxo de trabalho funciona assim:</p>
<ol>
<li><strong>Geração de chave</strong> — Seu dispositivo gera uma chave criptográfica (ex.: AES-256)</li>
<li><strong>Criptografia no cliente</strong> — Seus dados são criptografados no seu dispositivo antes de serem enviados para qualquer lugar</li>
<li><strong>Armazenamento no servidor</strong> — O servidor recebe e armazena apenas texto cifrado criptografado</li>
<li><strong>Gerenciamento de chave</strong> — A chave de criptografia fica no seu dispositivo (ou no fragmento da URL) e nunca é enviada ao servidor</li>
<li><strong>Descriptografia no cliente</strong> — Quando você (ou um destinatário) acessa os dados, a descriptografia ocorre no dispositivo cliente</li>
</ol>
<p>O ponto crítico é o passo 4: a chave nunca toca o servidor. Sem a chave, o servidor armazena o que é essencialmente ruído aleatório.</p>

<h2>Conhecimento zero vs. criptografia padrão</h2>
<table>
<thead><tr><th>Recurso</th><th>Criptografia no servidor</th><th>Criptografia de conhecimento zero</th></tr></thead>
<tbody>
<tr><td>Onde a criptografia acontece</td><td>No servidor</td><td>No seu navegador/dispositivo</td></tr>
<tr><td>Quem tem a chave</td><td>O servidor</td><td>Apenas o cliente</td></tr>
<tr><td>O provedor pode ler seus dados?</td><td>Sim</td><td>Não</td></tr>
<tr><td>Vulnerabilidade a violação de servidor</td><td>Dados expostos</td><td>Apenas blobs criptografados expostos</td></tr>
<tr><td>Vulnerabilidade a ordens legais</td><td>Provedor pode cumprir</td><td>Provedor não tem nada para entregar</td></tr>
</tbody>
</table>

<h2>Como Only Once Share implementa conhecimento zero</h2>
<p>No Only Once Share, o conhecimento zero é alcançado através do uso inteligente de fragmentos de URL:</p>
<ol>
<li>Seu navegador gera uma chave AES-256-GCM e criptografa seu segredo</li>
<li>Apenas o texto cifrado criptografado é enviado ao servidor</li>
<li>A chave de criptografia é colocada após o símbolo <code>#</code> na URL (o "fragmento")</li>
<li>Fragmentos de URL <strong>nunca são enviados aos servidores</strong> em requisições HTTP — isso é definido no RFC 3986</li>
<li>Quando o destinatário abre o link, seu navegador lê a chave do fragmento e descriptografa localmente</li>
</ol>

<h2>Por que isso importa</h2>
<p>A criptografia de conhecimento zero protege contra:</p>
<ul>
<li><strong>Violações de servidor</strong> — Atacantes que comprometem o servidor só obtêm dados criptografados que não podem ler</li>
<li><strong>Ameaças internas</strong> — Funcionários do provedor de serviço não podem acessar seus dados</li>
<li><strong>Vigilância governamental</strong> — O provedor não pode entregar dados que não pode descriptografar</li>
<li><strong>Mineração de dados</strong> — O provedor não pode analisar seus dados para publicidade ou perfilamento</li>
</ul>

<h2>Conclusão</h2>
<p>Criptografia de conhecimento zero é o padrão ouro para privacidade. Significa que você não precisa confiar no provedor de serviço — a matemática garante que eles não podem acessar seus dados. Ao escolher ferramentas para compartilhar informações sensíveis, sempre prefira implementações de conhecimento zero.</p>
`
  },
  "how-to-share-password-securely": {
    title: "Como compartilhar uma senha com segurança",
    description: "Guia passo a passo para compartilhar senhas com segurança usando links criptografados autodestrutivos. Pare de enviar senhas por e-mail e Slack.",
    content: `
<p>Seja compartilhando credenciais Wi-Fi com um visitante, enviando senhas de banco de dados para um colega ou dando a um cliente acesso à sua nova conta, há uma maneira certa e uma errada de compartilhar senhas.</p>

<h2>A maneira errada: canais em texto simples</h2>
<ul>
<li><strong>E-mail</strong> — Vive nas pastas de enviados/caixa de entrada para sempre</li>
<li><strong>Slack/Teams</strong> — Histórico de mensagens é retido e pesquisável por administradores</li>
<li><strong>SMS/iMessage</strong> — Armazenado em dispositivos e sistemas de operadoras</li>
<li><strong>Post-its</strong> — Risco de segurança física, facilmente fotografado</li>
</ul>

<h2>A maneira certa: links criptografados autodestrutivos</h2>
<h3>Passo a passo com Only Once Share</h3>
<ol>
<li><strong>Acesse <a href="/">ooshare.io</a></strong></li>
<li><strong>Digite a senha</strong> (ou qualquer texto secreto)</li>
<li><strong>Escolha um tempo de expiração</strong></li>
<li><strong>Clique em "Criar Link Secreto"</strong> — seu navegador criptografa a senha com AES-256-GCM antes de enviar qualquer coisa ao servidor</li>
<li><strong>Copie o link gerado</strong> e envie ao destinatário por qualquer canal</li>
<li><strong>O destinatário abre o link</strong>, vê a senha, e os dados são permanentemente destruídos</li>
</ol>

<h2>Por que esta abordagem funciona</h2>
<ul>
<li><strong>Sem cópias persistentes</strong> — A senha é destruída após visualização</li>
<li><strong>Criptografia ponta a ponta</strong> — O servidor só lida com dados criptografados</li>
<li><strong>Conhecimento zero</strong> — A chave está no fragmento da URL, nunca enviada ao servidor</li>
<li><strong>Limitação temporal</strong> — Mesmo se nunca visualizado, os dados expiram automaticamente</li>
<li><strong>Sem necessidade de conta</strong> — Sem registro, sem atrito</li>
</ul>

<h2>Melhores práticas adicionais</h2>
<h3>Rotacione após compartilhar</h3>
<p>Se está compartilhando uma senha para configuração inicial, peça ao destinatário que altere a senha imediatamente após o primeiro login.</p>

<h3>Use canais diferentes para contexto</h3>
<p>Envie o link secreto por um canal e diga ao destinatário para que serve por outro.</p>

<h2>Conclusão</h2>
<p>Compartilhar senhas com segurança não precisa ser complicado. Com links criptografados autodestrutivos, você pode compartilhar credenciais em segundos sem deixar rastro.</p>
`
  },
  "self-destructing-links-explained": {
    title: "Links autodestrutivos explicados: como funcionam",
    description: "Uma análise técnica de links autodestrutivos — os mecanismos que fazem senhas desaparecerem após serem lidas.",
    content: `
<p>Links autodestrutivos são uma das formas mais seguras de compartilhar informações sensíveis. Mas como eles realmente funcionam? Vamos decompor os mecanismos técnicos.</p>

<h2>O conceito básico</h2>
<ol>
<li><strong>Acesso único</strong> — Os dados só podem ser recuperados uma vez</li>
<li><strong>Expiração automática</strong> — Os dados são excluídos após um tempo definido, independentemente de serem acessados</li>
</ol>

<h2>Fluxo de trabalho técnico</h2>
<h3>Passo 1: Criptografia no cliente</h3>
<p>Quando você cria um segredo, seu navegador gera uma chave AES-256-GCM aleatória e um vetor de inicialização (IV). Seu segredo é criptografado no seu navegador.</p>

<h3>Passo 2: Armazenamento no servidor</h3>
<p>Apenas dados criptografados são enviados ao servidor com metadados (tempo de expiração, timestamp de criação). O servidor nunca vê seus dados em texto simples.</p>

<h3>Passo 3: Geração do link</h3>
<p>O servidor retorna um ID único. Seu navegador constrói o link completo combinando a URL do servidor, o ID da mensagem e a chave de criptografia após o fragmento de URL (<code>#</code>).</p>

<h3>Passo 4: Recuperação única</h3>
<p>Quando o destinatário abre o link, o servidor executa uma leitura atômica e exclusão: retorna os dados criptografados e os exclui imediatamente do armazenamento.</p>

<h3>Passo 5: Descriptografia no cliente</h3>
<p>O navegador do destinatário extrai a chave do fragmento da URL e descriptografa os dados localmente.</p>

<h2>Propriedades de segurança</h2>
<ul>
<li><strong>Sigilo antecipado</strong> — Uma vez excluídos, os dados não podem ser recuperados mesmo se o servidor for comprometido depois</li>
<li><strong>Conhecimento zero</strong> — O servidor nunca possui a capacidade de descriptografar dados</li>
<li><strong>Resistente a adulteração</strong> — AES-256-GCM fornece criptografia autenticada</li>
<li><strong>Detecção de acesso</strong> — Se o link já foi usado, o remetente sabe que alguém o visualizou</li>
</ul>

<h2>Conclusão</h2>
<p>Links autodestrutivos combinam criptografia no cliente, acesso único e expiração automática em uma URL simples. O segredo nunca toca o servidor em texto simples, e os dados são garantidamente excluídos.</p>
`
  },
  "aes-256-gcm-encryption-explained": {
    title: "Criptografia AES-256-GCM explicada",
    description: "Uma análise técnica profunda do AES-256-GCM — o padrão de criptografia usado pelo Only Once Share e outras ferramentas de segurança modernas.",
    content: `
<p>AES-256-GCM é o padrão de criptografia usado pelo Only Once Share, Signal, ProtonMail e a maioria das ferramentas de segurança modernas. Vamos explicar o que é, como funciona e por que é considerado o padrão ouro da criptografia simétrica.</p>

<h2>Decompondo o nome</h2>
<h3>AES (Advanced Encryption Standard)</h3>
<p>AES é um algoritmo de criptografia simétrica padronizado pelo NIST em 2001. "Simétrica" significa que a mesma chave é usada para criptografar e descriptografar.</p>

<h3>256 (Tamanho da chave)</h3>
<p>256 refere-se ao comprimento da chave de 256 bits. O espaço de chaves é 2^256 — um número maior que os átomos no universo observável.</p>

<h3>GCM (Galois/Counter Mode)</h3>
<p>GCM é o modo de operação que fornece <strong>confidencialidade</strong> (dados são criptografados) e <strong>autenticação</strong> (qualquer adulteração pode ser detectada).</p>

<h2>Por que AES-256-GCM?</h2>
<ul>
<li><strong>Criptografia autenticada</strong> — Criptografa e autentica em uma única operação</li>
<li><strong>Aceleração por hardware</strong> — CPUs modernas incluem instruções AES-NI</li>
<li><strong>Processamento paralelo</strong> — O modo GCM permite criptografar blocos em paralelo</li>
<li><strong>Amplamente auditado</strong> — Décadas de criptoanálise, sem vulnerabilidades práticas</li>
<li><strong>Padrão da indústria</strong> — TLS 1.3, SSH, IPsec todos o utilizam</li>
</ul>

<h2>O AES-256 é resistente a computação quântica?</h2>
<p>AES-256 é considerado resistente a computação quântica. O algoritmo de Grover reduz sua segurança efetiva para 128 bits — ainda bem além do alcance de qualquer ataque conhecido.</p>

<h2>Conclusão</h2>
<p>AES-256-GCM fornece confidencialidade, integridade e autenticação em um algoritmo eficiente. É o padrão ouro da criptografia simétrica.</p>
`
  },
  "send-api-keys-securely": {
    title: "Como enviar chaves de API com segurança para desenvolvedores",
    description: "Métodos seguros para desenvolvedores compartilharem chaves de API e tokens. Pare de colar credenciais no Slack — use links criptografados autodestrutivos.",
    content: `
<p>Chaves de API são a essência do desenvolvimento de software moderno. Elas autenticam serviços, autorizam acesso e conectam sistemas. Mas a forma como são compartilhadas é frequentemente chocantemente insegura.</p>

<h2>Compartilhamento típico (inseguro) de chaves de API</h2>
<ul>
<li>Colar chaves no Slack: "Aqui está a chave da API do Stripe: sk_live_..."</li>
<li>Commit no Git: "Chave de API hardcoded temporariamente para testes"</li>
<li>Compartilhar planilha de credenciais no Google Docs</li>
<li>Enviar arquivos de configuração por e-mail</li>
</ul>

<h2>O método seguro</h2>
<ol>
<li>Acesse <a href="/">ooshare.io</a></li>
<li>Cole a chave de API</li>
<li>Defina uma expiração curta</li>
<li>Envie o link via Slack/e-mail</li>
<li>O desenvolvedor usa e o link se autodestrói</li>
</ol>

<h2>Segurança no Git</h2>
<p>O erro mais perigoso é fazer commit de segredos no Git. Mesmo removendo o commit, o segredo permanece no histórico do Git. Use <code>.gitignore</code> para excluir arquivos <code>.env</code>.</p>

<h2>Conclusão</h2>
<p>Chaves de API devem usar links criptografados autodestrutivos para entrega única, variáveis de ambiente ou gerenciadores de segredos para uso em runtime, e ferramentas de varredura para prevenir commits acidentais.</p>
`
  },
  "best-free-secret-sharing-tools": {
    title: "Melhores ferramentas gratuitas de compartilhamento de segredos em 2025",
    description: "Comparação completa de ferramentas gratuitas de compartilhamento de segredos. Comparação lado a lado de recursos, segurança, métodos de criptografia e privacidade.",
    content: `
<p>Existem diversas ferramentas de compartilhamento de segredos no mercado. Este guia compara as melhores opções gratuitas, focando em segurança, privacidade e usabilidade.</p>

<h2>Comparação de ferramentas</h2>
<table>
<thead><tr><th>Ferramenta</th><th>Criptografia</th><th>Open Source</th><th>Auto-hospedagem</th><th>Plano Gratuito</th></tr></thead>
<tbody>
<tr><td><a href="/">Only Once Share</a></td><td>Cliente (AES-256-GCM)</td><td>Sim</td><td>Sim (Docker)</td><td>Totalmente gratuito</td></tr>
<tr><td>OneTimeSecret</td><td>Servidor</td><td>Sim</td><td>Sim</td><td>Gratuito (limitado)</td></tr>
<tr><td>Password Pusher</td><td>Servidor</td><td>Sim</td><td>Sim</td><td>Gratuito (limitado)</td></tr>
<tr><td>Yopass</td><td>Cliente (OpenPGP)</td><td>Sim</td><td>Sim</td><td>Totalmente gratuito</td></tr>
<tr><td>scrt.link</td><td>Cliente</td><td>Não</td><td>Não</td><td>Gratuito (limitado)</td></tr>
</tbody>
</table>

<h2>Por que Only Once Share se destaca</h2>
<ul>
<li><strong>Verdadeiro conhecimento zero</strong> — Criptografia AES-256-GCM no cliente</li>
<li><strong>Totalmente gratuito</strong> — Sem planos pagos, sem limitações</li>
<li><strong>Open source</strong> — Totalmente auditável no GitHub</li>
<li><strong>6 idiomas</strong> — Inglês, espanhol, chinês, português, hindi, árabe</li>
<li><strong>Pronto para auto-hospedagem</strong> — Deploy em minutos com Docker Compose</li>
</ul>

<h2>Conclusão</h2>
<p>Ao escolher uma ferramenta de compartilhamento de segredos, priorize criptografia no cliente e transparência open source. <a href="/">Only Once Share</a> se destaca em ambos e é totalmente gratuito.</p>
`
  },
  "server-side-vs-client-side-encryption": {
    title: "Criptografia no servidor vs. no cliente: por que a diferença importa",
    description: "Entenda a diferença crítica entre criptografia no servidor e no cliente. Uma protege seus dados de todos — incluindo o provedor. A outra não.",
    content: `
<p>"Criptografado" não significa automaticamente "privado". Onde a criptografia acontece determina quem pode acessar seus dados.</p>

<h2>Criptografia no servidor</h2>
<p>Os dados chegam ao servidor em texto simples, o servidor os criptografa e armazena. O servidor detém a chave de criptografia.</p>

<h2>Criptografia no cliente (conhecimento zero)</h2>
<p>Os dados são criptografados no seu navegador/dispositivo antes de serem enviados ao servidor. O servidor nunca vê sua chave.</p>

<h2>Impacto na segurança</h2>
<table>
<thead><tr><th>Cenário</th><th>Servidor</th><th>Cliente</th></tr></thead>
<tbody>
<tr><td>Servidor hackeado</td><td>Dados expostos</td><td>Apenas blobs criptografados</td></tr>
<tr><td>Funcionário desonesto</td><td>Pode ler dados</td><td>Não pode ler dados</td></tr>
<tr><td>Intimação governamental</td><td>Deve entregar dados</td><td>Nenhum dado utilizável para entregar</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Criptografia no servidor protege dados em repouso, mas confia no servidor. Criptografia no cliente não confia em ninguém — a chave nunca sai do seu dispositivo. Para dados sensíveis, criptografia no cliente (conhecimento zero) é o único método que oferece verdadeira privacidade.</p>
`
  },
  "self-host-secret-sharing-docker": {
    title: "Como auto-hospedar uma ferramenta de compartilhamento de segredos com Docker",
    description: "Guia passo a passo para implantar sua própria ferramenta de compartilhamento de segredos em 5 minutos com Docker Compose. Controle total dos seus dados.",
    content: `
<p>Auto-hospedar sua ferramenta de compartilhamento de segredos dá controle total sobre os dados. Com Docker Compose, você pode executar Only Once Share na sua própria infraestrutura em minutos.</p>

<h2>Início rápido</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>Por que auto-hospedar?</h2>
<ul>
<li><strong>Soberania de dados</strong> — Dados criptografados nunca saem da sua infraestrutura</li>
<li><strong>Conformidade</strong> — Atende requisitos de residência de dados GDPR, HIPAA, SOC 2</li>
<li><strong>Isolamento de rede</strong> — Execute em rede interna sem exposição à internet pública</li>
<li><strong>Personalização</strong> — Modifique branding, opções de TTL, limites de tamanho</li>
</ul>

<h2>Requisitos de recursos</h2>
<table>
<thead><tr><th>Recurso</th><th>Mínimo</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>Armazenamento</td><td>1 GB</td><td>5 GB</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Auto-hospedar Only Once Share com Docker é a forma mais fácil de obter controle total dos dados. A configuração leva menos de 5 minutos e fornece a mesma criptografia de conhecimento zero da versão hospedada.</p>
`
  },
  "credential-sharing-employee-onboarding": {
    title: "Compartilhamento seguro de credenciais durante a integração de funcionários",
    description: "Como compartilhar senhas, chaves de API e credenciais de acesso com segurança durante a integração de funcionários.",
    content: `
<p>A integração de funcionários é o momento de pico do compartilhamento de credenciais. Novos funcionários precisam de senhas para múltiplos sistemas, ferramentas e serviços.</p>

<h2>Fluxo de trabalho seguro de integração</h2>
<ol>
<li><strong>Crie links autodestrutivos separados para cada credencial</strong></li>
<li><strong>Defina expirações curtas</strong> — TTL de 24 horas para o primeiro dia</li>
<li><strong>Exija alteração imediata de senha</strong></li>
<li><strong>Inscreva no gerenciador de senhas</strong></li>
<li><strong>Ative MFA</strong> em todos os serviços que suportam</li>
</ol>

<h2>O que não fazer</h2>
<ul>
<li>Não envie senhas em texto simples no e-mail de "boas-vindas"</li>
<li>Não use uma planilha compartilhada com todas as credenciais</li>
<li>Não use a mesma senha temporária para todos os novos funcionários</li>
</ul>

<h2>Conclusão</h2>
<p>A integração é um momento crítico de segurança. Use links criptografados autodestrutivos para entrega inicial de credenciais e depois transfira novos funcionários para gerenciadores de senhas e MFA.</p>
`
  },
  "gdpr-compliant-secret-sharing": {
    title: "Compartilhamento de segredos em conformidade com GDPR",
    description: "Como compartilhar senhas e dados sensíveis em conformidade com o GDPR. Minimização de dados, requisitos de criptografia e melhores práticas.",
    content: `
<p>O Regulamento Geral de Proteção de Dados (GDPR) impõe requisitos rigorosos sobre como organizações lidam com dados pessoais. Isso se estende a como senhas e credenciais são compartilhadas.</p>

<h2>Princípios relevantes do GDPR</h2>
<ul>
<li><strong>Minimização de dados</strong> (Art. 5(1)(c)) — Processe apenas o necessário</li>
<li><strong>Limitação de armazenamento</strong> (Art. 5(1)(e)) — Não retenha mais do que o necessário</li>
<li><strong>Integridade e confidencialidade</strong> (Art. 5(1)(f)) — Medidas de segurança apropriadas</li>
<li><strong>Privacidade por design</strong> (Art. 25) — Proteção de dados incorporada por padrão</li>
</ul>

<h2>Como links autodestrutivos atendem ao GDPR</h2>
<table>
<thead><tr><th>Requisito GDPR</th><th>Como links autodestrutivos atendem</th></tr></thead>
<tbody>
<tr><td>Minimização de dados</td><td>Armazena apenas o segredo criptografado</td></tr>
<tr><td>Limitação de armazenamento</td><td>Exclusão automática após acesso</td></tr>
<tr><td>Criptografia</td><td>Criptografia AES-256-GCM no cliente</td></tr>
<tr><td>Privacidade por design</td><td>Arquitetura de conhecimento zero</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Compartilhamento de segredos em conformidade com GDPR requer criptografia, minimização de dados e exclusão automática. Links autodestrutivos de conhecimento zero atendem a todos esses requisitos.</p>
`
  },
  "devops-secret-sharing-best-practices": {
    title: "Melhores práticas de compartilhamento de segredos em DevOps",
    description: "Gerencie e compartilhe chaves de API, tokens e credenciais com segurança em fluxos de trabalho DevOps.",
    content: `
<p>Equipes DevOps lidam com mais credenciais do que quase qualquer outro papel: chaves de API, senhas de banco de dados, chaves SSH, tokens de provedor de nuvem, credenciais de registro de contêiner, certificados TLS e segredos de webhook.</p>

<h2>Ciclo de vida dos segredos</h2>
<h3>1. Entrega inicial (transferência única)</h3>
<p><strong>Solução:</strong> Use um link criptografado autodestrutivo para cada transferência de credencial. <a href="/">Only Once Share</a> lida com isso com criptografia de conhecimento zero.</p>

<h3>2. Uso ativo (runtime)</h3>
<p><strong>Solução:</strong> Use variáveis de ambiente, gerenciadores de segredos (HashiCorp Vault, AWS Secrets Manager, Doppler) ou configuração criptografada.</p>

<h3>3. Rotação</h3>
<p><strong>Solução:</strong> Automatize a rotação sempre que possível. Para rotação manual, use links criptografados para entrega de novas credenciais.</p>

<h2>Erros comuns</h2>
<h3>Segredos no controle de versão</h3>
<p>O erro mais perigoso é fazer commit de segredos no Git. Mesmo removendo o commit, o segredo permanece no histórico.</p>

<h2>Conclusão</h2>
<p>Gerenciamento de segredos em DevOps é um problema em camadas. Links criptografados autodestrutivos lidam com a entrega única; gerenciadores de segredos lidam com o acesso em runtime; plataformas CI/CD lidam com segredos de pipeline.</p>
`
  },
  "complete-guide-one-time-secret-sharing": {
    title: "O guia completo para compartilhamento de segredos únicos",
    description: "Tudo que você precisa saber sobre compartilhamento de segredos únicos: como funciona, quando usar, considerações de segurança e escolha da ferramenta certa.",
    content: `
<p>Compartilhamento de segredos únicos é a prática de transmitir informações sensíveis através de links que se autodestroem após uma única visualização.</p>

<h2>Quando usar compartilhamento de segredos únicos</h2>
<ul>
<li><strong>Senhas</strong> — Compartilhar credenciais de login para configuração inicial</li>
<li><strong>Chaves de API e tokens</strong> — Distribuir credenciais de serviço para desenvolvedores</li>
<li><strong>Strings de conexão</strong> — URLs de banco de dados, URIs Redis</li>
<li><strong>Chaves SSH</strong> — Chaves privadas para acesso a servidores</li>
<li><strong>Informações pessoais</strong> — CPF, detalhes financeiros</li>
</ul>

<h2>Níveis de segurança</h2>
<h3>Nível 1: Criptografia no servidor</h3>
<p>O servidor recebe texto simples, criptografa e armazena. O servidor vê seus dados.</p>

<h3>Nível 2: Criptografia no cliente (conhecimento zero)</h3>
<p>O navegador criptografa os dados antes de enviar ao servidor. O servidor só armazena blobs criptografados.</p>
<p><em>Exemplos: <a href="/">Only Once Share</a>, scrt.link, Yopass</em></p>

<h3>Nível 3: Cliente + auto-hospedado</h3>
<p>Igual ao Nível 2, mas executando na sua própria infraestrutura.</p>

<h2>Conclusão</h2>
<p>Compartilhamento de segredos únicos é o método mais seguro para transmitir informações sensíveis que precisam ser acessadas uma vez. Escolha uma ferramenta de conhecimento zero como <a href="/">Only Once Share</a>.</p>
`
  },
  "open-source-security-transparency": {
    title: "Segurança open source: por que a transparência importa",
    description: "Por que ferramentas de segurança open source são mais confiáveis que alternativas de código fechado. Auditoria comunitária, segurança da cadeia de suprimentos e o problema da confiança.",
    content: `
<p>Quando se trata de software de segurança, existe um paradoxo: as ferramentas que mais pedem sua confiança são frequentemente aquelas em que você deveria menos confiar.</p>

<h2>O problema da confiança</h2>
<p>Toda ferramenta de segurança faz afirmações: "criptografia de nível militar", "segurança de nível bancário", "arquitetura de conhecimento zero". Mas como você verifica essas afirmações? Com software de código fechado, você não pode.</p>
<p>Open source resolve isso tornando o código publicamente disponível.</p>

<h2>Open source e conhecimento zero verificável</h2>
<p>Para <a href="/">Only Once Share</a>, open source não é opcional — é essencial. Nossas afirmações de conhecimento zero são verificáveis porque você pode ler o <a href="https://github.com/dhdtech/only-once-share">código de criptografia</a>.</p>

<h2>Auto-hospedagem: o modelo de confiança definitivo</h2>
<p>Open source permite auto-hospedagem — executar o software na sua própria infraestrutura. Isso elimina até a necessidade de confiar na versão hospedada.</p>

<h2>Conclusão</h2>
<p>Para ferramentas de segurança, open source não é um luxo — é um requisito para credibilidade. Você não deveria ter que confiar na palavra de um fornecedor de que seus dados estão criptografados. Com open source, você pode verificar por si mesmo.</p>
`
  },
  "incident-response-credential-sharing": {
    title: "Resposta a incidentes: compartilhamento seguro de credenciais durante emergências",
    description: "Quando um incidente de segurança acontece, equipes precisam compartilhar credenciais rapidamente. Como equilibrar velocidade com segurança.",
    content: `
<p>Às 2 da manhã, seu sistema de monitoramento dispara um alerta crítico. Um banco de dados de produção está exposto. Você precisa compartilhar credenciais de acesso de emergência com a equipe de resposta a incidentes — rápido.</p>

<h2>Uma abordagem rápida E segura</h2>
<ol>
<li><strong>Abra <a href="/">ooshare.io</a></strong> (salve nos favoritos do seu playbook de resposta a incidentes)</li>
<li><strong>Cole a credencial</strong></li>
<li><strong>Defina TTL de 1 hora</strong></li>
<li><strong>Compartilhe o link</strong> no canal de resposta a incidentes</li>
<li><strong>O respondente abre o link</strong> e obtém a credencial — dados destruídos</li>
</ol>
<p>Tempo total: menos de 30 segundos.</p>

<h2>Higiene de credenciais pós-incidente</h2>
<ol>
<li><strong>Rotacione cada credencial</strong> compartilhada durante o incidente</li>
<li><strong>Rotacione cada credencial</strong> que pode ter sido comprometida no próprio incidente</li>
<li><strong>Revise logs de acesso</strong></li>
<li><strong>Atualize seu playbook</strong></li>
</ol>

<h2>Conclusão</h2>
<p>Resposta a incidentes exige velocidade, mas velocidade sem segurança cria risco composto. Links criptografados autodestrutivos oferecem a velocidade de uma mensagem do Slack com a segurança de dados criptografados e efêmeros.</p>
`
  },
  "web-crypto-api-browser-encryption": {
    title: "Web Crypto API: construindo criptografia no navegador",
    description: "Guia prático da Web Crypto API para desenvolvedores. Gere chaves, criptografe dados e implemente arquiteturas de conhecimento zero no navegador.",
    content: `
<p>A Web Crypto API é uma API JavaScript nativa do navegador que fornece operações criptográficas sem bibliotecas externas.</p>

<h2>Por que Web Crypto API?</h2>
<ul>
<li><strong>Sem dependências externas</strong> — Embutida em todos os navegadores modernos</li>
<li><strong>Aceleração por hardware</strong> — Usa o conjunto de instruções AES-NI da CPU</li>
<li><strong>Geração segura de números aleatórios</strong> — <code>crypto.getRandomValues()</code> usa o CSPRNG do SO</li>
<li><strong>Design assíncrono</strong> — Operações não-bloqueantes via Promises</li>
</ul>

<h2>Operações principais</h2>
<h3>1. Geração de valores aleatórios</h3>
<pre><code>const iv = crypto.getRandomValues(new Uint8Array(12));</code></pre>

<h3>2. Geração de chave AES-256-GCM</h3>
<pre><code>const key = await crypto.subtle.generateKey(
  { name: "AES-GCM", length: 256 },
  true,
  ["encrypt", "decrypt"]
);</code></pre>

<h3>3. Criptografia de dados</h3>
<pre><code>const ciphertext = await crypto.subtle.encrypt(
  { name: "AES-GCM", iv, additionalData, tagLength: 128 },
  key,
  data
);</code></pre>

<h3>4. Derivação de chave com HKDF</h3>
<pre><code>const derivedKey = await crypto.subtle.deriveKey(
  { name: "HKDF", hash: "SHA-256", salt, info: new TextEncoder().encode(messageId) },
  keyMaterial,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt", "decrypt"]
);</code></pre>

<h2>Construindo uma arquitetura de conhecimento zero</h2>
<p>A Web Crypto API facilita a construção de sistemas de conhecimento zero. O padrão usado pelo <a href="/">Only Once Share</a>: gerar chave no navegador, criptografar no cliente, enviar apenas texto cifrado ao servidor, colocar a chave no fragmento da URL (<code>#</code>).</p>

<h2>Conclusão</h2>
<p>A Web Crypto API fornece tudo que você precisa para construir aplicações seguras e focadas em privacidade sem bibliotecas criptográficas externas.</p>
`
  },
  "zero-knowledge-architecture-deep-dive": {
    title: "Arquitetura de conhecimento zero: um mergulho técnico profundo",
    description: "Exploração técnica de padrões de arquitetura de conhecimento zero para aplicações web. Gerenciamento de chaves, fragmentos de URL e modelagem de ameaças.",
    content: `
<p>Arquitetura de conhecimento zero é um padrão de design de sistemas onde o provedor de serviço não pode acessar dados do usuário. Não por política — por impossibilidade matemática.</p>

<h2>Definindo conhecimento zero</h2>
<ol>
<li>Dados são criptografados antes de sair do cliente</li>
<li>O servidor nunca possui a chave de descriptografia</li>
<li>O servidor armazena apenas texto cifrado que não pode descriptografar</li>
<li>Descriptografia ocorre exclusivamente no cliente</li>
</ol>

<h2>O problema de distribuição de chaves</h2>
<h3>Solução 1: Fragmentos de URL</h3>
<p>A abordagem usada pelo <a href="/">Only Once Share</a>. A chave é colocada após o <code>#</code> na URL:</p>
<pre><code>https://ooshare.io/s/abc123#chave-de-descriptografia-aqui</code></pre>
<p>Fragmentos de URL são definidos no RFC 3986 como apenas para o cliente — navegadores nunca os incluem em requisições HTTP.</p>

<h3>Solução 2: Derivação de chave baseada em senha</h3>
<p>O usuário fornece uma senha, e PBKDF2 ou Argon2 deriva a chave de criptografia.</p>

<h3>Solução 3: Criptografia de chave pública</h3>
<p>O remetente criptografa com a chave pública do destinatário; apenas a chave privada do destinatário pode descriptografar.</p>

<h2>Modelo de ameaças</h2>
<h3>Ameaça: Servidor comprometido</h3>
<p><strong>Mitigação:</strong> Servidor só armazena dados criptografados. Sem chaves, os dados não têm valor.</p>

<h3>Ameaça: JavaScript malicioso</h3>
<p><strong>Mitigação:</strong> Open source + revisão de código, tags SRI, auto-hospedagem.</p>

<h2>Padrões de implementação</h2>
<pre><code>derivedKey = HKDF(masterKey, salt, info=messageId)</code></pre>
<pre><code>ciphertext = AES-GCM-Encrypt(key, iv, plaintext, aad=messageId)</code></pre>

<h2>Conclusão</h2>
<p>Arquitetura de conhecimento zero fornece a garantia de privacidade mais forte para aplicações web: certeza matemática de que o servidor não pode acessar dados do usuário.</p>
`
  },
  "password-sharing-remote-teams": {
    title: "Melhores práticas de compartilhamento de senhas para equipes remotas",
    description: "Como equipes distribuídas e remotas podem compartilhar senhas e credenciais com segurança através de fusos horários, dispositivos e canais de comunicação.",
    content: `
<p>Equipes remotas enfrentam desafios únicos ao compartilhar credenciais. Membros da equipe estão espalhados por fusos horários, usando dispositivos pessoais em várias redes.</p>

<h2>Desafio de segurança do trabalho remoto</h2>
<ul>
<li><strong>Redes domésticas</strong> — Frequentemente menos seguras que redes corporativas</li>
<li><strong>Dispositivos pessoais</strong> — Podem não ter configurações de segurança empresarial</li>
<li><strong>Múltiplas ferramentas de comunicação</strong> — Credenciais acabam em todos os lugares</li>
<li><strong>Diferenças de fuso horário</strong> — Credenciais ficam em mensagens por horas</li>
</ul>

<h2>Melhores práticas</h2>
<h3>1. Use links autodestrutivos para cada transferência de credencial</h3>
<p>Faça disso uma política da equipe: sem senhas em texto simples em nenhum canal. Cada transferência usa um link criptografado autodestrutivo de <a href="/">Only Once Share</a>.</p>

<h3>2. Defina tempos de expiração curtos</h3>

<h3>3. Estabeleça um gerenciador de senhas compartilhado</h3>

<h3>4. Use canais separados para link e contexto</h3>

<h2>Referência rápida</h2>
<table>
<thead><tr><th>Cenário</th><th>Ferramenta</th></tr></thead>
<tbody>
<tr><td>Transferência única de credencial</td><td>Link criptografado autodestrutivo</td></tr>
<tr><td>Credencial compartilhada contínua</td><td>Gerenciador de senhas da equipe</td></tr>
<tr><td>Segredos de aplicação/CI</td><td>Gerenciador de segredos (Vault, AWS Secrets Manager)</td></tr>
<tr><td>Configuração inicial de integração</td><td>Link autodestrutivo → inscrição no gerenciador de senhas</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>Equipes remotas compartilham credenciais com mais frequência e através de mais canais. Padronizando links criptografados autodestrutivos para transferências únicas e gerenciadores de senhas para acesso contínuo, você mantém a segurança sem desacelerar a equipe.</p>
`
  },
  "why-self-host-secret-sharing": {
    title: "Por que sua empresa deveria auto-hospedar sua ferramenta de compartilhamento de segredos",
    description: "O caso para auto-hospedar sua infraestrutura de compartilhamento de segredos. Soberania de dados, conformidade, controle e eliminação de confiança em terceiros.",
    content: `
<p>Usar um serviço hospedado de compartilhamento de segredos significa que seus dados criptografados passam pelos servidores de outra pessoa. Mesmo com criptografia de conhecimento zero, algumas organizações precisam — ou preferem — eliminar completamente o envolvimento de terceiros.</p>

<h2>O caso para auto-hospedagem</h2>
<h3>1. Soberania total de dados</h3>
<p>Quando você auto-hospeda, dados criptografados nunca saem da sua infraestrutura.</p>

<h3>2. Conformidade regulatória</h3>
<p>Muitas regulamentações exigem que dados permaneçam em jurisdições específicas: GDPR, HIPAA, SOC 2, PCI DSS.</p>

<h3>3. Eliminar confiança em terceiros</h3>
<p>Auto-hospedagem elimina esse requisito de confiança porque você controla a implantação do código.</p>

<h3>4. Isolamento de rede</h3>
<p>Permite executar a ferramenta em uma rede interna sem exposição à internet pública.</p>

<h3>5. Personalização</h3>
<p>Com o código open source, você pode personalizar branding, opções de TTL, limites de tamanho, integração com autenticação e auditoria.</p>

<h2>Custos de auto-hospedagem</h2>
<table>
<thead><tr><th>Recurso</th><th>Mínimo</th><th>Recomendado</th></tr></thead>
<tbody>
<tr><td>RAM</td><td>512 MB</td><td>1 GB</td></tr>
<tr><td>CPU</td><td>1 vCPU</td><td>2 vCPU</td></tr>
<tr><td>Custo mensal (VM cloud)</td><td>~$5</td><td>~$10</td></tr>
</tbody>
</table>

<h2>Começar</h2>
<pre><code>git clone https://github.com/dhdtech/only-once-share.git
cd only-once-share
docker compose up -d</code></pre>

<h2>Conclusão</h2>
<p>Auto-hospedar sua ferramenta de compartilhamento de segredos fornece a combinação definitiva de segurança, controle e conformidade. Elimina a confiança em terceiros, garante a soberania de dados e custa uma fração das alternativas comerciais.</p>
`
  },
  "state-of-secret-sharing-2026": {
    title: "O estado das ferramentas de compartilhamento de segredos em 2026",
    description: "Uma visão geral do cenário de compartilhamento de segredos em 2026: tendências de mercado, evolução da criptografia, visibilidade em busca por IA e para onde a indústria está indo.",
    content: `
<p>O mercado de compartilhamento de segredos únicos evoluiu significativamente. O que começou como uma categoria de ferramentas de nicho se tornou infraestrutura essencial para equipes conscientes de segurança.</p>

<h2>Visão geral do mercado</h2>
<p>O cenário inclui aproximadamente 10-15 produtos ativos, de SaaS empresarial a projetos open source.</p>

<h3>Players estabelecidos (5+ anos)</h3>
<ul>
<li><strong>OneTimeSecret</strong> (est. 2011) — A ferramenta que definiu a categoria.</li>
<li><strong>Password Pusher</strong> (est. ~2012) — A opção open source mais rica em recursos.</li>
</ul>

<h3>Desafiantes modernos (2-5 anos)</h3>
<ul>
<li><strong>password.link</strong> — Focado em empresas com SSO e domínios personalizados.</li>
<li><strong>scrt.link</strong> — Baseado na Suíça, criptografia no cliente.</li>
</ul>

<h3>Novos entrantes</h3>
<ul>
<li><strong><a href="/">Only Once Share</a></strong> — Gratuito, open source, conhecimento zero com AES-256-GCM e suporte a 6 idiomas.</li>
</ul>

<h2>Tendências-chave em 2026</h2>
<h3>1. Criptografia no cliente está se tornando o padrão</h3>
<p>A maioria dos novos entrantes usa criptografia no cliente com arquitetura de conhecimento zero por padrão.</p>

<h3>2. Open source é uma vantagem competitiva</h3>
<p>As ferramentas mais confiáveis são open source. Ferramentas de código fechado enfrentam um déficit de confiança crescente.</p>

<h3>3. Auto-hospedagem é mainstream</h3>
<p>Docker tornou a auto-hospedagem trivialmente fácil.</p>

<h3>4. Busca por IA está remodelando a descoberta</h3>
<p>Google AI Overviews, ChatGPT e Perplexity estão mudando como pessoas descobrem ferramentas.</p>

<h3>5. Suporte multilíngue importa</h3>
<p>Ferramentas apenas em inglês perdem mercados enormes na Ásia, América Latina e Oriente Médio.</p>

<h2>A lacuna de criptografia</h2>
<table>
<thead><tr><th>Ferramenta</th><th>Tipo de criptografia</th><th>Servidor vê texto simples?</th></tr></thead>
<tbody>
<tr><td>Only Once Share</td><td>Cliente (AES-256-GCM)</td><td>Não</td></tr>
<tr><td>scrt.link</td><td>Cliente</td><td>Não</td></tr>
<tr><td>Yopass</td><td>Cliente (OpenPGP)</td><td>Não</td></tr>
<tr><td>OneTimeSecret</td><td>Servidor</td><td>Sim</td></tr>
<tr><td>Password Pusher</td><td>Servidor</td><td>Sim</td></tr>
</tbody>
</table>

<h2>Conclusão</h2>
<p>O mercado de compartilhamento de segredos em 2026 é mais saudável e competitivo do que nunca. A tendência em direção à criptografia no cliente, open source e auto-hospedagem reflete um entendimento cada vez mais maduro de privacidade e segurança. Os dados que você protege hoje são a violação que você previne amanhã.</p>
`
  },
  "why-share-images-securely": {
    title: "Por que você deveria compartilhar imagens com segurança (e como fazer)",
    description: "Imagens carregam mais dados sensíveis do que você imagina. Saiba por que o compartilhamento seguro de imagens é importante para saúde, jurídico, RH e privacidade pessoal — e como links criptografados e autodestrutivos resolvem o problema.",
    content: `
<p>Quando as pessoas pensam em compartilhar segredos, pensam em senhas e chaves de API. Mas alguns dos dados mais sensíveis que compartilhamos diariamente vêm na forma de imagens — digitalizações de documentos de identidade, registros médicos, contratos assinados, fotos privadas. Diferente do texto, imagens são mais difíceis de censurar, mais fáceis de encaminhar e quase impossíveis de desfazer uma vez vazadas.</p>

<h2>Imagens são alvos de alto valor</h2>
<p>Uma senha vazada pode ser alterada em minutos. Uma imagem vazada do seu passaporte, exame médico ou foto privada não pode ser desfeita. Imagens carregam informações ricas e contextuais:</p>
<ul>
<li><strong>Documentos de identidade</strong> — passaportes, carteiras de motorista e documentos nacionais contêm nome completo, data de nascimento, foto e números de documento. Uma única digitalização vazada é suficiente para roubo de identidade.</li>
<li><strong>Registros médicos</strong> — raios-X, resultados de laboratório, prescrições e imagens diagnósticas são protegidos por regulamentações como HIPAA e LGPD. Compartilhá-los por e-mail ou chat cria risco de conformidade.</li>
<li><strong>Documentos legais</strong> — contratos assinados, documentos judiciais e cartas notariais frequentemente precisam ser compartilhados entre partes, mas nunca deveriam ficar em uma caixa de entrada.</li>
<li><strong>Registros financeiros</strong> — extratos bancários, formulários fiscais e documentos de seguros contêm números de conta e dados financeiros pessoais.</li>
</ul>

<h2>Cenários do mundo real</h2>
<p>Compartilhamento seguro de imagens não é uma necessidade de nicho. Surge constantemente em contextos profissionais e pessoais.</p>

<h3>Saúde</h3>
<p>Um médico precisa compartilhar uma imagem diagnóstica com um especialista. Enviar por e-mail significa que ela fica em duas caixas de entrada indefinidamente. Com um link criptografado e autodestrutivo, o especialista visualiza a imagem uma vez e ela é permanentemente excluída.</p>

<h3>Jurídico e conformidade</h3>
<p>Um advogado envia ao cliente a foto de um acordo assinado. O documento não deveria persistir em threads de e-mail. Um link de uso único garante que seja visualizado e depois desapareça.</p>

<h3>Recursos humanos</h3>
<p>Novos funcionários enviam digitalizações de documentos de identidade e autorizações de trabalho. Departamentos de RH que recebem esses documentos por e-mail acumulam documentos de identidade — alvo principal para violações de dados. Links autodestrutivos resolvem isso.</p>

<h3>Imobiliário e finanças</h3>
<p>Solicitações de hipotecas, escrituras e extratos bancários frequentemente precisam ser compartilhados entre corretores e clientes. Contêm números de conta e assinaturas que não deveriam ficar em threads de e-mail.</p>

<h3>Privacidade pessoal</h3>
<p>Às vezes você precisa enviar uma foto do seu cartão de seguro para um familiar ou compartilhar uma captura de tela de uma conversa privada. Apps de mensagens armazenam imagens em seus servidores e sincronizam com backups na nuvem. Um link criptografado autodestrutivo devolve o controle a você.</p>

<h2>Por que os métodos tradicionais falham</h2>

<h3>E-mail</h3>
<p>O e-mail armazena mensagens e anexos indefinidamente em múltiplos servidores. A maioria dos e-mails não tem criptografia de ponta a ponta. Imagens enviadas por e-mail são trivialmente fáceis de encaminhar.</p>

<h3>Apps de mensagens</h3>
<p>WhatsApp, Slack e Teams frequentemente comprimem e armazenam imagens em seus servidores. Mesmo recursos de "mensagens que desaparecem" não são confiáveis — destinatários podem fazer capturas de tela e políticas de retenção corporativa podem anular as configurações de exclusão.</p>

<h3>Links de armazenamento na nuvem</h3>
<p>Links do Google Drive, Dropbox e OneDrive são persistentes por padrão. Revogar acesso requer ação manual e o arquivo permanece nos servidores do provedor.</p>

<h2>Como links criptografados autodestrutivos resolvem isso</h2>
<p>A ideia central é simples: criptografar a imagem no seu navegador antes de sair do dispositivo, enviar apenas os dados criptografados e gerar um link de uso único. O destinatário abre o link, a imagem é descriptografada no navegador e os dados criptografados são permanentemente excluídos do servidor.</p>
<ul>
<li><strong>Criptografia de conhecimento zero</strong> — O servidor nunca vê a imagem original.</li>
<li><strong>Recuperação única</strong> — A imagem só pode ser visualizada uma vez. Depois, os dados são excluídos atomicamente.</li>
<li><strong>Sem persistência</strong> — Diferente de anexos de e-mail ou links na nuvem, não há cópia esperando para ser violada.</li>
<li><strong>Criptografia no cliente</strong> — A chave de criptografia nunca toca o servidor.</li>
</ul>

<h2>Como o Only Once Share lida com compartilhamento de imagens</h2>
<p><a href="/">Only Once Share</a> suporta compartilhamento de imagens criptografadas:</p>
<ol>
<li><strong>Selecione ou arraste sua imagem</strong> — Arraste e solte ou clique para selecionar um arquivo.</li>
<li><strong>Criptografia no cliente</strong> — A imagem é criptografada no seu navegador usando AES-256-GCM com chave derivada via HKDF-SHA-256.</li>
<li><strong>Compartilhe o link</strong> — Você recebe um link de uso único com a chave incorporada no fragmento da URL.</li>
<li><strong>Destinatário visualiza uma vez</strong> — O destinatário abre o link, a imagem é descriptografada no navegador e os dados são permanentemente excluídos.</li>
</ol>

<h2>Melhores práticas para compartilhar imagens sensíveis</h2>
<ul>
<li><strong>Use o menor tempo de expiração prático</strong> — Se o destinatário abrirá o link em uma hora, configure um TTL de 1 hora.</li>
<li><strong>Nunca use e-mail para digitalizações de documentos</strong> — Passaportes e documentos de identidade nunca deveriam estar no e-mail.</li>
<li><strong>Verifique o destinatário antes de compartilhar</strong> — Um link autodestrutivo é tão seguro quanto o canal que você usa para enviá-lo.</li>
<li><strong>Evite armazenamento na nuvem para compartilhamento temporário</strong> — Se o destinatário só precisa ver a imagem uma vez, um link persistente na nuvem é excessivo.</li>
<li><strong>Verifique requisitos de conformidade</strong> — Se você lida com imagens médicas (HIPAA), dados pessoais (LGPD/GDPR) ou registros financeiros, links criptografados autodestrutivos ajudam a cumprir requisitos de minimização de dados.</li>
</ul>

<h2>Conclusão</h2>
<p>Imagens carregam mais informações sensíveis do que a maioria das pessoas percebe. De exames médicos a documentos de identidade e fotos privadas, as consequências de um vazamento de imagem são frequentemente muito piores do que uma senha vazada. Métodos tradicionais — e-mail, apps de mensagens, links na nuvem — não foram projetados para compartilhamento seguro e único. Links criptografados e autodestrutivos fecham essa lacuna. Da próxima vez que precisar compartilhar uma imagem sensível, pule o anexo de e-mail e <a href="/">crie um link autodestrutivo</a>.</p>
`
  },
  "password-protected-photo-sharing": {
    title: "Compartilhamento de Fotos com Proteção por Senha: Como Enviar Fotos Privadas com Segurança",
    description: "Aprenda como compartilhar fotos com segurança usando proteção por senha e criptografia de ponta a ponta. Descubra por que os métodos tradicionais falham e como links criptografados autodestrutivos mantêm suas imagens privadas protegidas.",
    content: `
<p>Compartilhar fotos de forma privada não deveria significar confiar a um terceiro suas imagens sem criptografia. Seja enviando digitalizações de documentos para um banco, imagens médicas para um médico, fotos particulares de família para um parente ou capturas de tela confidenciais para um colega, você precisa de um método que mantenha suas fotos protegidas desde o momento em que saem do seu dispositivo até o destinatário visualizá-las — e então as destrua permanentemente.</p>

<h2>O Que É o Compartilhamento de Fotos com Proteção por Senha?</h2>
<p>Compartilhamento de fotos com proteção por senha significa criptografar uma foto antes de enviá-la para que apenas alguém com a chave ou senha correta possa visualizá-la. O objetivo é garantir que ninguém — nem o servidor, nem a rede, nem um hacker — consiga ver a foto sem autorização. A forma mais forte disso é a <strong>criptografia de ponta a ponta</strong>, onde a foto é criptografada no dispositivo do remetente e descriptografada apenas no dispositivo do destinatário.</p>
<p>O compartilhamento "protegido por senha" tradicional — como proteger por senha um arquivo ZIP ou um link do Google Drive — ainda faz upload do arquivo não criptografado para um servidor. O servidor consegue ver sua foto. A senha apenas controla o acesso, ela não criptografa o conteúdo. O verdadeiro compartilhamento de fotos com proteção por senha significa que o servidor nunca vê a imagem original.</p>

<h2>Por Que os Métodos Tradicionais de Compartilhamento de Fotos São Inseguros</h2>
<h3>Anexos de E-mail</h3>
<p>O e-mail armazena fotos indefinidamente em múltiplos servidores (remetente, destinatário, backups). A maioria dos e-mails não tem criptografia de ponta a ponta. Uma conta de e-mail comprometida expõe todas as fotos já enviadas por ela. Anexos são trivialmente fáceis de encaminhar, e "excluir" um e-mail não o remove dos backups do servidor.</p>
<h3>Aplicativos de Mensagens</h3>
<p>WhatsApp, Telegram, Slack e Teams armazenam imagens em seus servidores. Mesmo aplicativos com recursos de "mensagens que desaparecem" não são confiáveis — os destinatários podem fazer capturas de tela, o aplicativo pode armazenar imagens em cache localmente e políticas de retenção corporativa podem anular as configurações de exclusão. A sincronização na nuvem (iCloud, Google Fotos) significa que imagens excluídas podem persistir em backups.</p>
<h3>Links de Armazenamento na Nuvem</h3>
<p>Links do Google Drive, Dropbox e OneDrive são persistentes por padrão. O arquivo fica nos servidores do provedor indefinidamente. Revogar o acesso requer ação manual, e links compartilhados podem ser encaminhados sem que o remetente saiba. O próprio provedor pode acessar seus arquivos não criptografados.</p>
<h3>Arquivos ZIP com Proteção por Senha</h3>
<p>Embora melhor do que texto simples, a proteção por senha de ZIP tem sérias vulnerabilidades. O arquivo ainda precisa ser transmitido por um canal inseguro. A própria senha precisa de um canal seguro separado. O ZIP criptografado persiste onde quer que tenha sido enviado. E a criptografia ZIP comum (ZipCrypto) é conhecida por ser criptograficamente fraca.</p>

<h2>Como Funcionam os Links Criptografados Autodestrutivos</h2>
<p>A abordagem mais segura para compartilhamento de fotos com proteção por senha combina três princípios: <strong>criptografia no cliente</strong>, <strong>arquitetura de conhecimento zero</strong> e <strong>recuperação única</strong>.</p>
<ol>
<li><strong>Criptografia no cliente</strong> — Sua foto é criptografada no seu navegador usando AES-256-GCM antes de sair do dispositivo. O servidor recebe apenas bytes criptografados que não consegue ler.</li>
<li><strong>Arquitetura de conhecimento zero</strong> — A chave de criptografia é colocada no fragmento da URL (a parte após o #). Navegadores nunca enviam fragmentos de URL para servidores. O servidor literalmente não consegue descriptografar sua foto, mesmo que quisesse.</li>
<li><strong>Recuperação única</strong> — Quando o destinatário abre o link, a foto criptografada é buscada e atomicamente excluída do servidor na mesma operação. A foto só pode ser visualizada uma vez e, em seguida, é permanentemente destruída.</li>
</ol>
<p>Isso é fundamentalmente diferente de "proteger por senha" um arquivo em um serviço de nuvem. Não há cópia não criptografada em nenhum servidor, nenhum link persistente que possa ser compartilhado ainda mais, e nenhuma janela onde os dados possam ser interceptados.</p>

<h2>Casos de Uso no Mundo Real</h2>
<h3>Verificação de Identidade</h3>
<p>Bancos, proprietários e empregadores frequentemente pedem fotos do seu RG, passaporte ou carteira de motorista. Enviá-las por e-mail cria um registro permanente dos seus documentos de identidade em múltiplas contas de e-mail e backups de servidor. Com links criptografados autodestrutivos, o verificador vê seu documento uma vez, confirma as informações e a imagem é permanentemente destruída.</p>
<h3>Imagens Médicas</h3>
<p>Médicos que compartilham raios-X, ressonâncias magnéticas ou resultados de laboratório com especialistas precisam de um método que cumpra com a LGPD e o GDPR. O e-mail não atende a esses requisitos. Um link criptografado e autodestrutivo garante que a imagem seja visualizada uma vez pelo destinatário pretendido e então permanentemente excluída — satisfazendo os princípios de minimização de dados.</p>
<h3>Documentos Legais</h3>
<p>Fotos de contratos assinados, petições judiciais ou documentos notarizados frequentemente precisam ser compartilhadas entre as partes. Elas não deveriam persistir em tópicos de e-mail que podem ser encaminhados, intimados ou violados. Um link criptografado de uso único garante que o documento seja visualizado e então destruído.</p>
<h3>Fotos Pessoais Privadas</h3>
<p>Fotos de família, momentos privados ou imagens pessoais sensíveis merecem o mesmo nível de proteção. Aplicativos de mensagens comuns armazenam essas imagens em seus servidores, as sincronizam com backups na nuvem e as tornam pesquisáveis. Um link criptografado autodestrutivo coloca você de volta no controle das suas fotos privadas.</p>
<h3>Capturas de Tela Empresariais e Confidenciais</h3>
<p>Capturas de tela de painéis internos, relatórios financeiros ou designs de produtos não lançados são frequentemente compartilhadas entre membros da equipe. Elas nunca deveriam ficar em canais do Slack ou tópicos de e-mail onde poderiam ser acessadas por pessoas não autorizadas meses depois.</p>

<h2>Como o Only Once Share Trata o Compartilhamento de Fotos com Proteção por Senha</h2>
<p><a href="/">Only Once Share</a> oferece compartilhamento de fotos com proteção por senha com criptografia de nível militar:</p>
<ol>
<li><strong>Adicione sua foto</strong> — Arraste e solte ou clique para selecionar uma imagem (JPEG, PNG, GIF, WebP de até 25 MB). Você também pode incluir uma mensagem de texto ou um PDF junto com a foto.</li>
<li><strong>Criptografia automática</strong> — Sua foto é criptografada no seu navegador usando AES-256-GCM com uma chave derivada via HKDF-SHA-256. O servidor recebe apenas bytes criptografados.</li>
<li><strong>Obtenha um link de uso único</strong> — A chave de criptografia é incorporada no fragmento da URL (após o #) e nunca enviada a nenhum servidor.</li>
<li><strong>Compartilhe o link</strong> — Envie o link por qualquer canal (WhatsApp, e-mail, SMS). Mesmo que o canal seja comprometido, a foto criptografada não pode ser lida sem a URL completa.</li>
<li><strong>Destinatário visualiza uma vez</strong> — O destinatário abre o link, a foto é descriptografada no navegador e os dados criptografados são permanentemente excluídos do servidor via exclusão atômica.</li>
</ol>
<p>Todo o processo é gratuito, de código aberto e não requer conta ou cadastro. Você pode <a href="/security">revisar a arquitetura de segurança</a> ou <a href="https://github.com/dhdtech/only-once-share">auditar o código-fonte</a> por conta própria.</p>

<h2>O Que Procurar em uma Ferramenta Segura de Compartilhamento de Fotos</h2>
<p>Ao escolher uma ferramenta para compartilhamento de fotos com proteção por senha, verifique estes critérios:</p>
<ul>
<li><strong>Criptografia no cliente</strong> — A foto deve ser criptografada no seu navegador, não no servidor.</li>
<li><strong>Arquitetura de conhecimento zero</strong> — O servidor nunca deve ter acesso à chave de criptografia.</li>
<li><strong>Recuperação única</strong> — A foto deve ser permanentemente excluída após a primeira visualização.</li>
<li><strong>Código aberto</strong> — Você deve poder auditar o código de criptografia.</li>
<li><strong>Sem necessidade de conta</strong> — Criar contas introduz mais uma superfície de ataque.</li>
<li><strong>Expiração automática</strong> — Mesmo que o destinatário nunca abra o link, os dados criptografados devem ser automaticamente excluídos após um prazo definido.</li>
</ul>

<h2>Melhores Práticas para Compartilhar Fotos com Segurança</h2>
<ul>
<li><strong>Nunca envie documentos de identidade ou imagens médicas por e-mail</strong> — Use links criptografados de uso único.</li>
<li><strong>Defina o menor prazo de expiração prático</strong> — Se o destinatário visualizará em uma hora, defina um TTL de 1 hora.</li>
<li><strong>Verifique o destinatário</strong> — Um link autodestrutivo é tão seguro quanto o canal que você usa para entregá-lo.</li>
<li><strong>Não use armazenamento na nuvem para compartilhamento único</strong> — Links do Google Drive e Dropbox persistem.</li>
<li><strong>Verifique requisitos de conformidade</strong> — Se você trata imagens médicas (HIPAA), dados pessoais (LGPD/GDPR) ou registros financeiros, links criptografados autodestrutivos ajudam a cumprir os requisitos de minimização de dados.</li>
</ul>

<h2>Conclusão</h2>
<p>Compartilhamento de fotos com proteção por senha não significa apenas adicionar uma senha a um arquivo — significa garantir que suas fotos sejam criptografadas antes de sair do dispositivo, transmitidas por um servidor de conhecimento zero e permanentemente destruídas após a visualização. Métodos tradicionais como e-mail, aplicativos de mensagens e links na nuvem falham em todos os três critérios. Links criptografados e autodestrutivos oferecem a forma mais forte de proteção de fotos disponível hoje. Da próxima vez que precisar compartilhar uma foto sensível, pule o anexo de e-mail e <a href="/">crie um link criptografado autodestrutivo</a>.</p>
`
  },
  "when-to-share-pdfs-securely": {
    title: "Quando você realmente precisa compartilhar PDFs com segurança?",
    description: "PDFs carregam contratos, prontuários médicos, declarações de imposto e muito mais. Conheça os cenários reais em que o compartilhamento seguro de PDFs é essencial — e por que anexos de e-mail não são suficientes.",
    content: `
<p>PDFs são o formato universal para documentos importantes. Contratos, declarações de imposto de renda, prontuários médicos, extratos bancários, petições judiciais — quando uma informação é importante o suficiente para ser formalizada, quase sempre acaba em um PDF. No entanto, a maioria das pessoas compartilha esses documentos da mesma forma que compartilha fotos de gatos: como anexos de e-mail ou links de armazenamento na nuvem que persistem indefinidamente e podem ser encaminhados para qualquer pessoa.</p>

<p>Nem todo PDF precisa de criptografia de nível militar. Mas muitos precisam — e os momentos em que o compartilhamento seguro é necessário são mais comuns do que você imagina.</p>

<h2>Contratos e acordos legais</h2>
<p>Quando duas partes trocam um contrato assinado, o PDF normalmente contém nomes, endereços, termos financeiros, assinaturas e, às vezes, números de documentos de identificação emitidos pelo governo. Enviar isso como anexo de e-mail significa que ambas as partes agora têm uma cópia permanente em seus e-mails — pesquisável, encaminhável e vulnerável a qualquer violação futura da conta.</p>
<p>Escritórios de advocacia, corretores de imóveis e freelancers compartilham contratos constantemente. Uma única conta de e-mail comprometida pode expor dezenas de acordos, cada um contendo informações pessoais suficientes para roubo de identidade. O compartilhamento seguro de PDFs com links de uso único garante que o documento seja visualizado e depois permanentemente excluído do servidor, sem deixar cópias remanescentes para invasores encontrarem.</p>

<h2>Documentos fiscais e registros financeiros</h2>
<p>A época de declaração de imposto de renda é uma mina de ouro para ladrões de identidade. Informes de rendimentos, declarações de imposto de renda, extratos bancários e comprovantes de renda contêm CPF, detalhes de rendimentos, informações do empregador e números de contas bancárias — tudo o que é necessário para fazer uma declaração de imposto fraudulenta ou abrir linhas de crédito em nome de outra pessoa.</p>
<p>Contadores e preparadores fiscais rotineiramente recebem esses documentos de clientes por e-mail. Alguns usam portais de clientes, mas muitos ainda dependem de anexos de e-mail ou links compartilhados do Google Drive. Cada uma dessas cópias persistentes é uma vulnerabilidade. Um link criptografado autodestrutivo elimina a janela de exposição: o contador baixa o documento e a cópia no servidor desaparece.</p>

<h2>Prontuários médicos e informações de saúde</h2>
<p>PDFs médicos — resultados de exames, laudos de imagem, receitas médicas, solicitações de reembolso de plano de saúde — estão entre os documentos mais sensíveis que uma pessoa pode compartilhar. No Brasil, a LGPD exige que dados pessoais sensíveis, incluindo dados de saúde, sejam transmitidos com salvaguardas apropriadas. Na União Europeia, o GDPR impõe requisitos semelhantes para dados de saúde.</p>
<p>Pacientes frequentemente precisam compartilhar prontuários médicos com novos médicos, operadoras de planos de saúde ou familiares. Enviar por e-mail um PDF com seus resultados de exames significa que esse documento agora existe em pelo menos quatro lugares: sua pasta de enviados, a caixa de entrada do destinatário e os sistemas de backup de ambos os provedores de e-mail. Um link criptografado de conhecimento zero com expiração automática atende ao princípio de minimização de dados que tanto a LGPD quanto o GDPR enfatizam.</p>

<h2>Documentos de RH e integração de funcionários</h2>
<p>Novos funcionários enviam uma enxurrada de PDFs sensíveis durante a integração: documentos de identidade emitidos pelo governo, CPF, dados bancários para depósito de salário, cartas de oferta assinadas com informações salariais e autorizações de verificação de antecedentes. Equipes de RH que coletam esses documentos por e-mail estão criando um verdadeiro tesouro de dados pessoais espalhados por caixas de entrada.</p>
<p>Mesmo empresas com portais de RH adequados às vezes recorrem ao e-mail quando o portal está fora do ar, o novo funcionário trabalha remotamente ou o processo está sendo feito às pressas. O compartilhamento seguro de PDFs oferece uma alternativa confiável que não compromete os dados dos funcionários. A equipe de RH recebe o documento e a cópia criptografada se autodestrói.</p>

<h2>Sinistros de seguros e documentos comprobatórios</h2>
<p>Registrar um sinistro de seguro frequentemente exige compartilhar PDFs de boletins de ocorrência, contas médicas, avaliações de danos materiais e orçamentos de reparo. Esses documentos contêm dados pessoais, valores financeiros e, às vezes, fotografias de propriedades danificadas ou lesões.</p>
<p>Corretores e peritos de seguros lidam com milhares desses documentos. Uma violação do e-mail de um corretor de seguros poderia expor as informações pessoais de cada cliente que já enviou um sinistro por e-mail. Links criptografados de uso único limitam a exposição ao momento da visualização, após o qual os dados não existem mais em nenhum servidor.</p>

<h2>Propriedade intelectual e documentos empresariais confidenciais</h2>
<p>Acordos de confidencialidade (NDAs), pedidos de patente, roteiros de produtos, projeções financeiras e documentos de fusões e aquisições são rotineiramente compartilhados como PDFs entre empresas, escritórios de advocacia e investidores. Esses documentos representam valor comercial significativo e vantagem competitiva.</p>
<p>Um pedido de patente vazado pode destruir a posição competitiva de uma empresa. Um documento de fusão e aquisição encaminhado pode desencadear investigações de uso de informações privilegiadas. Métodos tradicionais de compartilhamento de arquivos — e-mail, Slack, Google Drive — todos criam cópias persistentes que podem ser acessadas por qualquer pessoa que obtenha acesso à conta. Links criptografados autodestrutivos garantem que o documento seja visto apenas pelo destinatário pretendido e apenas uma vez.</p>

<h2>Documentos de identificação pessoal</h2>
<p>Digitalizações de passaporte, cópias de carteira de motorista, comprovantes de endereço e certidões de nascimento são frequentemente compartilhados como PDFs para verificação de identidade. Bancos, proprietários de imóveis, empregadores e órgãos governamentais solicitam esses documentos.</p>
<p>Uma digitalização de passaporte roubada é uma das mercadorias mais valiosas na dark web. No entanto, as pessoas rotineiramente enviam PDFs de passaporte por e-mail para proprietários em candidaturas de aluguel ou para bancos na abertura de contas. Cada e-mail cria uma cópia permanente que pode ser exposta em uma violação futura. Um link autodestrutivo garante que o verificador veja o documento e ele desapareça — sem cópias persistentes, sem exposição de longo prazo.</p>

<h2>Descoberta legal e processos judiciais</h2>
<p>Advogados compartilham PDFs relacionados a casos com clientes, colegas de escritório, peritos e tribunais. Esses documentos frequentemente contêm transcrições de depoimentos, resumos de provas, propostas de acordo e comunicações privilegiadas. O sigilo profissional pode ser quebrado se documentos privilegiados forem inadvertidamente divulgados a terceiros.</p>
<p>Usar links criptografados de uso único para compartilhar PDFs jurídicos sensíveis adiciona uma camada de proteção contra divulgação acidental. Se o link já foi aberto, uma parte não autorizada que obtenha a URL não encontrará nada — o documento não existe mais.</p>

<h2>Por que anexos de e-mail não são suficientes</h2>
<p>O e-mail foi projetado para comunicação, não para transferência segura de documentos. Quando você anexa um PDF a um e-mail:</p>
<ul>
<li><strong>Ele persiste em múltiplos locais</strong> — caixa de saída do remetente, caixa de entrada do destinatário, backups de ambos os servidores de e-mail e quaisquer cópias encaminhadas</li>
<li><strong>Pode ser encaminhado sem seu conhecimento</strong> — você não tem controle sobre quem vê o documento após enviá-lo</li>
<li><strong>É indexado e pesquisável</strong> — a busca de e-mail torna trivial encontrar "declaração de imposto" ou "passaporte" em uma conta comprometida</li>
<li><strong>Não possui criptografia em repouso</strong> — a maioria dos provedores de e-mail armazena mensagens de forma que seus próprios funcionários (ou uma ordem judicial) possam acessá-las</li>
<li><strong>Não tem expiração</strong> — o anexo existe até que alguém o exclua manualmente, o que a maioria das pessoas nunca faz</li>
</ul>

<h2>Por que links de armazenamento na nuvem são insuficientes</h2>
<p>Compartilhar PDFs via links do Google Drive, Dropbox ou OneDrive é melhor do que anexos de e-mail, mas ainda é problemático:</p>
<ul>
<li><strong>Links podem ser compartilhados além do destinatário pretendido</strong> — qualquer pessoa com o link (ou que adivinhe o padrão da URL) pode acessar o arquivo</li>
<li><strong>Arquivos persistem até serem excluídos manualmente</strong> — a maioria das pessoas se esquece de revogar o acesso ou excluir arquivos compartilhados</li>
<li><strong>O provedor de nuvem pode acessar seus arquivos</strong> — o PDF é armazenado em texto simples nos servidores do provedor</li>
<li><strong>Logs de acesso podem ser intimados</strong> — quem acessou qual documento e quando é rastreado pelo provedor</li>
</ul>

<h2>Como o Only Once Share lida com o compartilhamento seguro de PDFs</h2>
<p><a href="/">Only Once Share</a> foi criado exatamente para esses cenários. Veja como funciona:</p>
<ol>
<li><strong>Faça upload do seu PDF</strong> — Selecione um arquivo PDF de até 25 MB. Você também pode incluir uma mensagem de texto ou imagem junto com ele.</li>
<li><strong>Criptografia no navegador</strong> — O PDF é criptografado no seu navegador usando AES-256-GCM com uma chave derivada via HKDF-SHA-256. O servidor só recebe bytes criptografados — ele não consegue ler seu documento.</li>
<li><strong>Obtenha um link de uso único</strong> — A chave de criptografia é incorporada no fragmento da URL (após o #), que nunca é enviado a nenhum servidor.</li>
<li><strong>Compartilhe o link</strong> — Envie por qualquer canal. Mesmo que o canal seja comprometido, o PDF criptografado não pode ser descriptografado sem a URL completa.</li>
<li><strong>Destinatário visualiza uma vez</strong> — O destinatário abre o link, o PDF é descriptografado no navegador e os dados criptografados são permanentemente excluídos do servidor via exclusão atômica.</li>
</ol>
<p>Sem contas. Sem cadastro. Sem cópias persistentes. <a href="/security">Revise a arquitetura de segurança completa</a> ou <a href="https://github.com/dhdtech/only-once-share">audite o código-fonte</a>.</p>

<h2>Quando você deve usar o compartilhamento seguro de PDFs</h2>
<p>Como regra geral, use links criptografados autodestrutivos sempre que um PDF contiver:</p>
<ul>
<li><strong>Identificadores pessoais</strong> — CPF, números de passaporte, números de carteira de motorista</li>
<li><strong>Informações financeiras</strong> — números de contas bancárias, declarações de imposto de renda, detalhes salariais, registros de investimentos</li>
<li><strong>Informações de saúde</strong> — prontuários médicos, resultados de exames, sinistros de seguros</li>
<li><strong>Conteúdo jurídico</strong> — contratos, petições judiciais, comunicações entre advogado e cliente</li>
<li><strong>Segredos empresariais</strong> — segredos comerciais, pedidos de patente, projeções financeiras, documentos de fusões e aquisições</li>
<li><strong>Credenciais de autenticação</strong> — qualquer documento contendo senhas, chaves de API ou tokens de acesso</li>
</ul>
<p>Se o PDF causaria dano — financeiro, legal, reputacional ou pessoal — caso caísse em mãos erradas, ele merece compartilhamento criptografado de uso único.</p>

<h2>Conclusão</h2>
<p>PDFs carregam as informações mais importantes das nossas vidas profissionais e pessoais. A conveniência de anexos de e-mail e links na nuvem normalizou uma prática perigosa: deixar documentos sensíveis permanentemente acessíveis em sistemas que nunca foram projetados para protegê-los. Links criptografados e autodestrutivos resolvem isso garantindo que o documento exista apenas no momento em que é necessário e seja permanentemente destruído depois. Da próxima vez que precisar compartilhar um contrato, declaração de imposto, prontuário médico ou qualquer PDF sensível, pule o anexo de e-mail e <a href="/">crie um link seguro de uso único</a>.</p>
`
  },
  "share-zip-files-securely": {
    title: "Como Compartilhar Arquivos ZIP com Segurança: Arquivos Criptografados com Links Autodestrutivos",
    description: "Arquivos ZIP frequentemente contêm lotes de documentos sensíveis. Saiba como compartilhar arquivos compactados com segurança usando links criptografados de uso único em vez de anexos de e-mail ou armazenamento em nuvem.",
    content: `
<p>Arquivos ZIP são a forma como agrupamos documentos sensíveis. Um pacote de contratação com cartas de oferta, formulários fiscais e cópias de documentos de identidade. Uma entrega de projeto com código-fonte e credenciais. Um pacote de descoberta jurídica com centenas de documentos do caso. Quando você compacta arquivos, geralmente está criando um pacote de coisas importantes — e, ainda assim, a maioria das pessoas compartilha esses arquivos por e-mail ou links na nuvem que persistem para sempre.</p>
<p>Isso é um problema. Um arquivo ZIP contendo dez documentos sensíveis representa dez vezes a exposição de compartilhar apenas um. E a abordagem padrão — proteger o ZIP com senha — tem fraquezas graves que a maioria das pessoas não compreende.</p>

<h2>Por que ZIPs Protegidos por Senha Não São Suficientes</h2>
<p>Quando você cria um arquivo ZIP protegido por senha usando o método padrão ZipCrypto (o padrão no Windows e na maioria das ferramentas de compactação), a criptografia é notavelmente fraca. O ZipCrypto possui vulnerabilidades conhecidas desde a década de 1990 e pode ser quebrado com ferramentas disponíveis gratuitamente. Mesmo a opção mais forte AES-256 disponível no 7-Zip e WinRAR tem um problema fundamental: você precisa compartilhar a senha separadamente.</p>
<p>A maioria das pessoas acaba enviando o ZIP em um e-mail e a senha em outro — ou pior, no mesmo e-mail. Ambos os e-mails persistem em caixas de entrada, pastas de enviados e backups de servidores. Um invasor que comprometa qualquer uma das contas de e-mail obtém tanto o arquivo quanto a senha. A "proteção" é ilusória.</p>

<h2>Quando Você Precisa Compartilhar Arquivos Compactados com Segurança</h2>

<h3>Entregas de Projetos para Clientes</h3>
<p>Freelancers e agências rotineiramente enviam entregáveis de projetos como arquivos ZIP: código-fonte, assets de design, exportações de banco de dados, arquivos de configuração com chaves de API. Esses arquivos frequentemente contêm credenciais ou código proprietário que não devem persistir em tópicos de e-mail após a conclusão da entrega.</p>

<h3>Pacotes de Documentos de RH</h3>
<p>A integração de um novo funcionário frequentemente significa coletar um conjunto de documentos sensíveis: carta de oferta assinada, cópia de documento de identidade, CPF, formulário de dados bancários, autorização de verificação de antecedentes. Equipes de RH que recebem esses documentos como anexos ZIP criam um pacote concentrado de dados pessoais parado na caixa de entrada indefinidamente.</p>

<h3>Pacotes de Descoberta Jurídica</h3>
<p>Escritórios de advocacia trocam grandes conjuntos de documentos durante a descoberta — transcrições de depoimentos, contratos, registros financeiros, correspondências. Esses arquivos ZIP frequentemente contêm material privilegiado ou confidencial que poderia causar danos graves se divulgado a partes não autorizadas. A persistência do e-mail torna cada pacote transmitido um passivo de longo prazo.</p>

<h3>Pacotes de Documentos Financeiros</h3>
<p>Contadores, auditores e consultores financeiros recebem arquivos ZIP contendo declarações de imposto de renda, extratos bancários, registros de investimentos e relatórios financeiros corporativos. Cada arquivo compactado é um perfil financeiro completo que poderia permitir fraude ou roubo de identidade se caísse em mãos erradas.</p>

<h3>Código-Fonte e Credenciais</h3>
<p>Desenvolvedores compartilham arquivos ZIP contendo bases de código, configurações de ambiente, chaves SSH, credenciais de API e strings de conexão com banco de dados. Um único arquivo comprometido pode fornecer acesso completo a sistemas de produção. Esses nunca devem persistir em canais de comunicação.</p>

<h3>Transferências de Prontuários Médicos</h3>
<p>Pacientes que mudam de profissional de saúde frequentemente precisam transferir conjuntos de prontuários médicos — resultados de exames laboratoriais, laudos de imagem, históricos de prescrições, documentos de seguros. A LGPD e regulamentações de saúde exigem salvaguardas adequadas para informações de saúde protegidas, e um arquivo ZIP parado em uma caixa de entrada de e-mail não se qualifica.</p>

<h2>O Problema com E-mail e Armazenamento em Nuvem</h2>
<p>Compartilhar arquivos ZIP via e-mail ou links na nuvem tem os mesmos problemas fundamentais de compartilhar qualquer arquivo sensível por esses canais, amplificados pelo fato de que arquivos compactados contêm múltiplos documentos:</p>
<ul>
<li><strong>Persistência</strong> — O ZIP fica em pastas de enviados, caixas de entrada e backups de servidores indefinidamente. Uma conta comprometida expõe o pacote inteiro.</li>
<li><strong>Encaminhamento</strong> — O destinatário pode encaminhar o pacote inteiro para qualquer pessoa sem o seu conhecimento.</li>
<li><strong>Acesso na nuvem</strong> — Google Drive, Dropbox e OneDrive armazenam seus arquivos em texto simples em seus servidores. O provedor (e qualquer pessoa que comprometa o provedor) pode acessá-los.</li>
<li><strong>Sem expiração</strong> — Links e anexos permanecem acessíveis até que alguém os exclua manualmente, o que quase nunca acontece.</li>
<li><strong>Exposição multiplicada</strong> — Um ZIP com 20 documentos representa 20 vezes a exposição de uma violação de arquivo único.</li>
</ul>

<h2>Como o Only Once Share Lida com o Compartilhamento Seguro de Arquivos</h2>
<p><a href="/">Only Once Share</a> resolve esses problemas com links criptografados e autodestrutivos:</p>
<ol>
<li><strong>Faça upload do seu arquivo ZIP</strong> — Selecione um arquivo ZIP, RAR, 7Z ou TAR.GZ de até 25 MB. Você também pode incluir uma mensagem de texto junto.</li>
<li><strong>Criptografia no navegador</strong> — O arquivo é criptografado no seu navegador usando AES-256-GCM com uma chave derivada via HKDF-SHA-256. O servidor só recebe bytes criptografados — ele não consegue ler ou extrair seus arquivos.</li>
<li><strong>Obtenha um link de uso único</strong> — A chave de criptografia é incorporada no fragmento da URL (após o #), que nunca é enviado a nenhum servidor.</li>
<li><strong>Compartilhe o link</strong> — Envie por qualquer canal. Mesmo que o canal seja comprometido, o arquivo criptografado não pode ser descriptografado sem a URL completa.</li>
<li><strong>Destinatário baixa uma vez</strong> — O destinatário abre o link, o arquivo é descriptografado no navegador e fica disponível para download. Os dados criptografados são permanentemente excluídos do servidor via exclusão atômica.</li>
</ol>
<p>Sem senhas para compartilhar separadamente. Sem cópias persistentes em nenhum servidor. Sem necessidade de cadastro. <a href="/security">Revise a arquitetura de segurança</a> ou <a href="https://github.com/dhdtech/only-once-share">audite o código-fonte</a>.</p>

<h2>Melhores Práticas para Compartilhar Arquivos Compactados com Segurança</h2>
<ul>
<li><strong>Não confie apenas em senhas de ZIP</strong> — A criptografia padrão ZipCrypto é fraca. Mesmo ZIPs criptografados com AES exigem o compartilhamento de uma senha por um canal separado (frequentemente inseguro).</li>
<li><strong>Defina a expiração mais curta possível</strong> — Se o destinatário fará o download dentro de uma hora, use um TTL de 1 hora. Janelas mais curtas significam menos exposição.</li>
<li><strong>Remova arquivos desnecessários antes de compactar</strong> — Inclua apenas o que o destinatário realmente precisa. Cada arquivo extra é exposição adicional se algo der errado.</li>
<li><strong>Não use armazenamento em nuvem para transferências únicas</strong> — Se alguém precisa dos arquivos apenas uma vez, um link autodestrutivo é mais seguro do que um link persistente do Drive ou Dropbox.</li>
<li><strong>Verifique o seu destinatário</strong> — Um link autodestrutivo é tão seguro quanto o canal que você usa para entregá-lo. Envie para um contato verificado.</li>
<li><strong>Verifique os requisitos de conformidade</strong> — Se seus arquivos contêm dados de saúde (LGPD/regulamentações de saúde), dados pessoais (LGPD/GDPR) ou registros financeiros, links criptografados autodestrutivos ajudam a atender aos requisitos de minimização de dados.</li>
</ul>

<h2>Conclusão</h2>
<p>Arquivos ZIP concentram informações sensíveis em um único pacote, tornando o manuseio seguro mais importante — e não menos. ZIPs protegidos por senha proporcionam uma falsa sensação de segurança, e e-mails ou links na nuvem deixam arquivos expostos indefinidamente. Links criptografados e autodestrutivos garantem que seu arquivo exista apenas no momento em que é necessário e seja permanentemente destruído depois. Da próxima vez que precisar enviar uma entrega de projeto, um pacote de documentos de RH ou qualquer arquivo ZIP sensível, pule o anexo de e-mail e <a href="/">crie um link seguro de uso único</a>.</p>
`
  }
};
