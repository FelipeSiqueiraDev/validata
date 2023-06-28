import { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";

import * as Animatable from "react-native-animatable";

import { api } from "../services/axios";
import CheckProductCard from "../components/CheckProductCard";

export type checkProps = {
  AtualizacaoDadosSistemaDt: string;
  RelatoValidadeId: string;
  Empresa: {
    Id: number;
    Nome: string;
  };
  Produto: {
    Ean: string;
    Nome: string;
  };
  ProdutoId: number;
  VencimentoFinalDt: string;
  VencimentoFinalQt: number;
  DataId: string;
};

export default function CheckList() {
  const [checkList, setCheckList] = useState<checkProps[]>();
  const [emptyList, setEmptyList] = useState("Carregando...");

  async function getCheckList() {
    try {
      const checkListData = JSON.stringify({
        EqualityFilter: {
          RelatoValidadeStatusId: ["0"],
        },
        Take: 20,
      });
      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: checkListData,
      };

      const list = await api("/Services/Default/RelatoValidade/List", settings);
      setCheckList(list.data.Entities);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getCheckList();

    setTimeout(() => {
      setEmptyList("Esta lista parece estar vazia =(");
    }, 10000);
  }, []);

  return (
    <View style={styles.container}>
      <Animatable.View
        animation={"fadeInLeft"}
        delay={500}
        style={styles.containerHeader}
      >
        <View style={{ paddingStart: 10 }}>
          <Text style={styles.message}>Produtos Verificados</Text>
        </View>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.listContainer}>
        <FlatList
          data={checkList}
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
          keyExtractor={(product) => String(product.RelatoValidadeId)}
          renderItem={({ index, item: product }) => (
            <CheckProductCard product={product} index={index} />
          )}
        />
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
});
