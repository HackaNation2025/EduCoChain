// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// Interface para um Oráculo de Localização (simplificado)
interface ILocationOracle {
    function verificarLocalizacao(address _usuario, string calldata _localizacaoEsperada) external view returns (bool);
}



contract LiberacaoVerbaComValidacaoPublica {

    // --- Endereços das Partes ---
    address payable public orgaoGoverno;
    address payable public empresaContratada;
    address public enderecoOracleLocalizacao;

    // --- Detalhes do Contrato ---
    string public descricaoProdutoServico;
    uint public quantidadeEstipulada;
    string public localizacaoEntrega;
    uint public valorTotalContrato; // Valor destinado à empresa

    // --- Prazos ---
    uint public prazoVotacao;
    uint public inicioPeriodoVotacaoTimestamp;

    // --- Estado do Contrato ---
    enum EstadoContrato {
        AguardandoDeposito,
        AguardandoNotificacaoEmpresa,
        PeriodoDeVotacao,
        VotacaoEncerrada,
        PagamentoEmpresaRealizado, // Mudança de nome de PagamentoLiberado para clareza
        FundosRetornadosGoverno,
        DisputaEmAndamento
    }
    EstadoContrato public estadoAtual;

    // --- Votação ---
    struct Voto {
        bool produtoEntregue;
        uint quantidadeEntregueReportada;
        bool localizacaoConfirmada;
    }

    mapping(address => Voto) public votos;
    mapping(address => bool) public jaVotou;
    address[] public listaDeVotantes;

    uint public totalVotosSimEntrega;
    uint public totalVotosNaoEntrega;
    uint public somaQuantidadesReportadas;
    uint public contagemVotantesSimParaMedia;

    // --- Recompensas para Votantes ---
    uint public recompensaPorVotoValido; // Nome da variável atualizado para clareza
    mapping(address => bool) public recompensaReivindicada; // Nome da variável atualizado para clareza

    // --- Eventos ---
    event ContratoCriado(address indexed orgaoGoverno, address indexed empresaContratada, uint valorEmpresa, uint valorRecompensaUnitaria);
    event FundosDepositados(uint valorTotalDepositado);
    event ServicoConcluidoNotificado(uint inicioVotacaoTimestamp);
    event VotoRegistrado(address indexed votante, bool produtoEntregue, uint quantidadeReportada, bool localizacaoOK);
    event VotacaoFinalizada(uint votosSim, uint votosNao, uint mediaQuantidade, bool aprovadoParaPagamento);
    event PagamentoRealizadoParaEmpresa(address indexed empresa, uint valor); // Nome do evento atualizado
    event FundosDevolvidosAoGoverno(address indexed governo, uint valor); // Nome do evento atualizado
    event RecompensaReivindicadaPeloVotante(address indexed votante, uint valor); // Nome do evento atualizado

    // --- Modificadores ---
    modifier apenasOrgaoGoverno() {
        require(msg.sender == orgaoGoverno, "Apenas orgao do governo.");
        _;
    }
    modifier apenasEmpresaContratada() {
        require(msg.sender == empresaContratada, "Apenas empresa contratada.");
        _;
    }
    modifier noEstado(EstadoContrato _estado) {
        require(estadoAtual == _estado, "Estado invalido para esta acao.");
        _;
    }

    constructor(
        address payable _empresaContratada,
        string memory _descricao,
        uint _quantidade,
        string memory _localizacao,
        uint _valorParaEmpresa, // Parâmetro atualizado
        uint _prazoVotacaoSegundos,
        uint _recompensaUnitaria, // Parâmetro atualizado
        address _oracleAddress
    ) {
        orgaoGoverno = payable(msg.sender);
        empresaContratada = _empresaContratada;
        descricaoProdutoServico = _descricao;
        quantidadeEstipulada = _quantidade;
        localizacaoEntrega = _localizacao;
        valorTotalContrato = _valorParaEmpresa; // Atribuição atualizada
        prazoVotacao = _prazoVotacaoSegundos;
        recompensaPorVotoValido = _recompensaUnitaria; // Atribuição atualizada
        enderecoOracleLocalizacao = _oracleAddress;
        estadoAtual = EstadoContrato.AguardandoDeposito;
        emit ContratoCriado(orgaoGoverno, empresaContratada, valorTotalContrato, recompensaPorVotoValido);
    }

    // 1. Órgão do Governo deposita os fundos
    function depositarFundos() external payable apenasOrgaoGoverno noEstado(EstadoContrato.AguardandoDeposito) {
        require(msg.value >= valorTotalContrato, "Deposito deve cobrir pelo menos o valor da empresa.");
        estadoAtual = EstadoContrato.AguardandoNotificacaoEmpresa;
        emit FundosDepositados(msg.value);
    }

    // 2. Empresa notifica a conclusão do serviço/entrega
    function notificarConclusaoServico() external apenasEmpresaContratada noEstado(EstadoContrato.AguardandoNotificacaoEmpresa) {
        estadoAtual = EstadoContrato.PeriodoDeVotacao;
        inicioPeriodoVotacaoTimestamp = block.timestamp;
        emit ServicoConcluidoNotificado(inicioPeriodoVotacaoTimestamp);
    }

    // 3. Votante registra seu voto
    function registrarVoto(bool _produtoEntregue, uint _quantidadeReportada)
        external
        noEstado(EstadoContrato.PeriodoDeVotacao)
    {
        require(block.timestamp <= inicioPeriodoVotacaoTimestamp + prazoVotacao, "Periodo de votacao encerrado.");
        require(!jaVotou[msg.sender], "Votante ja registrou um voto.");

//        bool localizacaoOK = false;
//        if (enderecoOracleLocalizacao != address(0)) {
//            try ILocationOracle(enderecoOracleLocalizacao).verificarLocalizacao(msg.sender, localizacaoEntrega) returns (bool success) {
//                localizacaoOK = success;
//            } catch {
//                localizacaoOK = false;
//           }
//        } else 
//            revert("Oraculo de localizacao nao configurado.");
//        }

        bool localizacaoOK = true; // DEFINIÇÃO TEMPORÁRIA PARA TESTE

        jaVotou[msg.sender] = true;
    // Considere o impacto de comentar `listaDeVotantes.push` também para teste extremo
    // listaDeVotantes.push(msg.sender);
        votos[msg.sender] = Voto(_produtoEntregue, _quantidadeReportada, localizacaoOK);

    // ... resto da função ...
//        jaVotou[msg.sender] = true;
//        listaDeVotantes.push(msg.sender);
//        votos[msg.sender] = Voto(_produtoEntregue, _quantidadeReportada, localizacaoOK);

        if (_produtoEntregue) {
            totalVotosSimEntrega++;
            if (_quantidadeReportada <= quantidadeEstipulada) {
                 somaQuantidadesReportadas += _quantidadeReportada;
                 contagemVotantesSimParaMedia++;
            } else {
                 somaQuantidadesReportadas += quantidadeEstipulada;
                 contagemVotantesSimParaMedia++;
            }
        } else {
            totalVotosNaoEntrega++;
        }
        emit VotoRegistrado(msg.sender, _produtoEntregue, _quantidadeReportada, localizacaoOK);
    }

    // 4. Finalizar a votação e processar o resultado
    function finalizarVotacaoEProcessar() external noEstado(EstadoContrato.PeriodoDeVotacao) {
        require(block.timestamp > inicioPeriodoVotacaoTimestamp + prazoVotacao, "Periodo de votacao ainda nao encerrou.");
        require(inicioPeriodoVotacaoTimestamp > 0, "Votacao nao iniciada.");

        estadoAtual = EstadoContrato.VotacaoEncerrada;

        uint mediaQuantidadeEntregue = 0;
        if (contagemVotantesSimParaMedia > 0) {
            mediaQuantidadeEntregue = somaQuantidadesReportadas / contagemVotantesSimParaMedia;
        }

        bool aprovadoParaPagamentoEmpresa = false;
        if (totalVotosSimEntrega > totalVotosNaoEntrega) {
            bool quantidadeSuficiente = (mediaQuantidadeEntregue >= (quantidadeEstipulada * 80 / 100));
            if (quantidadeSuficiente) {
                aprovadoParaPagamentoEmpresa = true;
            }
        }
        emit VotacaoFinalizada(totalVotosSimEntrega, totalVotosNaoEntrega, mediaQuantidadeEntregue, aprovadoParaPagamentoEmpresa);

        if (aprovadoParaPagamentoEmpresa) {
            require(address(this).balance >= valorTotalContrato, "Saldo insuficiente para pagar empresa.");
            estadoAtual = EstadoContrato.PagamentoEmpresaRealizado; // Estado atualizado
            empresaContratada.transfer(valorTotalContrato);
            emit PagamentoRealizadoParaEmpresa(empresaContratada, valorTotalContrato); // Evento atualizado
        } else {
            estadoAtual = EstadoContrato.FundosRetornadosGoverno;
            emit FundosDevolvidosAoGoverno(orgaoGoverno, address(this).balance); // Evento atualizado
        }
    }

    // 5. NOVA FUNÇÃO: Votante reivindica sua recompensa
    function reivindicarRecompensa() external {
        require(
            estadoAtual == EstadoContrato.VotacaoEncerrada ||
            estadoAtual == EstadoContrato.PagamentoEmpresaRealizado ||
            estadoAtual == EstadoContrato.FundosRetornadosGoverno,
            "Reivindicacao de recompensa nao disponivel neste estado."
        );
        require(jaVotou[msg.sender], "Votante nao participou.");
        require(votos[msg.sender].localizacaoConfirmada, "Voto nao foi validado por localizacao.");
        require(!recompensaReivindicada[msg.sender], "Recompensa ja reivindicada.");
        require(address(this).balance >= recompensaPorVotoValido, "Saldo do contrato insuficiente para esta recompensa.");

        recompensaReivindicada[msg.sender] = true;
        (bool success, ) = payable(msg.sender).call{value: recompensaPorVotoValido}("");
        require(success, "Falha ao transferir recompensa.");
        emit RecompensaReivindicadaPeloVotante(msg.sender, recompensaPorVotoValido); // Evento atualizado
    }

    // 6. Função para o governo resgatar fundos excedentes/não utilizados
    function resgatarFundosNaoUtilizados() external apenasOrgaoGoverno {
        require(
            estadoAtual == EstadoContrato.PagamentoEmpresaRealizado ||
            estadoAtual == EstadoContrato.FundosRetornadosGoverno,
            "Resgate nao permitido neste estado ainda."
        );
        uint saldo = address(this).balance;
        if (saldo > 0) {
            orgaoGoverno.transfer(saldo);
            emit FundosDevolvidosAoGoverno(orgaoGoverno, saldo); // Evento atualizado
        }
    }

    // --- Funções de Leitura ---
    function getDetalhesContrato() external view returns (
        string memory descricao,
        uint quantidade,
        string memory localizacao,
        uint valorEmpresa,
        EstadoContrato estado,
        uint votosSim,
        uint votosNao
    ) {
        return (
            descricaoProdutoServico,
            quantidadeEstipulada,
            localizacaoEntrega,
            valorTotalContrato, // Este é o valor destinado à empresa
            estadoAtual,
            totalVotosSimEntrega,
            totalVotosNaoEntrega
        );
    }

    function getTempoRestanteVotacao() external view returns (uint) {
        if (estadoAtual == EstadoContrato.PeriodoDeVotacao && inicioPeriodoVotacaoTimestamp > 0) {
            uint prazoFinal = inicioPeriodoVotacaoTimestamp + prazoVotacao;
            if (block.timestamp < prazoFinal) {
                return prazoFinal - block.timestamp;
            }
        }
        return 0;
    }

    function podeReivindicarRecompensa(address _votante) external view returns (bool) {
        if (!(estadoAtual == EstadoContrato.VotacaoEncerrada ||
              estadoAtual == EstadoContrato.PagamentoEmpresaRealizado ||
              estadoAtual == EstadoContrato.FundosRetornadosGoverno)
           ) {
            return false;
        }
        return  jaVotou[_votante] &&
                votos[_votante].localizacaoConfirmada &&
                !recompensaReivindicada[_votante] &&
                address(this).balance >= recompensaPorVotoValido;
    }
} // FIM DO CONTRATO LiberacaoVerbaComValidacaoPublica