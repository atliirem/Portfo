import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";

import { setExtraFeature } from "../../redux/Slice/formSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { getPropertyFeatures } from "../../../api";
import { SafeAreaView } from "react-native-safe-area-context";

interface PropertyFeatureFormProps {
  propertyTypeId: number;
  onValidate?: (fn: () => boolean) => void;
  onValuesChange?: (values: Record<string, any>) => void;
  disabled?: boolean;
}

interface FeatureOption {
  id: number;
  title: string;
  selected?: boolean | string | number;
  childrens?: any[];
}

interface FeatureItem {
  id: number;
  title: string;
  value: any;
  input_type: string;
  details: any;
  options: FeatureOption[];
  childrens?: FeatureItem[];
}

interface FeatureGroup {
  title: string;
  features: FeatureItem[];
}

// ✅ Her zaman gösterilecek feature ID'leri
const ALWAYS_SHOW_IDS = [143, 144, 145];

const isOptionSelected = (opt: FeatureOption): boolean => {
  return opt.selected === true || opt.selected === "true" || opt.selected === 1 || opt.selected === "1";
};

export const PropertyFeatureForm: React.FC<PropertyFeatureFormProps> = ({
  propertyTypeId,
  onValidate,
  onValuesChange,
  disabled,
}) => {
  const dispatch = useAppDispatch();

  const extraFeatures = useAppSelector((state) => state.form.extraFeatures);
  const { groups, loading } = useAppSelector((state) => state.features);

  const [formValues, setFormValues] = useState<Record<number, any>>({});
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);
  const [tempMultipleSelection, setTempMultipleSelection] = useState<FeatureOption[]>([]);

  const prevPropertyTypeIdRef = useRef<number | null>(null);
  const initialValuesSetRef = useRef<boolean>(false);

  useEffect(() => {
    if (propertyTypeId) {
      if (prevPropertyTypeIdRef.current !== null && prevPropertyTypeIdRef.current !== propertyTypeId) {
        setFormValues({});
        initialValuesSetRef.current = false;
      }
      prevPropertyTypeIdRef.current = propertyTypeId;
      dispatch(getPropertyFeatures(propertyTypeId));
    }
  }, [propertyTypeId, dispatch]);

  // ✅ Debug: groups değiştiğinde tüm feature'ları logla
  useEffect(() => {
    if (groups && groups.length > 0) {
      console.log("=== ALL FEATURES DEBUG ===");
      groups.forEach((group: FeatureGroup) => {
        console.log(`Group: ${group.title}`);
        group.features.forEach((feature: FeatureItem) => {
          const isHidden = feature.details?.is_hidden === "1" || feature.details?.is_hidden === true;
          const forceShow = ALWAYS_SHOW_IDS.includes(feature.id);
          const willShow = !isHidden || forceShow;
          console.log(`  - ID: ${feature.id}, Title: ${feature.title}, Hidden: ${isHidden}, ForceShow: ${forceShow}, WillShow: ${willShow}`);
        });
      });
    }
  }, [groups]);

  useEffect(() => {
    if (Object.keys(extraFeatures).length > 0 && !initialValuesSetRef.current) {
      setFormValues(extraFeatures);
    }
  }, [extraFeatures]);

  useEffect(() => {
    if (groups && groups.length > 0 && !initialValuesSetRef.current) {
      const initialValues: Record<number, any> = {};

      groups.forEach((group: FeatureGroup) => {
        group.features.forEach((feature: FeatureItem) => {
          if (extraFeatures[feature.id] !== undefined) {
            initialValues[feature.id] = extraFeatures[feature.id];
            return;
          }

          const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";

          if (feature.input_type === "select" && feature.options) {
            const selectedOptions = feature.options.filter(isOptionSelected);
            if (selectedOptions.length > 0) {
              if (isMultiple) {
                initialValues[feature.id] = selectedOptions;
                dispatch(setExtraFeature({ id: feature.id, value: selectedOptions }));
              } else {
                initialValues[feature.id] = selectedOptions[0];
                dispatch(setExtraFeature({ id: feature.id, value: selectedOptions[0] }));
              }
            }
          } else if (feature.value !== null && feature.value !== undefined && feature.value !== "") {
            initialValues[feature.id] = feature.value;
            dispatch(setExtraFeature({ id: feature.id, value: feature.value }));
          }
        });
      });

      setFormValues(initialValues);
      initialValuesSetRef.current = true;
    }
  }, [groups, extraFeatures, dispatch]);

  useEffect(() => {
    onValuesChange?.(formValues);
  }, [formValues, onValuesChange]);

  useEffect(() => {
    onValidate?.(() => {
      if (!groups || groups.length === 0) return true;

      for (const group of groups) {
        for (const feature of group.features) {
          const isRequired = feature.details?.required === true || feature.details?.required === "true";
          const isHidden = feature.details?.is_hidden === "1" || feature.details?.is_hidden === true;
          const forceShow = ALWAYS_SHOW_IDS.includes(feature.id);

          if (isRequired && (!isHidden || forceShow)) {
            const value = formValues[feature.id];
            if (value === null || value === "" || value === undefined) {
              return false;
            }
            if (Array.isArray(value) && value.length === 0) {
              return false;
            }
          }
        }
      }
      return true;
    });
  }, [formValues, groups, onValidate]);

  const handleValueChange = useCallback((featureId: number, value: any) => {
    setFormValues((prev) => ({ ...prev, [featureId]: value }));
    dispatch(setExtraFeature({ id: featureId, value }));
  }, [dispatch]);

  const openSelectModal = (feature: FeatureItem) => {
    const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";
    setActiveFeature(feature);

    if (isMultiple) {
      const currentValue = formValues[feature.id];
      let selections: FeatureOption[] = [];

      if (Array.isArray(currentValue) && currentValue.length > 0) {
        selections = currentValue;
      } else if (feature.options) {
        const selectedFromApi = feature.options.filter(isOptionSelected);
        if (selectedFromApi.length > 0) {
          selections = selectedFromApi;
        }
      }
      setTempMultipleSelection(selections);
    }
    setSelectModalVisible(true);
  };

  const handleSingleSelect = (option: FeatureOption) => {
    if (activeFeature) {
      handleValueChange(activeFeature.id, option);
    }
    setSelectModalVisible(false);
    setActiveFeature(null);
  };

  const toggleMultipleOption = (option: FeatureOption) => {
    setTempMultipleSelection((prev) => {
      const exists = prev.find((item) => item.id === option.id);
      if (exists) {
        return prev.filter((item) => item.id !== option.id);
      }
      return [...prev, option];
    });
  };

  const saveMultipleSelection = () => {
    if (activeFeature) {
      handleValueChange(activeFeature.id, tempMultipleSelection);
    }
    setSelectModalVisible(false);
    setActiveFeature(null);
    setTempMultipleSelection([]);
  };

  const getDisplayValue = (feature: FeatureItem): string => {
    const value = formValues[feature.id];
    const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";

    if (value) {
      if (isMultiple && Array.isArray(value)) {
        return value.map((v) => v.title || v.label).join(", ");
      }
      if (value.title || value.label) {
        return value.title || value.label;
      }
    }

    if (feature.input_type === "select" && feature.options) {
      const selectedOptions = feature.options.filter(isOptionSelected);
      if (selectedOptions.length > 0) {
        if (isMultiple) {
          return selectedOptions.map((opt) => opt.title).join(", ");
        }
        return selectedOptions[0].title;
      }
    }
    return "";
  };

  const renderInput = (feature: FeatureItem) => {
    const value = formValues[feature.id];

    switch (feature.input_type) {
      case "text":
      case "textarea":
        return (
          <TextInput
            style={[
              styles.textInput,
              feature.input_type === "textarea" && styles.textArea,
              disabled && styles.disabledInput,
            ]}
            value={value?.toString() || feature.value?.toString() || ""}
            onChangeText={(text) => handleValueChange(feature.id, text)}
            placeholder={feature.title}
            placeholderTextColor="#999"
            editable={!disabled}
            multiline={feature.input_type === "textarea"}
            numberOfLines={feature.input_type === "textarea" ? 4 : 1}
          />
        );

      case "number":
        return (
          <TextInput
            style={[styles.textInput, disabled && styles.disabledInput]}
            value={value?.toString() || feature.value?.toString() || ""}
            onChangeText={(text) => handleValueChange(feature.id, text)}
            placeholder={feature.title}
            placeholderTextColor="#999"
            keyboardType="numeric"
            editable={!disabled}
          />
        );

      case "select":
        const displayText = getDisplayValue(feature);
        const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";

        return (
          <TouchableOpacity
            style={[styles.selectButton, disabled && styles.disabledInput]}
            onPress={() => !disabled && openSelectModal(feature)}
          >
            <Text
              style={displayText ? styles.selectText : styles.selectPlaceholder}
              numberOfLines={2}
            >
              {displayText || `${feature.title} seçin${isMultiple ? " (çoklu)" : ""}`}
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        );

      case "checkbox":
        const isChecked = value !== undefined ? !!value : !!feature.value;
        return (
          <View style={styles.checkboxContainer}>
            <Switch
              value={isChecked}
              onValueChange={(checked) => handleValueChange(feature.id, checked)}
              disabled={disabled}
              trackColor={{ false: "#ccc", true: "#25C5D1" }}
              thumbColor={isChecked ? "#fff" : "#f4f3f4"}
            />
            <Text style={styles.checkboxLabel}>{isChecked ? "Evet" : "Hayır"}</Text>
          </View>
        );

      case "date":
        return (
          <TouchableOpacity style={[styles.selectButton, disabled && styles.disabledInput]}>
            <Text style={value ? styles.selectText : styles.selectPlaceholder}>
              {value || `${feature.title} seçin`}
            </Text>
            <Text style={styles.selectArrow}>📅</Text>
          </TouchableOpacity>
        );

      case "file":
        const fileValue = value || feature.value;
        const fileName = fileValue?.name || "";
        return (
          <TouchableOpacity style={[styles.selectButton, disabled && styles.disabledInput]}>
            <Text style={fileName ? styles.selectText : styles.selectPlaceholder}>
              {fileName || "Dosya Seç"}
            </Text>
            <Text style={styles.selectArrow}>📁</Text>
          </TouchableOpacity>
        );

      default:
        return (
          <TextInput
            style={[styles.textInput, disabled && styles.disabledInput]}
            value={value?.toString() || feature.value?.toString() || ""}
            onChangeText={(text) => handleValueChange(feature.id, text)}
            placeholder={feature.title}
            placeholderTextColor="#999"
            editable={!disabled}
          />
        );
    }
  };

  const renderFeatureItem = (feature: FeatureItem, featureIndex: number) => {
    const isHidden = feature.details?.is_hidden === "1" || feature.details?.is_hidden === true;
    const forceShow = ALWAYS_SHOW_IDS.includes(feature.id);

    // ✅ Debug log
    console.log(`Rendering feature: ${feature.id} - ${feature.title}, isHidden: ${isHidden}, forceShow: ${forceShow}, willRender: ${!isHidden || forceShow}`);

    // Gizli ve zorla gösterilmeyecekse atla
    if (isHidden && !forceShow) {
      console.log(`  -> SKIPPED: ${feature.title}`);
      return null;
    }

    console.log(`  -> RENDERING: ${feature.title}`);

    const isRequired = feature.details?.required === true || feature.details?.required === "true";

    return (
      <View key={`feature-${feature.id}-${featureIndex}`} style={styles.featureContainer}>
        <Text style={styles.featureLabel}>
          {feature.title}
          {isRequired && <Text style={styles.required}> *</Text>}
        </Text>
        {renderInput(feature)}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#25C5D1" />
        <Text style={styles.loadingText}>Özellikler yükleniyor...</Text>
      </View>
    );
  }

  if (!groups || groups.length === 0) {
    console.log("No groups found, returning null");
    return null;
  }

  const isMultiple = activeFeature?.details?.multiple === true || activeFeature?.details?.multiple === "true";

  return (
    <SafeAreaView style={styles.safearea} edges={['bottom']}>
    <View style={styles.container}>
      {groups.map((group: FeatureGroup, groupIndex: number) => (
        <View key={`group-${groupIndex}-${group.title}`} style={styles.groupContainer}>
          <Text style={styles.groupTitle}>{group.title}</Text>
          {group.features.map((feature: FeatureItem, featureIndex: number) =>
            renderFeatureItem(feature, featureIndex)
          )}
        </View>
      ))}

      <Modal
        isVisible={selectModalVisible}
        onBackdropPress={() => {
          setSelectModalVisible(false);
          setTempMultipleSelection([]);
        }}
        style={styles.modal}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>
            {activeFeature?.title || "Seçin"}
            {isMultiple && <Text style={styles.multipleHint}> (Birden fazla seçebilirsiniz)</Text>}
          </Text>

          {activeFeature?.options && activeFeature.options.length > 0 ? (
            <ScrollView style={styles.optionsList}>
              {activeFeature.options.map((item, index) => {
                let isSelected = false;

                if (isMultiple) {
                  isSelected = tempMultipleSelection.some((sel) => sel.id === item.id);
                } else {
                  const currentVal = formValues[activeFeature.id];
                  if (currentVal) {
                    isSelected = currentVal.id === item.id;
                  } else {
                    isSelected = isOptionSelected(item);
                  }
                }

                return (
                  <TouchableOpacity
                    key={`option-${item.id}-${index}`}
                    style={[styles.optionItem, isSelected && styles.optionItemSelected]}
                    onPress={() => {
                      if (isMultiple) {
                        toggleMultipleOption(item);
                      } else {
                        handleSingleSelect(item);
                      }
                    }}
                  >
                    {isMultiple && (
                      <View style={[styles.checkbox, isSelected && styles.checkboxChecked]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    )}
                    <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <Text style={styles.noOptionsText}>Seçenek bulunamadı</Text>
          )}

          <View style={styles.modalButtons}>
            {isMultiple && (
              <TouchableOpacity style={styles.saveButton} onPress={saveMultipleSelection}>
                <Text style={styles.saveButtonText}>Kaydet ({tempMultipleSelection.length} seçili)</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.closeButton, isMultiple && styles.closeButtonSmall]}
              onPress={() => {
                setSelectModalVisible(false);
                setTempMultipleSelection([]);
              }}
            >
              <Text style={styles.closeButtonText}>{isMultiple ? "İptal" : "Kapat"}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 10 },
  safearea:{
    marginTop: -60,
  },
  loadingContainer: { padding: 20, alignItems: "center" },
  loadingText: { marginTop: 8, color: "#666", fontSize: 14 },
  groupContainer: { marginBottom: 20 },
  groupTitle: { fontSize: 15, fontWeight: "600", color: "#333", marginBottom: 12, paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: "#eee" },
  featureContainer: { marginBottom: 15 },
  featureLabel: { fontSize: 14, fontWeight: "500", color: "#555", marginBottom: 6 },
  required: { color: "#e74c3c" },
  textInput: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 15, color: "#333", backgroundColor: "#fff" },
  textArea: { height: 100, textAlignVertical: "top" },
  disabledInput: { backgroundColor: "#f5f5f5", color: "#999" },
  selectButton: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff" },
  selectText: { fontSize: 15, color: "#333", flex: 1 },
  selectPlaceholder: { fontSize: 15, color: "#999", flex: 1 },
  selectArrow: { fontSize: 12, color: "#999", marginLeft: 8 },
  checkboxContainer: { flexDirection: "row", alignItems: "center" },
  checkboxLabel: { marginLeft: 10, fontSize: 14, color: "#555" },
  modal: { margin: 0, justifyContent: "flex-end" },
  modalContainer: { backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20, maxHeight: "70%" },
  modalTitle: { fontSize: 18, fontWeight: "700", color: "#333", marginBottom: 15, textAlign: "center" },
  multipleHint: { fontSize: 12, fontWeight: "400", color: "#25C5D1" },
  optionsList: { maxHeight: 350 },
  optionItem: { paddingVertical: 14, paddingHorizontal: 10, borderRadius: 8, borderBottomWidth: 1, borderBottomColor: "#eee", flexDirection: "row", alignItems: "center" },
  optionItemSelected: { backgroundColor: "#e6f7f8" },
  checkbox: { width: 22, height: 22, borderRadius: 4, borderWidth: 2, borderColor: "#ddd", marginRight: 12, justifyContent: "center", alignItems: "center" },
  checkboxChecked: { backgroundColor: "#25C5D1", borderColor: "#25C5D1" },
  checkmark: { color: "#fff", fontSize: 14, fontWeight: "bold" },
  optionText: { fontSize: 15, color: "#333", flex: 1 },
  optionTextSelected: { color: "#25C5D1", fontWeight: "600" },
  noOptionsText: { textAlign: "center", color: "#999", padding: 20 },
  modalButtons: { flexDirection: "row", marginTop: 15, gap: 10 },
  saveButton: { flex: 1, paddingVertical: 12, backgroundColor: "#25C5D1", borderRadius: 8, alignItems: "center" },
  saveButtonText: { fontSize: 15, fontWeight: "600", color: "#fff" },
  closeButton: { flex: 1, paddingVertical: 12, backgroundColor: "#f0f0f0", borderRadius: 8, alignItems: "center" },
  closeButtonSmall: { flex: 0.5 },
  closeButtonText: { fontSize: 15, fontWeight: "600", color: "#666" },
});

export default PropertyFeatureForm;