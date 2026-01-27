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

import { setExtraFeature, clearExtraFeatures } from "../../redux/Slice/formSlice";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { getPropertyFeatures } from "../../../api";

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

const ALWAYS_SHOW_IDS = [143, 144, 145];

const isOptionSelected = (opt: FeatureOption): boolean => {
  return opt.selected === true || opt.selected === "true" || opt.selected === 1 || opt.selected === "1";
};

const isEmptyValue = (val: any): boolean => {
  if (val === null || val === undefined || val === "") return true;
  
  if (typeof val === "object" && !Array.isArray(val)) {
    if (val.title || val.label) return false;
    if ('min' in val || 'max' in val) return true;
    const values = Object.values(val);
    if (values.length === 0) return true;
    return values.every(v => v === null || v === undefined || v === "");
  }
  
  if (Array.isArray(val) && val.length === 0) return true;
  
  return false;
};

const normalizeSelectValue = (value: any, options: FeatureOption[], isMultiple: boolean): any => {
  if (isEmptyValue(value)) {
    return isMultiple ? [] : null;
  }

  if (typeof value === "string") {
    const matchedOption = options.find(opt => 
      opt.title === value || opt.title.toLowerCase() === value.toLowerCase()
    );
    
    if (matchedOption) {
      return isMultiple ? [matchedOption] : matchedOption;
    }
    
    if (isMultiple && value.includes(",")) {
      const titles = value.split(",").map(t => t.trim());
      const matchedOptions = options.filter(opt => 
        titles.some(title => opt.title === title || opt.title.toLowerCase() === title.toLowerCase())
      );
      return matchedOptions.length > 0 ? matchedOptions : [];
    }
    
    return isMultiple ? [] : null;
  }

  if (typeof value === "object" && !Array.isArray(value) && (value.id || value.title)) {
    return isMultiple ? [value] : value;
  }

  if (Array.isArray(value)) {
    return isMultiple ? value : (value.length > 0 ? value[0] : null);
  }

  return isMultiple ? [] : null;
};

