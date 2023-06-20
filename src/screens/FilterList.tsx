import {
  useState,
  useEffect,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useForm } from "react-hook-form";

import { useNavigation } from "@react-navigation/native";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import { api } from "../services/axios";
import Toast from "react-native-toast-message";
import { AppSettingsContext } from "../contexts/settings";

type filterModalProps = {
  setModalVisible: Dispatch<SetStateAction<boolean>>;
};

export type filterProps = {
  Id: string;
  Nome: string;
  Departamento: number;
};

export default function FilterList({ setModalVisible }: filterModalProps) {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<filterProps[]>();
  const { saveFilter, deleteFilter } = useContext(AppSettingsContext);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({});

  async function getFilters() {
    try {
      const filterList = await api.get("/Services/Default/Secao/List");
      setFilters(filterList.data.Entities);
    } catch (err) {
      console.log(err);
    }
  }

  async function setFilter(filter: filterProps) {
    try {
      await saveFilter(filter);
      Toast.show({
        type: "success",
        text1: "Filtros aplicados com sucesso!",
        text2: `Os produtos serão listados na seção: ${filter.Nome}`,
      });

      navigation.navigate("ProductList");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <Text style={styles.message}>Filtrar Seção</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => navigation.navigate("ProductList")}
        >
          <AntDesign name="close" size={28} color={"#FFF"} />
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.containerNew}>
        <FlatList
          data={filters}
          bounces={true}
          showsVerticalScrollIndicator={false}
          style={{
            height: 100,
            marginBottom: 5,
            marginTop: 15,
          }}
          keyExtractor={(filter) => String(filter.Id)}
          initialNumToRender={10}
          ListEmptyComponent={
            <ActivityIndicator
              animating={true}
              color={"#ECA400"}
              style={{ alignSelf: "center" }}
            />
          }
          renderItem={({ item: filter }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.actionButton}
              onPress={() => setFilter(filter)}
            >
              <Text>{filter.Nome}</Text>
            </TouchableOpacity>
          )}
        />

        <View
          style={{
            backgroundColor: "#ECA400",
            width: "100%",
            height: 2,
            borderRadius: 10,
          }}
        />

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionButton}
          onPress={() => {
            deleteFilter();
          }}
        >
          <Text style={styles.cleanFilter}>Limpar filtro</Text>
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ECA400",
    marginBottom: 15,
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
    paddingTop: 10,
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
    height: 350,
    borderBottomWidth: 1,
    color: "#A1A1A1",
    paddingStart: 10,
  },
  cleanFilter: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#008000",
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
