import { ReactNode, createContext, useEffect, useState } from "react";
import { userProps } from "../screens/Login";
import { api } from "../services/axios";
import saveUserCredentials from "../storage/user/saveUser.credentials";
import getUserCredentials from "../storage/user/getUser.credentials";
import deleteUserCredentials from "../storage/user/deleteUser.credentials";
import { companyProps } from "../screens/Settings";
import Toast from "react-native-toast-message";

type UserContextData = {
  logged: boolean;
  login: (credentials: userProps) => Promise<void>;
  logout: () => Promise<void>;
};

type ProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<UserContextData>(
  {} as UserContextData
);

function AppProvider({ children }: ProviderProps) {
  const [logged, setLogged] = useState(false);

  async function login({ username, password }: userProps) {
    const userData = {
      username: username,
      password: password,
    };
    const settings = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      data: userData,
    };

    await api("/Account/Login", settings)
      .then(async (resp) => {
        await saveUserCredentials({ username, password });
        setLogged(true);
      })
      .catch(async (err) => {
        Toast.show({
          type: "error",
          text1: "Usuário ou senha incorretos!",
          text2: "Verifique as credenciais e tente novamente",
        });
      });
  }

  async function logout() {
    try {
      await deleteUserCredentials();
      setLogged(false);
    } catch (err) {
      throw err;
    }
  }

  async function keepLogged() {
    try {
      const userData = await getUserCredentials();
      login(userData);
    } catch (err) {}
  }

  useEffect(() => {
    keepLogged();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, logged }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AppProvider };
