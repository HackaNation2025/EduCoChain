import { useContext } from "react";
import { WalletContext } from "./walletProvider"; // Presume que WalletContext é onde o walletClient é provido
import { SessionTypes } from "@walletconnect/types";
import { Linking, Alert } from "react-native"; // Importe Alert para mensagens amigáveis
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define a URL RPC principal e um fallback
const PRIMARY_RPC_URL = "https://rpc.ankr.com/bsc_testnet"; // Nova URL RPC mais estável
const FALLBACK_RPC_URL = "https://endpoints.omniatech.io/v1/bsc/testnet/public"; // URL RPC de fallback

export const useWallet = () => {
  // walletClient e setSession vêm do contexto, o que é ótimo para centralizar o gerenciamento.
  const { walletClient, session, setSession } = useContext(WalletContext);

  const connectWallet = async () => {
    if (!walletClient) {
      console.error("❌ WalletConnect SignClient não inicializado. Verifique WalletContext.");
      Alert.alert("Erro", "O sistema de carteira não está pronto. Tente novamente.");
      return;
    }

    // Definindo os namespaces necessários para a conexão WalletConnect
    const namespaces = {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData", "eth_accounts", "eth_requestAccounts"], // Adicionado eth_accounts e eth_requestAccounts
        chains: ["eip155:97"], // BNB Smart Chain Testnet Chain ID
        events: ["chainChanged", "accountsChanged"],
        rpcMap: {
          "97": PRIMARY_RPC_URL, // Usar a URL RPC principal aqui
        },
      },
    };

    // --- Lógica de Teste da Conexão RPC antes de iniciar a conexão WalletConnect ---
    try {
      console.log(`LOG: Testando conectividade RPC com ${PRIMARY_RPC_URL}...`);
      const testResponse = await fetch(PRIMARY_RPC_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
      });

      const testResult = await testResponse.json();
      if (testResponse.ok && testResult.result) {
        console.log(`LOG: ✅ Conectividade RPC com ${PRIMARY_RPC_URL} bem-sucedida. Bloco atual: ${parseInt(testResult.result, 16)}`);
      } else {
        // Se a URL principal falhar, tenta o fallback
        console.warn(`WARN: Conectividade RPC com ${PRIMARY_RPC_URL} falhou. Tentando fallback: ${FALLBACK_RPC_URL}`);
        namespaces.eip155.rpcMap["97"] = FALLBACK_RPC_URL; // Altera para o fallback
        const fallbackTestResponse = await fetch(FALLBACK_RPC_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jsonrpc: "2.0", method: "eth_blockNumber", params: [], id: 1 }),
        });
        const fallbackTestResult = await fallbackTestResponse.json();
        if (fallbackTestResponse.ok && fallbackTestResult.result) {
          console.log(`LOG: ✅ Conectividade RPC com ${FALLBACK_RPC_URL} bem-sucedida. Bloco atual: ${parseInt(fallbackTestResult.result, 16)}`);
        } else {
          console.error(`ERROR: ❌ Conectividade RPC com ${FALLBACK_RPC_URL} também falhou.`);
          Alert.alert("Erro de Rede", "Não foi possível conectar a nenhuma URL RPC da BNB Testnet. Verifique sua conexão ou tente novamente mais tarde.");
          return; // Sai da função se ambas as URLs falharem
        }
      }
    } catch (rpcTestError: any) {
      console.error(`ERROR: ❌ Erro inesperado ao testar RPC: ${rpcTestError.message}`);
      Alert.alert("Erro de Rede", "Não foi possível testar a conexão RPC. Verifique sua conexão ou tente novamente.");
      return;
    }
    // --- Fim da Lógica de Teste ---

    try {
      // Limpa a sessão existente no armazenamento antes de iniciar uma nova conexão
      await AsyncStorage.removeItem("walletconnectSession");
      setSession(null); // Garante que o estado local também esteja limpo

      const { uri, approval } = await walletClient.connect({
        requiredNamespaces: namespaces, // Usa os namespaces (que podem ter sido atualizados com fallback RPC)
      });

      if (uri) {
        console.log("LOG: 🔗 URI para WalletConnect:", uri);
        try {
          // Tenta abrir o link no aplicativo da carteira.
          // Se o app não estiver instalado, Linking.openURL pode falhar.
          await Linking.openURL(uri);
        } catch (linkError: any) {
          console.error("ERROR: Erro ao tentar abrir link WalletConnect:", linkError);
          // Se o link falhar, pode ser que o app da carteira não esteja instalado ou seja um emulador
          // Nesse caso, o usuário pode precisar copiar o URI manualmente.
          Alert.alert(
            "Conecte a Carteira",
            "Não foi possível abrir o aplicativo da carteira automaticamente. Por favor, copie o link e cole-o manualmente no seu aplicativo de carteira.",
            [{ text: "Copiar Link", onPress: () => { /* Implementar cópia para clipboard aqui */ } }, { text: "OK" }]
          );
        }
      }

      console.log("LOG: Aguardando aprovação da sessão...");
      const sessionResult = await approval(); // Aguarda a aprovação do usuário na carteira
      setSession(sessionResult as SessionTypes.Struct); // Define a sessão no contexto
      console.log("LOG: ✅ Sessão WalletConnect aprovada e estabelecida.");

      // Salvar a sessão no AsyncStorage após a conexão bem-sucedida
      await AsyncStorage.setItem("walletconnectSession", JSON.stringify(sessionResult))
        .then(() => console.log("LOG: 💾 Sessão salva no AsyncStorage"))
        .catch((e) => console.error("ERROR: ⚠️ Erro ao salvar sessão no AsyncStorage:", e));

    } catch (error: any) {
      console.error("ERROR: ❌ Falha no processo de conexão WalletConnect:", error);
      Alert.alert("Erro de Conexão", `Não foi possível conectar a carteira: ${error.message || "Erro desconhecido"}`);
      setSession(null); // Garante que a sessão seja limpa em caso de erro
      await AsyncStorage.removeItem("walletconnectSession");
    }
  };

  const disconnectWallet = async () => {
    if (!walletClient || !session) {
      console.warn("WARN: Nenhuma sessão ativa para desconectar ou WalletClient não inicializado.");
      return;
    }

    try {
      // Verifica se a sessão ainda está ativa no SignClient
      const existingSession = walletClient.session.get(session.topic);
      if (existingSession) {
        await walletClient.disconnect({
          topic: session.topic,
          reason: {
            code: 6000, // Código de desconexão padrão
            message: "Desconectado pelo usuário",
          },
        });
        console.log("LOG: 👋 Sessão desconectada com sucesso.");
      } else {
        console.warn("WARN: Sessão não encontrada no WalletConnect SignClient. Apenas limpando o estado local.");
      }
    } catch (error: any) {
      console.error("ERROR: ❌ Erro ao desconectar a sessão WalletConnect:", error);
      Alert.alert("Erro de Desconexão", `Não foi possível desconectar: ${error.message || "Erro desconhecido"}`);
    } finally {
      setSession(null); // Limpa o estado local da sessão
      await AsyncStorage.removeItem("walletconnectSession"); // Remove do AsyncStorage na desconexão
      console.log("LOG: 🧹 Sessão local removida do AsyncStorage.");
    }
  };

  const getAddress = () => {
    if (!session) return null;
    // Acessa o primeiro account da primeira namespace eip155.
    // Garante que 'namespaces' e 'eip155' existam antes de acessar 'accounts'.
    const account = session.namespaces?.eip155?.accounts?.[0]; // Ex: "eip155:97:0x..."
    return account?.split(":")[2] ?? null; // Retorna apenas o endereço Ethereum (0x...)
  };

  return {
    walletClient, // Retorna o SignClient (EthereumProvider é para WC v1/legacy, SignClient para WC v2)
    session,
    connectWallet,
    disconnectWallet,
    getAddress, // Retorna a função para obter o endereço
    // Adicionado para compatibilidade com o index.tsx que esperava `address` direto
    address: getAddress(),
    // Adicionado para compatibilidade com o index.tsx que esperava `ethereumProvider` para disabled
    ethereumProvider: walletClient, // Mapeia walletClient para ethereumProvider para compatibilidade
    isLoading: !walletClient, // Considera isLoading se o walletClient ainda não estiver pronto
  };
};