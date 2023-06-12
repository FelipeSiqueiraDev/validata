import { Dispatch, SetStateAction } from "react";
import { StyleSheet, TouchableOpacity, Text, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { productProps } from "../screens/RegisterProduct";

import { api } from "../services/axios";

import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";

type notFoundProps = {
  productData: productProps;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

export default function NotFoundModal({
  productData,
  setModalVisible,
}: notFoundProps) {
  const navigation = useNavigation();

  async function confirmMissingProducts() {
    try {
      const notFoundData = JSON.stringify({
        EntityId: productData.RelatoValidadeVerificacaoId,
      });

      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: notFoundData,
      };

      await api(
        "/services/Default/RelatoValidadeVerificacao/NaoEncontrado",
        settings
      );

      Toast.show({
        type: "success",
        text1: "Relato enviado com sucesso!",
        text2: "Os produtos não encontrados foram retirados da lista",
      });

      navigation.navigate("ProductList");
    } catch (err) {
      console.log(err);
      Toast.show({
        type: "error",
        text1: "Algo deu errado ao enviar o relato!",
        text2: "Tente novamente mais tarde",
      });
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
          onPress={confirmMissingProducts}
        >
          <Text style={styles.actionText}>Confirmar</Text>
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
