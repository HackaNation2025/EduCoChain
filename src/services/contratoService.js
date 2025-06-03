import { ethers } from "ethers";
import provider from "../config/provider";
import contratoABI from "../abi/contratoABI.json"; // Certifique-se de que esse arquivo contém a ABI correta

// Endereço do contrato na rede (BNB Testnet)
const contractAddress = "";
// Instância do contrato
const contract = new ethers.Contract(contractAddress, contratoABI, provider);

export default contract;

// Função para criar uma nova instância do contrato
export function criarInstanciaContrato(address) {
  return new ethers.Contract(address, contratoABI, provider);
}

// Buscar empresa contratada
export async function getEmpresaContratada(contract) {
  try {
    const empresa = await contract.empresaContratada();
    console.log("🔎 Empresa Contratada:", empresa);
    return empresa;
  } catch (error) {
    console.error("❌ Erro ao buscar empresa contratada:", error);
    return "Erro ao buscar dados";
  }
}

// Buscar órgão do governo  
export async function getOrgaoGoverno(contract) {
  try {
    const governo = await contract.orgaoGoverno();
    console.log("👑 Órgão do Governo:", governo);
    return governo;
  } catch (error) {
    console.error("❌ Erro ao buscar órgão do governo:", error);
    return "Erro ao buscar órgão";
  }
}

// Buscar valor do contrato
export async function getValorContrato(contract) {
  try {
    const valor = await contract.valorTotalContrato();
    console.log("💰 Valor do Contrato (em Wei):", valor.toString());

    return valor.toString(); // Retorna o valor bruto como no terminal
  } catch (error) {
    console.error("❌ Erro ao buscar valor do contrato:", error);
    return "Erro ao buscar valor";
  }
}

// Buscar descrição do serviço
export async function getdescricaoProdutoServico(contract) {
  try {
    const descricao = await contract.descricaoProdutoServico();
    console.log("📝 Descrição do Serviço:", descricao);
    return descricao;
  } catch (error) {
    console.error("❌ Erro ao buscar descrição do serviço:", error);
    return "Erro ao buscar descrição";
  }
}

// Buscar localização da entrega
export async function getlocalizacaoEntrega(contract) {
  try {
    const localizacao = await contract.localizacaoEntrega();
    if (!localizacao || localizacao === "") {
      console.warn("⚠️ Localização não definida no contrato.");
      return ""; // Retorna uma string vazia ao invés de uma mensagem de erro
    }
    console.log("📍 Localização da Entrega:", localizacao);
    return localizacao;
  } catch (error) {
    console.error("❌ Falha ao obter localização da entrega:", error);
    return ""; // Retorna uma string vazia, evitando mostrar erro ao usuário
  }
}


// Buscar estado atual do contrato
export async function getEstadoAtual(contract) {
  try {
    const estado = await contract.estadoAtual();
    console.log("📊 Estado Atual do Contrato (Enum):", estado);

    // Mapeamento do enum para nomes legíveis
    const estadosContrato = [
      "Aguardando Depósito",
      "Aguardando Notificação da Empresa",
      "Período de Votação",
      "Votação Encerrada",
      "Pagamento à Empresa Realizado",
      "Fundos Retornados ao Governo",
      "Disputa em Andamento"
    ];

    return estadosContrato[Number(estado)]; // Retorna o estado correspondente
  } catch (error) {
    console.error("❌ Erro ao buscar estado atual do contrato:", error);
    return "Erro ao buscar estado";
  }
}

// Buscar quantidade estipulada
export async function getQuantidadeEstipulada(contract) {
  try {
    const quantidade = await contract.quantidadeEstipulada();
    console.log("📦 Quantidade Estipulada:", quantidade.toString());
    return quantidade.toString();
  } catch (error) {
    console.error("❌ Erro ao buscar quantidade estipulada:", error);
    return "Erro ao buscar quantidade";
  }
}
