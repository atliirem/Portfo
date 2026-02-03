import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";


interface BannerDetailProps {
  id: number;
  isDraft?: boolean;
}

export const BannerDetail: React.FC<BannerDetailProps> = ({ id, isDraft = false }) => {
  const { groups, loading, propertyId } = useSelector(
    (state: RootState) => state.features.detail
  );

  const [activeTab, setActiveTab] = useState(0);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<number>>(new Set());

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#25C5D1" />
      </View>
    );
  }

  if (propertyId !== id) {
    return null;
  }

  if (!groups || groups.length === 0) {
    return null;
  }

  const formatValue = (feature: any): string => {
    const { value, input_type } = feature;

    if (value === null || value === undefined || value === "") {
      return "-";
    }

    if (input_type === "file") {
      if (Array.isArray(value)) {
        return value.map((f) => f.name).join(", ");
      }
      if (typeof value === "object" && value.name) {
        return value.name;
      }
      return "-";
    }

    if (typeof value === "object" && value.min !== undefined) {
      if (value.min === value.max) {
        return String(value.min);
      }
      return `${value.min} - ${value.max}`;
    }

    if (typeof value === "object" && value.title) {
      return value.title;
    }

    if (Array.isArray(value)) {
      return value
        .map((v) => (typeof v === "object" ? v.title || v.name : v))
        .filter(Boolean)
        .join(", ");
    }

    return String(value);
  };

  const shouldShowFeature = (feature: any): boolean => {
    if (feature.details?.is_hidden === "1" || feature.details?.is_hidden === true) {
      return false;
    }
    if (feature.value === null || feature.value === undefined || feature.value === "") {
      return false;
    }
    return true;
  };

  const toggleExpand = (featureId: number) => {
    setExpandedFeatures(prev => {
      const newSet = new Set(prev);
      if (newSet.has(featureId)) {
        newSet.delete(featureId);
      } else {
        newSet.add(featureId);
      }
      return newSet;
    });
  };

  const activeGroup = groups[activeTab];
  const visibleFeatures = activeGroup?.features.filter(shouldShowFeature) || [];

  return (
    <View style={styles.container}>
   
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabScrollView}
        contentContainerStyle={styles.tabContainer}
      >
        {groups.map((group, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.tab, activeTab === index && styles.activeTab]}
            onPress={() => setActiveTab(index)}
          >
            <Text style={[styles.tabText, activeTab === index && styles.activeTabText]}>
              {group.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

     
      {!isDraft && (
        <View style={styles.featureList}>
          {visibleFeatures.map((feature, index) => {
            const isExpanded = expandedFeatures.has(feature.id);
            const valueText = formatValue(feature);
            
            return (
              <TouchableOpacity
                key={feature.id}
                style={[
                  styles.featureRow,
                  index % 2 === 0 && styles.featureRowAlt,
                ]}
                onPress={() => toggleExpand(feature.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text 
                  style={[
                    styles.featureValue,
                    isExpanded && styles.featureValueExpanded
                  ]} 
                  numberOfLines={isExpanded ? undefined : 2}
                >
                  {valueText}
                </Text>
              </TouchableOpacity>
            );
          })}

          {visibleFeatures.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bu kategoride bilgi bulunmuyor</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  tabScrollView: {
    marginBottom: 8,
  },
  tabContainer: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeTab: {
    backgroundColor: "#fff",
    borderColor: "#333",
    borderWidth: 0.6  ,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  featureList: {
    borderRadius: 8,
    overflow: "hidden",
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  featureRowAlt: {
    backgroundColor: "#f8f8f8",
  },
  featureTitle: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  featureValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    textAlign: "right",
    maxWidth: "50%",
  },
  featureValueExpanded: {
    maxWidth: "60%",
  },
  emptyContainer: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#999",
    fontSize: 14,
  },
});