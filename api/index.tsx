import { createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../src/redux/store';

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService } from '../src/services/AuthService';

export const api = axios.create({
  baseURL: "https://portfoy.demo.pigasoft.com/api",
  headers: {Accept: "application/json"}

});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("@TOKEN");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type SignUpArgs = {
  email: string;
  password: string;
  name: string;
  invitation_code: string;
};

export const signUpThunk = createAsyncThunk<
  any, 
  SignUpArgs,
  { rejectValue: string }
>("auth/register", async ({ email, password, name, invitation_code }, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/register", {
      email,
      password,
      name,
      invitation_code,
    });

    const { token, user } = res.data.data;
    const userData = { ...user, token };

    await AsyncStorage.setItem("@TOKEN", String(token || ""));
    await AsyncStorage.setItem("@USER", JSON.stringify(userData));

    return userData;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors?.email?.[0] ||
      err?.message ||
      "Kayıt başarısız";
    return rejectWithValue(msg);
  }
});

type LoginArgs={ email: string; password: string };


export const loginThunk = createAsyncThunk<
  any, 
  LoginArgs,
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await api.post("/auth/login", {
      email,
      password,
      locale: "tr",
    });

    if (res.data?.status === "error") {
      return rejectWithValue(res.data?.message || "Giriş başarısız");
    }

    const token = res.data?.data?.token;
    const user = res.data?.data?.user || res.data?.data;

    if (!token) return rejectWithValue("Sunucudan token alınamadı");

    const userData = { ...user, token };

    await AsyncStorage.setItem("@TOKEN", String(token));
    await AsyncStorage.setItem("@USER", JSON.stringify(userData));

    return userData;
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || "Giriş başarısız";
    return rejectWithValue(msg);
  }
});

// export const loginThunk = createAsyncThunk(
//   "auth/login",
//   async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       const res = await api.post("/auth/login", { email, password, locale: "tr" });
//       const { token, user } = res.data.data;
//       const userData = { ...user, token };

//       await AuthService.setUser(userData); 

//       return userData;
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Giriş başarısız");
//     }
//   }
// );

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/auth/logout");
      await AuthService.logout(); 
      return true;
    } catch (err: any) {
      await AuthService.logout();
      return rejectWithValue(err?.response?.data?.message || "Çıkış yapılamadı");
    }
  }
);

interface ChangePasswordParams {
  current: string;
  password: string;
  password_confirm: string;
}

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (params: ChangePasswordParams, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/password/update", {
        current: params.current,
        password: params.password,
        password_confirm: params.password_confirm,
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Şifre değiştirilemedi");
      }

      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Şifre değiştirilemedi";
      return rejectWithValue(message);
    }
  }
);
interface VerifyPasswordCodeParams {
  code: string;
  email: string;
  locale: "tr";
}

export const verifyPasswordCodeThunk = createAsyncThunk(
  "auth/verifyPasswordCode",
  async (params: VerifyPasswordCodeParams, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/password/update/verify", {
        code: params.code,
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Doğrulama başarısız");
      }

      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Doğrulama başarısız";
      return rejectWithValue(message);
    }
  }
);

export const getCustomerProposals = createAsyncThunk(
  "auth/getCustomerProposals",
  async (params: { customer_id: string }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("customer_id", params.customer_id);

      const res = await api.post("/auth/company/proposals", formData);

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "İşlem başarısız");
      }
      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "İşlem başarısız";
      return rejectWithValue(message);
    }
  }
);

// export const logoutThunk = createAsyncThunk(
//   "auth/logout",
//   async (_, { rejectWithValue }) => {
//     try {
//       await api.post("/auth/logout");
//       await AsyncStorage.multiRemove(["token", "user", "refreshToken"]);
//       return true;
//     } catch (err: any) {

//       await AsyncStorage.multiRemove(["token", "user", "refreshToken"]);
//       const message = err.response?.data?.message || "Çıkış yapılamadı";
//       return rejectWithValue(message);
//     }
//   }
// );



//  export const getProperties = createAsyncThunk('properties/getProperties', async (id: number) => {
//    const res = await api.get(`/properties/${id}/details`);
//   return res.data.user;
// });
export const getProperties = createAsyncThunk(
  "properties/getProperties",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/${id}/details`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Bilgi alınamadı");
      }
      return res.data.data; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Bilgi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getAllProperties = createAsyncThunk(
  "properties/getAllProperties",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Bilgi alınamadı");
      }

      return res.data.data; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Bilgi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

// export const getPropertyFeatures = createAsyncThunk(
//   "features/getPropertyFeatures",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/properties/${id}/details`);
//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "Bilgi alınamadı");
//       }

//       return res.data.data.features;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Bilgi alınamadı";
//       return rejectWithValue(msg);
//     }
//   }
// );


