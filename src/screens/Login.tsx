import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../contexts/auth";
import { useForm, Controller } from "react-hook-form";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import * as Animatable from "react-native-animatable";
import { AntDesign } from "@expo/vector-icons";

export type userProps = {
  username: string;
  password: string;
};

const schema = yup.object({
  username: yup.string().required("Usuário obrigatório!"),
  password: yup.string().required("Senha obrigatória!"),
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const { login } = useContext(AuthContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function handleSignIn(userData: userProps) {
    setLoading(true);

    try {
      await login(userData);
    } catch (err) {
      console.log(err);
    } finally {
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
        <AntDesign name="user" size={28} color={"#FFF"} />
        <Text style={styles.message}>Login</Text>
      </Animatable.View>

      <Animatable.View animation={"fadeInUp"} style={styles.containerForm}>
        <Text style={[styles.label, { marginTop: 50 }]}>Usuário</Text>
        <Controller
          control={control}
          name="username"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              placeholder={"Digite seu usuário"}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              cursorColor={"#ECA400"}
              autoCapitalize={"none"}
              autoCorrect={false}
              style={[
                styles.input,
                {
                  borderBottomColor: errors.username && "#FF375B",
                  backgroundColor: errors.username && "#FFEBEF",
                },
              ]}
            />
          )}
        />
        {errors.username ? (
          //@ts-ignore
          <Text style={styles.loginError}>{errors.username?.message}</Text>
        ) : (
          <Text></Text>
        )}

        <Text style={styles.label}>Senha</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.password}>
              <TextInput
                placeholder={"Digite sua senha"}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                cursorColor={"#ECA400"}
                autoCapitalize={"none"}
                autoCorrect={false}
                secureTextEntry={passwordVisibility ? false : true}
                style={[
                  styles.input,
                  {
                    borderBottomColor: errors.password && "#FF375B",
                    backgroundColor: errors.password && "#FFEBEF",
                  },
                ]}
              />
              <TouchableOpacity
                style={styles.eye}
                onPress={() => setPasswordVisibility(!passwordVisibility)}
              >
                {passwordVisibility ? (
                  <AntDesign name="eye" size={20} />
                ) : (
                  <AntDesign name="eyeo" size={20} />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password ? (
          //@ts-ignore
          <Text style={styles.loginError}>{errors.password?.message}</Text>
        ) : (
          <Text></Text>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit(handleSignIn)}
          activeOpacity={0.7}
        >
          {loading ? (
            <ActivityIndicator animating={true} color={"#FFF"} />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>
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
  },
  message: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginLeft: 4,
  },
  containerForm: {
    flex: 1,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#FFF",
    paddingStart: "5%",
    paddingEnd: "5%",
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
  password: {
    flexDirection: "row",
    width: "100%",
  },
  eye: {
    marginLeft: -25,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});
