import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const Filters = ({ onChange, selections, sections }) => {
    return (
        <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
                <TouchableOpacity
                    key={index}
                    onPress={() => {
                        onChange(index);
                    }}
                    style={{
                        flex: 1 / sections.length,
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 16,
                        backgroundColor: selections[index]
                            ? "#F4CE14"
                            : "#495E57",
                        borderRadius: 32,
                        borderColor: "white",
                        marginBottom: 16,
                    }}
                >
                    <View>
                        <Text
                            style={{
                                color: selections[index] ? "black" : "white",
                            }}
                        >
                            {section.toUpperCase()}
                        </Text>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    filtersContainer: {
        backgroundColor: "#495E57",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
});

export default Filters;