export const getPropertyFeatures = createAsyncThunk(
  "features/getPropertyFeatures",
  async (
    params: { propertyId?: number; propertyTypeId?: number },
    { rejectWithValue }
  ) => {
    try {
      let propertyId = params.propertyId;
      const isCreateMode = !propertyId && params.propertyTypeId;


      if (isCreateMode) {
        console.log('Create mode - Template property kullanılıyor, typeId:', params.propertyTypeId);
        

        const templateId = TEMPLATE_PROPERTY_IDS[params.propertyTypeId!];
        
        if (!templateId) {
          throw new Error(`${params.propertyTypeId} tipi için şablon bulunamadı`);
        }
        
        propertyId = templateId;
      } else {
        console.log('Edit mode -Property details çekiliyor, propertyId:', propertyId);
      }

      const res = await api.get(`/properties/${propertyId}/details`);
      
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Bilgi alınamadı");
      }

      let features = res.data.data.features;

     
      if (isCreateMode) {
        console.log(' Template values temizleniyor...');
        features = clearFeatureValues(features);
      }

      return features;
    } catch (err: any) {
      console.error(' Features alınamadı:', {
        error: err?.response?.data || err.message
      });
      
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Bilgi alınamadı";
      return rejectWithValue(msg);
    }
  }
);
function clearFeatureValues(groups: any[]): any[] {
  return groups.map(group => ({
    ...group,
    features: group.features.map((feature: any) => {
      const isMultiple = feature.details?.multiple === true || 
                        feature.details?.multiple === "true";
      
      let clearedValue;
      
      if (feature.input_type === "checkbox") {
        clearedValue = false;
      } else if (feature.input_type === "select") {
   
        clearedValue = isMultiple ? [] : null;
        
      
        if (feature.options) {
          feature.options = feature.options.map((opt: any) => ({
            ...opt,
            selected: false
          }));
        }
      } else if (feature.input_type === "number") {
        clearedValue = "";
      } else if (feature.input_type === "file") {
        clearedValue = isMultiple ? [] : null;
      } else {
        clearedValue = "";
      }
      return {
        ...feature,
        value: clearedValue
      };
    })
  }));
}


 export const getNotifications = createAsyncThunk('/notifications/getNotifications', async (id: number) => {
   const res = await api.get(`/auth/notifications`);
  return res.data.data;
});

//  export const getTypes = createAsyncThunk('/types/getTypes', async () => {
//    const res = await api.get(`/properties/types`);
//   return res.data.data;


  
// });


export const getTypes = createAsyncThunk(
  '/types/getTypes ',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(`/properties/types`);
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Type alınamadı';
      return rejectWithValue(msg);
    }
  }
);


// export const getCurrencies = createAsyncThunk(
//   "currencies/getCurrencies",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await axios.get(`/front/currencies`); 
//       return res.data.data; 
//     } catch (err: any) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

export const getCurrencies = createAsyncThunk(
  "currencies/getCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/currencies`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Para birimleri alınamadı");
      }
      return res.data.data; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Para birimleri alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getTeam = createAsyncThunk(
  "/team/getTeam",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/auth/company/team`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Ekip bilgisi alınamadı");
      }
      return res.data.data.personals; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Ekip bilgisi alınamadı";
      return rejectWithValue(msg);
    }
  }
);


export const getMyProperties = createAsyncThunk(
  'myProperties/getmyProperties',
  async (page: number = 1, { rejectWithValue }) => {
    try {
      console.log('API ÇAĞRILIYOR: /auth/properties, Sayfa:', page);
      
      const res = await api.post('/auth/properties', {
        page: page,
      });
      
      console.log('API RESPONSE:', res.data);
      
      const pagination = res.data.pagination;
      
      return {
        data: res.data.data,
        pagination: {
          currentPage: pagination?.current_page || page,
          lastPage: Math.ceil((pagination?.total || 0) / (pagination?.per_page || 10)),
          total: pagination?.total || 0,
          perPage: pagination?.per_page || 10,
          paginationText: pagination?.pagination_text || "",
        }
      };
    } catch (err: any) {
      console.error('API HATASI:', err);
      const msg = err?.response?.data?.message || err?.message || 'İlanlar alınamadı';
      return rejectWithValue(msg);
    }
  }
);
// export const myAlerts = createAsyncThunk(
//   'alerts/getMyAlerts',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get('/auth/notifications');
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.errors?.body?.[0] ||
//         err?.message ||
//         'Bildirim alınamadı';
//       return rejectWithValue(msg);
//     }
//   }
//);

// export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (
//     {
//       name,
//       email,
     
//     }: {
//       name: string;
//       email: string;
    
//     },
//     { rejectWithValue }
//   ) => {
//     try {
      
//       const res = await api.post("/auth/profile/update?locale=tr", {
//         name,
//         email,
       
//       });
      
//       console.log("updateProfile yanıtı:", res.data);

//       if (res.data.status === "success") {
//         return res.data.data; 
//       } else {
//         throw new Error(res.data.message || "Profil güncellenemedi");
//       }
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Profil güncellenemedi";
//       return rejectWithValue(msg);
//     }
//   }
// );

export const getCountries = createAsyncThunk(
  "countries/getCountries",
  async (_, { rejectWithValue }) => {
    console.log("COUNTRIES THUNK ÇALIŞTI");  
    try {
      const res = await api.get("/front/countries");
      console.log("COUNTRY API RESPONSE:", res.data); 
      return res.data.data;
    } catch (err) {
      console.log("COUNTRY ERROR:", err); 
      return rejectWithValue("Ülke kodları yüklenemedi");
    }
  }
);

type UpdateProfileArgs = {
  name: string;
  phone_code: string;
  phone: string;
  locale?: string;
};

type ThunkConfig = {
  state: RootState;
  rejectValue: string;
};

export const updateProfile = createAsyncThunk<any, UpdateProfileArgs, ThunkConfig>(
  "auth/updateProfile",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("phone_code", payload.phone_code);
      formData.append("phone", payload.phone);
      formData.append("locale", payload.locale ?? "tr");

      const res = await api.post("/auth/profile/update", formData);

      if (res.data?.status !== "success") {
        return rejectWithValue(res.data?.message || "Profil güncellenemedi");
      }

      const stateUser = getState().auth.user;

      const mergedUser = {
        ...stateUser,
        name: payload.name,
        phone: {
          code: payload.phone_code,
          number: payload.phone,
        },
         avatar: stateUser?.avatar?.includes("ui-avatars.com")
    ? stateUser.avatar.replace(/name=[^&]+/, `name=${encodeURIComponent(payload.name)}`)
    : stateUser?.avatar,
      };

      await AsyncStorage.setItem("@USER", JSON.stringify(mergedUser));

      return mergedUser;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Profil güncellenemedi"
      );
    }
  }
);


type UpdatePropertyLocationArgs = {
  propertyId: number;
  latitude: number;
  longitude: number;
};

export const updatePropertyLocation = createAsyncThunk(
  "properties/updateLocation",
  async (
    { propertyId, latitude, longitude }: UpdatePropertyLocationArgs,
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("latitude", latitude.toString());
      formData.append("longitude", longitude.toString());

      const res = await api.post(`/properties/${propertyId}/map/update`, formData);

      if (res.data?.status !== "success") {
        return rejectWithValue(res.data?.message || "Konum güncellenemedi");
      }

      return { propertyId, latitude, longitude };
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Konum güncellenemedi"
      );
    }
  }
);
// export const updateProfile = createAsyncThunk(
//   "auth/updateProfile",
//   async (
//     {
//       name,
//       phone_code,
//       phone,
//       locale = "tr",
//     }: {
//       name: string;
//       phone_code: string;
//       phone: string;
//       locale?: string;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const formData = new FormData();

//       formData.append("name", name);
//       formData.append("phone_code", phone_code);
//       formData.append("phone", phone);
//       formData.append("locale", locale);

//       const res = await api.post(
//         "/auth/profile/update",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "Profil güncellenemedi");
//       }

//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Profil güncellenemedi"
//       );
//     }
//   }
// );



// export const getProposals = createAsyncThunk(
//   "proposals/getProposals",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.("/auth/proposals");
      
//       if (res.data.status === "success") {
//         return res.data.data;
//       }
//       throw new Error(res.data.message);
//     } catch (err: any) {
//       return rejectWithValue(err?.response?.data?.message || "Teklifler alınamadı");
//     }
//   }
// );

export const getProposals = createAsyncThunk(
  "proposals/getProposals",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/proposals");
      if (res.data.status !== "success") throw new Error(" alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue("  yüklenemedi");
    }
  }
);

export const getSummary = createAsyncThunk(
  "summary/getSummary",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/auth/company/summary");
      if (res.data.status !== "success") throw new Error(" alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue("  yüklenemedi");
    }
  }
);

export const getOffersDetail = createAsyncThunk(
  "offersDetail/getOffersDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/offers/${id}/show`);
      if (res.data.status !== "success") throw new Error(" alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue("  yüklenemedi");
    }
  }
);

