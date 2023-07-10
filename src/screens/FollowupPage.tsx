import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Linking,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import * as Animatable from "react-native-animatable";

import { AntDesign } from "@expo/vector-icons";
import { checkProps } from "./CheckList";
import { useEffect, useState } from "react";
import { api } from "../services/axios";
import ProductCard from "../components/ProductCard";
import { ScrollView } from "react-native-gesture-handler";
import SendEmail from "../components/SendEmail";

export type VerifyedProduct = {
  Entity: {
    RelatoValidadeId: string;

    Codigo: number;
    EmpresaId: number;
    ProdutoId: number;
    DataId: Date;
    VencimentoInicialQt: number;
    VencimentoFinalQt: number;
    VencimentoFinalDt: Date;
    VencimentoFinalUserId: number;
    VencendoFinalUserDisplayName: string;
    EstoqueFinalQt: number;
    EstoqueInicialQt: number;
    GiroDiarioFinalQt: number;
    GiroDiarioInicialQt: number;
    PrecoCustoInicialVlr: number;
    PrecoCustoFinalVlr: number;
    AtualizacaoDadosSistemaDt: Date;
    PrecoVendaInicialVlr: number;
    PrecoVendaFinalVlr: number;
    VendaAcumuladaQt: number;
    RelatoValidadeStatusId: number;
    CustoTotalInicialVlr: number;
    CustoTotalFinalVlr: number;
    DDEInicialQt: number;
    DDEFinalQt: number;
    DDEVencimentoInicialQt: number;
    DDEVencimentoFinalQt: number;
    EmpresaNome: string;
    ProdutoNome: string;
    FornecedorId: number;
    DepartamentoId: number;
    SecaoId: number;
    CategoriaId: number;
    SubCategoriaId: number;
    FornecedorLabel: string;
    DepartamentoLabel: string;
    SecaoLabel: string;
    CategoriaLabel: string;
    SubCategoriaLabel: string;
    ResponsavelList: Array<number>;
    NotasList: Array<{
      RelatoValidadeNotaId: number;
      RelatoValidadeId: string;
      Historico: string;
      Fotos: string;
      InsertUserId: number;
      InsertDate: Date;
      InsertUserUsername: string;
      InsertUserDisplayName: string;
      InsertUserEmail: string;
    }>;
    DadosDiariosList: Array<string>;
    Empresa: {
      Id: number;
      Nome: string;
      CNPJ: string;
      FazPedidoFornecedor: boolean;
      RecebeBonus: boolean;
      Magazine: boolean;
      Construcao: boolean;
      Supermercado: boolean;
      RegiaoId: number;
      Raspadinha: boolean;
      AnalisaDDE: boolean;
      AnalisaExcesso: boolean;
      MetaRuptura: number;
      AnalisaRuptura: boolean;
      DDEMeta: number;
      Gerente: number;
      ControlaLojaProduto: boolean;
      AppTagPrinterEnabled: boolean;
      AppPriceAuditEnabled: boolean;
      AppValidadeEnabled: boolean;
      CalculaEstoqueMaximoLoja: boolean;
      IsActive: number;
      WinthorId: number;
      InsertUserId: number;
      InsertDate: Date;
      UpdateUserId: number;
      UpdateDate: Date;
    };
    Fornecedor: {
      Id: number;
      Nome: string;
      CNPJ: string;
      IsActive: number;
      WinthorId: number;
    };
    Departamento: {
      Id: number;
      Nome: string;
      ECommerceEnabled: boolean;
      ControlaValidade: boolean;
      IsActive: number;
      WinthorId: number;
      InsertUserId: number;
      InsertDate: Date;
    };
    Secao: {
      Id: number;
      Nome: string;
      Responsavel: number;
      AnalisaRuptura: boolean;
      AnalisaDDE: boolean;
      DDEMeta: number;
      MetaRuptura: number;
      AnalisaExcesso: boolean;
      Supermercado: boolean;
      Magazine: boolean;
      Construcao: boolean;
      Departamento: number;
      ECommerceEnabled: boolean;
      ControlaValidade: boolean;
      IsActive: number;
      WinthorId: number;
      InsertUserId: number;
      InsertDate: Date;
    };
    Categoria: {
      Id: number;
      Nome: string;
      Secao: number;
      ECommerceEnabled: boolean;
      ControlaValidade: boolean;
      IsActive: number;
      WinthorId: number;
      InsertUserId: number;
      InsertDate: Date;
    };
    SubCategoria: {
      Id: number;
      Nome: string;
      Secao: number;
      Categoria: number;
      Margem: number;
      ECommerceEnabled: boolean;
      ControlaValidade: boolean;
      IsActive: number;
      WinthorId: number;
      InsertUserId: number;
      InsertDate: Date;
    };
    Produto: {
      Id: number;
      Nome: string;
      Ean: number;
      Multiplo: number;
      Embalagem: string;
      Unidade: string;
      Fornecedor: number;
      Departamento: number;
      Secao: number;
      Categoria: number;
      SubCategoria: number;
      ForaLinha: boolean;
      Excluido: false;
      DataCadastro: Date;
      TipoNegociacao: string;
      AnaliseRuptura: string;
      TemSimilar: string;
      ClasseVenda: string;
      LocalEstoque: string;
      ECommerceNome: string;
      ECommerceEnabled: boolean;
      ControlaValidade: boolean;
      IsActive: number;
      ControlaEstoquePorLote: boolean;
      WinthorId: number;
    };
    GerenteEmpresa: {
      UserId: number;
      Username: string;
      DisplayName: string;
      Email: string;
      IsActive: number;
    };
    GerenteProduto: {
      UserId: number;
      Username: string;
      DisplayName: string;
      Email: string;
      IsActive: number;
      WinthorUserId: number;
    };
    Responsavel: {
      UserId: number;
      Username: string;
      DisplayName: string;
      Email: string;
      IsActive: number;
    };
    InsertUserId: number;
    InsertDate: Date;
    UpdateUserId: number;
    UpdateDate: Date;
    InsertUserUsername: string;
    InsertUserDisplayName: string;
    InsertUserEmail: string;
    UpdateUserUsername: string;
    UpdateUserDisplayName: string;
    UpdateUserEmail: string;
  };
};

