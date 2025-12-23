import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet
} from "react-native";
import Modal from "react-native-modal";

type Option = {
  id: number;
  title: string;
};

type Props = {
  isVisible: boolean;
  onClose: () => void;
  options: Option[];
  loading?: boolean;
  onSelect: (value: Option) => void;
};

const ChildrenModal: React.FC<Props> = ({
  isVisible,
  onClose,
  options,
  loading = false,
  onSelect,
}) => {
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Oda Sayısı Seç</Text>

        {loading ? (
          <ActivityIndicator size="small" color="#00A7C0" />
        ) : (
          <FlatList
            data={options}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.itemText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}

        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>İptal</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default ChildrenModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "70%",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#00A7C0",
  },
  item: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
  cancelButton: {
    marginTop: 15,
    paddingVertical: 12,
    backgroundColor: "#29c5d3",
    borderRadius: 8,
  },
  cancelText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
  },
});
