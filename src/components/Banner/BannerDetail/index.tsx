import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/Hooks";
import { getPropertyFeatures } from "../../../../api";

export const BannerDetail = ({ id }: { id: number }) => {
  const dispatch = useAppDispatch();
  const { titles, groups, loading } = useAppSelector(
    (state) => state.features
  );

  const [selectedTitle, setSelectedTitle] = useState<string>("");

  useEffect(() => {
    dispatch(getPropertyFeatures(id));
  }, [id]);

  useEffect(() => {
    if (titles.length > 0) {
      setSelectedTitle(titles[0]);
    }
  }, [titles]);

  if (loading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#1a8b95" />
      </View>
    );
  }

  if (!titles || titles.length === 0) {
    return (
      <Text style={{ padding: 12, color: "#333" }}>
        Başlık bulunamadı.
      </Text>
    );
  }

  const selectedGroup = groups.find((g) => g.title === selectedTitle);

  return (
    <View>
    
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ padding: 10 }}
      >
        {titles.map((item: string, index: number) => {
          const isSelected = selectedTitle === item;

          return (
            <TouchableOpacity
              key={index}
              onPress={() => setSelectedTitle(item)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: isSelected ? "#fff" : "#eaebec",
                marginRight: 10,
                minHeight: 52,
                marginTop: -10,
                left: -10,
                justifyContent: "center",
                borderColor: isSelected ? "#000" : "#fff",
                borderWidth: 0.6,
              }}
            >
              <Text
                style={{
                  color: isSelected ? "black" : "#707171",
                  fontWeight: "500",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>


      <View style={{ paddingHorizontal: 16, paddingTop: 6 }}>
        {selectedGroup?.features?.map((feat) => (
          <View
            key={feat.id}
            style={{
              paddingVertical: 10,
              borderBottomWidth: 0.4,
              borderColor: "#ccc",
            }}
          >
         
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#222",
                  fontWeight: "600",
                }}
              >
                {feat.title}
              </Text>

              <Text style={{ fontSize: 14, color: "#555" }}>
                {typeof feat.value === "object" || Array.isArray(feat.value)
                  ? "-"
                  : feat.value ?? "-"}
              </Text>
            </View>


            {feat.childrens?.length > 0 &&
              feat.childrens.map((child) => (
                <View key={child.id} style={{ marginTop: 10, marginLeft: 10 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#333",
                    }}
                  >
                    {child.title}
                  </Text>

                 
                  {child.options?.map((opt) => (
                    <Text
                      key={opt.id}
                      style={{
                        fontSize: 13,
                        color: "#555",
                        marginLeft: 12,
                        marginTop: 2,
                      }}
                    >
                      - {opt.title}
                    </Text>
                  ))}
                </View>
              ))}
          </View>
        ))}
      </View>
    </View>
  );
};
