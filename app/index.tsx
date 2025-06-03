import "../src/polyfills/crypto"; // precisa vir primeiro
import 'react-native-get-random-values';
import 'fast-text-encoding';
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { useWallet } from "../src/wallet/useWallet";
import { useRouter } from "expo-router";

export default function IndexScreen() {
  const { walletClient, session, connectWallet } = useWallet();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.replace("/menu");
    }
  }, [session]);

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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20, textAlign: "center" }}>
        Conectar sua carteira
      </Text>

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
    </View>
  );
}
