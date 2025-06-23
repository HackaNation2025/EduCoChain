import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity, Alert, TextInput } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter, useLocalSearchParams } from "expo-router";
import styles from "../styles/detalhes";

import { useWallet } from "../../src/wallet/useWallet";
import { ethers } from "ethers";

import {
  criarInstanciaContrato,
  getEmpresaContratada,
  getValorContrato,
  getdescricaoProdutoServico,
  getlocalizacaoEntrega,
  getEstadoAtual,
  getOrgaoGoverno,
  getQuantidadeEstipulada,
  depositarVerbaNoContrato, // Importado
} from "../../src/services/contratoService";
import provider from "../../src/config/provider";

const GOVERNO_ADDRESSES = [
  "0x7A70375d0f6a7E2222150670C1a97f5Ba576084C",
  "0x6259c18086E3f7cbB47758233A7899e774711288",
].map(addr => addr.toLowerCase());

export default function DetalhesContratoGoverno() {
  const { contrato } = useLocalSearchParams();
  const router = useRouter();

  const [empresa, setEmpresa] = useState("");
  const [valorContrato, setValorContrato] = useState<string>("0");
  const [quantidadeEstipulada, setQuantidadeEstipulada] = useState<string>("0");
  const [descricaoProdutoServico, setDescricaoProdutoServico] = useState("");
  const [localizacaoEntrega, setLocalizacaoEntrega] = useState("");
  const [estadoContrato, setEstadoContrato] = useState<string>("Carregando...");
  const [governo, setOrgaoGoverno] = useState("");
  const [valorDepositoInput, setValorDepositoInput] = useState("");

  const [loading, setLoading] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [error, setError] = useState("");

  const { walletClient, session, getAddress } = useWallet();

  const copyToClipboard = useCallback((text: string) => {
    Clipboard.setStringAsync(text);
    Alert.alert("Copiado", "Texto copiado para a área de transferência.");
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      if (!contrato || typeof contrato !== "string") {
        throw new Error("Endereço de contrato não fornecido.");
      }

      const instancia = criarInstanciaContrato(contrato, provider);

      const [
        empresaData,
        valorData,
        descricaoData,
        localizacaoData,
        estadoData,
        orgaoData,
        quantidadeData,
      ] = await Promise.all([
        getEmpresaContratada(instancia),
        getValorContrato(instancia),
        getdescricaoProdutoServico(instancia),
        getlocalizacaoEntrega(instancia),
        getEstadoAtual(instancia),
        getOrgaoGoverno(instancia),
        getQuantidadeEstipulada(instancia),
      ]);

      setEmpresa(empresaData);
      setValorContrato(valorData);
      setDescricaoProdutoServico(descricaoData);
      setLocalizacaoEntrega(localizacaoData);
      setEstadoContrato(estadoData);
      setOrgaoGoverno(orgaoData);
      setQuantidadeEstipulada(quantidadeData);
      setValorDepositoInput(ethers.formatEther(valorData));
    } catch (err) {
      console.error("❌ Erro ao carregar os detalhes do contrato:", err);
      setError("Erro ao carregar os detalhes do contrato. Verifique o endereço e tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [contrato]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDepositar = async () => {
    if (!walletClient || !session) {
      Alert.alert("Erro", "Carteira não conectada. Por favor, conecte sua carteira primeiro.");
      return;
    }

    if (!contrato || typeof contrato !== "string") {
      Alert.alert("Erro", "Endereço do contrato inválido.");
      return;
    }

    if (estadoContrato !== "Aguardando Depósito") {
      Alert.alert("Erro", "Não é possível depositar verba neste estado do contrato.");
      return;
    }

    const currentAddress = getAddress();
    if (!currentAddress) {
      Alert.alert("Erro", "Endereço da carteira não disponível. Tente reconectar.");
      return;
    }

    let amountToDepositWei: ethers.BigNumberish;
    try {
      amountToDepositWei = ethers.parseEther(valorDepositoInput || "0");
      if (amountToDepositWei < ethers.parseUnits(valorContrato, "wei")) {
        Alert.alert("Aviso", "O valor a ser depositado é menor que o valor total estipulado no contrato.");
      }
    } catch (e: any) {
      Alert.alert("Erro de Valor", "Valor de depósito inválido. Use um formato numérico válido (ex: 0.1, 1.5).");
      return;
    }

    setDepositing(true);
    try {
      // CORREÇÃO AQUI: Passar walletClient e session para depositarVerbaNoContrato
      await depositarVerbaNoContrato(contrato, walletClient, session, amountToDepositWei);

      Alert.alert("Sucesso", "Verba depositada com sucesso!");
      fetchData();
    } catch (err: any) {
      console.error("❌ Erro ao depositar verba:", err);
      if (err.code === 4001) {
        Alert.alert("Erro", "Transação recusada pelo usuário.");
      } else {
        Alert.alert("Erro", `Falha ao depositar verba: ${err.message || "Erro desconhecido"}`);
      }
    } finally {
      setDepositing(false);
    }
  };

  const isGoverno = getAddress()?.toLowerCase() && GOVERNO_ADDRESSES.includes(getAddress()!.toLowerCase());

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

            <Text style={styles.label}>Valor Total do Contrato (Estipulado):</Text>
            <Text style={styles.text}>
              {ethers.formatEther(valorContrato)} BNB
            </Text>

            <View style={styles.buttonRow}>
              {isGoverno && estadoContrato === "Aguardando Depósito" && (
                <>
                  <Text style={styles.label}>Valor a Depositar (BNB):</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    placeholder={`Ex: ${ethers.formatEther(valorContrato)}`}
                    value={valorDepositoInput}
                    onChangeText={setValorDepositoInput}
                  />
                  <TouchableOpacity
                    style={[styles.buttonVote, (depositing || !walletClient || !session) && styles.buttonDisabled]}
                    onPress={handleDepositar}
                    disabled={depositing || !walletClient || !session}
                  >
                    {depositing ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Depositar Verba</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
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