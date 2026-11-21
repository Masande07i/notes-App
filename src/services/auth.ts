
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";

export type User = {
  username: string;
  email: string;
  password: string;
};

const USER_KEY = "user";

export const registerUser = async (user: User) => {
  const hashedPassword = await bcrypt.hash(user.password, 10);

  const newUser = {
    ...user,
    password: hashedPassword,
  };

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));
};

export const loginUser = async (email: string, password: string) => {
  const savedUser = await AsyncStorage.getItem(USER_KEY);

  if (!savedUser) {
    throw new Error("No registered user found.");
  }

  const user: User = JSON.parse(savedUser);

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (user.email !== email || !passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  await AsyncStorage.setItem("loggedInUser", JSON.stringify(user));

  return user;
};

export const getCurrentUser = async () => {
  const savedUser = await AsyncStorage.getItem("loggedInUser");

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser) as User;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem("loggedInUser");
};
