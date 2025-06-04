import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from "react-native";
import { useWallet } from "../../src/wallet/useWallet";
import { useRouter } from "expo-router";
import styles from "../styles/styles";  // Ajuste o caminho se necessário

const GOVERNO_ADDRESSES = [
  "0x7A70375d0f6a7E2222150670C1a97f5Ba576084C",
  "0x6259c18086E3f7cbB47758233A7899e774711288",
].map(addr => addr.toLowerCase());

export default function MenuGoverno() {
  const { session, getAddress, disconnectWallet } = useWallet();
  const router = useRouter();
  const [enderecoContrato, setEnderecoContrato] = useState("");

  // Garante que address seja string (ou string vazia)
  const address = getAddress()?.toLowerCase() ?? "";

  useEffect(() => {
    if (!session || !address || !GOVERNO_ADDRESSES.includes(address)) {
      Alert.alert("Acesso negado", "Você não tem permissão para acessar esta área.");
      router.replace("/");
    }
  }, [session, address]);

  const irParaDetalhes = () => {
    if (!enderecoContrato || enderecoContrato.length !== 42) {
      Alert.alert("Erro", "Endereço de contrato inválido.");
      return;
    }
    router.push({ pathname: "/governo/detalhesGov", params: { contrato: enderecoContrato } });
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
      router.replace("/");
    } catch (error) {
      console.error("Erro ao desconectar:", error);
      Alert.alert("Erro", "Não foi possível desconectar a carteira.");
    }
  };

  if (!session || !address || !GOVERNO_ADDRESSES.includes(address)) {
    return (
      <View style={styles.container}>
        <Text style={styles.title2}>Verificando permissões...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={require("../../assets/images/icon.png")} style={styles.icon} />
      <Text style={styles.title2}>Painel do Governo</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Endereço do contrato (0x...)"
          value={enderecoContrato}
          onChangeText={setEnderecoContrato}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity style={styles.button} onPress={irParaDetalhes}>
          <Text style={styles.buttonText}>🔎</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={handleDisconnect}
        style={[styles.buttonDesconnect, { backgroundColor: "#d9534f", marginTop: 30, paddingVertical: 15 }]}
      >
        <Text style={styles.buttonText}>Desconectar</Text>
      </TouchableOpacity>
    </View>
  );
}
