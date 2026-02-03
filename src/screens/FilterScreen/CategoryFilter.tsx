import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Modal from "react-native-modal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import { getTypes } from "../../../api";
import { setSelectedTypes, clearSelectedTypes } from "../../redux/Slice/typesSlice";

const { height: screenHeight } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  isVisible: boolean;
  onClose: () => void;
};

const CategoryFilterModal: React.FC<Props> = ({ isVisible, onClose }) => {
  const dispatch = useAppDispatch();
  const { titles, loading, error, selectedTypes } = useAppSelector((state) => state.types);


  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [expandedParents, setExpandedParents] = useState<string[]>([]);

  useEffect(() => {
    if (isVisible) {
      setSelectedIds(selectedTypes || []);
      
      const parentsToExpand = titles
        .filter((item) => item.parent && selectedTypes?.includes(item.id))
        .map((item) => item.parent as string);
      setExpandedParents([...new Set(parentsToExpand)]);
    }
  }, [isVisible, selectedTypes, titles]);

  useEffect(() => {
    if (titles.length === 0) {
      dispatch(getTypes());
    }
  }, [dispatch, titles.length]);

  
  const groupedCategories = React.useMemo(() => {
    const parents = titles.filter((item) => !item.parent);
    const children: Record<string, typeof titles> = {};

    titles.forEach((item) => {
      if (item.parent) {
        if (!children[item.parent]) {
          children[item.parent] = [];
        }
        children[item.parent].push(item);
      }
    });

    return { parents, children };
  }, [titles]);

  const toggleExpand = (parentLabel: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedParents((prev) =>
      prev.includes(parentLabel)
        ? prev.filter((x) => x!== parentLabel)
        : [...prev, parentLabel]
    );
  };

  
  const toggleCategory = (id: number, isParent: boolean) => {
    if (isParent) {
      const item = titles.find((t) => t.id === id);
      if (!item) return;

      const childIds = groupedCategories.children[item.label]?.map((c) => c.id) || [];
      const allIds = [id, ...childIds];
      const allSelected = allIds.every((i) => selectedIds.includes(i));

      if (allSelected) {
        setSelectedIds((prev) => prev.filter((i) => !allIds.includes(i)));
      } else {
        setSelectedIds((prev) => [...new Set([...prev, ...allIds])]);
      }
    } else {
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    }
  };

  const handleClearCategories = () => {
    setSelectedIds([]);
    dispatch(clearSelectedTypes());
  };

  const handleApplyCategories = () => {
    console.log(" Selected Category IDs:", selectedIds);
    dispatch(setSelectedTypes(selectedIds));
    onClose();
  };

  const hasSelection = selectedIds.length > 0;

  const isParentChecked = (parentId: number, parentLabel: string) => {
    const childIds = groupedCategories.children[parentLabel]?.map((c) => c.id) || [];
    if (childIds.length === 0) {
      return selectedIds.includes(parentId);
    }
    return [parentId, ...childIds].every((i) => selectedIds.includes(i));
  };

  const isParentIndeterminate = (parentLabel: string) => {
    const childIds = groupedCategories.children[parentLabel]?.map((c) => c.id) || [];
    if (childIds.length === 0) return false;
    const selectedCount = childIds.filter((i) => selectedIds.includes(i)).length;
    return selectedCount > 0 && selectedCount < childIds.length;
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

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#00A7C0" />
            <Text style={styles.loadingText}>Kategoriler yükleniyor...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => dispatch(getTypes())}>
              <Text style={styles.retryText}>Tekrar Dene</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {groupedCategories.parents.map((parent, index) => {
              const hasChildren = groupedCategories.children[parent.label]?.length > 0;
              const isExpanded = expandedParents.includes(parent.label);
              const isChecked = isParentChecked(parent.id, parent.label);
              const isIndeterminate = isParentIndeterminate(parent.label);

              return (
                <View key={parent.id}>
                
                  <View style={styles.parentRow}>
                    <BouncyCheckbox
                      size={24}
                      fillColor="#00A7C0"
                      unfillColor="#FFFFFF"
                      isChecked={isChecked}
                      iconStyle={[styles.checkboxIcon, isIndeterminate && styles.indeterminateIcon]}
                      innerIconStyle={styles.checkboxInnerIcon}
                      onPress={() => toggleCategory(parent.id, true)}
                      disableBuiltInState
                    />
                    <TouchableOpacity
                      style={styles.parentLabelContainer}
                      onPress={() => hasChildren && toggleExpand(parent.label)}
                      activeOpacity={hasChildren ? 0.7 : 1}
                    >
                      <Text style={[styles.parentText, isChecked && styles.checkedText]}>
                        {parent.label}
                      </Text>
                      {hasChildren && (
                        <Ionicons
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={20}
                          color="#666"
                        />
                      )}
                    </TouchableOpacity>
                  </View>

                 
                  {hasChildren && isExpanded && (
                    <View style={styles.childrenContainer}>
                      {groupedCategories.children[parent.label].map((child) => (
                        <View key={child.id} style={styles.childRow}>
                          <BouncyCheckbox
                            size={22}
                            fillColor="#00A7C0"
                            unfillColor="#FFFFFF"
                            text={child.label}
                            isChecked={selectedIds.includes(child.id)}
                            iconStyle={styles.checkboxIcon}
                            innerIconStyle={styles.checkboxInnerIcon}
                            textStyle={[
                              styles.childText,
                              selectedIds.includes(child.id) && styles.checkedText,
                            ]}
                            onPress={() => toggleCategory(child.id, false)}
                            disableBuiltInState
                          />
                        </View>
                      ))}
                    </View>
                  )}

                  {index < groupedCategories.parents.length - 1 && <View style={styles.separator} />}
                </View>
              );
            })}
          </ScrollView>
        )}


        <View style={styles.buttons}>
          <TouchableOpacity
            style={[styles.clearButton, !hasSelection && styles.disabledButton]}
            onPress={handleClearCategories}
            disabled={!hasSelection}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Temizle</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.applyButton} onPress={handleApplyCategories} activeOpacity={0.7}>
            <Text style={styles.buttonText}>Uygula</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryFilterModal;

