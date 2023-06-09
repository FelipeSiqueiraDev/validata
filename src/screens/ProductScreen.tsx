import { useState } from "react";
import { TextInputMask } from "react-native-masked-text";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";

import Toast from "react-native-toast-message";
import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import { useNavigation, useRoute } from "@react-navigation/native";
import { productProps } from "./RegisterProduct";

import { useForm, Controller } from "react-hook-form";
import { api } from "../services/axios";
import NotFoundModal from "../components/NotFoundModal";

type validateProps = {
  quantity: string;
  expiration: string;
};

export default function ProductScreen() {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const data = useRoute();
  const prodData = data.params as productProps;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  async function sendOcorrence({ expiration, quantity }: validateProps) {
    setLoading(true);

    let formatedDate: string | string[] = "";
    let formatedQuantity: string;
    const today = new Date();
    const actualDay = String(today.getDate()).padStart(2, "0");
    const actualMonth = String(today.getMonth() + 1).padStart(2, "0");
    const ActualYear = today.getFullYear();

    if (!expiration) {
      formatedDate = String(
        new Date(prodData.VencimentoIndicadoDt).toLocaleDateString()
      );
    } else formatedDate = expiration;

    formatedDate = formatedDate.split("/");
    if (Number(formatedDate[1]) > 12) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Parece que tem algo errado com a data de registro",
        text2: "O mes é maior que dezembro (12)",
      });
      return;
    }
    if (Number(formatedDate[2]) < ActualYear) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Parece que tem algo errado com a data de registro",
        text2: "O ano informado já passou",
      });
      return;
    } else if (Number(formatedDate[2]) == ActualYear) {
      if (Number(formatedDate[1]) < Number(actualMonth)) {
        setLoading(false);
        Toast.show({
          type: "error",
          text1: "Parece que tem algo errado com a data de registro",
          text2: "O mes informado já passou",
        });
        return;
      } else if (Number(formatedDate[1]) == Number(actualMonth)) {
        if (Number(formatedDate[0]) < Number(actualDay)) {
          setLoading(false);
          Toast.show({
            type: "error",
            text1: "Parece que tem algo errado com a data de registro",
            text2: "O dia informado já passou",
          });
          return;
        }
      }
    }

    formatedDate.reverse();
    formatedDate = formatedDate.join("/");

    if (!quantity) {
      formatedQuantity = String(prodData.VencimentoIndicadoQt);
    } else formatedQuantity = quantity;

    try {
      const productData = {
        Entity: {
          RelatoValidadeVerificacaoId: prodData.RelatoValidadeVerificacaoId,
          VencimentoEncontradoQt: formatedQuantity,
          VencimentoIndicadoDt: formatedDate,
        },
      };
      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: productData,
      };

      await api("/services/Default/RelatoValidadeVerificacao/Update", settings);

      navigation.navigate("CheckList");
      Toast.show({
        type: "success",
        text1: "Relato enviado com sucesso!",
        text2: "Você pode acompanhar o registro na lista",
      });
      setLoading(false);
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Algo deu errado ao enviar o relato!",
        text2: "Tente novamente mais tarde",
      });
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={28} color={"#FFF"} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.listContainer}>
        <Text style={styles.message}>{prodData.ProdutoNome}</Text>
        <View>
          <Text style={[styles.label, { marginTop: 50 }]}>Quantidade</Text>
          <Controller
            control={control}
            name="quantity"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder={String(prodData.VencimentoIndicadoQt)}
                defaultValue={String(prodData.VencimentoIndicadoQt)}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                cursorColor={"#ECA400"}
                autoCapitalize={"none"}
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    borderBottomColor: errors.quantity && "#FF375B",
                    backgroundColor: errors.quantity && "#FFEBEF",
                  },
                ]}
              />
            )}
          />
          {errors.quantity ? (
            //@ts-ignore
            <Text style={styles.loginError}>{errors.quantity?.message}</Text>
          ) : (
            <Text></Text>
          )}

          <Text style={styles.label}>Vencimento</Text>
          <Controller
            control={control}
            name="expiration"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputMask
                type="datetime"
                placeholder={String(
                  new Date(prodData.VencimentoIndicadoDt).toLocaleDateString()
                )}
                defaultValue={String(
                  new Date(prodData.VencimentoIndicadoDt).toLocaleDateString()
                )}
                placeholderTextColor={"#000"}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                cursorColor={"#ECA400"}
                autoCapitalize={"none"}
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    borderBottomColor: errors.expiration && "#FF375B",
                    backgroundColor: errors.expiration && "#FFEBEF",
                  },
                ]}
              />
            )}
          />
          {errors.expiration ? (
            //@ts-ignore
            <Text style={styles.loginError}>{errors.expiration?.message}</Text>
          ) : (
            <Text></Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(sendOcorrence)}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator animating={true} color={"#FFF"} />
          ) : (
            <Text style={styles.buttonText}>Enviar</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.notFoundContainer}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.notFoundMessage}>Produto não encontrado</Text>
        </TouchableOpacity>
      </Animatable.View>
      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        transparent
      >
        <NotFoundModal
          productData={prodData}
          setModalVisible={setModalVisible}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECA400",
  },
  goBack: {
    backgroundColor: "#bf8502",
    width: 45,
    height: 45,
    marginLeft: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#000",
    marginTop: 20,
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  companyName: {
    fontSize: 16,
    color: "#A1A1A1",
    marginRight: 30,
  },
  label: {
    fontSize: 20,
    marginTop: 12,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    width: "100%",
    marginBottom: 12,
    fontSize: 16,
    paddingStart: 4,
  },
  loginError: {
    alignSelf: "flex-start",
    color: "#FF375B",
  },
  button: {
    backgroundColor: "#ECA400",
    width: "100%",
    height: 60,
    borderRadius: 4,
    marginTop: 28,
    paddingVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
  },
  notFoundContainer: {
    marginTop: 50,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  notFoundMessage: {
    color: "#ECA400",
    fontSize: 13,
    textDecorationLine: "underline",
    fontWeight: "bold",
    marginLeft: 5,
  },
});