export const replyToOffer = createAsyncThunk(
  "offers/replyToOffer",
  async ({ id, type }: { id: number; type: "confirm" | "reject" }, { rejectWithValue }) => {
    try {
      const res = await api.post(`/offers/${id}/reply`, { type });
      return res.data;
    } catch {
      return rejectWithValue("Teklif yanıtlanamadı");
    }
  }
);

export const getCompanyTeam = createAsyncThunk(
  "companyTeam/getCompanyTeam",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/companies/${id}/team`);
    

      if (res.data.status !== "success") throw new Error(" alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(" yüklenemedi");
    }
  }
);

export const getCompany = createAsyncThunk(
  'company/getCompany',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/auth/company/profile` );
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Şirket Bilgileri alınamadı';
      return rejectWithValue(msg);
    }
  }
);

export const getSentOffers = createAsyncThunk(
  "offers/getSentOffers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/offers", {
        type: "sent",
      });
      return res.data.data;
    } catch {
      return rejectWithValue("Gönderilen teklifler alınamadı");
    }
  }
);

export const getReceivedOffers = createAsyncThunk(
  "offers/getReceivedOffers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/auth/offers", {
        type: "received",
      });
      return res.data.data;
    } catch {
      return rejectWithValue("Alınan teklifler alınamadı");
    }
  }
);

export const getCloneProperty = createAsyncThunk(
  'cloneProperty/getCloneProperty',
  async ({ id, title }: { id: number; title: string }, { rejectWithValue }) => {
    try {
      console.log(" Clone API çağrılıyor, ID:", id, "Title:", title);
      
      const res = await api.post(`/properties/${id}/clone`, { 
        title,
        clone_images: true 
      });
      
      console.log("Clone API response:", res.data);
      
      if (res.data.status === "success") {
        return res.data.data?.property || res.data.data || { id, success: true };
      }
      
      if (res.data.status === "error") {
        return rejectWithValue(res.data.message);
      }
      
      return res.data;
    } catch (err: any) {
      console.error(" Clone API hatası:", err?.response?.data || err);
      const msg = err?.response?.data?.message || err?.message || 'İlan kopyalanamadı';
      return rejectWithValue(msg);
    }
  }
);


