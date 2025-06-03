import { useContext } from "react";
import { WalletContext } from "./walletProvider";
import { SessionTypes } from "@walletconnect/types";
import { Linking } from "react-native";

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet deve ser usado dentro de WalletProvider");
  }

  const { walletClient, session, setSession } = context;

  // Função para conectar a carteira (BNB Testnet)
  async function connectWallet() {
    if (!walletClient) return;

    try {
      const { uri, approval } = await walletClient.connect({
        pairingTopic: session?.topic,
        requiredNamespaces: {
          eip155: {
            methods: ["eth_sendTransaction", "personal_sign"],
            chains: ["eip155:97"], // BNB Testnet
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });

      if (uri) {
        // Abre o app da carteira usando o deep link do WalletConnect (pode pedir para o usuário aprovar)
        await Linking.openURL(uri);
      }

      const newSession: SessionTypes.Struct = await approval();
      setSession(newSession);
    } catch (error) {
      console.error("Erro ao conectar carteira:", error);
    }
  }

  return { walletClient, session, connectWallet };
};
