// contratoService.js
import { ethers } from "ethers";
import provider from "../config/provider";
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import contratoABI from "../abi/contratoABI.json";

export function criarInstanciaContrato(address, signerOrProvider = provider) {
  return new ethers.Contract(address, contratoABI, signerOrProvider);
}

export async function depositarVerbaNoContrato(contractAddress, walletClient, session, amountInWei) {
  if (!walletClient || !session) {
    throw new Error("Cliente da carteira ou sessão não fornecidos. Conecte sua carteira.");
  }
  if (!contractAddress) {
    throw new Error("Endereço do contrato não fornecido.");
  }

  try {
    console.log("💰 Preparando EthereumProvider para transação...");

    const accountsInSession = session.namespaces?.eip155?.accounts || [];
    console.log("Contas na sessão WalletConnect (eip155):", accountsInSession);
    if (accountsInSession.length === 0) {
      throw new Error("Nenhuma conta encontrada na sessão WalletConnect.");
    }

    // Tente um RPC alternativo para BNB Testnet. Às vezes o principal pode estar instável.
    // Você pode pesquisar por "BNB Smart Chain Testnet RPC URL" no Google para mais opções.
    const bnbTestnetRpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545/"; // Seu RPC atual
    // const bnbTestnetRpcUrl = "https://bsc-testnet.public.blastapi.io/"; // Uma alternativa
    // const bnbTestnetRpcUrl = "https://endpoints.omniatech.io/v1/bsc/testnet/public"; // Outra alternativa
    // Escolha um dos acima ou adicione mais para testar se o problema é do RPC.

    const ethProvider = await EthereumProvider.init({
      projectId: "3e6f24739b8a48a8f8b761d782cbcba6",
      chains: [97], // Chain ID numérico
      rpcMap: {
        97: bnbTestnetRpcUrl // Usando a variável do RPC
      },
      showQrModal: false,
      methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_accounts", "eth_requestAccounts"],
      events: ["chainChanged", "accountsChanged"],
      metadata: {
        name: "EduCoChain",
        description: "App de contratos inteligentes com WalletConnect",
        url: "https://localhost",
        icons: ["https://educhain.com/logo.png"],
      },
    });

    if (!ethProvider.connected) {
      await ethProvider.connect();
    }

    // --- NOVO TRECHO DE DEBUG AQUI ---
    console.log("EthereumProvider conectado. Verificando comunicação RPC...");
    try {
      // Tente obter o número do bloco diretamente do provedor ethers que envolve o ethProvider WC
      const browserProvider = new ethers.BrowserProvider(ethProvider);
      const blockNumber = await browserProvider.getBlockNumber();
      console.log("✅ getBlockNumber bem-sucedido. Bloco atual:", blockNumber);
    } catch (blockError) {
      console.error("❌ Falha na chamada eth_blockNumber via ethers.BrowserProvider. Isso indica um problema de RPC/Provedor:", blockError);
      throw new Error("Problema de comunicação com a rede BNB Testnet. Verifique a URL RPC ou sua conexão.");
    }
    // --- FIM DO TRECHO DE DEBUG ---

    const signer = await new ethers.BrowserProvider(ethProvider).getSigner();

    console.log("💰 Iniciando depósito de verba...", {
      contractAddress,
      signerAddress: await signer.getAddress(),
      amount: amountInWei.toString(),
    });

    const contractWithSigner = new ethers.Contract(contractAddress, contratoABI, signer);

    const tx = await contractWithSigner.depositarVerba({
      value: amountInWei,
    });

    console.log("⏳ Transação de depósito enviada. Hash:", tx.hash);

    await tx.wait();

    console.log("✅ Depósito de verba confirmado!");
    return tx;
  } catch (error) {
    console.error("❌ Erro ao depositar verba:", error);
    throw error;
  }
}


// ------------------------------------------------------------------------------

export async function getEmpresaContratada(contract) {
  try {
    const empresa = await contract.empresaContratada();
    return empresa;
  } catch (error) {
    console.error("❌ Erro ao buscar empresa contratada:", error);
    return "Erro ao buscar dados";
  }
}

export async function getOrgaoGoverno(contract) {
  try {
    const governo = await contract.orgaoGoverno();
    return governo;
  } catch (error) {
    console.error("❌ Erro ao buscar órgão do governo:", error);
    return "Erro ao buscar órgão";
  }
}

export async function getValorContrato(contract) {
  try {
    const valor = await contract.valorTotalContrato();
    return valor.toString();
  } catch (error) {
    console.error("❌ Erro ao buscar valor do contrato:", error);
    return "Erro ao buscar valor";
  }
}

export async function getdescricaoProdutoServico(contract) {
  try {
    const descricao = await contract.descricaoProdutoServico();
    return descricao;
  } catch (error) {
    console.error("❌ Erro ao buscar descrição do serviço:", error);
    return "Erro ao buscar descrição";
  }
}

export async function getlocalizacaoEntrega(contract) {
  try {
    const localizacao = await contract.localizacaoEntrega();
    if (!localizacao || localizacao === "") {
      return "";
    }
    return localizacao;
  } catch (error) {
    console.error("❌ Falha ao obter localização da entrega:", error);
    return "";
  }
}

export async function getEstadoAtual(contract) {
  try {
    const estado = await contract.estadoAtual();
    const estadosContrato = [
      "Aguardando Depósito",
      "Aguardando Notificação da Empresa",
      "Período de Votação",
      "Votação Encerrada",
      "Pagamento à Empresa Realizado",
      "Fundos Retornados ao Governo",
      "Disputa em Andamento",
    ];
    return estadosContrato[Number(estado)];
  } catch (error) {
    console.error("❌ Erro ao buscar estado atual do contrato:", error);
    return "Erro ao buscar estado";
  }
}

export async function getQuantidadeEstipulada(contract) {
  try {
    const quantidade = await contract.quantidadeEstipulada();
    return quantidade.toString();
  } catch (error) {
    console.error("❌ Erro ao buscar quantidade estipulada:", error);
    return "Erro ao buscar quantidade";
  }
}