export const getUpdateSold = createAsyncThunk(
  'updateSold/getUpdateSold',
  async ({ id, hold }: { id: number; hold: boolean }, { rejectWithValue }) => {
    try {
      console.log(" Sold API çağrılıyor, ID:", id, "Hold:", hold);
      
      const res = await api.post(`/properties/${id}/sold/update`, { 
        action: "sold",
        hold: hold 
      });
      
      console.log("Sold API response:", res.data);
      
      if (res.data.status === "success") {
        return { id, hold, success: true };
      }
      
      if (res.data.status === "error") {
        return rejectWithValue(res.data.message);
      }
      
      return res.data;
    } catch (err: any) {
      console.error(" Sold API hatası:", err?.response?.data || err);
      const msg = err?.response?.data?.message || err?.message || 'İşlem başarısız';
      return rejectWithValue(msg);
    }
  }
);


export const getDeleteProperty = createAsyncThunk(
  'deleteProperty/getDeleteProperty',
  async (id: number, { rejectWithValue }) => {
    try {
      console.log(" Delete API çağrılıyor, ID:", id);
      
      const res = await api.post(`/properties/${id}/delete`);
      
      console.log(" Delete API response:", res.data);
      
      if (res.data.status === "success") {
        return { id, success: true };
      }
      
      if (res.data.status === "error") {
        return rejectWithValue(res.data.message);
      }
      
      return res.data;
    } catch (err: any) {
      console.error(" Delete API hatası:", err?.response?.data || err);
      const msg = err?.response?.data?.message || err?.message || 'İlan silinemedi';
      return rejectWithValue(msg);
    }
  }
);
export const getDiscountedProperties = createAsyncThunk(
  'discount/getDiscountedProperties',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/properties/discounted');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'İndirimli ilanlar alınamadı';
      return rejectWithValue(msg);
    }
  }
);
export const getRecentlyProperties = createAsyncThunk(
  'recently/getRecentlyProperties',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/properties/recently');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Yeni ilanlar alınamadı';
      return rejectWithValue(msg);
    }
  }
);
export const getNews = createAsyncThunk(
  'news/getNews',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/front/articles');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Article alınamadı';
      return rejectWithValue(msg);
    }
  }
);
// export const getFilteredProperties = createAsyncThunk(
//   'properties/getFilteredProperties',
//   async (
//     {
//       city_id,
//       featured,
//       discounted,
//       page = 1,
//     }: {
//       city_id?: string | number;
//       featured?: string | number;
//       discounted?: string | number;
//       page?: number;
//     },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await api.post('/properties/filter', {
//         city_id,
//         featured,
//         discounted,
//         page,
//       });

//       if (res.data.status !== 'success') {
//         throw new Error(res.data.message || 'Filtreli ilanlar alınamadı');
//       }

//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         'Filtreli ilanlar alınamadı';
//       return rejectWithValue(msg);
//     }
//   }
// );

export const getContact = createAsyncThunk(
  "contact/getContact",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/contacts/info");
      if (res.data.status !== "success") throw new Error(" İletişim bilgileri alınamadı");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(" İletişim bilgileri yüklenemedi");
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (propertyId: number, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/wishlist/property/toggle`, {
        property_id: propertyId,
      });

      if (res.data.status !== 'success') {
        throw new Error(res.data.message || 'Favori işlemi başarısız');
      }

      return res.data.data; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Favori işlemi başarısız';
      return rejectWithValue(msg);
    }
  }
);

export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, { rejectWithValue }) => {
    try {
     
      const res = await api.post("/auth/wishlist");
      console.log("WISHLIST RESPONSE:", res.data); 

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Favori listesi alınamadı");
      }

      return res.data.data; 
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Favori listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getCustomers = createAsyncThunk(
  'customer/getCustomer',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/company/customers` );
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Teklif görüntülenemedi';
      return rejectWithValue(msg);
    }
  }
 );
 export const deleteCustomer = createAsyncThunk(
  'delete/deleteCustomer',
  async ( id , { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/company/customers/${id}/delete` );
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Teklif görüntülenemedi';
      return rejectWithValue(msg);
    }
  }
 );

//  export const getAllCompanies = createAsyncThunk(
//   'companies/getAllCompanies',
//   async ( id , { rejectWithValue }) => {
//     try {
//       const res = await api.post(`/companies/` );
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.errors?.body?.[0] ||
//         err?.message ||
//         'Teklif görüntülenemedi';
//       return rejectWithValue(msg);
//     }
//   }
//  );

//  export const getCompanyProperties = createAsyncThunk(
//   "companies/getCompanyProperties",
//   async (id: number, { rejectWithValue }) => {
//     try {
//       const res = await api.post(`/companies/${id}/properties`);
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue("Firma portföyü alınamadı");
//     }
//   }
// );

export const getAllCompanies = createAsyncThunk(
  "company/getAllCompanies",
  async (_, { rejectWithValue }) => {
    try {
     
      const res = await api.post("/companies");
      console.log("API Response:", res.data);
      return res.data.data;
    } catch (err: any) {
      console.log("Error:", err?.response?.data);
      return rejectWithValue("Şirket listesi alınamadı");
    }
  }
);

export const getCompanyProperties = createAsyncThunk(
  "company/getCompanyProperties",
  async (
    { companyId, page = 1 }: { companyId: number; page?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/companies/${companyId}/properties`, { page });

      const pagination = res.data.pagination;
      const companyData = res.data.data;
      const properties = companyData?.properties || [];

      
      console.log("=== API Response ===");
      console.log("companyData:", companyData);
      console.log("locations:", companyData?.locations);

      return {
        data: properties,
        companyInfo: {
          id: companyData?.id,
          name: companyData?.name,
          logo: companyData?.logo,
          type: companyData?.type,
          code: companyData?.code,
          score: companyData?.score,
          created_at: companyData?.created_at,
          properties: properties,
          locations: companyData?.locations, 
        },
        pagination: {
          currentPage: pagination?.current_page || page,
          lastPage: Math.ceil(
            (pagination?.total || 0) / (pagination?.per_page || 10)
          ),
          total: pagination?.total || 0,
          perPage: pagination?.per_page || 10,
          paginationText: pagination?.pagination_text || "",
        },
      };
    } catch {
      return rejectWithValue("Firma portföyü alınamadı");
    }
  }
);

