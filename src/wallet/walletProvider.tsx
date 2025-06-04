import React, { createContext, useEffect, useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipagem do contexto incluindo disconnect
interface WalletContextType {
  walletClient: SignClient | null;
  session: SessionTypes.Struct | null;
  setSession: React.Dispatch<React.SetStateAction<SessionTypes.Struct | null>>;
  // O disconnect será exposto via useWallet, não diretamente via contexto
  // disconnect: () => Promise<void>; // Removido daqui
}

export const WalletContext = createContext<WalletContextType>({
  walletClient: null,
  session: null,
  setSession: () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletClient, setWalletClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);

  useEffect(() => {
    async function initializeClient() {
      if (walletClient) return; // Adicione esta linha para evitar reinicialização
      console.log("🟡 Inicializando WalletConnect...");
      try {
        const client = await SignClient.init({
          projectId: "3e6f24739b8a48a8f8b761d782cbcba6", // Substitua pelo seu Project ID
          metadata: {
            name: "EduCoChain",
            description: "App de contratos inteligentes com WalletConnect",
            url: "https://localhost",
            icons: ["https://educhain.com/logo.png"],
          },
        });

        console.log("🟢 WalletConnect inicializado com sucesso ✅");
        setWalletClient(client);

        // Não carregue sessões antigas aqui se o objetivo é sempre reconectar
        // Remova toda a lógica de client.session.getAll() e disconnect dentro deste useEffect
        // A limpeza deve ser feita na desconexão ou no início do aplicativo se houver necessidade
        // de garantir um estado limpo antes de uma nova conexão.
        // No seu caso, a lógica já existente no `disconnectWallet` em `useWallet` é suficiente.

        // Limpa o estado da sessão local (para não haver estado residual)
        setSession(null);
        await AsyncStorage.removeItem("walletconnectSession"); // Garante que não há sessão salva ao iniciar
        console.log("🧹 Sessão local removida do AsyncStorage ao iniciar.");
      } catch (error) {
        console.error("🔴 Erro ao inicializar WalletConnect:", error);
      }
    }

    initializeClient();
  }, []); // Dependência vazia para executar apenas uma vez

  // Remova este useEffect. O salvamento e a limpeza da sessão serão tratados em `useWallet`.
  // useEffect(() => {
  //   if (session) {
  //     AsyncStorage.setItem("walletconnectSession", JSON.stringify(session))
  //       .then(() => console.log("💾 Sessão salva no AsyncStorage"))
  //       .catch((e) => console.error("⚠️ Erro ao salvar sessão no AsyncStorage:", e));
  //   }
  // }, [session]);

  // A função disconnect será gerenciada dentro de useWallet.
  // async function disconnect() {
  //   if (!walletClient || !session) return;
  //   try {
  //     await walletClient.disconnect({
  //       topic: session.topic,
  //       reason: { code: 6000, message: "Desconectado pelo usuário" },
  //     });
  //     console.log("🧹 Sessão desconectada com sucesso.");
  //   } catch (error) {
  //     console.error("⚠️ Erro ao desconectar sessão:", error);
  //   } finally {
  //     setSession(null);
  //     await AsyncStorage.removeItem("walletconnectSession");
  //     console.log("🧹 Sessão local removida do AsyncStorage após desconectar.");
  //   }
  // }

  return (
    <WalletContext.Provider value={{ walletClient, session, setSession }}>
      {children}
    </WalletContext.Provider>
  );
};