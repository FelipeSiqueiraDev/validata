import { useContext, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

import { api } from "../services/axios";

import ProductCard from "../components/ProductCard";
import { productProps } from "./RegisterProduct";
import { AppSettingsContext } from "../contexts/settings";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

export default function ProductList() {
  const navigation = useNavigation();
  const [validateList, setValidateList] = useState<productProps[]>();
  const [emptyList, setEmptyList] = useState("Carregando...");
  const { company, filter, dateFilter } = useContext(AppSettingsContext);

  async function getValidateList() {
    try {
      const validateListData = JSON.stringify({
        EqualityFilter: {
          StatusId: ["0"],
          EmpresaId: [String(company?.EmpresaId)],
          ...(filter?.filterId && { SecaoId: [String(filter?.filterId)] }),
        },
        ...(dateFilter?.initialDate && {
          Criteria: [
            [["VencimentoIndicadoDt"], ">=", dateFilter.initialDate],
            "and",
            [["VencimentoIndicadoDt"], "<", dateFilter.finalDate],
          ],
        }),
        Sort: ["SecaoLabel"],
        Take: 20,
      });

      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: validateListData,
      };

      const list = await api(
        "/Services/Default/RelatoValidadeVerificacao/List",
        settings
      );
      setValidateList(list.data.Entities);
    } catch (err) {
      console.log(err.response);
    }
  }

  useFocusEffect(() => {
    getValidateList();

    setTimeout(() => {
      setEmptyList("Esta lista parece estar vazia =(");
    }, 10000);
  });

  return (
    <>
      <View style={styles.container}>
        <Animatable.View
          animation={"fadeInLeft"}
          delay={500}
          style={styles.containerHeader}
        >
          <View style={{ paddingStart: 10 }}>
            <Text style={styles.message}>Lista de Produtos</Text>
            <Text style={styles.companyName}>{company?.EmpresaNome}</Text>
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginLeft: 5,
              marginRight: 10,
              width: 120,
            }}
          >
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => navigation.navigate("FiltersRoutes")}
            >
              <AntDesign name="filter" size={28} color={"#FFF"} />
            </TouchableOpacity>
            <Animatable.Text
              animation={"fadeInLeft"}
              style={{
                width: "100%",
                marginTop: 10,
                height: 20,
                fontSize: 8,
                textAlign: "center",
                color: "#ECEFF1",
              }}
            >
              {filter ? filter.filterName : ""}
            </Animatable.Text>
          </View>
        </Animatable.View>

        <Animatable.View animation={"fadeInUp"} style={styles.listContainer}>
          {dateFilter ? (
            <Text style={styles.filterStyle}>
              Próximos {dateFilter?.periodName}
            </Text>
          ) : (
            <Text style={styles.filterStyle}></Text>
          )}
          <FlatList
            data={validateList}
            showsVerticalScrollIndicator={false}
            style={{ marginTop: 10 }}
            ListEmptyComponent={
              <Animatable.Text
                animation={"rubberBand"}
                duration={2000}
                style={{
                  alignSelf: "center",
                  color: "#A1A1A1",
                  fontSize: 20,
                  textAlign: "center",
                  marginTop: "60%",
                }}
              >
                {emptyList}
              </Animatable.Text>
            }
            keyExtractor={(product) =>
              String(product.RelatoValidadeVerificacaoId)
            }
            renderItem={({ index, item: product }) => (
              <ProductCard product={product} index={index} />
            )}
          />
        </Animatable.View>
      </View>
    </>
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
  },
  companyName: {
    fontSize: 16,
    color: "#FFF",
    marginRight: 35,
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",
    paddingStart: "5%",
    paddingEnd: "5%",
    marginTop: -20,
  },
  filterButton: {
    backgroundColor: "#bf8502",
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  filterStyle: {
    textAlign: "center",
    fontSize: 15,
    marginTop: 5,
    color: "#A1A1A1",
  },
});
