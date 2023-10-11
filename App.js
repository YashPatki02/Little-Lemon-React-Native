import {
    StyleSheet,
    Text,
    View,
    Image,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import OnboardingScreen from "./screens/OnboardingScreen";
import ProfileScreen from "./screens/ProfileScreen";
import HomeScreen from "./screens/HomeScreen";

import Header from "./components/Header";

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);

    const checkFirstLaunch = async () => {
        try {
            const value = await AsyncStorage.getItem("alreadyLaunched");

            if (value === null) {
                AsyncStorage.setItem("alreadyLaunched", "true");
                setIsFirstLaunch(true);
            } else {
                setIsFirstLaunch(false);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        checkFirstLaunch();
        setIsLoading(false);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <Image
                    source={require("./assets/images/Logo.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text>Loading...</Text>
            </View>
        );
    }    


    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        gestureEnabled: false,
                        headerLeft: () => {
                            return <></>;
                        },
                        headerRight: () => {
                            return (
                                <Header />
                            );
                        },
                        headerTitle: () => {
                            return (
                                <Image
                                    source={require("./assets/images/Logo.png")}
                                    style={{
                                        width: 100,
                                        height: 80,
                                        marginTop: -20,
                                    }}
                                    resizeMode="contain"
                                />
                            );
                        },
                    }}
                />
                <Stack.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        gestureEnabled: false,
                        headerLeft: () => {
                            return <></>;
                        },
                        headerTitle: () => {
                            return (
                                <Image
                                    source={require("./assets/images/Logo.png")}
                                    style={{
                                        width: 100,
                                        height: 80,
                                        marginTop: -20,
                                    }}
                                    resizeMode="contain"
                                />
                            );
                        },
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        width: 300,
        height: 300,
        borderRadius: 75,
        marginBottom: 20,
    },
});
