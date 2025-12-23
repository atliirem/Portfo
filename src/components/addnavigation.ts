
import { useNavigation } from "@react-navigation/native";


export function useAddNavigation() {
  const navigation = useNavigation();

  const goToCreate = () => {
    navigation.navigate("Create" as never);
  };

  return { goToCreate };
}