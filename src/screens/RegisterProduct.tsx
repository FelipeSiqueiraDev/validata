import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { TextInputMask } from "react-native-masked-text";

import { useDebounce } from "../hooks/useDebounce";
import { useNavigation } from "@react-navigation/native";

import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import { AxiosRequestConfig } from "axios";
import { api } from "../services/axios";
import Toast from "react-native-toast-message";

const schema = yup.object({
  productId: yup.string().required("O produto é obrigatório!"),
  productQtd: yup.string().required("A quantidade é obrigatória"),
  productDate: yup.string().required("A data é obrigatória"),
});

export type registerProps = {
  productId: string;
  productQtd: string;
  productDate: string;
};

export type productProps = {
  EmpresaId?: number;
  EntradaDt?: string;
  EntradaQt?: number;
  InsertDate?: string;
  InsertUserId?: number;
  ProdutoEan: number;
  ProdutoId: number;
  ProdutoLabel?: string;
  ProdutoNome: string;
  RelatoValidadeVerificacaoId: string;
  SaldoQt: number;
  StatusId?: number;
  VencimentoIndicadoDt: string;
  VencimentoIndicadoQt?: number;
  VendaQt?: number;
};

export default function RegisterProduct() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<productProps[]>(
    [] as productProps[]
  );
  const [searchText, setSearchText] = useState("");
  const debouncedSearchTerm = useDebounce(searchText, 1000);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function getProducts() {
    try {
      const filters = {
        Take: 50,
        ContainsText: searchText,
        EqualityFilter: {
          Excluido: false,
          ForaLinha: false,
        },
      };
      const settings: AxiosRequestConfig = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: filters,
      };

      await api("/Services/Default/Produto/List", settings)
        .then((res) => {
          setProducts(res.data.Entities);
        })
        .catch((err) => console.log(err.response));
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRegisterProduct(productData: registerProps) {
    setLoading(true);

    const today = new Date();
    const actualDay = String(today.getDate()).padStart(2, "0");
    const actualMonth = String(today.getMonth() + 1).padStart(2, "0");
    const ActualYear = today.getFullYear();

    const quantityVerify = Number(productData.productQtd);

    if (quantityVerify <= 0) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Parece que tem algo errado com a quantidade de registro",
        text2:
          "Caso não tenha encontrado os produtos, clique em 'Produtos não encontrados' abaixo.",
      });
      return;
    }

    let formatedDate: string | string[] = productData.productDate.split("/");

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
          text2: "O mês informado já passou",
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
    productData.productDate = formatedDate;

    try {
      const registerData = {
        Entity: {
          ProdutoId: String(productData.productId),
          VencimentoInicialQt: String(productData.productQtd),
          DataId: String(productData.productDate),
          EmpresaId: String(60),
        },
      };
      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: registerData,
      };
      await api("/services/Default/RelatoValidade/Create", settings);

      setLoading(false);
      Toast.show({
        type: "success",
        text1: "Relato enviado com sucesso!",
        text2: "Você pode acompanhar o registro na lista",
      });
      navigation.navigate("CheckList");
    } catch (err) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Algo deu errado ao enviar o relato!",
        text2: "Tente novamente mais tarde",
      });
      console.log(err);
    }
  }

  useEffect(() => {
    if (!!debouncedSearchTerm) {
      getProducts();
    }
  }, [debouncedSearchTerm]);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Registrar Validade</Text>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.containerNew}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView>
            <Text style={styles.label}>Produto(s)</Text>
            <Controller
              control={control}
              name="productId"
              render={({ field: { onChange, value } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name="tagso"
                    size={20}
                    color={"#000"}
                    style={{ marginLeft: 4, position: "absolute", zIndex: 99 }}
                  />

                  <Dropdown
                    data={products}
                    value={value}
                    valueField={"Id"}
                    labelField={"Nome"}
                    onChange={(item) => onChange(item.Id)}
                    selectedTextStyle={{ maxHeight: 20 }}
                    placeholder={"Selecione um produto"}
                    placeholderStyle={{ color: "#A1A1A1" }}
                    dropdownPosition="auto"
                    search
                    itemContainerStyle={{
                      borderBottomWidth: 1,
                      borderBottomColor: "#DCDCDC",
                    }}
                    style={[
                      styles.selectBox,
                      {
                        borderBottomColor: errors.productId && "#FF375B",
                        backgroundColor: errors.productId && "#FFEBEF",
                      },
                    ]}
                    renderInputSearch={() => (
                      <TextInput
                        placeholderTextColor={"#A1A1A1"}
                        placeholder="Pesquise por um produto"
                        cursorColor={"#ECA400"}
                        value={searchText}
                        onChangeText={setSearchText}
                        style={styles.inputBox}
                      />
                    )}
                  />
                </View>
              )}
            />
            {errors.productId ? (
              //@ts-ignore
              <Text style={styles.error}>{errors.productId?.message}</Text>
            ) : (
              <Text></Text>
            )}

            <Text style={styles.label}>Quantidade</Text>
            <Controller
              control={control}
              name="productQtd"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name="bars"
                    size={20}
                    color={"#000"}
                    style={{ marginLeft: 4, position: "absolute", zIndex: 99 }}
                  />
                  <TextInput
                    placeholder={"Digite a quantidade"}
                    onChangeText={onChange}
                    value={value}
                    cursorColor={"#ECA400"}
                    autoCapitalize={"none"}
                    autoCorrect={false}
                    keyboardType="numeric"
                    style={[
                      styles.input,
                      {
                        borderBottomColor: errors.productQtd && "#FF375B",
                        backgroundColor: errors.productQtd && "#FFEBEF",
                      },
                    ]}
                  />
                </View>
              )}
            />
            {errors.productQtd ? (
              //@ts-ignore
              <Text style={styles.error}>{errors.productQtd?.message}</Text>
            ) : (
              <Text></Text>
            )}

            <Text style={styles.label}>Data de vencimento</Text>
            <Controller
              control={control}
              name="productDate"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <AntDesign
                    name="calendar"
                    size={20}
                    color={"#000"}
                    style={{ marginLeft: 4, position: "absolute", zIndex: 99 }}
                  />
                  <TextInputMask
                    type="datetime"
                    onBlur={onBlur}
                    value={value}
                    onChangeText={onChange}
                    placeholder="DD/MM/AAAA"
                    cursorColor={"#ECA400"}
                    options={{
                      format: "DD/MM/YYYY",
                    }}
                    style={[
                      styles.input,
                      {
                        borderBottomColor: errors.productDate && "#FF375B",
                        backgroundColor: errors.productDate && "#FFEBEF",
                      },
                    ]}
                  />
                </View>
              )}
            />
            {errors.productDate ? (
              //@ts-ignore
              <Text style={styles.error}>{errors.productDate?.message}</Text>
            ) : (
              <Text></Text>
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit(handleRegisterProduct)}
              activeOpacity={0.7}
            >
              {loading ? (
                <ActivityIndicator animating={true} color={"#FFF"} />
              ) : (
                <Text style={styles.buttonText}>Enviar</Text>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECA400",
  },
  containerHeader: {
    marginTop: "14%",
    marginBottom: "8%",
    paddingStart: "5%",
    paddingEnd: "5%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 4,
  },
  containerNew: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",
    paddingStart: "5%",
    paddingEnd: "5%",
    paddingTop: 40,
  },
  label: {
    fontSize: 20,
    marginTop: 15,
  },
  input: {
    borderBottomWidth: 1,
    height: 56,
    width: "100%",
    marginBottom: 12,
    fontSize: 16,
    marginTop: 6,
    paddingStart: 30,
  },
  error: {
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
  selectBox: {
    width: "100%",
    height: 56,
    borderBottomWidth: 1,
    color: "#000",
    marginTop: 6,
    paddingStart: 30,
  },
  inputBox: {
    height: 50,
    paddingStart: 15,
    borderBottomWidth: 1,
  },
});
