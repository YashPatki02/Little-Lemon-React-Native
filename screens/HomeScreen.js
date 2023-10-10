import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

import Button from "../components/Button";

export default function HomeScreen({ navigation }) {
    const [name, onNameChange] = useState("");
    const [email, onEmailChange] = useState("");

    useEffect(() => {
        const loadUserDataFromStorage = async () => {
            try {
                const userDataString = await AsyncStorage.getItem("userData");
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);

                    onNameChange(userData.name);
                    onEmailChange(userData.email);
                }
            } catch (error) {
                console.error("Error loading user data: ", error);
            }
        };

        loadUserDataFromStorage();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.heroContainer}>
                <Text style={styles.mainHeader}>Little Lemon</Text>
                <Text style={styles.subHeader}>Chicago</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>
                        We are a family owned Mediterranean restaurant focused
                        on traditional recipes served with a modern twist.
                    </Text>
                    <Image
                        source={require("../assets/images/Logo.png")}
                        resizeMode="contain"
                        style={styles.heroImage}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    heroContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    mainHeader: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 20,
    },
    subHeader: {
        fontSize: 20,
        textAlign: "center",
        marginBottom: 20,
    },
    text: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 20,
    },
    heroImage: {
        width: 300,
        height: 300,
        borderRadius: 75,
        marginBottom: 20,
        borderColor: "#495E57",
        borderWidth: 1,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