export const getCompanyLocations = createAsyncThunk(
  "company/getCompanyLocations",
  async (companyId: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/companies/${companyId}/locations`);
      console.log("=== Locations API ===", res.data);
      return res.data.data;
    } catch {
      return rejectWithValue("Firma konum bilgisi alınamadı");
    }
  }
);



export const getCompanyTeamById = createAsyncThunk(
  "company/getCompanyTeamById",
  async (companyId: number, { rejectWithValue }) => {
    try {

      const res = await api.get(`/companies/${companyId}/team`);
      
      console.log("API Response:", res.data);
      return res.data.data;
    } catch (err: any) {
      console.log("Error:", err?.response?.data);
      return rejectWithValue("Firma ekibi alınamadı");
    }
  }
);
// export const getAllCompanies = createAsyncThunk(
//   "company/getAllCompanies",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get("/companies");
//       return res.data.data;
//     } catch {
//       return rejectWithValue("Şirket listesi alınamadı");
//     }
//   }
// );



// ilan oluşturma apisi: 


type CreateOfferPayload = {
  property_id: number;
  price: number;
  notes?: string;
};

export const getCreatePriceOffer = createAsyncThunk(
  "offers/createPriceOffer",
  async (
    { property_id, price, notes }: CreateOfferPayload,
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("property_id", String(property_id));
      formData.append("price", String(price));

      if (notes) {
        formData.append("notes", notes);
      }

      const res = await api.post(
        "/offers/create",
        formData,
        {
          headers: {
      
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Teklif oluşturulamadı");
      }

      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        "Teklif oluşturulamadı";

      return rejectWithValue(msg);
    }
  }
);


export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (
    { id, body }: { id: number; body: any },
    { rejectWithValue }
  ) => {
    try {
      // FormData formatında gönder (EditPersonalModal gibi)
      const formData = new FormData();
      
      if (body.name) formData.append("name", body.name);
      if (body.email) formData.append("email", body.email);
      
      // Telefon - obje formatında geliyorsa
      if (body.phone) {
        if (typeof body.phone === "object") {
          formData.append("phone", body.phone.number);
          formData.append("phone_code", body.phone.code);
        } else {
          formData.append("phone", body.phone);
        }
      }

      formData.append("locale", body.locale || "tr");

      const res = await api.post(
        `/auth/company/customers/${id}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", res.data);

      if (res.data.status === "success") {
        return { id, data: res.data.data };
      }

      return rejectWithValue(res.data.message || "Müşteri güncellenemedi");
    } catch (err: any) {
      console.error("updateCustomer error:", err.response?.data || err);
      
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        "Müşteri güncellenemedi";
      return rejectWithValue(msg);
    }
  }
);
export const getAllSubsrictions = createAsyncThunk(
  'allSubsrictions/getAllSubsrictions',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/company/subscriptions');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Article alınamadı';
      return rejectWithValue(msg);
    }
  }
);

export const getAllPackage = createAsyncThunk(
  'package/getPackage',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/company/subscriptions/packages');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Article alınamadı';
      return rejectWithValue(msg);
    }
  }
);

export const getActiveSubscriptionUsage = createAsyncThunk(
  'usage/getUsage',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/auth/company/subscriptions/active/usage');
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        'Article alınamadı';
      return rejectWithValue(msg);
    }
  }
);


// export const getStatusPublish = createAsyncThunk(
//   'pusblish/getPublish',
//   async (id, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/properties/${id}/status/update`);
//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.errors?.body?.[0] ||
//         err?.message ||
//         'Article alınamadı';
//       return rejectWithValue(msg);
//     }
//   }
// );

// // Property Status Güncelle

export const updatePropertyStatus = createAsyncThunk(
  "properties/updateStatus",
  async (
    { id, status }: { id: number; status: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(`/properties/${id}/status/update`, {
        status: status,
      });

      if (res.data.status === "success") {
        return { id, status };
      }

      return rejectWithValue(res.data.message || "Status güncellenemedi");
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || "Status güncellenemedi"
      );
    }
  }
);



// export const updateProfile = createAsyncThunk(
//   'auth/updateProfile',
//   async (_, { rejectWithValue }) => {
//     try {
      
//       const response = await api.post('/auth/profile/update?locale=tr', {});
//        console.log(' Güncelleme response:', response.data);
//       return response.data.data; 
     

//     } catch (error: any) {
//       console.log(' Profil güncelleme hatası:', error.response?.data || error);
//       return rejectWithValue(
//         error.response?.data?.message || 'Profil güncellenemedi.'
//       );
//     }
    
//   }
// );

// export const updateProfile = createAsyncThunk(
//   'update/updateProfile',
//   async (
//     { name, email,  }: { name: string; email: string;  },
//     { rejectWithValue }
//   ) => {
//     try {
      
//       const res = await api.post('/auth/profile/update?locale=tr', {
//         name,
//         email,
//         // phone: {
//         //   code: '+90', 
//         //   number: phone,
//         // },
//       });