const styles = StyleSheet.create({
  modal: { margin: 0, justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    maxHeight: screenHeight * 0.65,
  },
  dragIndicator: { width: 40, height: 4, backgroundColor: "#DDD", borderRadius: 2, alignSelf: "center", marginBottom: 12 },
  title: { textAlign: "center", fontSize: 18, fontWeight: "700", color: "#00A7C0", marginBottom: 16 },
  scrollContent: { paddingBottom: 8 },
  parentRow: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  parentLabelContainer: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginLeft: 8 },
  parentText: { fontSize: 16, fontWeight: "600", color: "#333" },
  childrenContainer: { backgroundColor: "#F8F9FA", borderRadius: 10, marginLeft: 32, marginBottom: 8, paddingVertical: 4 },
  childRow: { paddingVertical: 10, paddingHorizontal: 12 },
  childText: { fontSize: 14, color: "#555", textDecorationLine: "none" },
  checkboxIcon: { borderColor: "#00A7C0", borderRadius: 6 },
  checkboxInnerIcon: { borderWidth: 2, borderRadius: 6 },
  indeterminateIcon: { backgroundColor: "#00A7C0", opacity: 0.5 },
  checkedText: { color: "#00A7C0", fontWeight: "600" },
  separator: { height: 1, backgroundColor: "#F0F0F0" },
  loaderContainer: { alignItems: "center", paddingVertical: 40 },
  loadingText: { marginTop: 12, color: "#999", fontSize: 14 },
  errorContainer: { alignItems: "center", paddingVertical: 30 },
  errorText: { color: "#FF4444", fontSize: 14, marginBottom: 12, textAlign: "center" },
  retryButton: { paddingVertical: 10, paddingHorizontal: 20, backgroundColor: "#F0F0F0", borderRadius: 8 },
  retryText: { color: "#00A7C0", fontWeight: "600" },
  buttons: { flexDirection: "row", marginTop: 16, gap: 12 },
  clearButton: { flex: 1, paddingVertical: 14, backgroundColor: "#B0B0B0", borderRadius: 10, alignItems: "center" },
  applyButton: { flex: 1, paddingVertical: 14, backgroundColor: "#00A7C0", borderRadius: 10, alignItems: "center" },
  disabledButton: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});