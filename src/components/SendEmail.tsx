import { Dispatch, SetStateAction } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  SafeAreaView,
  Linking,
} from "react-native";

import * as Animatable from "react-native-animatable";

type logoutModalVisible = {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
  email: string;
};

export default function SendEmail({
  setModalVisible,
  email,
}: logoutModalVisible) {

  async function handleSendEmail() {
    try {
      Linking.openURL(email);
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
          onPress={handleSendEmail}
        >
          <Text style={styles.actionText}>Enviar Email</Text>
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