export const PropertyFeatureForm: React.FC<PropertyFeatureFormProps> = ({
  propertyTypeId,
  onValidate,
  onValuesChange,
  disabled,
}) => {
  const dispatch = useAppDispatch();

  const extraFeatures = useAppSelector((state) => state.form.extraFeatures);
  const isEditMode = useAppSelector((state) => state.form.isEditMode);
  const propertyId = useAppSelector((state) => state.form.propertyId);
  const { groups, loading } = useAppSelector((state) => state.features.form);

  const [formValues, setFormValues] = useState<Record<number, any>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [touched, setTouched] = useState<Record<number, boolean>>({});
  const [selectModalVisible, setSelectModalVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState<FeatureItem | null>(null);
  const [tempMultipleSelection, setTempMultipleSelection] = useState<FeatureOption[]>([]);

  const prevPropertyTypeIdRef = useRef<number | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // ✅ Component unmount olduğunda form'u temizle
  useEffect(() => {
    return () => {
      console.log("🧹 Component unmount - form tamamen temizleniyor");
      dispatch(clearExtraFeatures());
      setFormValues({});
      setErrors({});
      setTouched({});
      isInitializedRef.current = false;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!propertyTypeId) return;

    const categoryChanged = prevPropertyTypeIdRef.current !== null && 
                            prevPropertyTypeIdRef.current !== propertyTypeId;
    
    if (categoryChanged) {
      console.log("📦 Kategori değişti:", prevPropertyTypeIdRef.current, "->", propertyTypeId);
      setFormValues({});
      setErrors({});
      setTouched({});
      isInitializedRef.current = false;
      dispatch(clearExtraFeatures());
    }
    
    prevPropertyTypeIdRef.current = propertyTypeId;
    
    console.log("🔍 getPropertyFeatures çağrılıyor:", { 
      isEditMode, 
      propertyId, 
      propertyTypeId 
    });
    
    dispatch(getPropertyFeatures({
      propertyId: isEditMode ? propertyId : undefined,
      propertyTypeId: propertyTypeId
    }));
  }, [propertyTypeId, isEditMode, propertyId, dispatch]);

  useEffect(() => {
    if (Object.keys(extraFeatures).length === 0 && isInitializedRef.current) {
      console.log("🧹 extraFeatures temizlendi, formValues sıfırlanıyor");
      setFormValues({});
      setErrors({});
      setTouched({});
      isInitializedRef.current = false;
    }
  }, [extraFeatures]);

  useEffect(() => {
    if (!groups || groups.length === 0) {
      console.log("⚠️ Groups boş veya yüklenmedi");
      return;
    }
    if (loading) return;
    if (isInitializedRef.current) return;

    console.log("🔄 Groups yüklendi, form başlatılıyor...", { 
      isEditMode, 
      extraFeaturesCount: Object.keys(extraFeatures).length,
      groupsCount: groups.length
    });

    const initialValues: Record<number, any> = {};

    groups.forEach((group: FeatureGroup) => {
      group.features.forEach((feature: FeatureItem) => {
        const featureId = feature.id;
        const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";

        if (extraFeatures[featureId] !== undefined && !isEmptyValue(extraFeatures[featureId])) {
          if (feature.input_type === "select" && feature.options) {
            const normalizedValue = normalizeSelectValue(extraFeatures[featureId], feature.options, isMultiple);
            initialValues[featureId] = normalizedValue;
            dispatch(setExtraFeature({ id: featureId, value: normalizedValue }));
          } else {
            initialValues[featureId] = extraFeatures[featureId];
          }
          return;
        }

        if (feature.input_type === "select" && feature.options) {
          const selectedOptions = feature.options.filter(isOptionSelected);
          
          if (selectedOptions.length > 0) {
            const value = isMultiple ? selectedOptions : selectedOptions[0];
            initialValues[featureId] = value;
            dispatch(setExtraFeature({ id: featureId, value }));
          } else if (!isEmptyValue(feature.value)) {
            const normalizedValue = normalizeSelectValue(feature.value, feature.options, isMultiple);
            initialValues[featureId] = normalizedValue;
            dispatch(setExtraFeature({ id: featureId, value: normalizedValue }));
          }
        } else if (!isEmptyValue(feature.value)) {
          initialValues[featureId] = feature.value;
          dispatch(setExtraFeature({ id: featureId, value: feature.value }));
        }
      });
    });

    console.log("✅ Form başlatıldı, değer sayısı:", Object.keys(initialValues).length);
    setFormValues(initialValues);
    isInitializedRef.current = true;

  }, [groups, loading, dispatch, extraFeatures]);

  useEffect(() => {
    onValuesChange?.(formValues);
  }, [formValues, onValuesChange]);

  const validateField = (feature: FeatureItem): string => {
    const isRequired = feature.details?.required === true || feature.details?.required === "true";
    const isHidden = feature.details?.is_hidden === "1" || feature.details?.is_hidden === true;
    const forceShow = ALWAYS_SHOW_IDS.includes(feature.id);

    if (!isRequired || (isHidden && !forceShow)) {
      return "";
    }

    const value = formValues[feature.id];
    
    if (value === null || value === "" || value === undefined) {
      return `${feature.title} zorunludur`;
    }
    
    if (Array.isArray(value) && value.length === 0) {
      return `${feature.title} seçilmelidir`;
    }

    return "";
  };

  const validateForm = (): boolean => {
    if (!groups || groups.length === 0) return true;

    const newErrors: Record<number, string> = {};
    let isValid = true;

    for (const group of groups) {
      for (const feature of group.features) {
        const error = validateField(feature);
        if (error) {
          newErrors[feature.id] = error;
          isValid = false;
        }
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    onValidate?.(() => validateForm());
  }, [formValues, groups, onValidate]);

  const handleValueChange = useCallback((featureId: number, value: any) => {
    setFormValues((prev) => ({ ...prev, [featureId]: value }));
    dispatch(setExtraFeature({ id: featureId, value }));
    
    setTouched((prev) => ({ ...prev, [featureId]: true }));
    
    if (errors[featureId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[featureId];
        return newErrors;
      });
    }
  }, [dispatch, errors]);

  const handleBlur = (featureId: number, feature: FeatureItem) => {
    setTouched((prev) => ({ ...prev, [featureId]: true }));
    
    const error = validateField(feature);
    if (error) {
      setErrors((prev) => ({ ...prev, [featureId]: error }));
    }
  };

  const openSelectModal = (feature: FeatureItem) => {
    const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";
    setActiveFeature(feature);

    if (isMultiple) {
      const currentValue = formValues[feature.id];
      let selections: FeatureOption[] = [];

      if (Array.isArray(currentValue)) {
        selections = currentValue;
      } else if (currentValue && typeof currentValue === "object" && (currentValue.id || currentValue.title)) {
        selections = [currentValue];
      } else if (typeof currentValue === "string" && feature.options) {
        const normalized = normalizeSelectValue(currentValue, feature.options, true);
        selections = Array.isArray(normalized) ? normalized : [];
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

    if (isEmptyValue(value)) {
      return "";
    }

    if (feature.input_type === "select" && feature.options) {
      const normalizedValue = normalizeSelectValue(value, feature.options, isMultiple);
      
      if (isMultiple && Array.isArray(normalizedValue)) {
        const titles = normalizedValue
          .filter(v => !isEmptyValue(v))
          .map((v) => v.title || v.label || "")
          .filter(Boolean);
        return titles.join(", ");
      }
      
      if (!isMultiple && normalizedValue && typeof normalizedValue === "object") {
        return normalizedValue.title || normalizedValue.label || "";
      }
    }

    if (typeof value === "object" && (value.title || value.label)) {
      return value.title || value.label;
    }

    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "number") {
      return String(value);
    }

    return "";
  };

  const getPlaceholder = (title: string, isRequired: boolean, suffix?: string): string => {
    let placeholder = title;
    if (suffix) placeholder += suffix;
    if (isRequired) placeholder += " *";
    return placeholder;
  };

  const getInputValue = (value: any): string => {
    if (value === null || value === undefined || value === "") return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    
    if (typeof value === "object" && !Array.isArray(value)) {
      if (value.title) return value.title;
      if (value.label) return value.label;
      
      if ('min' in value || 'max' in value) {
        return "";
      }
      
      return "";
    }
    
    return "";
  };

  const renderInput = (feature: FeatureItem, isRequired: boolean) => {
    const value = formValues[feature.id];
    const inputValue = getInputValue(value);
    const hasError = touched[feature.id] && errors[feature.id];
    
    const isEmpty = isEmptyValue(value);
    const showRequiredBorder = isRequired && isEmpty;

    switch (feature.input_type) {
      case "text":
        return (
          <View style={[
            styles.inputContainer, 
            disabled && styles.disabledContainer, 
            (hasError || showRequiredBorder) && styles.errorContainer
          ]}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={(text) => handleValueChange(feature.id, text)}
              onBlur={() => handleBlur(feature.id, feature)}
              placeholder={getPlaceholder(feature.title, isRequired)}
              placeholderTextColor="#999"
              editable={!disabled}
            />
          </View>
        );

      case "textarea":
        return (
          <View style={[
            styles.inputContainer, 
            styles.textAreaContainer, 
            disabled && styles.disabledContainer, 
            (hasError || showRequiredBorder) && styles.errorContainer
          ]}>
            <TextInput
              style={[styles.input, styles.textAreaInput]}
              value={inputValue}
              onChangeText={(text) => handleValueChange(feature.id, text)}
              onBlur={() => handleBlur(feature.id, feature)}
              placeholder={getPlaceholder(feature.title, isRequired)}
              placeholderTextColor="#999"
              editable={!disabled}
              multiline
              textAlignVertical="top"
            />
          </View>
        );

      case "number":
        return (
          <View style={[
            styles.inputContainer, 
            disabled && styles.disabledContainer, 
            (hasError || showRequiredBorder) && styles.errorContainer
          ]}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={(text) => handleValueChange(feature.id, text)}
              onBlur={() => handleBlur(feature.id, feature)}
              placeholder={getPlaceholder(feature.title, isRequired)}
              placeholderTextColor="#999"
              keyboardType="numeric"
              editable={!disabled}
            />
          </View>
        );

      case "select":
        const displayText = getDisplayValue(feature);
        const isMultiple = feature.details?.multiple === true || feature.details?.multiple === "true";
        const selectPlaceholder = getPlaceholder(feature.title, isRequired, isMultiple ? " (çoklu)" : "");

        return (
          <TouchableOpacity
            style={[
              styles.inputContainer, 
              disabled && styles.disabledContainer, 
              (hasError || showRequiredBorder) && styles.errorContainer
            ]}
            onPress={() => {
              if (!disabled) {
                openSelectModal(feature);
                setTouched((prev) => ({ ...prev, [feature.id]: true }));
              }
            }}
          >
            <Text
              style={displayText ? styles.selectText : styles.selectPlaceholder}
              numberOfLines={2}
            >
              {displayText || selectPlaceholder}
            </Text>
            <Text style={styles.selectArrow}>▼</Text>
          </TouchableOpacity>
        );

      case "checkbox":
        const isChecked = value !== undefined ? !!value : false;
        return (
          <View style={[
            styles.inputContainer, 
            styles.checkboxWrapper, 
            (hasError || showRequiredBorder) && styles.errorContainer
          ]}>
            <Switch
              value={isChecked}
              onValueChange={(checked) => handleValueChange(feature.id, checked)}
              disabled={disabled}
              trackColor={{ false: "#E0E0E0", true: "#25C5D1" }}
              thumbColor={isChecked ? "#fff" : "#f4f3f4"}
            />
            <Text style={styles.checkboxLabel}>
              {feature.title}{isRequired && <Text style={styles.required}> *</Text>}
            </Text>
          </View>
        );

      case "date":
        return (
          <TouchableOpacity 
            style={[
              styles.inputContainer, 
              disabled && styles.disabledContainer, 
              (hasError || showRequiredBorder) && styles.errorContainer
            ]}
            onPress={() => setTouched((prev) => ({ ...prev, [feature.id]: true }))}
          >
            <Text style={inputValue ? styles.selectText : styles.selectPlaceholder}>
              {inputValue || getPlaceholder(feature.title, isRequired)}
            </Text>
            <Text style={styles.selectArrow}>📅</Text>
          </TouchableOpacity>
        );

      case "file":
        const fileName = (typeof value === "object" && value?.name) ? value.name : "";
        return (
          <TouchableOpacity 
            style={[
              styles.inputContainer, 
              disabled && styles.disabledContainer, 
              (hasError || showRequiredBorder) && styles.errorContainer
            ]}
            onPress={() => setTouched((prev) => ({ ...prev, [feature.id]: true }))}
          >
            <Text style={fileName ? styles.selectText : styles.selectPlaceholder}>
              {fileName || getPlaceholder("Dosya Seç", isRequired)}
            </Text>
            <Text style={styles.selectArrow}>📁</Text>
          </TouchableOpacity>
        );

      default:
        return (
          <View style={[
            styles.inputContainer, 
            disabled && styles.disabledContainer, 
            (hasError || showRequiredBorder) && styles.errorContainer
          ]}>
            <TextInput
              style={styles.input}
              value={inputValue}
              onChangeText={(text) => handleValueChange(feature.id, text)}
              onBlur={() => handleBlur(feature.id, feature)}
              placeholder={getPlaceholder(feature.title, isRequired)}
              placeholderTextColor="#999"
              editable={!disabled}
            />
          </View>
        );
    }
  };

  const renderFeatureItem = (feature: FeatureItem, featureIndex: number) => {
    const isHidden = feature.details?.is_hidden === "1" || feature.details?.is_hidden === true;
    const forceShow = ALWAYS_SHOW_IDS.includes(feature.id);

    if (isHidden && !forceShow) {
      return null;
    }

    const isRequired = feature.details?.required === true || feature.details?.required === "true";
    const hasError = touched[feature.id] && errors[feature.id];

    return (
      <View key={`feature-${feature.id}-${featureIndex}`} style={styles.featureContainer}>
        {renderInput(feature, isRequired)}
        {hasError && (
          <Text style={styles.errorText}>{errors[feature.id]}</Text>
        )}
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
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Özellik bulunamadı</Text>
      </View>
    );
  }

  const isMultiple = activeFeature?.details?.multiple === true || activeFeature?.details?.multiple === "true";

  return (
    <ScrollView ref={scrollViewRef} style={styles.container}>
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
                  if (currentVal && typeof currentVal === "object") {
                    isSelected = currentVal.id === item.id;
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    color: "#666",
    fontSize: 14,
  },
  groupContainer: {
    marginBottom: 16,
  },
  groupTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#25C5D1",
    marginBottom: 12,
  },
  featureContainer: {
    marginBottom: 10,
  },
  required: {
    color: "#FF6B6B",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
  },
  errorContainer: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#333",
    paddingVertical: 0,
  },
  textAreaContainer: {
    height: 100,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  textAreaInput: {
    height: 76,
    textAlignVertical: "top",
  },
  disabledContainer: {
    backgroundColor: "#F9F9F9",
    opacity: 0.7,
  },
  selectText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  selectPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: "#999",
  },
  selectArrow: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
  },
  checkboxWrapper: {
    justifyContent: "flex-start",
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 15,
    color: "#333",
  },
  modal: {
    margin: 0,
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
    textAlign: "center",
  },
  multipleHint: {
    fontSize: 12,
    fontWeight: "400",
    color: "#25C5D1",
  },
  optionsList: {
    maxHeight: 320,
  },
  optionItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
    alignItems: "center",
  },
  optionItemSelected: {
    backgroundColor: "#E8F8F9",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#25C5D1",
    borderColor: "#25C5D1",
  },
  checkmark: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  optionText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  optionTextSelected: {
    color: "#25C5D1",
    fontWeight: "600",
  },
  noOptionsText: {
    textAlign: "center",
    color: "#999",
    padding: 20,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#25C5D1",
    borderRadius: 10,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  closeButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonSmall: {
    flex: 0.5,
  },
  closeButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
});