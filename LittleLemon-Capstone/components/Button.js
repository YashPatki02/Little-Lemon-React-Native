import {Pressable, Text, StyleSheet } from "react-native";
import React from "react";

export default function Button({ title, onPress, disabled }) {
    return (
        <Pressable style={disabled ? styles.disabled : styles.button} onPress={onPress} disabled={disabled}>
            <Text style={styles.text}>{title}</Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        padding: 10,
        margin: 10,
        width: 200,
        backgroundColor: "#495E57",
    },
    text: {
        fontSize: 20,
        color: "#fff",
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