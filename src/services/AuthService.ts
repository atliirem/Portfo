// import AsyncStorage from "@react-native-async-storage/async-storage";

// const KEYS = {
//   USER: "@USER",
//   TOKEN: "@TOKEN",
// } as const;

// export type StoredUser = any & { token: string };

// export const AuthService = {

//   async getUser(): Promise<StoredUser | null> {
//     try {
//       const token = await AsyncStorage.getItem(KEYS.TOKEN);
      
//       if (!token) {
//         console.log(" AuthService: Token bulunamadı");
//         return null;
//       }

//       const jsonUser = await AsyncStorage.getItem(KEYS.USER);
      
//       if (!jsonUser) {
//         console.warn(" AuthService: Token var ama user bilgisi yok, temizleniyor...");
//         await AsyncStorage.removeItem(KEYS.TOKEN);
//         return null;
//       }

//       const user = JSON.parse(jsonUser);
//       console.log(" AuthService: User yüklendi:", user.email);
      
//       return { ...user, token };
//     } catch (error) {
//       console.error(" AuthService.getUser error:", error);
    
//       await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN]);
//       return null;
//     }
//   },


//   async setUser(userData: StoredUser): Promise<void> {
//     try {
//       const token = String(userData.token || "");
      
//       if (!token) {
//         console.error(" AuthService.setUser: Token eksik!");
//         return;
//       }

//       await AsyncStorage.setItem(KEYS.TOKEN, token);
//       await AsyncStorage.setItem(KEYS.USER, JSON.stringify(userData));
      
//       console.log(" AuthService: User kaydedildi:", userData.email);
//     } catch (error) {
//       console.error(" AuthService.setUser error:", error);
//       throw error;
//     }
//   },


//   async logout(): Promise<void> {
//     try {
//       await AsyncStorage.multiRemove([KEYS.USER, KEYS.TOKEN]);
//       console.log(" AuthService: Storage temizlendi");
//     } catch (error) {
//       console.error("AuthService.logout error:", error);
//       throw error;
//     }
//   },


//   async debugStorage(): Promise<void> {
//     try {
//       const token = await AsyncStorage.getItem(KEYS.TOKEN);
//       const user = await AsyncStorage.getItem(KEYS.USER);
      
<<<<<<< HEAD
//       console.log(" AuthService Debug:");
//       console.log("  - Token:", token ? "✓ Var" : " Yok");
//       console.log("  - User:", user ? JSON.parse(user).email : "✗ Yok");
//     } catch (error) {
//       console.error(" AuthService.debugStorage error:", error);
//     }
//   }
// };
=======
      console.log(" AuthService Debug:");
      console.log("  - Token:", token ? " Var" : " Yok");
      console.log("  - User:", user ? JSON.parse(user).email : " Yok");
    } catch (error) {
      console.error(" AuthService.debugStorage error:", error);
    }
  }
};
>>>>>>> b8eb7fb40045d470698716348d31a76a1daa182f
