import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const api = axios.create({
  baseURL: 'https://portfoy.demo.pigasoft.com/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});


api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@TOKEN');


  if (token && typeof token === 'string') {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});



export const signUpThunk = createAsyncThunk<
  any,
  { email: string; password: string; name: string; invitation_code: string }
>('auth/register', async ({ email, password, name, invitation_code }) => {
  try {
    const res = await api.post('/auth/register', {
      email,
      password,
      name,
      invitation_code,
    });

    const { token, user } = res.data.data; 
    const userData = { ...user, token };

    await AsyncStorage.setItem('@TOKEN', String(token || ''));


    await AsyncStorage.setItem('@USER', JSON.stringify(userData));

    return userData;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.errors?.email?.[0] ||
      err?.message ||
      'Kayıt başarısız';
    throw new Error(msg);
  }
});

export const loginThunk = createAsyncThunk<
  any,
  { email: string; password: string }
>('auth/login', async ({ email, password }) => {
  try {
    const res = await api.post('/auth/login', {
      email,
      password,
      locale: 'tr',
    });
      

    console.log('Gelen yanıt:', res.data);

    if (res.data.status === 'error') {
      throw new Error(res.data.message || 'Giriş başarısız');
    }

    const token = res.data.data?.token;
    const user = res.data.data?.user || res.data.data;

    if (!token) {
      throw new Error('Sunucudan token alınamadı');
    }

    const userData = { ...user, token };


    await AsyncStorage.setItem('@TOKEN', token);
    await AsyncStorage.setItem('@USER', JSON.stringify(userData));

    return userData;
  } catch (err: any) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      'Giriş başarısız';
    throw new Error(msg);
  }
});


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
      // Tüm data objesini döndür (personals değil)
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


export const getPropertyFeatures = createAsyncThunk(
  "features/getPropertyFeatures",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.get(`/properties/${id}/details`);
      if (res.data.status !== "success") {
        throw new Error(res.data.message || "Bilgi alınamadı");
      }

      return res.data.data.features;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Bilgi alınamadı";
      return rejectWithValue(msg);
    }
  }
);

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
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/properties');
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




export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    {
      name,
      email,
     
    }: {
      name: string;
      email: string;
    
    },
    { rejectWithValue }
  ) => {
    try {
      // 👇 backend’in beklediği doğru format
      const res = await api.post("/auth/profile/update?locale=tr", {
        name,
        email,
       
      });

      console.log("updateProfile yanıtı:", res.data);

      if (res.data.status === "success") {
        return res.data.data; 
      } else {
        throw new Error(res.data.message || "Profil güncellenemedi");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Profil güncellenemedi";
      return rejectWithValue(msg);
    }
  }
);

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

export const getOffers = createAsyncThunk(
  'offers/getOffers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post(`/auth/offers` );
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
export const getSentOffers = createAsyncThunk(
  'sentOffers/getSentOffers',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await api.post(`/properties/${id}/offers`);
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
export const getFilteredProperties = createAsyncThunk(
  'properties/getFilteredProperties',
  async (
    {
      city_id,
      featured,
      discounted,
      page = 1,
    }: {
      city_id?: string | number;
      featured?: string | number;
      discounted?: string | number;
      page?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post('/properties/filter', {
        city_id,
        featured,
        discounted,
        page,
      });

      if (res.data.status !== 'success') {
        throw new Error(res.data.message || 'Filtreli ilanlar alınamadı');
      }

      return res.data.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Filtreli ilanlar alınamadı';
      return rejectWithValue(msg);
    }
  }
);

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

 export const getAllCompanies = createAsyncThunk(
  'companies/getAllCompanies',
  async ( id , { rejectWithValue }) => {
    try {
      const res = await api.post(`/companies` );
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
 // /auth/company/customers/192/update

export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async (
    { id, body }: { id: number; body: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post(
        `/auth/company/customers/${id}/update`,
        body
      );

     
      return { id, data: res.data.data };
    } catch (err: any) {
      const msg =
        err?.response?.data?.errors?.body?.[0] ||
        err?.message ||
        "Müşteri güncellenemedi";
      return rejectWithValue(msg);
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