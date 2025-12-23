import { useDispatch } from "react-redux";
import { Alert } from "react-native";
import { toggleWishlist } from "../../api";
import { AppDispatch } from "../redux/store";

export const useWishlistToggle = (property: any) => {
  const dispatch = useDispatch<AppDispatch>();

  const toggleFavorite = async () => {
    if (!property?.id) return;

    try {
      const res = await dispatch(toggleWishlist(property.id)).unwrap();

      console.log("Favori yanıtı:", res);

      const added = res?.added ?? res?.data?.added; 
      const message = added
        ? "İlan favorilere eklendi "
        : "İlan favorilerden kaldırıldı ";

      Alert.alert("Başarılı", message);
    } catch (err) {
      console.error("Favori işlemi hatası:", err);
      Alert.alert("Hata", "Favori işlemi başarısız!");
    }
  };

  return toggleFavorite;
};
