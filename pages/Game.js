import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { StyleText } from "../component/components";

const Game = ({ route, navigation }) => {
    const { username } = route.params;

    return (
        <View style={styles.container}>
            <Text>Hello, {username}</Text>
            <TouchableOpacity onPress={() => {
                navigation.goBack();
                // TODO: clean up username at Home
            }}>
                <StyleText fontSize={20} color="#FFD700" style={styles.textShadow}>離開</StyleText>
            </TouchableOpacity>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default Game;