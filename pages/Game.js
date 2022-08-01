import React, { useRef, useEffect, useState } from "react";
import {
    Button,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { StyleText, Manual, images, AlertModal } from "../component/components";
import { baseURL } from "../api";


const Game = ({ route }) => {
    const { username } = route.params;
    const [playerState, setPlayerState] = useState({});
    const [message, setMessage] = useState("");

    const ws = useRef(new WebSocket("ws://" + baseURL)).current;

    useEffect(() => {
        ws.onopen = () => {
            ws.send(JSON.stringify({
                action: "join",
                playerName: username,
            }));
        };

        ws.onmessage = ({ data }) => onMessage(data);

        ws.onclose = () => {
            console.log("Disconnected. Check internet or server.");
        };

        return () => ws.close();
    }, []);

    const onMessage = (data) => {
        console.log(new Date().toLocaleTimeString(), username, "received:\n", JSON.parse(data));

        let { type, actionPlayer, playerState = {}, msg = "", } = JSON.parse(data);
        if (type === "update") {
            console.log("object", playerState);
            delete playerState[username];
            setPlayerState(playerState);
        } else if (type === "error") {
            setMessage(msg);
        } else {
            console.log("unknown type");
        }
    };

    const startGame = () => {
        ws.send(JSON.stringify({ action: "start" }));
    };

    return (
        <View style={styles.container}>
            <ImageBackground source={images.background} style={styles.container}>
                <Manual />
                <View style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: "white",
                    flexDirection: "row",
                }}>
                    {Object.entries(playerState).map(([name, { shield = false, gameover = false, action = false }]) =>
                        <Player
                            key={name}
                            name={name}
                            shield={shield}
                            gameover={gameover}
                            action={action}
                        />)}
                </View>
                <View style={{
                    flex: 2,
                    borderWidth: 1,
                    borderColor: "white",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    <View style={{
                        paddingHorizontal: 20,
                        paddingVertical: 10,
                        backgroundColor: "white",
                        borderRadius: 20,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-evenly",
                    }}>
                        <Text>
                            8-公主：{"\n"}
                            7-伯爵夫人：{"\n"}
                            6-國王：{"\n"}
                            5-王子：{"\n"}
                            4-侍女：{"\n"}
                            3-男爵：{"\n"}
                            2-神父：{"\n"}
                            1-衛兵：
                        </Text>
                        {/* card left 0 alert with red text */}
                        <Text>
                            ({0}/1){"\n"}
                            ({0}/1){"\n"}
                            ({0}/1){"\n"}
                            ({0}/2){"\n"}
                            ({0}/2){"\n"}
                            ({0}/2){"\n"}
                            ({0}/2){"\n"}
                            ({0}/5)
                        </Text>
                    </View>

                </View>
                <View style={{
                    flex: 2,
                    borderWidth: 1,
                    borderColor: "white",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}>
                    {Object.keys(playerState).length > 0 ?
                        <Button
                            onPress={startGame}
                            title="開始遊戲"
                            color="goldenrod"
                        />
                        :
                        <StyleText fontSize={30} color="gold">
                            等待其他玩家加入
                        </StyleText>
                    }
                </View>
            </ImageBackground>
            <AlertModal
                show={message !== ""}
                closeModal={() => setMessage("")}
                message={message}
            />
        </View>
    );
};

const Player = ({ name, shield = false, gameover = false, action = false }) => (
    <View style={{
        flex: 1,
        borderWidth: 1,
        borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
    }}>
        <Text numberOfLines={2} style={styles.playerName}>{name}</Text>
        {shield && <MaterialCommunityIcons
            name="shield-cross"
            size={40}
            color="green"
        />}
        {action && <Entypo
            name="triangle-up"
            size={40}
            color="red"
        />}
        {gameover && <MaterialCommunityIcons
            name="heart-broken"
            size={40}
            color="red"
        />}
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    playerName: {
        textAlign: "center",
        textAlignVertical: "center",
        textShadowColor: "black",
        textShadowOffset: { height: 2, width: 2 },
        textShadowRadius: 1,
        color: "gold",
        height: 40,
    },
});

export default Game;

