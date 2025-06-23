import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles/styles";
import { useWallet } from "../src/wallet/useWallet"; 

export default function MenuScreen() {
  const router = useRouter();
  const [enderecoContrato, setEnderecoContrato] = useState("");
  const { disconnectWallet, walletClient, session } = useWallet();

  const irParaDetalhes = () => {
    if (!enderecoContrato || enderecoContrato.length !== 42) {
      alert("Endereço de contrato inválido.");
      return;
    }
    router.push({ pathname: "/publico/detalhes", params: { contrato: enderecoContrato } });
  };

  const handleDisconnect = async () => {
    if (walletClient && session) {
      await disconnectWallet();
      alert("Carteira desconectada.");
    } else {
      alert("Nenhuma carteira conectada para desconectar.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/icon.png")} style={styles.icon} />
      <Text style={styles.title2}>Seja Bem-Vindo!</Text>

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

     
      {session && ( // Renderiza o botão apenas se houver uma sessão ativa
        <TouchableOpacity style={styles.disconnectButton} onPress={handleDisconnect}>
          <Text style={styles.disconnectButtonText}>Desconectar Carteira</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}