//       return res.data.data;
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.errors?.body?.[0] ||
//         err?.message ||
//         'Profil güncellenemedi';
//       return rejectWithValue(msg);
//     }
//   }
// );

// export const getCountries = createAsyncThunk(
//   "countries/getCountries",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get(`/front/countries`);
//       if (res.data.status !== "success") throw new Error("Ülke kodları alınamadı");
//       return res.data.data;
//     } catch (err: any) {
//       return rejectWithValue("Ülke kodları yüklenemedi");
//     }
//   }
// );


export const getCities = createAsyncThunk(
  "cities/getCities",
  async (countryId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${countryId}/cities`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Şehirler alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Şehir listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

export const getDistrict = createAsyncThunk(
  "district/getDistrict",
  async (cityID: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${cityID}/districts`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "İlçeler alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "İlçe listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);


export const getStreet = createAsyncThunk(
  "street/getStreet",
  async (districtID: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/front/${districtID}/streets`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Mahalleler alınamadı");
      }
      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Mahalle listesi alınamadı";
      return rejectWithValue(msg);
    }
  }
);


// export const getFilteredProperties = createAsyncThunk(
//   "filteredProperties/getFilteredProperties",
//   async (page: number = 1, { getState, rejectWithValue }) => {
//     try {
//       const state = getState() as RootState;

//       const { selectedTypes } = state.types;
//       const { selectedCountry } = state.country;
//       const { selectedCity } = state.cities;
//       const { selectedDistrict } = state.district;
//       const { selectedStreet } = state.streets;
//       const { minPrice, maxPrice } = state.price;
//       const { query } = state.search;

//       const params: Record<string, any> = { page };

//       if (query && query.trim()) {
//         params.search = query.trim();
//       }
//       if (selectedTypes && selectedTypes.length > 0) {
//         params.types = selectedTypes.join(",");
//       }
//       if (selectedCountry) params.country_id = selectedCountry;
//       if (selectedCity) params.city_id = selectedCity;
//       if (selectedDistrict) params.district_id = selectedDistrict;
//       if (selectedStreet) params.street_id = selectedStreet;
//       if (minPrice) params.min_price = minPrice;
//       if (maxPrice) params.max_price = maxPrice;

//       console.log("API params:", params);

//       const res = await api.get("/properties", { params });

//       console.log("API Response:", res.data);

//       if (res.data.status !== "success") {
//         throw new Error(res.data.message || "İlanlar alınamadı");
//       }

//       return {
//         data: res.data.data || [],
//         pagination: {
//           currentPage: res.data.current_page || res.data.meta?.current_page || 1,
//           lastPage: res.data.last_page || res.data.meta?.last_page || 1,
//           total: res.data.total || res.data.meta?.total || 0,
//           perPage: res.data.per_page || res.data.meta?.per_page || 10,
//         },
//       };
//     } catch (err: any) {
//       console.log("API Error:", err.response?.data || err.message);
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "İlanlar yüklenemedi";
//       return rejectWithValue(msg);
//     }
//   }

// );


export const getFilteredProperties = createAsyncThunk(
  "filteredProperties/getFilteredProperties",
  async (page: number = 1, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;

      const { selectedTypes } = state.types;
      const { selectedCountry } = state.country;
      const { selectedCity } = state.cities;
      const { selectedDistrict } = state.district;
      const { selectedStreet } = state.streets;
      const { minPrice, maxPrice } = state.price;
      const { selectedCurrencyId } = state.currencies;  
      const { query } = state.search;

      const formData = new FormData();
      formData.append("page", page.toString());

      if (query && query.trim()) {
        formData.append("q", query.trim());
      }

      if (selectedTypes && selectedTypes.length > 0) {
        formData.append("type_id", selectedTypes.join(","));
      }

      if (selectedCountry) formData.append("country_id", selectedCountry);
      if (selectedCity) formData.append("city_id", selectedCity);
      if (selectedDistrict) formData.append("district_id", selectedDistrict);
      if (selectedStreet) formData.append("street_id", selectedStreet);

  
      if (minPrice) formData.append("min_sell_price", minPrice);
      if (maxPrice) formData.append("max_sell_price", maxPrice);
      if (selectedCurrencyId) formData.append("currency_id", String(selectedCurrencyId)); 

     
      console.log("Fiyat filtreleri:", { minPrice, maxPrice, selectedCurrencyId });

      const res = await api.post("/properties", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "İlanlar alınamadı");
      }

      const paginationData = res.data.pagination || {};

      const pagination = {
        currentPage: paginationData.current_page || page,
        lastPage: paginationData.last_page || 1,
        total: paginationData.total || 0,
        perPage: paginationData.per_page || 10,
      };

      if (pagination.lastPage === 1 && pagination.total > pagination.perPage) {
        pagination.lastPage = Math.ceil(pagination.total / pagination.perPage);
      }

      return {
        data: res.data.data || [],
        pagination,
      };
    } catch (err: any) {
      console.log("{{url}}/auth/company/summary API Error:", err.response?.data || err.message);
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "İlanlar yüklenemedi"
      );
    }
  }
);
export const createProposal = createAsyncThunk(
  "proposals/createProposal",
  async (
    data: {
      customer_id: number;
      currency_id: string;
      properties: { id: number; price: number; title?: string }[];
      notes?: string;
      notify?: 0 | 1;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();

      formData.append("customer_id", String(data.customer_id));
      formData.append("currency_id", data.currency_id);
      formData.append("notify", String(data.notify ?? 0));

      if (data.notes) {
        formData.append("notes", data.notes);
      }

      // Her ilan kendi ID'si ile ayrı key olarak ekleniyor
      // properties[72][price] = 123
      // properties[73][price] = 456
      for (let i = 0; i < data.properties.length; i++) {
        const prop = data.properties[i];
        formData.append(`properties[${prop.id}][price]`, String(prop.price));
        if (prop.title) {
          formData.append(`properties[${prop.id}][title]`, prop.title);
        }
      }

      console.log("Gönderilen properties:");
      data.properties.forEach(p => {
        console.log(`- ID: ${p.id}, Price: ${p.price}`);
      });

      const res = await api.post("/proposals/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Teklif oluşturulamadı");
      }

      return res.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Teklif gönderilemedi";
      return rejectWithValue(msg);
    }
  }
);

export type CompanyUpdateArgs = {
  company_name: string;
  tax_number: string;
  licence_number: string;
  email: string;
  phone: string;
  phone_code: string;

  billing_trade_name: string;
  billing_tax_office: string;
  billing_company_address: string;

  tax_plate?: string; 
  licence_file_uri?: string; 
};

export const updateCompanyProfileThunk = createAsyncThunk<
  any,
  CompanyUpdateArgs,
  { state: RootState; rejectValue: string }
>("company/updateCompanyProfile", async (p, { rejectWithValue }) => {
  try {
    const fd = new FormData();

    fd.append("company_name", p.company_name);
    fd.append("tax_number", p.tax_number);
    fd.append("licence_number", p.licence_number);
    fd.append("email", p.email);
    fd.append("phone", p.phone);
    fd.append("phone_code", p.phone_code);

 
    fd.append("billing.trade_name", p.billing_trade_name);
    fd.append("billing.tax_office", p.billing_tax_office);
    fd.append("billing.company.address", p.billing_company_address);


    if (p.tax_plate) fd.append("tax_plate", p.tax_plate);


    if (p.licence_file_uri) {
      fd.append("licence_file", {
        uri: p.licence_file_uri,
        name: "licence_file.pdf",
        type: "application/pdf",
      } as any);
    }


    const res = await api.post("/auth/company/profile/update", fd);

    if (res.data?.status !== "success") {
      return rejectWithValue(res.data?.message || "Firma güncellenemedi");
    }

    return res.data.data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Firma güncellenemedi"
    );
  }
});


export type SelectedFile = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

type UploadLogoArgs = {
  logo: SelectedFile;
};

export const uploadCompanyLogoThunk = createAsyncThunk<
  { path: string },
  UploadLogoArgs,
  { state: RootState; rejectValue: string }
>("company/uploadLogo", async ({ logo }, { rejectWithValue }) => {
  try {
    const formData = new FormData();

    formData.append("logo", {
      uri: logo.uri,
      name: logo.name || "logo.jpg",
      type: logo.type || "image/jpeg",
    } as any);

    const res = await api.post("/auth/company/profile/logo/update", formData);

    if (res.data?.status !== "success") {
      return rejectWithValue(res.data?.message || "Logo yüklenemedi");
    }

    return { path: res.data?.data?.path };
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Logo yüklenemedi"
    );
  }
});

export const uploadCoverImage = createAsyncThunk(
  "gallery/uploadCoverImage",
  async (
    { propertyId, asset }: { propertyId: number; asset: any },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      formData.append("cover", {
        uri: asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || `cover_${Date.now()}.jpg`,
      });

      const response = await api.post(
        `/properties/${propertyId}/galleries/cover/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Kapak fotoğrafı yüklenemedi"
      );
    }
  }
);

