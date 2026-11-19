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

export const loginUser = async (email: string, password: string) => {
  const savedUser = await AsyncStorage.getItem(USER_KEY);

  if (!savedUser) {
    throw new Error("No registered user found.");
  }

  const user: User = JSON.parse(savedUser);

  if (user.email !== email || user.password !== password) {
    throw new Error("Invalid email or password.");
  }

  await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));

  return user;
};