import { Dispatch, SetStateAction, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text, SafeAreaView } from "react-native";

import * as Animatable from "react-native-animatable";
import { AuthContext } from "../contexts/auth";

type logoutModalVisible = {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

export default function LogoutModal({ setModalVisible }: logoutModalVisible) {
  const { logout } = useContext(AuthContext);

  async function getOut() {
    try {
      await logout();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1, zIndex: 9 }}
        onPress={() => setModalVisible(false)}
      ></TouchableOpacity>

      <Animatable.View style={styles.content} animation={"bounceInUp"}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionButton}
          onPress={getOut}
        >
          <Text style={styles.actionText}>Sair da Conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionButton}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginVertical: 10,
    marginHorizontal: 10,
  },
  actionButton: {
    zIndex: 99,
    backgroundColor: "#FFF",
    borderRadius: 6,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#000",
    elevation: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: {
    textAlign: "center",
    fontWeight: "bold",
    width: "100%",
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FF0000",
  },
});
