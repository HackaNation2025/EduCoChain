# 🚀 EduCoChain: Transparência e Auditoria Descentralizada na Gestão de Verbas Públicas para a Educação

Bem-vindo ao repositório do *EduCoChain*, o protótipo de dApp desenvolvido para o TOKENNATION Hackathon. Nosso objetivo é revolucionar a forma como os recursos públicos para a educação são alocados, liberados e fiscalizados, promovendo total transparência e engajamento comunitário através da tecnologia blockchain.

## 💡 O Problema que Resolvemos

A ausência de visibilidade e rastreabilidade na liberação e uso de recursos públicos na educação frequentemente resulta em desvios, atrasos e má prestação de serviços essenciais. Isso corrói a confiança da sociedade nas instituições e prejudica diretamente a qualidade da educação.

## ✨ Nossa Solução: Uma Ponte entre Tecnologia e Cidadania

O EduCoChain é um aplicativo móvel construído sobre a *BNB Chain* que automatiza, registra e democratiza a liberação e fiscalização de verbas públicas para a educação. Ele se baseia em três pilares fundamentais:

1.  *Smart Contracts para Liberação Automática:*
    * Cada etapa do fluxo financeiro (aprovação orçamentária, pagamento ao fornecedor) é codificada em contratos inteligentes.
    * As verbas são liberadas apenas após a validação de condições pré-definidas (comprovação de entrega, assinatura de recibo, metas educacionais), eliminando burocracia e intermediários.
2.  *Validação Comunitária via dApp:*
    * Pais, professores e conselhos de controle social podem acompanhar em tempo real a aplicação dos recursos pelo aplicativo.
    * Usuários consultam o histórico de transações, verificam comprovantes (fotos, notas fiscais, relatórios) e aprovam ou sinalizam inconsistências. Todas as validações são registradas de forma imutável, garantindo transparência e engajamento cívico.
3.  *Controle Seguro de Entregas Reais:*
    * O aplicativo integra oráculos de localização (GPS) e QR Codes em materiais (livros, equipamentos, mobiliário) para confirmar a chegada ao destino correto.
    * Data, hora e coordenadas geográficas são registradas de forma imutável na blockchain, prevenindo falsificações e assegurando rastreabilidade. Alertas automáticos são disparados em caso de inconsistências.

## 🎯 Público-alvo

Nosso dApp é destinado a:
* *Órgãos públicos de educação* (secretarias municipais e estaduais)
* *Conselhos de controle social*
* *Comunidades escolares* (pais, professores, voluntários)

Todos aqueles que buscam maior transparência e segurança na gestão e fiscalização das verbas educacionais.

## 🚀 Arquitetura e Tecnologias Utilizadas

Este protótipo foi construído com uma arquitetura robusta e tecnologias modernas, garantindo escalabilidade, segurança e uma excelente experiência de usuário:

* *Frontend (Mobile):* *React Native (com Expo)*
    * Interface unificada para iOS e Android.
    * Integração direta com carteiras digitais (MetaMask Mobile / WalletConnect) para assinatura de transações.
    * Módulos nativos de geolocalização (GPS) para validação de entregas.
* *Smart Contracts:* *Solidity*
    * Desenvolvidos para automação de liberação de verbas e validação de requisições.
    * Parâmetros configuráveis para condições de validação.
    * Testes unitários e deploy automatizado utilizando Hardhat.
* *Blockchain:* *BNB Chain (Testnet - Chapel)*
    * Transações de baixo custo e alta segurança.
    * Imutabilidade dos registros.
* *Integração Web3:* *Web3.js / Ethers.js*
    * Chamadas de funções (call e send) e escuta de eventos dos contratos inteligentes.
    * Gerenciamento de chaves e assinaturas digitais on-device.
    * Mecanismos de fallback para robustez na comunicação com a blockchain.
* *Versionamento e CI/CD:* *GitHub*
    * Organização de branches, pull requests e pipelines de CI (GitHub Actions) para compilação e testes automáticos.
