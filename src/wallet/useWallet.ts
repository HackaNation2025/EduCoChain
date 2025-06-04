import { useContext } from "react";
import { WalletContext } from "./walletProvider";
import { SessionTypes } from "@walletconnect/types";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importar AsyncStorage

export const useWallet = () => {
  const { walletClient, session, setSession } = useContext(WalletContext);

  const connectWallet = async () => {
    if (!walletClient) return;

    const namespaces = {
      eip155: {
        methods: ["eth_sendTransaction", "personal_sign", "eth_signTypedData"],
        chains: ["eip155:97"],
        events: ["chainChanged", "accountsChanged"],
        rpcMap: {
          "97": "https://data-seed-prebsc-1-s1.binance.org:8545/",
        },
      },
    };

    // Limpa a sessão existente no armazenamento antes de conectar
    await AsyncStorage.removeItem("walletconnectSession");
    setSession(null); // Garante que o estado local também esteja limpo

    const { uri, approval } = await walletClient.connect({
      requiredNamespaces: namespaces,
    });

    if (uri) {
      console.log("🔗 URI para WalletConnect:", uri);

      try {
        await Linking.openURL(uri);
      } catch (error) {
        console.error("Erro ao abrir link WalletConnect:", error);
      }
    }

    const sessionResult = await approval();
    setSession(sessionResult);
    // Salvar a sessão no AsyncStorage após a conexão bem-sucedida
    await AsyncStorage.setItem("walletconnectSession", JSON.stringify(sessionResult))
      .then(() => console.log("💾 Sessão salva no AsyncStorage"))
      .catch((e) => console.error("⚠️ Erro ao salvar sessão no AsyncStorage:", e));
  };

  const disconnectWallet = async () => {
    if (!walletClient || !session) return;

    try {
      const existingSession = walletClient.session.get(session.topic);
      if (existingSession) {
        await walletClient.disconnect({
          topic: session.topic,
          reason: {
            code: 6000,
            message: "Desconectado pelo usuário",
          },
        });
        console.log("👋 Sessão desconectada com sucesso.");
      } else {
        console.warn("⚠️ Sessão não encontrada no walletClient.");
      }
    } catch (error) {
      console.error("Erro ao desconectar:", error);
    } finally {
      setSession(null);
      await AsyncStorage.removeItem("walletconnectSession"); // Remover do AsyncStorage na desconexão
      console.log("🧹 Sessão local removida do AsyncStorage.");
    }
  };

  const getAddress = () => {
    if (!session) return null;
    const account = session.namespaces["eip155"]?.accounts?.[0]; // eip155:97:0x...
    return account?.split(":")[2] ?? null;
  };

  return {
    walletClient,
    session,
    connectWallet,
    disconnectWallet,
    getAddress,
  };
};