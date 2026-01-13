import { setSelectedCountry } from "../redux/Slice/countrySlice";
import { setSelectedDistrict } from "../redux/Slice/districtSlice";
import { setSelectedCity } from "../redux/Slice/citySlice";
import { setSelectedStreet } from "../redux/Slice/streetsSlice";



export const clearLocationFilters = () => (dispatch) => {
  dispatch(setSelectedCountry(null));
  dispatch(setSelectedCity(null));
  dispatch(setSelectedDistrict(null));
  dispatch(setSelectedStreet(null));

};
