import React from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Image
} from "react-native";
import { ProfileButton } from "../Buttons/profileButton";

type MyOffersCardProps = {
    id: number;
    property: {
        cover: string;
        title: string;
        primary: { formatted: string };
        secondary: { formatted: string };
        code?: string,
    };
    created_at: string;
    status: {
        key: string;
        title: string;
    };
    company: {
        personal: string;
    };
    offered_price?: {
        formatted: string;
    };
    onPress?: () => void;
};

const MyOffersCard: React.FC<MyOffersCardProps> = ({
    created_at,
    property,
    status,
    offered_price,
    onPress
}) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={onPress}
        >
            <View style={styles.inner}>
                <Image style={styles.image} source={{ uri: property.cover }} />

                <View style={styles.infoContainer}>

                    <View style={styles.headerRow}>
                        <Text numberOfLines={1} style={styles.title}>{property.title}</Text>
                        <View style={{ marginLeft: -10 }}>
                            {status && (
                                <ProfileButton
                                    label={status.title}
                                    marginTop={0}

                                    bg={
                                        status.key === "confirm"
                                            ? "#4CAF50"
                                            : status.key === "reject"
                                                ? "#E53935"
                                                : "#25C5D1"
                                    }

                                    width={98}
                                    color="white"
                                    height={23}
                                />

                            )}
                        </View>
                    </View>


                    <View style={styles.priceRow}>
                        <Text style={styles.text}>Teklif Edilen:</Text>
                        <Text style={styles.price}>{offered_price?.formatted || property.primary.formatted}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.text}>Pass Fiyat:</Text>
                        <Text style={styles.price}>{property.secondary.formatted}</Text>
                    </View>
                    {created_at && (
                        <Text style={styles.created_At}> Oluşturulma Tarihi:  {created_at}</Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default MyOffersCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 6,
        elevation: 3,
        width: '95%',
        alignSelf: "center",
        borderColor: "#e5e5e5",
        borderWidth: 1,
    },
    inner: {
        flexDirection: "row",
        padding: 10,
    },
    image: {
        width: 140,
        height: 140,
        borderRadius: 10,
        marginRight: 12,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "center",
    },
    headerRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginBottom: 6,

    },
    title: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        flex: 1,
        marginRight: 10,
        marginBottom: 6
    },
    priceRow: {
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        marginTop: 2,
    },
    text: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    created_At: {
        fontSize: 10,
        color: '#666',
        fontWeight: '400',
    },
    price: {
        color: '#F9C43E',
        fontWeight: '800',
        fontSize: 18,

    },
});