
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";

export type User = {
  username: string;
  email: string;
  password: string;
};

const USER_KEY = "user";
const LOGGED_IN_KEY = "loggedInUser";

bcrypt.setRandomFallback((length) => {
  const randomBytes = Crypto.getRandomBytes(length);
  return Array.from(randomBytes);
});

export const registerUser = async (user: User) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

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

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (user.email !== email || !passwordMatch) {
    throw new Error("Invalid email or password.");
  }

  await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));

  return user;
};

export const getCurrentUser = async () => {
  const savedUser = await AsyncStorage.getItem(LOGGED_IN_KEY);

  if (!savedUser) {
    return null;
  }

  return JSON.parse(savedUser) as User;
};

export const updateUserProfile = async (
  username: string,
  email: string,
  currentPassword: string,
  newPassword?: string
) => {
  const savedUser = await AsyncStorage.getItem(USER_KEY);

  if (!savedUser) {
    throw new Error("User account not found.");
  }

  const user: User = JSON.parse(savedUser);

  const passwordMatch = bcrypt.compareSync(
    currentPassword,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Your current password is incorrect.");
  }

  const updatedUser: User = {
    username,
    email,
    password: user.password,
  };

  if (newPassword) {
    const salt = bcrypt.genSaltSync(10);
    updatedUser.password = bcrypt.hashSync(newPassword, salt);
  }

  await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  await AsyncStorage.setItem(LOGGED_IN_KEY, JSON.stringify(updatedUser));

  return updatedUser;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(LOGGED_IN_KEY);
};
