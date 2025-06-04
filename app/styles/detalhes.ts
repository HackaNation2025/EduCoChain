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
    // Aumentei o paddingBottom para dar mais espaço,
    // já que o footer agora estará abaixo do conteúdo rolado
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
  // Removi 'position: absolute' do footer
  // e ajuste para que ele fique no final da tela mas como parte do fluxo do scroll
  footer: {
    // Isso garante que ele fique na parte inferior do container principal,
    // mas pode ser que o conteúdo da scrollview precise de um padding extra
    // para não ser sobreposto se o footer for 'absolute' e não estiver no scroll.
    // Melhor abordagem: garantir que o footer esteja DENTRO do fluxo normal
    // ou que a ScrollView tenha padding suficiente.
    // Vamos garantir que ele está "dentro" do container e empurra o conteúdo da ScrollView.
    width: "100%",
    alignItems: "center",
    backgroundColor: "#fff", // Para ter um fundo se estiver fora do scroll
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // Se você quer que o footer SEMPRE fique na parte inferior da tela,
    // mesmo que o conteúdo da ScrollView seja curto,
    // você precisa envolver o footer e o ScrollView em uma View com flex: 1,
    // e o footer com marginTop: 'auto'.

    // Opção 1: Footer Fixo na parte inferior da tela (melhor UX para navegação)
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    // Se usar esta opção, o `paddingBottom` do `scrollContent`
    // DEVE ser maior ou igual à altura do footer.
    // A altura aproximada do button + padding do footer = 50 + 20 + 15 = ~85.
    // Então, um paddingBottom de 90-100 no scrollContent seria ideal.
    // Já ajustamos para 120, o que deve ser suficiente.
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
    // Reduzido o width para permitir que o botão "Copiar" tenha espaço.
    // Ou, se o texto for muito longo, quebre a linha ou use ellipsizeMode.
    // Como você já usa ellipsizeMode, manter 80% está OK, mas ajustei para flex: 1 para o texto.
    // E o botão fica fixo.
    width: '100%', // Para que o container ocupe a largura total
  },
  copyButton: {
    backgroundColor: "#5d1923",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 10, // Adiciona um pequeno espaço entre o texto e o botão
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
    // Removido marginBottom daqui, pois o footer já tem padding ou está fixo
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