
export interface PriceValue {
  formatted: string;
  number: number;
  symbol: string;
  code: string;
}

export interface Prices {
  primary: PriceValue;
  secondary: PriceValue;
}

export interface Currency {
  id: number;
  title: string;
}

export interface Country {
  id: number;
  title: string;
  regional: string;
  iso_code: string;
  currency: string;
  phone_code: string;
  is_only_phone_code: number;
}

export interface City {
  id: number;
  title: string;
  country_id: number;
}

export interface District {
  id: number;
  city_id: number;
  title: string;
  latitude: number | null;
  longitude: number | null;
}

export interface Street {
  id: number;
  title: string;
  district_id: number;
  latitude: number | null;
  longitude: number | null;
}

export interface TypeBase {
  id: number;
  title: string;
}

export interface Creator {
  name: string;
  avatar: string;
}

// FEATURE TYPES
export interface FeatureDetails {
  multiple?: boolean | string;
  is_hidden?: boolean | string | number;
  hide_on_proposal?: boolean | string | number;
  multiple_on_filter?: boolean | string | number;
  required?: boolean;
  can_filter?: boolean;
  min?: number | string | boolean | null;
  max?: number | string | boolean | null;
  is_range?: boolean | string | number;
  range_on_project?: boolean | number | string;
  fraction?: string | number;
  joker_search?: string | number;
  mimetype?: string;
}

export interface FeatureChildOption {
  id: number;
  title: string;
  input_type: string;
  details: FeatureDetails;
  options: FeatureOption[];
  value: string | number | null;
}

export interface FeatureOption {
  id: number;
  title: string;
  selected: boolean;
  childrens: FeatureChildOption[];
}

export interface FeatureItem {
  id: number;
  title: string;
  value: string | number | null;
  input_type: string;
  details: FeatureDetails;
  options: FeatureOption[];
}

export interface FeatureCategory {
  title: string;
  features: FeatureItem[];
}

// GALLERY TYPES
export interface GalleryImagePath {
  small: string;
  large: string;
}

export interface GalleryImage {
  id: number;
  path: GalleryImagePath;
}

export interface Gallery {
  title: string;
  id: number;
  images: GalleryImage[];
}

// COMPANY
export interface Company {
  id: number;
  title: string;
  logo: string;
  badges: any[];
}

// MAP
export interface MapData {
  latitude: string;
  longitude: string;
}

// COMMISSION
export interface CommissionRates {
  buyer: number | null;
  seller: number | null;
}

// FULL PROPERTY DATA
export interface PropertyData {
  id: number;
  no: string;
  title: string;

  prices: Prices;
  currency: Currency;

  is_under_construction: boolean;
  cover: string;
  status: string;

  country: Country;
  city: City;
  district: District;
  street: Street;

  type: TypeBase;
  creator: Creator;

  features: FeatureCategory[];

  galleries: Gallery[];
  gallery_count: number;

  videos: any[];

  show_pass_price: boolean;
  show_commission_rates: boolean;

  property_type: string;
  hasPriceRange: boolean;

  company: Company;

  in_wishlist: boolean;

  updated_at: string;

  badges: any[];
  project_prices: any[];
  suspend_reasons: any[];

  map: MapData;

  is_owner_company: boolean;

  pricing_type: string;

  commission_rates: CommissionRates;
}


export interface SinglePropertyResponse {
  status: string;
  message: string;
  data: PropertyData;
  locale: string;
}
