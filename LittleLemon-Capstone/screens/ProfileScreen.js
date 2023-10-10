import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const ProfileScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.profileImage}
                source={{ uri: 'https://via.placeholder.com/150' }}
            />
            <Text style={styles.name}>John Doe</Text>
            <Text style={styles.bio}>Software Developer</Text>
            <View style={styles.infoContainer}>
                <Text style={styles.info}>Email: john.doe@example.com</Text>
                <Text style={styles.info}>Phone: (123) 456-7890</Text>
                <Text style={styles.info}>Location: New York, NY</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    bio: {
        fontSize: 18,
        marginBottom: 20,
    },
    infoContainer: {
        backgroundColor: '#f2f2f2',
        padding: 20,
        borderRadius: 10,
    },
    info: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default ProfileScreen;
