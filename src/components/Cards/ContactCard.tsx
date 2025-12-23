import React from "react";
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { ProfileButton } from "../Buttons/profileButton";

type ContactCardProps = {
    id: number;
    image: string;
    title: string;
    created_at: string;
    status: {
        key: string;
        title: string;
    };
    company: {
        personal: string;
    };
    onPress?: () => void;
};

const OffersCard: React.FC<ContactCardProps> = ({ title, id, created_at, status, company, onPress }) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.inner}>
                <View style={styles.textContainer}>
                    <Text numberOfLines={2} style={styles.title}>
                        {title}
                    </Text>
                      <View style={styles.row}>
                      
                        {company && (
                            <Text style={styles.companyPerson}>  {company.personal}</Text>
                        )}
                    </View>

                    <View style={styles.row}>
                       
                       <Text style={styles.dateText}> Oluşturulma Tarihi:</Text>
                        {created_at && (
                            <Text style={styles.company}>   {created_at}</Text>
                        )}
                    </View>

                    <View style={styles.row}>
                     
                     
                        {status && (
                           <ProfileButton label={status.title} marginTop={0} bg="#25C5D1" width={80} color="white" height={23} />
                        )}
                      
                    </View>

                
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default OffersCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginHorizontal: 8,
        marginVertical: 2,
        elevation: 3,
        width: 365,
        alignSelf: "center",
        height: 0,
        borderColor: "#e5e5e5",
        borderWidth: 1,
       
    },
    inner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    company: {
        fontSize: 12,
        color: '#a6a6a6',
        marginLeft: 4,
        fontWeight: '600',
        marginBottom: 10
    },
     companyPerson: {
        fontSize: 15,
        color: '#000000ff',
        marginLeft: 4,
        fontWeight: '700',
        marginTop: -20
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    dateText:{
        color: '#c4c4c4',
        fontWeight: '800',
        marginLeft: 7

    }
});