export const getProposalDetail = createAsyncThunk(
  "proposals/getProposalDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/proposals/${id}/show`);

      if (res.data.status !== "success") {
        return rejectWithValue(res.data.message || "Teklif detayı alınamadı");
      }

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || err?.message || "Teklif detayı alınamadı"
      );
    }
  }
);

interface ContactFormParams {
  name: string;
  email: string;
  phone: string;
  phone_code: string;
  subject: string;
  message: string;
  locale?: string;
}

export const sendContactFormThunk = createAsyncThunk(
  "contact/sendForm",
  async (params: ContactFormParams, { rejectWithValue }) => {
    try {
      const res = await api.post("/contacts/form", {
        name: params.name,
        email: params.email,
        phone: params.phone,
        subject: params.subject,
        message: params.message,
        locale: params.locale || "tr",
      });

      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Mesaj gönderilemedi");
      }

      return res.data;
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Mesaj gönderilemedi";
      return rejectWithValue(message);
    }
  }
);

export type CreateCustomerParams = {
  name: string;
  email?: string;
  phone?: string;
  phone_code?: string;
  locale?: string; 
};

export type CreateCustomerData = {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  phone_code?: string;
  locale?: string;
};

export type CreateCustomerResponse = {
  status: "success" | "error";
  message: string;
  data: CreateCustomerData;
  locale?: string;
};

const getErrorMessage = (err: any, fallback: string) =>
  err?.response?.data?.message || err?.message || fallback;

export const createCustomerThunk = createAsyncThunk<
  CreateCustomerResponse,
  CreateCustomerParams,
  { rejectValue: string }
>("customers/create", async (params, { rejectWithValue }) => {
  try {
    const payload = {
      name: params.name.trim(),
      email: params.email?.trim() || undefined,
      phone: params.phone?.trim() || undefined,
      phone_code: params.phone_code?.trim() || undefined,
      locale: params.locale ?? "tr",
    };

    const { data } = await api.post<CreateCustomerResponse>(
      "/auth/company/customers/create",
      payload
    );

    if (data.status !== "success") {
      return rejectWithValue(data.message || "Müşteri oluşturulamadı");
    }

    return data;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Müşteri oluşturulamadı"));
  }
});

