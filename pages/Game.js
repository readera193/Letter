import React, { useRef, useEffect, useState, useMemo } from "react";
import {
    Button,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { StyleText, Manual, images, AlertModal } from "../component/components";
import { baseURL } from "../api";


const Game = ({ route }) => {
    const { username } = route.params;
    const [state, setState] = useState("");
    const [actionPlayer, setActionPlayer] = useState("");
    const [playerState, setPlayerState] = useState({});
    const [actionSequence, setActionSequence] = useState([]);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState("");
    const [cardIndexSelected, setCardIndexSelected] = useState(-1); // use inedex to prevent same card
    const [usedCards, setUsedCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);

    const ws = useRef(new WebSocket("ws://" + baseURL)).current;

    const send = (data) => ws.send(JSON.stringify(data));

    useEffect(() => {
        ws.onopen = () => send({ action: "join", playerName: username });

        ws.onmessage = ({ data }) => onMessage(data);

        ws.onclose = () => {
            console.log("Disconnected. Check internet or server.");
        };

        return () => ws.close();
    }, []);

    const onMessage = (data) => {
        console.log(new Date().toLocaleTimeString(), username, "received:\n", JSON.parse(data));

        let {
            type, state, actionPlayer, actionSequence,
            cards = [], playerState = {}, msg = "",
            usedCards = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        } = JSON.parse(data);

        if (type === "update") {
            setState(state);
            setActionPlayer(actionPlayer);
            setPlayerState(playerState);
            setActionSequence(actionSequence.filter((name) => name !== username));
            setUsedCards(usedCards);
        } else if (type === "deal") {
            setCards(cards);
        } else if (type === "error") {
            setMessage(msg);
        } else {
            console.log("unknown type");
        }
    };


    const playerArea = useMemo(() => {
        if (state === "waiting") {
            if (actionSequence.length > 0) {
                return (
                    <Button
                        onPress={() => send({ action: "start" })}
                        title="開始遊戲"
                        color="goldenrod"
                    />
                );
            } else {
                return (
                    <StyleText fontSize={30} color="gold">
                        等待其他玩家加入
                    </StyleText>
                );
            }
        } else {
            return (
                <View style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                    }}>

                        {cards.map((card, index) =>
                            <TouchableOpacity
                                key={index}
                                onPress={() => setCardIndexSelected(index)}
                                // cardIndexSelected use index to prevent get 2 same card
                                style={(cardIndexSelected === index) ? { borderWidth: 2, borderColor: "gold" } : {}}
                                disabled={cards.length <= 1}
                            >
                                <Image
                                    source={images.roles[card]}
                                    resizeMode="contain"
                                    style={{
                                        flex: 1,
                                        aspectRatio: 210 / 293,
                                        margin: 5,
                                    }}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    {(actionPlayer === username) &&
                        <View style={{ margin: 20 }}>
                            {(cards.length <= 1) ?
                                <Button
                                    onPress={() => send({ action: "draw" })}
                                    title="抽牌"
                                    color="goldenrod"
                                />
                                :
                                <Button
                                    onPress={() => {
                                        send({ action: "play", playedCard: cards[cardIndexSelected] });
                                        setCardIndexSelected(-1);
                                    }}
                                    title="確定"
                                    color="goldenrod"
                                    disabled={cardIndexSelected === -1}
                                />
                            }
                        </View>
                    }
                </View>
            );
        }
    }, [state, actionSequence, actionPlayer, username, cards, cardIndexSelected]);

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
                    {actionSequence.map((name) => {
                        let { shield = false, gameover = false, action = false } = playerState[name] ?? {};
                        return (
                            <Player
                                key={name}
                                name={name}
                                shield={shield}
                                gameover={gameover}
                                action={action}
                            />
                        );
                    })}
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
                            ({usedCards[8]}/1){"\n"}
                            ({usedCards[7]}/1){"\n"}
                            ({usedCards[6]}/1){"\n"}
                            ({usedCards[5]}/2){"\n"}
                            ({usedCards[4]}/2){"\n"}
                            ({usedCards[3]}/2){"\n"}
                            ({usedCards[2]}/2){"\n"}
                            ({usedCards[1]}/5)
                        </Text>
                    </View>

                </View>
                <View style={{
                    flex: 2,
                    borderWidth: 1,
                    borderColor: "white",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-start",
                }}>
                    <Text numberOfLines={2} style={[styles.playerName, { fontSize: 30 }]} >{username}</Text>
                    {playerArea}
                    {/* Button: 催促按鈕 */}
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

