import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import { useAppDispatch, useAppSelector } from "../../redux/Hooks";
import TextInputUser from "../../components/TextInput/TextInputUser";
import { ProfileButton } from "../../components/Buttons/profileButton";
import {
  getCreatePriceOffer,
  getProperties,
  getSentOffers,
} from "../../../api";
import { resetCreateOffer } from "../../redux/Slice/CreateOffersSlice";
import { getPropertyById } from "../../../api/CreateThunk";

type Props = {
  visible: boolean;
  propertyId: number;
  onClose: () => void;
};

const CreateOfferModal: React.FC<Props> = ({
  visible,
  propertyId,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");

  const { property, loading } = useAppSelector(
    (state) => state.properties
  );

  const {
    loadingCreateOffer,
    errorCreateOffer,
    createOfferData,
  } = useAppSelector((state) => state.createOffers);

  useEffect(() => {
    if (visible && propertyId) {
      dispatch(getPropertyById(propertyId));
    }
  }, [visible, propertyId]);

  const handleSubmit = async () => {
    if (!price) return;

    const result = await dispatch(
      getCreatePriceOffer({
        property_id: propertyId,
        price: Number(price),
        notes: notes?.trim() || undefined,
      })
    );

    console.log("propertyId:", propertyId);
    console.log("Teklif sonucu:", result);

    if (getCreatePriceOffer.fulfilled.match(result)) {
      const offersResult = await dispatch(getSentOffers(propertyId));
      console.log("🔹 getSentOffers sonucu:", offersResult);
      
      dispatch(resetCreateOffer());
      setPrice("");
      setNotes("");
      onClose();
    }
  };

  const handleClose = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleClose}
      style={styles.bottomModal}
      avoidKeyboard
      useNativeDriver={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalContent}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
              bounces={false}
            >
              <Text style={styles.title}>Talep Oluştur</Text>

              {loading ? (
                <ActivityIndicator color="#25C5D1" />
              ) : (
                <>
                  <View style={styles.priceRow}>
                    <Text style={styles.label}>Satış Fiyatı</Text>
                    <Text style={styles.value}>
                      {property?.prices?.primary?.formatted}
                    </Text>
                  </View>

                  <View style={styles.priceRow}>
                    <Text style={styles.label}>Pass Fiyatı</Text>
                    <Text style={styles.value}>
                      {property?.prices?.secondary?.formatted}
                    </Text>
                  </View>
                </>
              )}

              <TextInputUser
                placeholder="Talep ettiğiniz fiyat"
                value={price}
                keyboardType="numeric"
                onChangeText={setPrice}
                containerStyle={{ marginTop: 12 }}
       
                blurOnSubmit={false}
              />

              <TextInputUser
                placeholder="Notunuz"
                value={notes}
                multiline
                onChangeText={setNotes}
                containerStyle={{ marginTop: 12 }}
                returnKeyType="done"
                onSubmitEditing={handleSubmit}
              />

              {errorCreateOffer && (
                <Text style={styles.error}>{errorCreateOffer}</Text>
              )}

              {loadingCreateOffer ? (
                <ActivityIndicator style={{ marginTop: 16 }} />
              ) : (
                <ProfileButton
                  label="Gönder"
                  height={42}
                  marginTop={16}
                  bg="#25C5D1"
                  color="#fff"
                  onPress={handleSubmit}
                />
              )}
            </ScrollView>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateOfferModal;

const styles = StyleSheet.create({
  bottomModal: { justifyContent: "flex-end", margin: 0 },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    maxHeight: "80%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#25C5D1",
    textAlign: "center",
    marginBottom: 16,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  label: { color: "#999", fontSize: 14 },
  value: { fontSize: 16, fontWeight: "700", color: "#F9C43E" },
  error: { color: "red", textAlign: "center", marginTop: 8 },
});