import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import * as Animatable from "react-native-animatable";
import { checkProps } from "../screens/CheckList";

type cardProps = {
  product: checkProps;
  index: number;
};

export default function CheckProductCard({ product, index }: cardProps) {
  return (
    <Animatable.View
      style={[styles.container, { paddingStart: 0 }]}
      animation={"fadeInUp"}
      duration={1000}
      delay={index * 200}
    >
      <TouchableOpacity
        style={styles.container}
        activeOpacity={1}
        onPress={() => console.log("Nada acontece por aqui!")}
      >
        <View style={styles.containerDetail} />
        <View style={styles.containerHeader}>
          <Text style={styles.title}>{product.Produto.Nome}</Text>
          <Text style={styles.code}>Cod.: {product.ProdutoId}</Text>
        </View>
        <View style={styles.validateBox}>
          <View style={styles.validadeArea}>
            <Text style={[styles.validateText, { marginRight: 27 }]}>
              Quantidade:
            </Text>
            <Text style={styles.validateText}>{product.VencimentoFinalQt}</Text>
          </View>
          <View style={styles.validadeArea}>
            <Text style={[styles.validateText, { marginRight: 25 }]}>
              Vencimento:
            </Text>
            <Text style={styles.validateText}>
              {new Date(product.VencimentoFinalDt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 150,
    backgroundColor: "#393B41",
    borderWidth: 1,
    borderColor: "#ECA400",
    marginBottom: 20,
    borderRadius: 25,
    paddingStart: 10,
    elevation: 5,
  },
  containerDetail: {
    height: "75%",
    width: 3,
    borderRadius: 50,
    backgroundColor: "#ECA400",
    position: "absolute",
    left: 9,
    top: 20,
  },
  containerHeader: {
    paddingStart: 10,
    paddingEnd: 10,
    paddingTop: 15,
    width: "100%",
    height: 85,
    maxHeight: 85,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
  },
  title: {
    fontSize: 20,
    color: "#ECA400",
    fontWeight: "bold",
  },
  code: {
    fontSize: 12,
    color: "#A1A1A1",
  },
  validateBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingStart: 20,
    paddingBottom: 10,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  validadeArea: {
    flexDirection: "row",
    width: "65%",
    justifyContent: "flex-start",
  },
  validateText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ECA400",
  },
});