export const createInvitationThunk = createAsyncThunk(
  "company/createInvitation",
  async (
    payload: {
      name: string;
      email?: string;
      phone?: string;
      phone_code?: string;
      role?: string;
      locale?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
      formData.append("name", payload.name);
      if (payload.email) formData.append("email", payload.email);
      if (payload.phone) formData.append("phone", payload.phone);
      if (payload.phone_code) formData.append("phone_code", payload.phone_code);
      if (payload.role) formData.append("role", payload.role);
      formData.append("locale", payload.locale || "tr");

      const response = await api.post(
        "/auth/company/team/invitations/create",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        return response.data;
      }

      return rejectWithValue(response.data.message || "Davetiye oluşturulamadı");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Davetiye oluşturulamadı"
      );
    }
  }
);

export const getInvitationsThunk = createAsyncThunk(
  "company/getInvitations",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/auth/company/team/invitations");

      if (response.data.status === "success") {
        return response.data.data.invitations || [];
      }

      return rejectWithValue(response.data.message || "Davetiyeler alınamadı");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Davetiyeler alınamadı"
      );
    }
  }
);

export const updateInvitationThunk = createAsyncThunk(
  "company/updateInvitation",
  async (
    {
      invitationId,
      data,
    }: {
      invitationId: number;
      data: {
        name: string;
        email: string;
        role: string;
        locale: string;
        phone: string;
        phone_code: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
      formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.phone_code) formData.append("phone_code", data.phone_code);
      if (data.role) formData.append("role", data.role);
      formData.append("locale", data.locale || "tr");

      const response = await api.post(
        `/auth/company/team/invitations/${invitationId}/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        return { invitationId, data: response.data };
      }

      return rejectWithValue(response.data.message || "Davetiye güncellenemedi");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Davetiye güncellenemedi"
      );
    }
  }
);

export const deleteInvitationThunk = createAsyncThunk(
  "company/deleteInvitation",
  async (invitationId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/auth/company/team/invitations/${invitationId}/delete`
      );

      if (response.data.status === "success") {
        return { invitationId };
      }

      return rejectWithValue(response.data.message || "Davetiye silinemedi");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Davetiye silinemedi"
      );
    }
  }
);

export const getPersonalPermissionsThunk = createAsyncThunk(
  "company/getPersonalPermissions",
  async (personalId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/auth/company/team/${personalId}/permissions`
      );

      if (response.data.status === "success") {
        return response.data.data || [];
      }

      return rejectWithValue(response.data.message || "Yetkiler alınamadı");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Yetkiler alınamadı"
      );
    }
  }
);

export const updatePersonalPermissionsThunk = createAsyncThunk(
  "company/updatePersonalPermissions",
  async (
    {
      personalId,
      permissions,
    }: {
      personalId: number;
      permissions: string[];
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
 
      permissions.forEach((permKey) => {
        formData.append(permKey, "1");
      });

      const response = await api.post(
        `/auth/company/team/${personalId}/permissions/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        return { personalId, permissions };
      }

      return rejectWithValue(response.data.message || "Yetkiler güncellenemedi");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Yetkiler güncellenemedi"
      );
    }
  }
);

export const updatePersonalStatusThunk = createAsyncThunk(
  "company/updatePersonalStatus",
  async (personalId: number, { rejectWithValue }) => {
    try {
      const response = await api.post(
        `/auth/company/team/${personalId}/status/toggle`
      );

      if (response.data.status === "success") {
        const newStatus = response.data.data?.personal_status;
        return { personalId, is_active: newStatus };
      }

      return rejectWithValue(response.data.message || "Durum değiştirilemedi");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Durum değiştirilemedi"
      );
    }
  }
);
export const updatePersonalProfileThunk = createAsyncThunk(
  "company/updatePersonalProfile",
  async (
    {
      personalId,
      data,
    }: {
      personalId: number;
      data: {
        name: string;
        phone?: string;
        phone_code?: string;
        role?: string; // role key (örn: "manager", "chairmen")
        locale?: string;
      };
    },
    { rejectWithValue }
  ) => {
    try {
      const formData = new FormData();
      
      formData.append("name", data.name);
      if (data.phone) formData.append("phone", data.phone);
      if (data.phone_code) formData.append("phone_code", data.phone_code);
      if (data.role) formData.append("role", data.role);
      formData.append("locale", data.locale || "tr");

      const response = await api.post(
        `/auth/company/team/${personalId}/profile/update`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.status === "success") {
        return { personalId, data: response.data.data };
      }

      return rejectWithValue(response.data.message || "Profil güncellenemedi");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Profil güncellenemedi"
      );
    }
  }
);

export const getRolesThunk = createAsyncThunk(
  "company/getRoles",
  async (_, { rejectWithValue }) => {
    try {
      console.log("getRolesThunk başladı");
      
      const formData = new FormData();
      formData.append("locale", "tr");
      
      const response = await api.post(`/front/roles`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        console.log("Roller başarıyla alındı:", response.data.data);
        return response.data.data;
      }

      console.log("API error:", response.data.message);
      return rejectWithValue(response.data.message || "Roller alınamadı");
    } catch (error: any) {
      console.log("Catch error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || "Roller alınamadı"
      );
    }
  }
);
