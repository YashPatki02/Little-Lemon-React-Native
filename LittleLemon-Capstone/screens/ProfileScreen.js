import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Button from "../components/Button";
import { useState, useEffect } from "react";
import { CheckBox } from "react-native-elements";
import * as ImagePicker from "expo-image-picker";
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
    const route = useRoute();

    const [name, onNameChange] = useState(route.params.name);
    const [email, onEmailChange] = useState(route.params.email);
    const [phone, onPhoneChange] = useState("");

    const [orderStatus, setOrderStatus] = useState(false);
    const [passwordChange, setPasswordChange] = useState(false);
    const [specialOffers, setSpecialOffers] = useState(false);
    const [newsletter, setNewsletter] = useState(false);

    const [image, setImage] = useState(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        } else {
            setImage(null);
        }
    };

    const toggleCheckbox = (name) => {
        switch (name) {
            case "orderStatus":
                setOrderStatus((prevStatus) => !prevStatus);
                break;
            case "passwordChange":
                setPasswordChange((prevStatus) => !prevStatus);
                break;
            case "specialOffers":
                setSpecialOffers((prevStatus) => !prevStatus);
                break;
            case "newsletter":
                setNewsletter((prevStatus) => !prevStatus);
                break;
        }
    };

    const getInitials = (name) => {
        const names = name.split(" ");

        if (names.length === 1 || names[1].length === 0) {
            return names[0][0];
        }

        let initials = "";
        names.forEach((name) => {
            initials += name[0];
        });
        return initials.toUpperCase();
    }

    const saveUserDataToStorage = async () => {
        try {
            const userData = {
                name,
                email,
                phone,
                image,
                orderStatus,
                passwordChange,
                specialOffers,
                newsletter,
            };
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
        } catch (error) {
            console.error("Error saving user data: ", error);
        }
    };

    useEffect(() => {
        const loadUserDataFromStorage = async () => {
            try {
                const userDataString = await AsyncStorage.getItem("userData");
                if (userDataString !== null) {
                    const userData = JSON.parse(userDataString);

                    onNameChange(userData.name);
                    onEmailChange(userData.email);
                    onPhoneChange(userData.phone);
                    setImage(userData.image);
                    setOrderStatus(userData.orderStatus);
                    setPasswordChange(userData.passwordChange);
                    setSpecialOffers(userData.specialOffers);
                    setNewsletter(userData.newsletter);
                }
            } catch (error) {
                console.error("Error loading user data: ", error);
            }
        };

        loadUserDataFromStorage();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Personal Information</Text>

            <View style={styles.profileContainer}>
                <View style={styles.profileImage}>
                    {image ? (
                        <Image
                            source={{ uri: image }}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.initialsContainer}>
                            <Text style={styles.initialsText}>
                                {getInitials(name)}
                            </Text>
                        </View>
                    )}
                </View>
                <Button
                    title="Change"
                    onPress={() => {
                        pickImage();
                    }}
                    style={{ backgroundColor: "#495E57", width: 100 }}
                    textStyles={{
                        color: "#fff",
                    }}
                />
                <Button
                    title="Remove"
                    onPress={() => {
                        setImage(null);
                    }}
                    style={{
                        width: 100,
                        borderColor: "#495E57",
                        borderWidth: 1,
                        borderRadius: 0,
                        backgroundColor: "#fff",
                    }}
                    textStyles={{
                        color: "#495E57",
                    }}
                />
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.text}>Name:</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={onNameChange}
                />
                <Text style={styles.text}>Email:</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={onEmailChange}
                />
                <Text style={styles.text}>Phone Number:</Text>
                <MaskedTextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={(text, rawText) => {
                        onPhoneChange(rawText);
                    }}
                    mask="(999) 999-9999"
                    keyboardType="numeric"
                />
            </View>

            <View style={styles.notifications}>
                <Text style={styles.text}>Email Notifications</Text>

                <View style={styles.notificationContainer}>
                    <View style={styles.checkbox}>
                        <CheckBox
                            title="Order Statuses"
                            checked={orderStatus}
                            onPress={() => toggleCheckbox("orderStatus")}
                            checkedColor="#495E57"
                        />
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            title="Password Changes"
                            checked={passwordChange}
                            onPress={() => toggleCheckbox("passwordChange")}
                            checkedColor="#495E57"
                        />
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            title="Special Offers"
                            checked={specialOffers}
                            onPress={() => toggleCheckbox("specialOffers")}
                            checkedColor="#495E57"
                        />
                    </View>
                    <View style={styles.checkbox}>
                        <CheckBox
                            title="Newsletter"
                            checked={newsletter}
                            onPress={() => toggleCheckbox("newsletter")}
                            checkedColor="#495E57"
                        />
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <Button
                        title="Log Out"
                        onPress={() => {
                            navigation.navigate("Onboarding");
                            AsyncStorage.removeItem("userData");
                        }}
                        style={{
                            width: 300,
                            color: "#fff",
                            backgroundColor: "#F4CE14",
                        }}
                        textStyles={{
                            color: "black",
                            fontWeight: "bold",
                        }}
                    />
                </View>

                <View style={styles.saveButtons}>
                    <Button
                        title="Discard Changes"
                        onPress={() => {
                            navigation.navigate("Onboarding");
                        }}
                        style={{
                            width: 150,
                            color: "#495E57",
                            backgroundColor: "#fff",
                            borderColor: "#495E57",
                            borderWidth: 1,
                        }}
                        textStyles={{
                            color: "#495E57",
                            fontWeight: "bold",
                        }}
                    />
                    <Button
                        title="Save Changes"
                        onPress={() => {
                            saveUserDataToStorage();
                        }}
                        style={{
                            width: 150,
                            color: "#fff",
                            backgroundColor: "#495E57",
                        }}
                        textStyles={{
                            color: "#fff",
                            fontWeight: "bold",
                        }}
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
        padding: 16,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#495E57",
    },
    initialsContainer: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: "#495E57",
        justifyContent: "center",
        alignItems: "center",
    },
    initialsText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },

    profileContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },
    profileImage: {
        flex: 1,
        alignItems: "center",
    },
    logo: {
        width: 80,
        height: 80,
        borderRadius: 50,
        backgroundColor: "#495E57",
    },
    buttonsContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        marginLeft: 20,
    },
    infoContainer: {
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        marginBottom: 5,
        color: "#495E57",
    },
    input: {
        height: 35,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    notificationContainer: {
        flexDirection: "column",
    },
    checkbox: {
        marginRight: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20,
    },
    saveButtons: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
});
