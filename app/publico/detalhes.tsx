import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from "react-native"; // Importe Alert
import * as Clipboard from "expo-clipboard";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../styles/detalhes";

import {
  criarInstanciaContrato,
  getEmpresaContratada,
  getValorContrato,
  getdescricaoProdutoServico,
  getlocalizacaoEntrega,
  getEstadoAtual,
  getOrgaoGoverno,
  getQuantidadeEstipulada,
} from "../../src/services/contratoService";

export default function DetalhesContrato() {
  const { contrato } = useLocalSearchParams(); // pega o endereço da URL
  const [empresa, setEmpresa] = useState("");
  const [valorContrato, setValorContrato] = useState(0);
  const [quantidadeEstipulada, setQuantidadeEstipulada] = useState(0);
  const [descricaoProdutoServico, setdescricaoProdutoServico] = useState("");
  const [localizacaoEntrega, setlocalizacaoEntrega] = useState("");
  const [estadoContrato, setEstadoContrato] = useState<string>("Aguardando Depósito");
  const [governo, setOrgaoGoverno] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(""); // Limpa qualquer erro anterior

        if (!contrato || typeof contrato !== "string") {
          throw new Error("Endereço de contrato não fornecido.");
        }

        const instancia = criarInstanciaContrato(contrato);

        const [
          empresa,
          valor,
          descricao,
          localizacao,
          estado,
          orgao,
          quantidade,
        ] = await Promise.all([
          getEmpresaContratada(instancia),
          getValorContrato(instancia),
          getdescricaoProdutoServico(instancia),
          getlocalizacaoEntrega(instancia),
          getEstadoAtual(instancia),
          getOrgaoGoverno(instancia),
          getQuantidadeEstipulada(instancia),
        ]);

        setEmpresa(empresa);
        setValorContrato(Number(valor));
        setdescricaoProdutoServico(descricao);
        setlocalizacaoEntrega(localizacao);
        setEstadoContrato(estado);
        setOrgaoGoverno(orgao);
        setQuantidadeEstipulada(Number(quantidade));
      } catch (err) { // Mudei para 'err' para consistência
        console.error("❌ Erro ao carregar os detalhes do contrato:", err);
        setError("Erro ao carregar os detalhes do contrato. Verifique o endereço e tente novamente.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [contrato]);

  const copyToClipboard = (text: string) => {
    Clipboard.setStringAsync(text);
    Alert.alert("Copiado", "Texto copiado para a área de transferência."); // Adicionei o alerta aqui
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.title}>Detalhes do Contrato</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <View style={styles.detailsBox}>
            <Text style={styles.label}>Serviço:</Text>
            <Text style={styles.text}>{descricaoProdutoServico}</Text>

            <Text style={styles.label}>Órgão Responsável:</Text>
            <View style={styles.copyContainer}>
              <Text style={styles.copyableText} numberOfLines={1} ellipsizeMode="middle">{governo}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(governo)} style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Empresa Contratada:</Text>
            <View style={styles.copyContainer}>
              <Text style={styles.copyableText} numberOfLines={1} ellipsizeMode="middle">{empresa}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(empresa)} style={styles.copyButton}>
                <Text style={styles.copyButtonText}>Copiar</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Estado do Contrato:</Text>
            <Text style={styles.text}>{estadoContrato}</Text>

            <Text style={styles.label}>Localização: 📌</Text>
            <Text style={styles.text}>{localizacaoEntrega}</Text>

            <Text style={styles.label}>Quantidade Estipulada:</Text>
            <Text style={styles.text}>{quantidadeEstipulada}</Text>

            <Text style={styles.label}>Valor do Contrato:</Text>
            <Text style={styles.text}>{valorContrato} </Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.buttonRewards} onPress={() => router.push("/publico/recompensa")}>
                <Text style={styles.buttonText}>Recompensas</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttonVote} onPress={() => router.push("/publico/votar")}>
                <Text style={styles.buttonText}>Votar</Text>
              </TouchableOpacity>
            </View>

          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => router.back()}>
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}