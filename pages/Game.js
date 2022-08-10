import React, { useRef, useEffect, useState, useMemo } from "react";
import {
    Button,
    Image,
    ImageBackground,
    ScrollView,
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
    const [playerNames, setPlayerNames] = useState([]);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState("");
    const [cardIndexSelected, setCardIndexSelected] = useState(-1); // use inedex to prevent same card
    const [usedCards, setUsedCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [record, setRecord] = useState("");

    const scrollViewRef = useRef();
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
            type, state, actionPlayer, playerNames,
            cards = [], playerState = {}, msg,
            usedCards = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        } = JSON.parse(data);

        if (type === "update") {
            setState(state);
            setActionPlayer(actionPlayer);
            setPlayerNames(playerNames.filter((name) => name !== username));
            setCards(cards);
            setPlayerState(playerState);
            setUsedCards(usedCards);
            if (msg) {
                setRecord((oldRecord) => oldRecord + msg + "\n");
                scrollViewRef.current.scrollToEnd();
            }
        } else if (type === "start") {
            setRecord("");
            setMessage("");
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
            if (playerNames.length > 0) {
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
                <View style={{ flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", }}>
                    <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", }}>
                        {cards.map((card, index) =>
                            <TouchableOpacity
                                key={index}
                                onPress={() => setCardIndexSelected(index)}
                                // cardIndexSelected use index to prevent get 2 same card
                                style={(cardIndexSelected === index) ? styles.selectedCard : {}}
                                disabled={cards.length <= 1}
                            >
                                <Image
                                    source={images.roles[card]}
                                    resizeMode="contain"
                                    style={styles.card}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    {(actionPlayer === username) &&
                        <View style={{ margin: 20, }}>
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
    }, [state, playerNames, actionPlayer, username, cards, cardIndexSelected]);

    return (
        <View style={{ flex: 1, }}>
            <ImageBackground source={images.background} style={styles.container}>
                <Manual />
                <View style={styles.players}>
                    {playerNames.map((name) =>
                        <Player
                            key={name}
                            name={name}
                            shield={playerState[name]?.shield}
                            eliminated={playerState[name]?.eliminated}
                            action={actionPlayer === name}
                        />
                    )}
                </View>
                <View style={styles.infoArea}>
                    <View style={{ padding: 5, alignItems: "center", justifyContent: "space-evenly", }}>
                        <Text>牌庫：{16}</Text>
                        <Text>未知的角色牌：{2}</Text>
                        <Text style={usedCards[8] === 1 ? { color: "red" } : {}}>公主(8)：( {usedCards[8]} / 1 )</Text>
                        <Text style={usedCards[7] === 1 ? { color: "red" } : {}}>皇后(7)：( {usedCards[7]} / 1 )</Text>
                        <Text style={usedCards[6] === 1 ? { color: "red" } : {}}>國王(6)：( {usedCards[6]} / 1 )</Text>
                        <Text style={usedCards[5] === 2 ? { color: "red" } : {}}>王子(5)：( {usedCards[5]} / 2 )</Text>
                        <Text style={usedCards[4] === 2 ? { color: "red" } : {}}>侍女(4)：( {usedCards[4]} / 2 )</Text>
                        <Text style={usedCards[3] === 2 ? { color: "red" } : {}}>男爵(3)：( {usedCards[3]} / 2 )</Text>
                        <Text style={usedCards[2] === 2 ? { color: "red" } : {}}>神父(2)：( {usedCards[2]} / 2 )</Text>
                        <Text style={usedCards[1] === 5 ? { color: "red" } : {}}>衛兵(1)：( {usedCards[1]} / 5 )</Text>
                    </View>
                    <View style={{ flex: 1, padding: 5, }}>
                        <Text style={{ textAlign: "center", textAlignVertical: "center", paddingBottom: 5, }}>遊戲紀錄：</Text>
                        <View style={styles.record}>
                            <ScrollView ref={scrollViewRef}>
                                <Text>{record}</Text>
                            </ScrollView>
                        </View>
                    </View>

                </View>
                <View style={styles.container}>
                    <Text numberOfLines={2} style={styles.userNameText}>{username}</Text>
                    <View style={styles.container}>
                        {playerArea}
                        {/* Button: 催促按鈕 */}
                    </View>
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

const Player = ({ name, shield = false, eliminated = false, action = false }) => (
    <View style={styles.playerState}>
        <Text numberOfLines={2} style={styles.playerNameText}>{name}</Text>
        {eliminated ? <MaterialCommunityIcons name="heart-broken" size={40} color="red" />
            : action ? <Entypo name="triangle-up" size={40} color="red" />
                : shield ? <MaterialCommunityIcons name="shield-cross" size={40} color="green" />
                    : <Entypo name="triangle-up" size={40} color="transparent" />
        }
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        // borderWidth: 1,
    },
    userNameText: {
        textAlign: "center",
        textAlignVertical: "center",
        textShadowColor: "black",
        textShadowOffset: { height: 2, width: 2 },
        textShadowRadius: 1,
        color: "gold",
        height: 40,
        fontSize: 30,
    },
    playerNameText: {
        textAlign: "center",
        textAlignVertical: "center",
        color: "black",
        height: 35,
        marginHorizontal: 5,
    },
    playerState: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        height: 80,
        width: 80,
    },
    card: {
        flex: 1,
        aspectRatio: 210 / 293,
        margin: 5,
    },
    record: {
        flex: 1,
        borderWidth: 2,
        borderColor: "red",
        borderRadius: 5,
        padding: 5,
    },
    infoArea: {
        flex: 1,
        flexDirection: "row",
        alignItems: "stretch",
        backgroundColor: "white",
        borderRadius: 10,
    },
    selectedCard: {
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "red",
    },
    players: {
        flex: 1 / 2,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});


export default Game;

