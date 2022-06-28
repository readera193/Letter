import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { StyleText } from "../component/components";

const images = {
    background: require("../assets/background.jpg"),
    logo: require("../assets/logo.png"),
}

const Home = ({ navigation }) => {
    const [username, onChangeUsername] = React.useState("");

    return (
        <View style={styles.container}>
            <ImageBackground source={images.background} style={styles.imageBackground}>
                <View>
                    <Image source={images.logo} style={{ width: 90, height: 90 }} />
                    <StyleText fontSize={30} color="gold" fontWeight="bold" style={styles.textShadow}>情書</StyleText>
                </View>
                <View style={styles.inputNameContainer}>
                    <View style={{ flexDirection: "row" }}>
                        <StyleText fontSize={20} color="gold" style={styles.textShadow}>暱稱：</StyleText>
                        <TextInput
                            value={username}
                            onChangeText={text => onChangeUsername(text)}
                            style={styles.inputName}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <TouchableOpacity onPress={() => {
                            // TODO: alert if user doesn't enter name
                            navigation.navigate("Game", { username: username === "" ? "stranger" : username });
                        }}>
                            <StyleText fontSize={20} color="gold" style={styles.textShadow}>開始遊戲</StyleText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
        resizeMode: "cover",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    logo: {
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    textShadow: {
        textAlign: "center",
        textAlignVertical: "center",
        textShadowColor: "black",
        textShadowOffset: {
            height: 2,
            width: 2,
        },
        textShadowRadius: 1,
    },
    inputNameContainer: {
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    inputName: {
        backgroundColor: "white",
        borderRadius: 3,
        borderWidth: 1,
        height: 30,
        width: 150,
        marginVertical: 15,
        paddingHorizontal: 5,
        paddingVertical: 0,
    },
});

export default Home;