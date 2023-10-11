import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList,
    TextInput,
    Alert,
    ActivityIndicator,
    Pressable,
    SafeAreaView,
    KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState, useCallback, useMemo } from "react";
import { getSectionListData, useUpdateEffect } from "../utils.js";
import debounce from "lodash.debounce";
import {
    createTable,
    getMenuItems,
    saveMenuItems,
    filterByQueryAndCategories,
} from "../database.js";
import menuData from "../assets/menuData.js";

import Filters from "../components/Filters";

const API_URL =
    "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json";

const sections = ["starters", "mains", "desserts"];
const imageMapping = {
    greekSalad: require("../assets/images/greekSalad.png"),
    bruschetta: require("../assets/images/bruschetta.png"),
    grilledFish: require("../assets/images/grilledFish.png"),
    lemonDessert: require("../assets/images/lemonDessert.png"),
    pasta: require("../assets/images/pasta.png"),
};

function Item({ title, price, description, image }) {
    let imageName;
    if (image !== null && image !== undefined) {
        imageName = image.split(".")[0];
    } else {
        imageName = "greekSalad";
    }

    return (
        <View style={styles.item}>
            <View style={styles.imageContainer}>
                <Image
                    source={imageMapping[imageName]}
                    resizeMode="cover"
                    style={styles.itemImage}
                />
            </View>
            <View style={styles.detailsContainer}>
                <Text style={styles.itemTitle}>{title}</Text>
                <Text style={styles.itemDescription}>{description}</Text>
                <Text style={styles.itemPrice}>Price: ${price}</Text>
            </View>
        </View>
    );
}

export default function HomeScreen({ navigation }) {
    const [name, onNameChange] = useState("");
    const [email, onEmailChange] = useState("");

    const [sectionData, setSectionData] = useState([]);
    const [dataReceived, setDataReceived] = useState(false);

    const [searchBarText, setSearchBarText] = useState("");
    const [searching, setSearching] = useState(false);
    const [query, setQuery] = useState("");
    const [filterSelections, setFilterSelections] = useState(
        sections.map(() => false)
    );

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

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            return menuData;
        } catch (error) {
            console.error("Error fetching data: ", error);
            throw error;
        }
    };

    useEffect(() => {
        createTable();
        getMenuItems().then((menuItems) => {
            if (menuItems.length === 0) {
                fetchData()
                    .then((data) => {
                        saveMenuItems(menuData.menu);

                        const sectionListData = getSectionListData(
                            menuData.menu
                        );

                        setSectionData(sectionListData);
                        setDataReceived(true);
                    })
                    .catch((error) => {
                        Alert.alert("Error", error.message);
                    });
            } else {
                const sectionListData = getSectionListData(menuItems);

                setSectionData(sectionListData);
                setDataReceived(true);
            }
        });
    }, []);

    useUpdateEffect(() => {
        (async () => {
            const activeCategories = sections.filter((section, index) => {
                if (filterSelections.every((item) => item === false)) {
                    return true;
                }
                return filterSelections[index];
            });

            try {
                const menuItems = await filterByQueryAndCategories(
                    query,
                    activeCategories
                );
                const sectionListData = getSectionListData(menuItems);
                setSectionData(sectionListData);
            } catch (e) {
                Alert.alert(e.message);
            }
        })();
    }, [filterSelections, query]);

    const lookup = useCallback((q) => {
        setQuery(q);
    }, []);

    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const originalArray = [...filterSelections];
        originalArray[index] = !filterSelections[index];
        setFilterSelections(originalArray);
    };

    return (
        <View style={styles.container}>
            <View style={styles.heroContainer}>
                <Text style={styles.mainHeader}>Little Lemon</Text>
                <Text style={styles.subHeader}>Chicago</Text>
                <View style={styles.row}>
                    <Text style={styles.text}>
                        We are a family-owned Mediterranean restaurant focused
                        on traditional recipes served with a modern twist.
                    </Text>
                    <Image
                        source={require("../assets/images/hero_image.png")}
                        resizeMode="cover"
                        style={styles.heroImage}
                    />
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <Pressable
                        onPress={() => setSearching(true)}
                        onBlur={() => setSearching(false)}
                    >
                        {searching ? (
                            <TextInput
                                onChangeText={handleSearchChange}
                                value={searchBarText}
                                iconColor="gray"
                                style={styles.inputOpened}
                                onBlur={() => setSearching(false)}
                            />
                        ) : (
                            <View style={styles.inputBox}>
                                <Image
                                    source={require("../assets/images/search.png")}
                                    resizeMode="contain"
                                    style={{ ...styles.input }}
                                />
                            </View>
                        )}
                    </Pressable>
                </KeyboardAvoidingView>
            </View>

            {!dataReceived ? (
                <ActivityIndicator
                    style={styles.loadingIndicator}
                    size="large"
                    color="#4CAF50"
                />
            ) : (
                <SafeAreaView style={styles.container}>
                    <Filters
                        selections={filterSelections}
                        onChange={handleFiltersChange}
                        sections={sections}
                    />
                    <FlatList
                        style={styles.flatList}
                        data={sectionData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) =>
                            item.data.map((itemData, index) => {
                                return (
                                    <Item
                                        key={index.toString()}
                                        title={itemData.title}
                                        price={itemData.price}
                                        description={itemData.description}
                                        image={itemData.image}
                                    />
                                );
                            })
                        }
                    />
                </SafeAreaView>
            )}
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
        backgroundColor: "#495E57",
        padding: 20,
        width: "100%",
    },
    mainHeader: {
        fontSize: 48,
        fontWeight: "bold",
        color: "#F4CE14",
    },
    subHeader: {
        fontSize: 32,
        color: "#fff",
    },
    text: {
        fontSize: 16,
        textAlign: "left",
        marginBottom: 20,
        color: "#fff",
        width: 200,
    },
    heroImage: {
        width: 150,
        height: 175,
        borderRadius: 15,
        marginBottom: 20,
        marginTop: -30,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    inputBox: {
        height: 40,
        width: 40,
        borderRadius: 40,
        alignSelf: "center",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 20,
        width: 25,
        borderRadius: 40,
        alignSelf: "center",
        backgroundColor: "#fff",
    },
    inputOpened: {
        height: 40,
        width: 300,
        borderRadius: 40,
        alignSelf: "center",
        backgroundColor: "#fff",
        paddingLeft: 20,
    },
    item: {
        backgroundColor: "#fff",
        padding: 20,
        marginVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        width: "100%",
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
    },
    itemDescription: {
        fontSize: 14,
        color: "#555",
    },
    itemImage: {
        width: 80,
        height: 80,
        borderRadius: 10,
    },
    imageContainer: {
        width: 80,
        height: 80,
        borderRadius: 10,
        marginRight: 10,
        overflow: "hidden",
        alignItems: "center",
        justifyContent: "center",
    },
    textContainer: {
        flex: 1,
        marginRight: 10,
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    detailsContainer: {
        flex: 0.8,
        height: "100%",
    },
    flatList: {
        flex: 1,
        width: "80%",
    },
    search: {
        backgroundColor: "#495E57",
        color: "white",
        elevation: 0,
    },
});
