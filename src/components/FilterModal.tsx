import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useContext,
} from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { api } from "../services/axios";

import { useNavigation } from "@react-navigation/native";
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

export default function FilterModal({ setModalVisible }: filterModalProps) {
  const navigation = useNavigation();
  const [filters, setFilters] = useState<filterProps[]>();
  const { saveFilter, deleteFilter } = useContext(AppSettingsContext);

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
      setModalVisible(false);
      navigation.navigate("CheckList");
      navigation.navigate("ProductList");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getFilters();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={{ flex: 1, zIndex: 9 }}
        onPress={() => setModalVisible(false)}
      ></TouchableOpacity>

      <Animatable.View style={styles.content} animation={"bounceInUp"}>
      <View
          style={{
            backgroundColor: "#DBDBDB",
            width: 45,
            height: 3,
            borderRadius: 10,
            alignSelf: 'center'
          }}
        />
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

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.actionButton}
          onPress={() => {
            setModalVisible(false);
          }}
        >
          <Text style={styles.cancelText}>Fechar Filtro</Text>
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  content: {
    marginVertical: 10,
    paddingStart: 10,
    paddingEnd: 10,
    height: "60%",
    width: "100%",
    backgroundColor: "#FFF",
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
    paddingTop: 10,
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
});
