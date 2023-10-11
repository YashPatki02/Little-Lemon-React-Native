import { View, Text, StyleSheet, Image, TextInput, Alert } from "react-native";
import React, { useEffect, useState } from "react";

import Button from "../components/Button";

export default function OnboardingScreen({ navigation }) {
    const [name, onNameChange] = useState("");
    const [email, onEmailChange] = useState("");

    const [buttonDisabled, setButtonDisabled] = useState(true);

    useEffect(() => {
        if (name && email && email.includes("@") && email.includes(".com") && email.length > 5) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [name, email]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require("../assets/images/Logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text
                    style={{
                        ...styles.text,
                        fontWeight: "bold",
                        marginBottom: 20,
                    }}
                >
                    {" "}
                    Welcome to Little Lemon!{" "}
                </Text>
                <Text style={{ ...styles.text, marginBottom: 20 }}>
                    Let us get to know you first!
                </Text>
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.text}>Full Name</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onNameChange}
                    value={name}
                />
                <Text style={styles.text}>Email</Text>
                <TextInput
                    style={styles.input}
                    onChangeText={onEmailChange}
                    value={email}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button
                    title="Next"
                    onPress={() => {
                        navigation.navigate("Profile", { name, email });
                        onNameChange("");
                        onEmailChange("");
                    }}
                    disabled={buttonDisabled}
                    style={{ backgroundColor: "#495E57" }}
                    textStyles={{
                        fontSize: 20,
                        color: "#fff",
                        textAlign: "center",
                    }}
                />
                {buttonDisabled && <Text style={styles.error}>
                    Please enter a valid name and email address.
                </Text>}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    logoContainer: {
        flex: 0.4,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 200,
        height: 200,
    },
    formContainer: {
        flex: 0.6,
        padding: 20,
    },
    text: {
        fontSize: 20,
        textAlign: "center",
        paddingHorizontal: 40,
    },
    input: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 10,
        paddingHorizontal: 10,
        width: 250,
    },
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 120,
    },
    error: {
        color: "gray",
        fontSize: 12,
        textAlign: "center",
        paddingHorizontal: 40,
    }
});
