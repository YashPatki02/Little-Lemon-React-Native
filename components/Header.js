import React from "react";
import { Pressable, StyleSheet, View, Text, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default Header = () => {
    const navigation = useNavigation();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");

    const getProfilePicture = async () => {
        try {
            const value = await AsyncStorage.getItem("image");
            const name = await AsyncStorage.getItem("name");

            if (value === null) {
                setImage(null);
                setName(name);
            } else if (value !== null) {
                setImage(value);
                setName(name);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getProfilePicture();
    }, [image, name]);

    const getInitials = (name) => {
        return name[0]
    };

    return (
        <Pressable
            style={styles.container}
            onPress={() => {
                navigation.navigate("Profile", { name });
            }}
        >
            {image !== null ? (
                <Image
                    source={{ uri: image }}
                    style={styles.logo}
                    resizeMode="contain"
                />
            ) : (
                <View style={styles.initialsContainer}>
                    <Text style={styles.initialsText}>{getInitials(name)}</Text>
                </View>
            )}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 10,
        marginTop: -5,
    },
    logo: {
        width: 30,
        height: 30,
        borderRadius: 50,
    },
    initialsContainer: {
        width: 30,
        height: 30,
        borderRadius: 50,
        backgroundColor: "#495E57",
        justifyContent: "center",
        alignItems: "center",
    },
    initialsText: {
        fontSize: 10,
        color: "#fff",
    },
});
