import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2eee2",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBox: {
    backgroundColor: "#343A40",
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  button: {
    position: "absolute", // Fixando na parte inferior
    bottom: 40, 
    alignSelf: "center",
    backgroundColor: "#5d1923",
    width: 250,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
export default styles;