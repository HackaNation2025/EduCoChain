// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IOracle {
    function verificarLocalizacao(address usuario, string calldata localizacaoEsperada) external view returns (bool);
}

contract LiberacaoVerbaComValidacaoPublica {
    address payable public empresaContratada;
    address payable public orgaoGoverno;
    address public oracleAddress;

    uint256 public valorTotalContrato;
    uint256 public quantidadeEstipulada;
    string public descricaoProdutoServico;
    string public localizacaoEntrega;
    uint256 public prazo;

    enum EstadoContrato { EmAndamento, ConclusaoNotificada, Finalizado }
    EstadoContrato public estadoAtual;

    mapping(address => bool) public jaVotou;
    address[] public listaDeVotantes;

    uint256 public votosFavoraveis;
    uint256 public votosTotais;

    mapping(address => bool) public recompensaReivindicada;

    event VotoRegistrado(address votante, bool voto);

    constructor(
        address payable _empresaContratada,
        address payable _orgaoGoverno,
        uint256 _valorTotalContrato,
        string memory _descricaoProdutoServico,
        string memory _localizacaoEntrega,
        uint256 _prazo,
        address _oracleAddress
    ) payable {
        require(msg.value >= _valorTotalContrato, "Valor inicial insuficiente");
        empresaContratada = _empresaContratada;
        orgaoGoverno = _orgaoGoverno;
        valorTotalContrato = _valorTotalContrato;
        descricaoProdutoServico = _descricaoProdutoServico;
        localizacaoEntrega = _localizacaoEntrega;
        prazo = _prazo;
        oracleAddress = _oracleAddress;
        estadoAtual = EstadoContrato.EmAndamento;
    }

    function depositarVerba() public payable {
        require(msg.sender == orgaoGoverno, "Somente o governo pode depositar");
    }

    function notificarConclusaoServico() public {
        require(msg.sender == empresaContratada, "Somente a empresa pode notificar");
        require(estadoAtual == EstadoContrato.EmAndamento, "Contrato nao esta em andamento");

        // Verifica localização via oráculo
        bool localizacaoOk = IOracle(oracleAddress).verificarLocalizacao(empresaContratada, localizacaoEntrega);
        require(localizacaoOk, "Localizacao invalida para conclusao");

        estadoAtual = EstadoContrato.ConclusaoNotificada;
    }

    function votar(bool _voto) public {
        require(estadoAtual == EstadoContrato.ConclusaoNotificada, "Votacao ainda nao disponivel");
        require(!jaVotou[msg.sender], "Usuario ja votou");

        jaVotou[msg.sender] = true;
        listaDeVotantes.push(msg.sender);
        votosTotais++;

        if (_voto) {
            votosFavoraveis++;
        }

        emit VotoRegistrado(msg.sender, _voto);
    }

    function finalizarContrato() public {
        require(estadoAtual == EstadoContrato.ConclusaoNotificada, "Contrato nao esta pronto para finalizar");
        require(msg.sender == orgaoGoverno, "Somente o governo pode finalizar");

        require(votosFavoraveis * 100 / votosTotais >= 60, "Menos de 60% dos votos foram favoraveis");

        uint256 pagamentoEmpresa = valorTotalContrato * 80 / 100;
        uint256 recompensaTotal = valorTotalContrato - pagamentoEmpresa;

        empresaContratada.transfer(pagamentoEmpresa);

        // A recompensa será distribuída posteriormente com `reivindicarRecompensa`
        estadoAtual = EstadoContrato.Finalizado;
    }

    function podeReivindicarRecompensa() public view returns (bool) {
        return (
            estadoAtual == EstadoContrato.Finalizado &&
            jaVotou[msg.sender] &&
            !recompensaReivindicada[msg.sender]
        );
    }

    function reivindicarRecompensa() public {
        require(podeReivindicarRecompensa(), "Nao pode reivindicar recompensa");

        recompensaReivindicada[msg.sender] = true;

        uint256 recompensa = (valorTotalContrato * 20 / 100) / listaDeVotantes.length;
        payable(msg.sender).transfer(recompensa);
    }

    function resgatarFundosNaoUtilizados() public {
        require(msg.sender == orgaoGoverno, "Somente o governo pode resgatar");
        require(estadoAtual == EstadoContrato.Finalizado, "Contrato nao finalizado");

        uint256 saldoContrato = address(this).balance;
        orgaoGoverno.transfer(saldoContrato);
    }
}
