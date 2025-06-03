import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import styles from "./styles/styles";

export default function MenuScreen() {
  const router = useRouter();
  const [enderecoContrato, setEnderecoContrato] = useState("");

  const irParaDetalhes = () => {
    if (!enderecoContrato || enderecoContrato.length !== 42) {
      alert("Endereço de contrato inválido.");
      return;
    }
    router.push({ pathname: "/publico/detalhes", params: { contrato: enderecoContrato } });
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
    </View>
  );
}
