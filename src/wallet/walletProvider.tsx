import React, { createContext, useEffect, useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Tipagem do contexto incluindo disconnect
interface WalletContextType {
  walletClient: SignClient | null;
  session: SessionTypes.Struct | null;
  setSession: React.Dispatch<React.SetStateAction<SessionTypes.Struct | null>>;
  disconnect: () => Promise<void>;
}

// Inicializa com valor padrão para evitar nulls
export const WalletContext = createContext<WalletContextType>({
  walletClient: null,
  session: null,
  setSession: () => {},
  disconnect: async () => {},
});

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [walletClient, setWalletClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);

  useEffect(() => {
    async function initializeClient() {
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

        // Limpa sessões antigas no início para evitar reconexão automática e erros
        const sessions = client.session.getAll();
        if (sessions.length > 0) {
          console.log(`🧹 Limpeza de ${sessions.length} sessão(ões) armazenada(s)...`);
          for (const sess of sessions) {
            try {
              await client.disconnect({
                topic: sess.topic,
                reason: { code: 6000, message: "Limpeza ao iniciar app" },
              });
              console.log(`🗑 Sessão ${sess.topic} desconectada.`);
            } catch (error) {
              console.warn(`⚠️ Erro ao desconectar sessão ${sess.topic}:`, error);
            }
          }
        }

        // Limpa estado e AsyncStorage da sessão local
        setSession(null);
        await AsyncStorage.removeItem("walletconnectSession");
        console.log("🧹 Sessão local removida do AsyncStorage");
      } catch (error) {
        console.error("🔴 Erro ao inicializar WalletConnect:", error);
      }
    }

    initializeClient();
  }, []);

  // Persiste sessão no AsyncStorage quando mudar
  useEffect(() => {
    if (session) {
      AsyncStorage.setItem("walletconnectSession", JSON.stringify(session))
        .then(() => console.log("💾 Sessão salva no AsyncStorage"))
        .catch((e) => console.error("⚠️ Erro ao salvar sessão no AsyncStorage:", e));
    }
  }, [session]);

  // Função para desconectar sessão ativa
  async function disconnect() {
    if (!walletClient || !session) return;

    try {
      await walletClient.disconnect({
        topic: session.topic,
        reason: { code: 6000, message: "Desconectado pelo usuário" },
      });
      console.log("🧹 Sessão desconectada com sucesso.");
    } catch (error) {
      console.error("⚠️ Erro ao desconectar sessão:", error);
    } finally {
      setSession(null);
      await AsyncStorage.removeItem("walletconnectSession");
      console.log("🧹 Sessão local removida do AsyncStorage após desconectar.");
    }
  }

  return (
    <WalletContext.Provider value={{ walletClient, session, setSession, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
};
