import { setSelectedCountry } from "./countrySlice";
import { setSelectedCity } from "./filterSlice";
import { setSelectedDistrict } from "./districtSlice";
import { setSelectedStreet } from "./streetsSlice";

export const clearLocationFilters = () => (dispatch) => {
  dispatch(setSelectedCountry(null));
  dispatch(setSelectedCity(null));
  dispatch(setSelectedDistrict(null));
  dispatch(setSelectedStreet(null));
};
