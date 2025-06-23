import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f2eee2",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  icon: {
    width: 250,
    height: 250,
    alignSelf: "center",
    marginBottom: 0,
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#343A40",
    textAlign: "center",
    marginBottom: 20,
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#343A40",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#5d1923",
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    borderTopLeftRadius: 0, // Remove arredondamento no canto esquerdo
    borderBottomLeftRadius: 0, // Remove arredondamento no canto esquerdo
  },
  buttonDesconnect:{
    backgroundColor: "#5d1923",
    width: 140,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
    disconnectButton: {
    backgroundColor: '#dc3545', // Cor vermelha para indicar desconexão
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  disconnectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonText: {
    color: "#f2eee2",
    fontSize: 18,
    fontWeight: "600",
  },
  input: {
    width: 220,
    height: 50,
    borderWidth: 2,
    borderColor: "#999",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#FFF",
    borderTopRightRadius: 0, // Remove arredondamento no canto direito
    borderBottomRightRadius: 0, // Remove arredondamento no canto direito
  },
  resultado: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "600",
  },
  error: {
    marginTop: 20,
    color: "red",
    fontWeight: "600",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginTop: 12,
    marginBottom: 6,
  },
  
});

export default styles;
