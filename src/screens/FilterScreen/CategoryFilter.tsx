import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { getTypes } from "../../../api";
import { setSelectedTypes, clearSelectedTypes } from "../../redux/Slice/typesSlice";

const { height: screenHeight } = Dimensions.get("window");

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const CategoryFilterModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const dispatch = useAppDispatch();
  const { titles, loading, error, selectedTypes } = useAppSelector((state) => state.types);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  useEffect(() => {
    dispatch(getTypes());
  }, [dispatch]);

  const toggleCategory = (label: string) => {
    setSelectedCategories((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label]
    );
  };

  const handleClearCategories = () => {
    setSelectedCategories([]);
    dispatch(clearSelectedTypes());
  };

  const handleApplyCategories = () => {
    dispatch(setSelectedTypes(selectedCategories));
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      propagateSwipe
      style={styles.modal}
    >
      <View style={styles.sheet}>
        <View style={styles.dragIndicator} />
        <Text style={styles.title}>Kategori</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {loading && <ActivityIndicator size="small" color="#00A7C0" />}
          {error && <Text style={styles.error}>{error}</Text>}

          {titles.map(({ label, parent }) => (
            <BouncyCheckbox
              key={parent ? `${parent}-${label}` : label}
              size={22}
              fillColor="#00A7C0"
              unfillColor="#FFFFFF"
              text={parent ? `  └ ${label}` : label}
              isChecked={selectedCategories.includes(label)}
              iconStyle={styles.checkboxIcon}
              innerIconStyle={styles.checkboxInnerIcon}
              textStyle={styles.checkboxText}
              onPress={() => toggleCategory(label)}
            />
          ))}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[
                styles.clearButton,
                selectedCategories.length === 0 && styles.disabledButton,
              ]}
              onPress={handleClearCategories}
              disabled={selectedCategories.length === 0}
            >
              <Text style={styles.buttonText}>Temizle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyButton} onPress={handleApplyCategories}>
              <Text style={styles.buttonText}>Uygula</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default CategoryFilterModal;

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    height: screenHeight * 0.55,
  },
  dragIndicator: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#00A7C0",
    marginBottom: 10,
  },
  checkboxIcon: { borderColor: "#00A7C0" },
  checkboxInnerIcon: { borderWidth: 2 },
  checkboxText: { textDecorationLine: "none" },
  buttons: { marginTop: 20, gap: 12 },
  clearButton: {
    backgroundColor: "#b6b4b4d4",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  applyButton: {
    backgroundColor: "#41c4cf",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: "#fff", fontWeight: "700" },
  error: { color: "red", marginBottom: 10 },
});
