// src/wallet/walletProvider.tsx
import React, { createContext, useState, useEffect } from "react";
import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface WalletContextType {
  walletClient: SignClient | null;
  session: SessionTypes.Struct | null;
  setSession: React.Dispatch<React.SetStateAction<SessionTypes.Struct | null>>;
}

export const WalletContext = createContext<WalletContextType>({
  walletClient: null,
  session: null,
  setSession: () => {}, // Função vazia para inicializar
});

// Certifique-se que o PROJECT_ID está aqui também!
const WC_PROJECT_ID = "3e6f24739b8a48a8f8b761d782cbcba6";

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletClient, setWalletClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);

  useEffect(() => {
    const setupClient = async () => {
      if (walletClient) return; // Garante que o cliente só seja inicializado uma vez

      console.log("LOG: Inicializando WalletConnect SignClient no WalletProvider...");
      try {
        const client = await SignClient.init({
          projectId: WC_PROJECT_ID,
          metadata: {
            name: "EduCoChain",
            description: "App de contratos inteligentes com WalletConnect",
            url: "https://localhost",
            icons: ["https://educhain.com/logo.png"],
          },
        });
        setWalletClient(client);
        console.log("LOG: ✅ WalletConnect SignClient inicializado com sucesso no WalletProvider.");

        // Tenta restaurar a sessão do AsyncStorage
        const storedSession = await AsyncStorage.getItem("walletconnectSession");
        if (storedSession) {
          const parsedSession: SessionTypes.Struct = JSON.parse(storedSession);
          // Verifica se a sessão ainda é válida com o SignClient
          if (client.session.get(parsedSession.topic)) {
            setSession(parsedSession);
            console.log("LOG: 🔄 Sessão WalletConnect restaurada do AsyncStorage.");
          } else {
            console.warn("WARN: Sessão no AsyncStorage inválida ou expirada. Removendo.");
            await AsyncStorage.removeItem("walletconnectSession");
          }
        }
      } catch (error) {
        console.error("ERROR: ❌ Erro ao inicializar WalletConnect SignClient:", error);
      }
    };

    setupClient();
  }, []);

  // Adiciona listeners globais para o SignClient aqui, se necessário,
  // para que eventos como 'session_delete' possam limpar o estado.
  useEffect(() => {
    if (walletClient) {
      // Cria a função listener aqui para que tenhamos uma referência estável
      const sessionDeleteListener = ({ topic }: { topic: string }) => {
        console.log("LOG: 🧹 Sessão deletada pelo peer/servidor:", topic);
        setSession(null);
        AsyncStorage.removeItem("walletconnectSession");
      };

      walletClient.on("session_delete", sessionDeleteListener);
      // Outros listeners, como 'session_event', 'session_update', etc.
      // Exemplo:
      // const sessionUpdateListener = (args: SignClientTypes.SessionUpdate) => { /* ... */ };
      // walletClient.on("session_update", sessionUpdateListener);

      // Cleanup para listeners ao desmontar: remover a *mesma* função que foi adicionada
      return () => {
        console.log("DEBUG: Removendo listeners do WalletProvider.");
        walletClient.off("session_delete", sessionDeleteListener);
        // Exemplo:
        // walletClient.off("session_update", sessionUpdateListener);
      };
    }
    // O array de dependências deve incluir walletClient, pois queremos que este useEffect
    // re-execute (e adicione/remova listeners) sempre que walletClient mudar (de null para a instância).
  }, [walletClient]);


  return (
    <WalletContext.Provider value={{ walletClient, session, setSession }}>
      {children}
    </WalletContext.Provider>
  );
};