import React from "react";
import {
    Text,
    StyleSheet,
    Image,
    View,
    TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";




type FirstCardProps = {
    title: string;
    updated_at?: string;
    price: string;
    image: string;
    videos: [];
   
    prices?: 
       { primary:{
            formatted: string;
        },
        secondary:{
            formatted: string;
        }
    }
    tag?: string | null;
    company?: {
        title: string;
        logo: string;
    };
    type?: string;
    city?: string;
    district?: string;
     map?: {
        latitude: string,
        longitude: string,
     };
 
    onPress?: () => void;


};

const FirstCard: React.FC<FirstCardProps> = ({ title, image, price ,prices, company, type, city, district,  updated_at, onPress}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <View style={styles.inner}>
                <Image source={{ uri: image }} style={styles.image} />

                <View style={styles.textContainer}>
                    <Text numberOfLines={2} style={styles.title}>
                        {title}    </Text>

                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     
                        <Ionicons name="business" color={'#a6a6a6'} size={11} />
                        <Text  style={styles.company}> Hazır </Text>

                         <Ionicons name="menu" color={'#a6a6a6'} size={11} />
                        {type && (


                            <Text style={styles.company}>  {type}</Text>
                        )}
                       

                    </View>
                       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                     
                        <Ionicons name="location" color={'#a6a6a6'} size={11} />
                

                        
                        {(city || district) && (


                            <Text style={styles.company}>  
                            {city}/ {city && district ? '/': ''} {district}</Text>
                        )}

<View>
                         {updated_at && (


                        <Text style={styles.company}>{updated_at}</Text>
                    )}
                    </View>

                       

                    </View>

                    
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="person" color={'#a6a6a6'} size={11} />
                        {company && (


                            <Text style={styles.company}> {company?.title}</Text>
                        )}
                        
                       

                    </View>


                         {price && (


                        <Text style={styles.price}>{price}</Text>
                    )}
                    {prices && (


                        <Text style={styles.price}>{prices?.primary?.formatted}</Text>
                    )}

                    

                </View>
            </View>
        </TouchableOpacity>
    );
};

export default FirstCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        overflow: "hidden",
        marginHorizontal: 8,
        marginVertical: 2,
        elevation: 3,
        width: 350,
        alignSelf: "center",
        height: 150,
         borderColor: "#e5e5e5",
    borderWidth: 1,
    },
    inner: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
       
        borderColor: '#727272ff'
    },
    image: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginRight: 12,
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
    price: {
        color: '#F9C43E',
        fontSize: 22,
        fontWeight: '800',


    },
    company: {
        fontSize: 9.5,
        color: '#a6a6a6',
        margin: 2.8

    }
});