export default function FollowupPage() {
  const navigation = useNavigation();

  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [ean, setEan] = useState(true);
  const [daysLeft, setDaysLeft] = useState<number>(0);

  const data = useRoute();
  const prodData = data.params as checkProps;

  const [product, setProduct] = useState<VerifyedProduct>({
    Entity: {},
  } as VerifyedProduct);

  function eanVerify() {
    if (String(prodData.Produto.Ean) == "0000000000000") {
      setEan(false);
    }
  }
  async function getVerifyInfo() {
    try {
      const Entity = {
        EntityId: prodData.RelatoValidadeId,
      };
      const settings = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        data: Entity,
      };

      const response = await api<VerifyedProduct>(
        "/services/Default/RelatoValidade/Retrieve",
        settings
      );
      setProduct(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    eanVerify();
    getVerifyInfo();
  }, []);

  return (
    <ScrollView style={{ flex: 1, height: "100%" }}>
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
          <Text style={styles.message}>{prodData.Produto.Nome}</Text>

          <View style={{ flexDirection: "row", justifyContent: "flex-start" }}>
            <Text style={[styles.info, { marginRight: 40 }]}>
              Cod.: {prodData.ProdutoId}
            </Text>
            <Text style={styles.info}>
              {ean ? `Ean.: ${prodData.Produto.Ean}` : ""}
            </Text>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}> Informações do produto</Text>

            <View
              style={{ width: "100%", height: 1, backgroundColor: "#ECA400" }}
            />

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                Loja:{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                }}
              >
                {product.Entity.EmpresaNome?.split("FV.")}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                Departamento:{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                }}
              >
                {product.Entity.Departamento?.Nome}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                Seção:{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                }}
              >
                {product.Entity.Secao?.Id} -{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                }}
              >
                {product.Entity.Secao?.Nome}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Categoria:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.Categoria?.Id} -{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.Categoria?.Nome}
              </Text>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Subcategoria:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.SubCategoria?.Id} -{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 12,
                  width: 200,
                  alignSelf: "center",
                }}
              >
                {product.Entity.SubCategoria?.Nome}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 10 }}
            >
              <View style={{ width: "50%", flexDirection: "row" }}>
                <Text
                  style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}
                >
                  Embalagem:{" "}
                </Text>
                <Text style={{ color: "#FFF", fontSize: 15 }}>
                  {product.Entity.Produto?.Embalagem}
                </Text>
              </View>

              <View style={{ width: "50%", flexDirection: "row" }}>
                <Text
                  style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}
                >
                  Unidade:{" "}
                </Text>
                <Text style={{ color: "#FFF", fontSize: 15 }}>
                  {product.Entity.Produto?.Unidade}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                Fornecedor:{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  width: "80%",
                }}
              >
                {product.Entity.Fornecedor?.Nome}
              </Text>
            </View>
            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                ID fornecedor:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.Fornecedor?.Id}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", marginTop: 10, marginBottom: 2 }}
            >
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  marginTop: 2,
                  fontWeight: "900",
                }}
              >
                CNPJ fornecedor:{"  "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15, marginTop: 2 }}>
                {product.Entity.Fornecedor?.CNPJ}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}> Informações do vencimento </Text>

            <View
              style={{ width: "100%", height: 1, backgroundColor: "#ECA400" }}
            />

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                  fontWeight: "900",
                }}
              >
                Vencimento:{" "}
              </Text>
              <Text
                style={{
                  color: "#FFF",
                  fontSize: 15,
                }}
              >
                {new Date(product.Entity.DataId).toLocaleDateString("pt-BR")}
              </Text>

              {Number(
                new Date(product.Entity.DataId)
                  .toLocaleDateString("pt-BR")
                  .split("/")[0]
              ) -
                Number(new Date().toLocaleDateString("pt-BR").split("/")[0]) >
              0 ? (
                <Text
                  style={{
                    color: "#A1A1A1",
                    fontSize: 10,
                    alignSelf: "flex-end",
                    marginLeft: 50,
                  }}
                >
                  Faltam{" "}
                  {Number(
                    new Date(product.Entity.DataId)
                      .toLocaleDateString("pt-BR")
                      .split("/")[0]
                  ) -
                    Number(
                      new Date().toLocaleDateString("pt-BR").split("/")[0]
                    )}{" "}
                  dias
                </Text>
              ) : (
                <Text
                  style={{
                    color: "#A1A1A1",
                    fontSize: 10,
                    alignSelf: "flex-end",
                    marginLeft: 50,
                  }}
                >
                  Este produto já venceu
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Quantidade:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.VencimentoFinalQt}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 10 }}
            >
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Custo de compra:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                R${product.Entity.CustoTotalFinalVlr?.toFixed(2)}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 10 }}
            >
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Valor de venda:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                R${product.Entity.PrecoCustoFinalVlr?.toFixed(2)}
              </Text>
            </View>

            <View
              style={{ flexDirection: "row", marginBottom: 5, marginTop: 10 }}
            >
              <Text style={{ color: "#FFF", fontSize: 15, fontWeight: "900" }}>
                Giro Diario:{" "}
              </Text>
              <Text style={{ color: "#FFF", fontSize: 15 }}>
                {product.Entity.GiroDiarioFinalQt?.toFixed(2)}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}> Notas </Text>

            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: "#ECA400",
                marginBottom: 10,
              }}
            />

            {product.Entity.NotasList?.length > 0 ? (
              product.Entity.NotasList.map((prod) => [
                <TouchableOpacity
                  key={product.Entity.NotasList.toLocaleString()}
                  style={[
                    styles.instructionsBox,
                    {
                      marginTop: 5,
                      width: "100%",
                    },
                  ]}
                  onPress={() => {
                    setModalVisible(true),
                      setEmail(`mailto: ${prod.InsertUserEmail}`);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#FFF",
                        marginStart: 5,
                        marginBottom: 2,
                        fontSize: 12,
                        fontWeight: "600",
                      }}
                    >
                      {prod.InsertUserDisplayName[0].toUpperCase() +
                        prod.InsertUserDisplayName.substring(1)}
                    </Text>

                    <View style={{ flexDirection: "row" }}>
                      <Text
                        style={{
                          color: "#FFF",
                          marginStart: 5,
                          marginBottom: 2,
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      >
                        {new Date(prod.InsertDate).toLocaleDateString("pt-BR")}
                      </Text>
                      <Text
                        style={{
                          color: "#FFF",
                          marginStart: 5,
                          marginBottom: 2,
                          fontSize: 11,
                          fontWeight: "600",
                        }}
                      >
                        {String(prod.InsertDate).split("T")[1].split(".")[0]}
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={{
                      color: "#FFF",
                      marginStart: 5,
                      marginBottom: 2,
                      fontSize: 15,
                      marginTop: 5,
                    }}
                  >
                    {prod.Historico}
                  </Text>
                </TouchableOpacity>,
              ])
            ) : (
              <Text
                style={{
                  color: "#FFF",
                  textAlign: "center",
                  fontSize: 20,
                  fontWeight: "900",
                  marginTop: 15,
                  marginBottom: 20,
                }}
              >
                Não há notas
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={{ flexDirection: "row", width: "100%", marginTop: 20 }}
            onPress={() => {
              setModalVisible(true);
              setEmail(
                `mailto: ${product.Entity.GerenteEmpresa?.Email}, ${product.Entity.GerenteProduto?.Email}, ${product.Entity.Responsavel?.Email}`
              );
            }}
          >
            <View
              style={{
                width: "70%",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Text style={styles.detailText}>
                Gerente da loja:{" "}
                {product.Entity.GerenteEmpresa?.DisplayName.split(" ")[0] +
                  " " +
                  product.Entity.GerenteEmpresa?.DisplayName.split(" ")[1]}
              </Text>

              <Text style={styles.detailText}>
                Gerente do produto:{" "}
                {product.Entity.GerenteProduto?.DisplayName.split(" ")[0] +
                  " " +
                  product.Entity.GerenteProduto?.DisplayName.split(" ")[1]}
              </Text>

              <Text style={styles.detailText}>
                Informado por: {product.Entity.InsertUserDisplayName}
              </Text>
            </View>

            <View style={{ justifyContent: "center" }}>
              <Text style={{ color: "#A1A1A1", opacity: 0.5, fontSize: 10 }}>
                Entrar em contato
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
          transparent
        >
          <SendEmail setModalVisible={setModalVisible} email={email} />
        </Modal>
      </View>
    </ScrollView>
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
    width: "100%",
    justifyContent: "space-between",
  },
  goBack: {
    backgroundColor: "#BF8502",
    width: 45,
    height: 45,
    marginLeft: 10,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  listContainer: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#181818",
    paddingStart: "5%",
    paddingEnd: "5%",
  },
  message: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#FFF",
    marginTop: 20,
  },
  info: {
    fontSize: 12,
    color: "#A1A1A1",
  },
  instructionsBox: {
    backgroundColor: "#ECA400",
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    width: "100%",
  },
  todotext: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "400",
    backgroundColor: "#ECA400",
  },
  detailText: {
    color: "#A1A1A1",
    fontSize: 13,
    marginBottom: 5,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 20,
    marginStart: -2,
    fontWeight: "700",
    color: "#ECA400",
  },
});
