import { useContext, useEffect } from "react";
import { AppSettingsContext } from "../contexts/settings";
import { Controller, useForm } from "react-hook-form";
import { Dropdown } from "react-native-element-dropdown";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";

import { useNavigation } from "@react-navigation/native";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";
import Toast from "react-native-toast-message";

const periods = [
  {
    name: "Sete dias",
    value: 7,
  },
  {
    name: "Quinte dias",
    value: 15,
  },
  {
    name: "Trinta dias",
    value: 30,
  },
];

export type dateFilterProps = {
  periods: {
    name: string;
    value: number;
  };
};

export default function FilterDate() {
  const navigation = useNavigation();
  const { dateFilter } = useContext(AppSettingsContext);

  const { saveDateFilter, deleteDateFilter } = useContext(AppSettingsContext);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({});

  async function getFilterDate(data: dateFilterProps) {
    const today = new Date();
    const finalDate = new Date();
    finalDate.setDate(finalDate.getDate() + data.periods.value);
    const formatedToday = today
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");

    const formatedFinalDay = finalDate
      .toLocaleDateString("pt-BR")
      .split("/")
      .reverse()
      .join("-");

    try {
      await saveDateFilter({
        initialDate: formatedToday,
        finalDate: formatedFinalDay,
        periodName: data.periods.name,
      });
    } catch (err) {
      console.log(err);
    } finally {
      Toast.show({
        type: "success",
        text1: "Configurações salvas com sucesso!",
        text2: `Os produtos serão no periodo de ${data.periods.name} `,
      });
      navigation.navigate("ProductList");
    }
  }

  useEffect(() => {
    setValue(
      "periods",
      periods.find((item) => item.name === dateFilter?.periodName)
    );
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Filtrar Data</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate("ProductList")}
        >
          <AntDesign name="close" size={28} color={"#FFF"} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.containerNew}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <KeyboardAvoidingView style={{ height: 550 }}>
            <>
              <Controller
                name="periods"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Dropdown
                    data={periods}
                    value={value}
                    valueField={"value"}
                    labelField={"name"}
                    onChange={onChange}
                    dropdownPosition="auto"
                    placeholder={"Selecione o periodo"}
                    placeholderStyle={{ color: "#A1A1A1" }}
                    style={[styles.selectBox]}
                  />
                )}
              />

              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.actionButton,
                  { marginBottom: 20, marginTop: 40 },
                ]}
                onPress={handleSubmit(getFilterDate)}
              >
                <Text style={styles.setFilter}>Filtrar</Text>
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: "#ECA400",
                  width: "100%",
                  height: 2,
                  borderRadius: 10,
                  position: "absolute",
                  bottom: 78,
                }}
              />
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.actionButton,
                  { position: "absolute", bottom: 30, width: "100%" },
                ]}
                onPress={() => {
                  deleteDateFilter();
                  Toast.show({
                    type: "success",
                    text1: "Filtros limpos!",
                    text2: `Os produtos serão listados sem data limite`,
                  });
                  navigation.navigate("ProductList");
                }}
              >
                <Text style={styles.cleanFilter}>Limpar filtro</Text>
              </TouchableOpacity>
            </>
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
    marginTop: "10%",
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
  inputBox: {
    height: 50,
    paddingStart: 15,
    borderBottomWidth: 1,
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
    width: "80%",
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FF0000",
  },
  selectBox: {
    width: "100%",
    height: 70,
    borderBottomWidth: 1,
    color: "#A1A1A1",
    paddingStart: 10,
  },
  cleanFilter: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#008000",
  },
  setFilter: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#ECA400",
  },
  filterButton: {
    backgroundColor: "#bf8502",
    width: 45,
    height: 45,
    marginRight: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
});
