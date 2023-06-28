import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

import * as Animatable from "react-native-animatable";
import logoImage from "../assets/LogoValiData.png";

export default function Home() {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.containerLogo}>
        <Animatable.Image
          animation={"flipInY"}
          source={logoImage}
          style={{ width: "60%", height: "50%" }}
          resizeMode={"contain"}
        />
        <Text style={styles.logoTitle}>ValiData</Text>
      </View>

      <Animatable.View
        delay={500}
        animation={"fadeInUp"}
        style={styles.containerForm}
      >
        <Text style={styles.title}>
          Controle e monitoramento de validade de produtos
        </Text>
        <Text style={styles.text}>Faça o login para começar</Text>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECA400",
  },
  logoTitle: {
    fontSize: 50,
    fontWeight: "bold",
    color: "#FFF",
  },
  containerLogo: {
    flex: 2,
    backgroundColor: "#ECA400",
    alignItems: "center",
    justifyContent: "center",
  },
  containerForm: {
    flex: 1,
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  title: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 28,
    marginBottom: 12,
  },
  text: {
    color: "#A1A1A1",
  },
  button: {
    position: "absolute",
    backgroundColor: "#ECA400",
    borderRadius: 50,
    paddingVertical: 8,
    width: "60%",
    height: "20%",
    alignSelf: "center",
    bottom: "15%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
});
