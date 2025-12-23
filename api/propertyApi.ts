import axios, { AxiosError } from 'axios';
import { CreateAdState } from '../src/redux/Slice/formSlice';


const API_BASE_URL = 'https://portfoy.demo.pigasoft.com/api';


export interface PropertyResponse {
  status: string;
  message: string;
  data: {
    property: {
      id: number;
      no: string;
      type_id: string;
      company_id: number;
      created_by: number;
      title: string;
      is_under_construction: boolean;
      status: string;
      country_id: string;
      city_id: string;
      district_id: string;
      street_id: string;
      currency_id: string;
      buyer_commission_rate: string;
      seller_commission_rate: string;
      pricing_type: string;
      sell_price: string;
      pass_price: string;
      max_price: string | null;
      project_licence_file: string | null;
      sell_price_in_try: number;
      created_at: string;
      updated_at: string;
    };
  };
  locale: string;
}


interface CreatePropertyPayload {
  title: string;
  type_id?: string;

  country_id?: string;
  city_id?: string;
  district_id?: string;
  street_id?: string;

  currency_id: string;

  pricing_type: "COMMISSION" | "PASS";

  sell_price?: string;
  buyer_commission_rate?: string;
  seller_commission_rate?: string;

  pass_price?: string;
  min_price?: string;
  max_price?: string;

  is_under_construction: boolean;

  room_count?: string;
  project_min?: string;
  project_max?: string;
}


const mapStateToApiPayload = (state: CreateAdState): CreatePropertyPayload => {
  const pricingType: "COMMISSION" | "PASS" =
    state.commission.salePrice ? "COMMISSION" : "PASS";

  const isProject =
    state.selectedSubCategoryId === 34 ||
    state.selectedSubCategoryId === 35;

  const payload: CreatePropertyPayload = {
    title: state.title,
    type_id:
      state.selectedSubCategoryId?.toString() ||
      state.selectedCategoryId?.toString(),

    country_id: state.location.country,
    city_id: state.location.city,
    district_id: state.location.district,
    street_id: state.location.streets,

    currency_id: state.price.currencyId?.toString() || "1",

    pricing_type: pricingType,

    is_under_construction: isProject ? true : false,
  };


  if (pricingType === "COMMISSION") {
    payload.sell_price = state.commission.salePrice;
    payload.buyer_commission_rate = state.commission.buyerRate;
    payload.seller_commission_rate = state.commission.sellerRate;
  } else {

    payload.pass_price = state.pass.passPrice;
    payload.sell_price = state.pass.salePrice;
  }

  if (state.price.minPrice) payload.min_price = state.price.minPrice;
  if (state.price.maxPrice) payload.max_price = state.price.maxPrice;


  if (isProject) {
    payload.room_count = state.project.roomCount;
    payload.project_min = state.project.min;
    payload.project_max = state.project.max;
  }

  return payload;
};


export const createProperty = async (
  state: CreateAdState,
  authToken?: string
): Promise<PropertyResponse> => {
  const payload = mapStateToApiPayload(state);

  console.log("Gönderilen Payload:", payload);

  try {
    const response = await axios.post<PropertyResponse>(
      `${API_BASE_URL}/properties/drafts/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          ...(authToken && { Authorization: `Bearer ${authToken}` }),
        },
      }
    );

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    const message = getErrorMessage(error);
    console.error("API Hatası:", message);
    throw error;
  }
};


export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (message) return message;

    switch (status) {
      case 401:
        return "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.";
      case 422:
        return "Lütfen tüm gerekli alanları doldurun.";
      case 500:
        return "Sunucu hatası. Lütfen daha sonra tekrar deneyin.";
      default:
        return "Bir hata oluştu. Lütfen tekrar deneyin.";
    }
  }

  return "Beklenmeyen bir hata oluştu.";
};
