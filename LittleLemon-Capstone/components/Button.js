import { Pressable, Text, StyleSheet } from "react-native";
import React from "react";

export default function Button({
    title,
    onPress,
    disabled,
    style,
    textStyles,
}) {
    return (
        <Pressable
            style={[disabled ? styles.disabled : styles.button, style]}
            onPress={onPress}
            disabled={disabled}
        >
            <Text style={[styles.text, textStyles] }>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 10,
        margin: 10,
        width: 200,
        backgroundColor: "#495E57",
        borderRadius: 10,
    },
    text: {
        fontSize: 14,
        textAlign: "center",
    },
    disabled: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        width: 200,
        backgroundColor: "red",
    },
});
