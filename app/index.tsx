import "../src/polyfills/crypto";
import "react-native-get-random-values";
import "fast-text-encoding";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useWallet } from "../src/wallet/useWallet";
import { useRouter } from "expo-router";

const GOVERNO_ADDRESS = "0x7A70375d0f6a7E2222150670C1a97f5Ba576084C".toLowerCase();

export default function IndexScreen() {
  const { walletClient, session, connectWallet, disconnectWallet, getAddress } = useWallet();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [navigated, setNavigated] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connectWallet();
    } catch (error) {
      Alert.alert("Erro", "Falha ao conectar a carteira. Tente novamente.");
      console.error("Erro na conexão:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      Alert.alert("Erro", "Falha ao desconectar. Tente novamente.");
      console.error("Erro ao desconectar:", error);
    }
  };

  useEffect(() => {
    if (walletClient && session) {
      const userAddress = getAddress();
      setAddress(userAddress?.toLowerCase() ?? null);
    }
  }, [walletClient, session]);

  useEffect(() => {
    if (address && !navigated) {
      if (address === GOVERNO_ADDRESS) {
        router.replace("/governo/menuGoverno");
      } else {
        router.replace("/menu");
      }
      setNavigated(true);
    }
  }, [address, navigated]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20, textAlign: "center" }}>
        {session ? "Carteira conectada" : "Conectar sua carteira"}
      </Text>

      {!session ? (
        <TouchableOpacity
          onPress={handleConnect}
          style={{
            paddingVertical: 15,
            paddingHorizontal: 30,
            backgroundColor: loading || !walletClient ? "#888" : "#333",
            borderRadius: 10,
          }}
          disabled={loading || !walletClient}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>Conectar via WalletConnect</Text>
          )}
        </TouchableOpacity>
      ) : (
        !navigated && (
          <TouchableOpacity
            onPress={handleDisconnect}
            style={{
              paddingVertical: 15,
              paddingHorizontal: 30,
              backgroundColor: "#aa3333",
              borderRadius: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Desconectar carteira</Text>
          </TouchableOpacity>
        )
      )}
    </View>
  );
}
