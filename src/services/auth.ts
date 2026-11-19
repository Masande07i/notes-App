import AsyncStorage from "@react-native-async-storage/async-storage";

export type User = {
  username: string;
  email: string;
  password: string;
};


const USER_KEY = "user";

export const registerUser = async (user: User) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};