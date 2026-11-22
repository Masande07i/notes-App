
import AsyncStorage from "@react-native-async-storage/async-storage";
import bcrypt from "bcryptjs";
import * as Crypto from "expo-crypto";

export type User = {
  username: string;
  email: string;
  password: string;
};

const USERS_KEY = "users";
const USER_KEY = "user";
const LOGGED_IN_KEY = "loggedInUser";

bcrypt.setRandomFallback((length) => {
  const randomBytes = Crypto.getRandomBytes(length);
  return Array.from(randomBytes);
});

const getUsers = async (): Promise<User[]> => {
  const savedUsers = await AsyncStorage.getItem(USERS_KEY);
  const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];

  // Move an existing single-user account into the users array.
  const oldUser = await AsyncStorage.getItem(USER_KEY);

  if (oldUser) {
    const user: User = JSON.parse(oldUser);

    const alreadyExists = users.some(
      (existingUser) =>
        existingUser.email.toLowerCase() === user.email.toLowerCase()
    );

    if (!alreadyExists) {
      users.push(user);
    }

    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.removeItem(USER_KEY);
  }

  return users;
};

export const registerUser = async (user: User) => {
  const users = await getUsers();

  const email = user.email.trim().toLowerCase();

  const existingUser = users.find(
    (existingUser) => existingUser.email.toLowerCase() === email
  );

  if (existingUser) {
    throw new Error("An account with this email already exists.");
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(user.password, salt);

  const newUser: User = {
    ...user,
    email,
    password: hashedPassword,
  };

  const updatedUsers = [...users, newUser];

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );
};

export const loginUser = async (email: string, password: string) => {
  const users = await getUsers();

  const user = users.find(
    (existingUser) =>
      existingUser.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!user) {
    throw new Error("Invalid email or password.");
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);

  if (!passwordMatch) {
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
  const users = await getUsers();

  const loggedInUser = await getCurrentUser();

  if (!loggedInUser) {
    throw new Error("No logged-in user found.");
  }

  const userIndex = users.findIndex(
    (user) => user.email.toLowerCase() === loggedInUser.email.toLowerCase()
  );

  if (userIndex === -1) {
    throw new Error("User account not found.");
  }

  const user = users[userIndex];

  const passwordMatch = bcrypt.compareSync(
    currentPassword,
    user.password
  );

  if (!passwordMatch) {
    throw new Error("Your current password is incorrect.");
  }

  const updatedEmail = email.trim().toLowerCase();

  const emailAlreadyExists = users.some(
    (existingUser, index) =>
      index !== userIndex &&
      existingUser.email.toLowerCase() === updatedEmail
  );

  if (emailAlreadyExists) {
    throw new Error("This email is already being used by another account.");
  }

  const updatedUser: User = {
    username: username.trim(),
    email: updatedEmail,
    password: user.password,
  };

  if (newPassword) {
    const salt = bcrypt.genSaltSync(10);
    updatedUser.password = bcrypt.hashSync(newPassword, salt);
  }

  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;

  await AsyncStorage.setItem(
    USERS_KEY,
    JSON.stringify(updatedUsers)
  );

  await AsyncStorage.setItem(
    LOGGED_IN_KEY,
    JSON.stringify(updatedUser)
  );

  return updatedUser;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(LOGGED_IN_KEY);
};
