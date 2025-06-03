import React, { createContext, useEffect, useState } from "react";
import SignClient from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";

// Tipagem do contexto
interface WalletContextType {
  walletClient: SignClient | null;
  session: SessionTypes.Struct | null;
  setSession: React.Dispatch<React.SetStateAction<SessionTypes.Struct | null>>;
}

// Inicializa com valor padrão para evitar nulls
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
          // ❌ Não inclua `storage` (usará padrão AsyncStorage)
        });

        console.log("🟢 WalletConnect inicializado com sucesso ✅");
        setWalletClient(client);
      } catch (error) {
        console.error("🔴 Erro ao inicializar WalletConnect:", error);
      }
    }

    initializeClient();
  }, []);

  useEffect(() => {
    if (walletClient) {
      console.log("🔗 walletClient está disponível:", walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    if (session) {
      console.log("✅ Sessão WalletConnect ativa:", session);
    }
  }, [session]);

  return (
    <WalletContext.Provider value={{ walletClient, session, setSession }}>
      {children}
    </WalletContext.Provider>
  );
};
