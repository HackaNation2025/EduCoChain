import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2eee2",
  },
  headerBox: {
    backgroundColor: "#343A40",
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 120, // Ajuste este valor se necessário
  },
  detailsBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 20,
  },

  footer: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff", // Para ter um fundo se estiver fora do scroll
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,

  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  text: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
  },
  copyContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '100%', // Para que o container ocupe a largura total
  },
  // NOVO ESTILO PARA O TEXTO DENTRO DO copyContainer
  copyableText: {
    fontSize: 15,
    color: "#333",
    flex: 1, // Permite que o texto ocupe o espaço disponível
    marginRight: 10, // Espaçamento entre o texto e o botão
  },
  copyButton: {
    backgroundColor: "#5d1923",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    // marginLeft: 10, // Removido, pois o marginRight no copyableText já cuida do espaçamento
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  button: {
    backgroundColor: "#5d1923",
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,

  },
  buttonRow: {
    flexDirection: "column", // Alterado para coluna para o input e botão "Depositar"
    justifyContent: "center", // Centraliza os itens na coluna
    alignItems: "center", // Centraliza horizontalmente
    marginTop: 20,
    width: '100%', // Garante que o buttonRow ocupe a largura total do detailsBox
  },
  buttonRewards: {
    backgroundColor: "#28a745", // verde
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: '100%', // Faz com que ocupe a largura total da buttonRow
    marginBottom: 10, // Espaçamento entre botões, se houver mais de um na linha
  },
  buttonVote: {
    backgroundColor: "#007bff", // azul
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: '100%', // Faz com que ocupe a largura total da buttonRow
    marginTop: 10, // Espaçamento para o input
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  buttonDisabled: {
    backgroundColor: '#cccccc', // Cinza claro para botão desabilitado
  },
  error: {
    color: "red",
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  // NOVO ESTILO PARA O INPUT
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10, // Espaçamento abaixo do input
    width: '100%', // Ocupa a largura total na buttonRow
    fontSize: 16,
    backgroundColor: '#f9f9f9', // Um pouco de fundo para o input
  },
});

export default styles;