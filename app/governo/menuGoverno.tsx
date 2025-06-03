import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Alert, Button } from "react-native";
import { useWallet } from "../../src/wallet/useWallet";
import { useRouter } from "expo-router";

const GOVERNO_ADDRESS = "0x7A70375d0f6a7E2222150670C1a97f5Ba576084C".toLowerCase();

export default function MenuGoverno() {
  const { session, getAddress, disconnectWallet } = useWallet();
  const router = useRouter();

  const address = getAddress()?.toLowerCase();

  useEffect(() => {
    if (!session || address !== GOVERNO_ADDRESS) {
      Alert.alert("Acesso negado", "Você não tem permissão para acessar esta área.");
      router.replace("/");
    }
  }, [session, address]);

  if (!session || address !== GOVERNO_ADDRESS) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Verificando permissões...</Text>
      </View>
    );
  }

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      Alert.alert("Erro", "Não foi possível desconectar a carteira.");
    }
  };

  return (
    <View
      style={{ flex: 1, padding: 20, justifyContent: "center", alignItems: "center" }}
    >
      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 20 }}>
        Painel do Governo
      </Text>

      <Text style={{ fontSize: 18, textAlign: "center", marginBottom: 40 }}>
        Bem-vindo, administrador da rede pública. Você pode gerenciar contratos, liberar
        verbas e monitorar atividades públicas a partir deste painel.
      </Text>

      <Button title="Desconectar" onPress={handleDisconnect} color="#d9534f" />
    </View>
  );
}
