import AsyncStorage from "@react-native-async-storage/async-storage";

const KEYS = {
  USER: "@USER",
  TOKEN: "@TOKEN",
} as const;

export type StoredUser = any & { token: string };

export const AuthService = {
  async getUser(): Promise<StoredUser | null> {
    const token = await AsyncStorage.getItem(KEYS.TOKEN);
    if (!token) return null;

    const jsonUser = await AsyncStorage.getItem(KEYS.USER);
    if (!jsonUser) {
      
      await AsyncStorage.removeItem(KEYS.TOKEN);
      return null;
    }

    try {
      const user = JSON.parse(jsonUser);
      return { ...user, token };
    } catch {
     
      await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN]);
      return null;
    }
  },

  async setUser(userData: StoredUser) {
    await AsyncStorage.setItem(KEYS.TOKEN, String(userData.token || ""));
    await AsyncStorage.setItem(KEYS.USER, JSON.stringify(userData));
  },

  async logout() {
   
    await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN]);
  },
};
