import React, { useState } from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { apiJoin } from "../api";
import { StyleText, images, CommonModal } from "../component/components";


const Home = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [emptyAlert, setEmptyAlert] = useState("");
    const [message, setMessage] = useState("");
    const [lock, setLock] = useState(false);

    const startGame = () => {
        if (username === "") {
            setEmptyAlert("請輸入暱稱");
        } else if (!lock) {
            setLock(true);
            setEmptyAlert("");
            apiJoin({ playerName: username }).then(({ status, data }) => {
                if (status === 200) {
                    navigation.navigate("Game", { username: username });
                } else {
                    throw data;
                }
            }).catch((error) => {
                console.log("error occurred: ", error?.response?.data || error.message);
                setMessage(error?.response?.data || error.message);
            }).finally(() => {
                setLock(false);
            });
        }
    };

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
                            onChangeText={(text) => setUsername(text)}
                            style={styles.inputName}
                            placeholder={emptyAlert}
                        />
                    </View>
                    <View style={{ margin: 5 }}>
                        <TouchableOpacity onPress={startGame} disabled={lock}>
                            <StyleText fontSize={20} color="gold" style={styles.textShadow}>確定</StyleText>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <CommonModal show={message !== ""} closeModal={() => setMessage("")}>
                <StyleText fontSize={20} color="black">{message}</StyleText>
            </CommonModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageBackground: {
        flex: 1,
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
        textShadowOffset: { height: 2, width: 2 },
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