* *Backend / DevOps:*
    * Definição de infraestrutura de rede para comunicação dApp-blockchain.
    * Configuração de nós de validação (na BNB Testnet).
    * Pipeline de CI/CD para automatizar o desenvolvimento e deploy.
    * Meu papel foi crucial na arquitetura técnica (backend/DevOps) e na integração full-stack, conectando o frontend ao smart contract e implementando chamadas Web3 no app móvel.

## ⚙ Como Rodar o Protótipo (Instruções para Desenvolvimento)

Para configurar e rodar o projeto localmente:

1.  *Clone o repositório:*
    bash
    git clone https://github.com/HackaNation2025/EduCoChain.git
    cd EducoChain
    
2.  *Instale as dependências:*
    bash
    npm install
    
3.  *Inicie o aplicativo Expo:*
    bash
    npx expo start
    
    Você pode então abrir o aplicativo em:
    * Um [development build](https://docs.expo.dev/develop/development-builds/introduction/)
    * Um [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
    * Um [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
    * [Expo Go](https://expo.dev/go) (para testes rápidos em um ambiente limitado)

4.  *Configuração do Ambiente Blockchain (Opcional, para testes avançados de contrato):*
    * Certifique-se de ter o Hardhat ou Truffle configurado para deploy e testes dos smart contracts na BNB Testnet (Chapel).
    * Será necessário ter uma carteira configurada (MetaMask) conectada à BNB Testnet com alguns tokens de teste.

## 🤝 Equipe

Este projeto foi o resultado de um esforço colaborativo e multidisciplinar. Agradeço imensamente à minha equipe por aceitar o desafio e por toda a dedicação:

* *Mônica Araújo:* Vídeo de Apresentação, Viabilidade Financeira, Estruturação de Personas.
* *Janaína:* Estratégia de Comunicação, Gestão da Equipe, Documentação Geral, Design do Projeto e Apresentação.
* *Maria Clara:* Ideação, Arquitetura Técnica (geral), Desenvolvimento de Smart Contracts.
* *Luiz Fernando Balbino:* Arquitetura Técnica (Backend/DevOps), Integração Full-Stack (Smart Contract - Conexão Front-end), Documentação de Código (GitHub).

## 📄 Governança de Dados e Compliance

A governança de dados é descentralizada e definida nos Contratos Inteligentes (on-chain), garantindo a imutabilidade dos dados e controle de acesso criptográfico. Dados off-chain são controlados pelo usuário no dispositivo (AsyncStorage).

* *Controle de Acesso:* Perfis de usuário ("Validador" e "Gestor") com permissões distintas no app.
* *Classificação de Dados:* Transações on-chain (hash, timestamp, valor), provas off-chain (imagens/PDFs com nome padronizado) e dados pessoais mínimos (nome/apelido do validador).
* *Qualidade de Dados:* Cada registro de "EntregaConfirmada" inclui ID da transação, Latitude, Longitude (GPS), Timestamp e Arquivo de prova.
* *Conformidade:* Adotamos referências mínimas da *LGPD (Lei 13.709/2018)* para tratamento de dados pessoais (GPS, fotos, identificação) e do *Marco Civil da Internet (Lei 12.965/2014)* para registro de logs de conexão e transações on-chain.

## 🌟 Conclusão e Próximos Passos

O EduCoChain representa um protótipo funcional com potencial transformador para a gestão de verbas públicas. Os benefícios esperados incluem:
* *Transparência Total:* Rastreabilidade em tempo real de recursos em ledger público.
* *Redução de Fraudes e Desvios:* Pagamentos condicionais por smart contracts e validação comunitária.
* *Engajamento e Responsabilização da Comunidade:* Mecanismo de fiscalização ativa e contínua.
* *Eficiência Operacional:* Automação de processos, reduzindo burocracia e acelerando pagamentos.
* *Geração de Dados para Análise:* Histórico de transações para insights sobre gargalos e fraudes.

Agradecemos a TOKENNATION por esta oportunidade de desenvolver uma solução tão impactante!
