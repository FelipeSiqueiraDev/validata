import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useForm, Controller } from "react-hook-form";

import { api } from "../services/axios";
import { useEffect, useState } from "react";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";
import { Dropdown } from "react-native-element-dropdown";

import Toast from "react-native-toast-message";

import { useNavigation } from "@react-navigation/native";
import LogoutModal from "../components/LogoutModal";

import { useContext } from "react";
import { AppSettingsContext } from "../contexts/settings";

export type companyProps = {
  EmpresaId: string;
  EmpresaNome: string;
};

type compProps = {
  company: companyProps;
};

export default function Settings() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const { saveCompany, company } = useContext(AppSettingsContext);

  const [companies, setCompanies] = useState<companyProps[]>(
    [] as companyProps[]
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<compProps>({});

  async function getCompanies() {
    try {
      const { data } = await api.get<companyProps[]>(
        "/api/validade/v1/EmpresaList"
      );
      const list = data.map((item) => ({
        ...item,
        EmpresaNome: item.EmpresaNome.replace("-", ".").replace("FV.", ""),
      }));
      setCompanies(list);
    } catch (err) {
      console.log(err);
    }
  }

  async function saveSettings({ company }: compProps) {
    setLoading(true);

    try {
      await saveCompany(company);
      Toast.show({
        type: "success",
        text1: "Configurações salvas com sucesso!",
        text2: `Os produtos serão listados na unidade ${company.EmpresaNome} `,
      });
      navigation.goBack();
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Algo inesperado aconteceu!",
        text2:
          "Não foi possível salvar as informações da empresa, tente novamente.",
      });

      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getCompanies();
    setValue("company", company);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Configurações</Text>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => setModalVisible(true)}
        >
          <AntDesign name="logout" size={28} color={"#FFF"} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.containerSettings}>
        <Text style={styles.label}>Empresa:</Text>

        <Controller
          name="company"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Dropdown
              data={companies}
              value={value}
              //@ts-ignore
              valueField={"EmpresaId"}
              //@ts-ignore
              labelField={"EmpresaNome"}
              onChange={onChange}
              search
              dropdownPosition="auto"
              placeholder={"Selecione a empresa"}
              placeholderStyle={{ color: "#A1A1A1" }}
              searchPlaceholder={"Pesquise o nome da empresa"}
              style={[styles.selectBox]}
            />
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(saveSettings)}
          activeOpacity={0.9}
        >
          {loading ? (
            <ActivityIndicator animating={true} color={"#FFF"} />
          ) : (
            <Text style={styles.buttonText}>Salvar</Text>
          )}
        </TouchableOpacity>
      </Animatable.View>

      <Modal
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
        transparent
      >
        <LogoutModal setModalVisible={setModalVisible} />
      </Modal>
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
  logoutButton: {
    backgroundColor: "#bf8502",
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  containerSettings: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  label: {
    fontSize: 20,
    marginTop: 28,
    marginBottom: 16,
  },
  selectBox: {
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
    color: "#A1A1A1",
  },
  button: {
    backgroundColor: "#ECA400",
    width: "100%",
    height: 60,
    borderRadius: 4,
    marginTop: 60,
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
  comapanyError: {
    alignSelf: "flex-start",
    color: "#FF375B",
  },
  error: {
    alignSelf: "flex-start",
    color: "#FF375B",
    marginTop: 4,
  },
});
