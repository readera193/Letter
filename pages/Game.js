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
import { Picker } from "@react-native-picker/picker";
import { StyleText, Manual, images, CommonModal } from "../component/components";
import { baseURL } from "../api";


const pickerText = {
    1: "選擇要猜測手牌的玩家，不可猜測對方手牌為衛兵",
    2: "選擇要看手牌的玩家",
    3: "選擇要比較手牌大小的玩家，若平手無事發生",
    5: "指定要棄牌重抽的玩家，可以是你自己",
    6: "選擇要交換手牌的玩家",
};

const cardText = {
    1: "衛兵", 2: "神父", 3: "男爵", 4: "侍女",
    5: "王子", 6: "國王", 7: "皇后", 8: "公主",
};

const Game = ({ route }) => {
    const { username } = route.params;
    const [state, setState] = useState("");
    const [actionPlayer, setActionPlayer] = useState("");
    const [publicState, setPublicState] = useState({});
    const [playerNames, setPlayerNames] = useState([]);
    const [cards, setCards] = useState([]);
    const [message, setMessage] = useState("");
    const [cardIndexSelected, setCardIndexSelected] = useState(-1); // use inedex to prevent same card
    const [usedCards, setUsedCards] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const [record, setRecord] = useState("");
    const [cardPoolRemaining, setCardPoolRemaining] = useState(0);
    const [unknownCards, setUnknownCards] = useState(0);
    const [showPlayerSelector, setShowPlayerSelector] = useState(false);
    const [playerOptions, setPlayerOptions] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [guessCard, setGuessCard] = useState(0);

    const scrollViewRef = useRef();
    const ws = useRef();

    useEffect(() => {
        ws.current = new WebSocket(`ws://${baseURL}?playerName=${username}`);

        ws.current.onmessage = ({ data }) => onMessage(data);

        ws.current.onclose = () => {
            console.log("Disconnected. Check internet or server.");
        };

        return () => ws.current.close();
    }, []);

    const send = (data) => ws.current.send(JSON.stringify(data));

    const onMessage = (data) => {
        console.log(new Date().toLocaleTimeString(), username, "received:\n", JSON.parse(data));

        let {
            type, state, actionPlayer, playerNames, cardPoolRemaining, unknownCards, msg,
            cards = [], publicState = {}, usedCards = [0, 0, 0, 0, 0, 0, 0, 0, 0],
        } = JSON.parse(data);

        if (type === "update") {
            setState(state);
            setActionPlayer(actionPlayer);
            setPlayerNames(playerNames.filter((name) => name !== username));
            setCardPoolRemaining(cardPoolRemaining);
            setCards(cards);
            setUnknownCards(unknownCards);
            setPublicState(publicState);
            setUsedCards(usedCards);
            if (msg) {
                setRecord((oldRecord) => oldRecord + msg + "\n\n");
                scrollViewRef.current.scrollToEnd();
            }
        } else if (type === "start") {
            if (record.length > 100) {
                setRecord("");
            }
            setMessage("");
        } else if (type === "deal") {
            setCards(cards);
            setCardPoolRemaining(cardPoolRemaining);
        } else if (type === "error") {
            setMessage(msg);
        } else {
            console.log("unknown type");
        }
    };

    const enter = () => {
        let selectedCard = cards[cardIndexSelected];
        if ([5, 6].includes(selectedCard) && cards.includes(7)) {
            setMessage(`你手上有${cardText[selectedCard]}，必須棄掉皇后(伯爵夫人)`)
        } else if ([1, 2, 3, 5, 6].includes(selectedCard)) {
            let targetPlayers = playerNames.filter((name) => !publicState[name].shield);
            if (selectedCard === 5) {
                targetPlayers.push(username);
                setPlayerOptions(targetPlayers);
                setShowPlayerSelector(true);
            } else if (targetPlayers.length > 0) {
                setPlayerOptions(targetPlayers);
                setShowPlayerSelector(true);
            } else {
                // all players are protected by 4
                setSelectedPlayer("");
                play();
            }
        } else {
            play();
        }
    };

    const play = () => {
        setShowPlayerSelector(false);
        send({
            action: "play",
            playedCard: cards[cardIndexSelected],
            selectedPlayer: selectedPlayer,
            guessCard: guessCard,
        });
        setCardIndexSelected(-1);
        setSelectedPlayer("");
        setGuessCard(0);
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
                                style={(cardIndexSelected === index) ? styles.guessCard : {}}
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
                                    onPress={enter}
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
                            shield={publicState[name]?.shield}
                            eliminated={publicState[name]?.eliminated}
                            action={actionPlayer === name}
                        />
                    )}
                </View>
                <View style={styles.infoArea}>
                    <View style={{ padding: 5, alignItems: "center", justifyContent: "space-evenly", }}>
                        <Text>牌庫：{cardPoolRemaining}</Text>
                        <Text>未知的角色牌：{unknownCards}</Text>
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
            <CommonModal show={message !== ""} closeModal={() => setMessage("")}>
                <StyleText fontSize={20} color="black">{message}</StyleText>
            </CommonModal>
            <CommonModal show={showPlayerSelector} closeModal={() => setShowPlayerSelector(false)}>
                <StyleText fontSize={15} color="black">{pickerText[cards[cardIndexSelected]]}</StyleText>
                <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 5 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <View style={styles.picker}>
                            <Picker
                                selectedValue={selectedPlayer}
                                style={{ flex: 1 }}
                                onValueChange={(value) => setSelectedPlayer(value)}
                            >
                                <Picker.Item label="請選擇一位玩家" value="" enabled={false} />
                                {playerOptions.map((name) => <Picker.Item key={name} label={name} value={name} />)}
                            </Picker>
                        </View>
                    </View>
                    {cards[cardIndexSelected] === 1 &&
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                            <View style={styles.picker}>
                                <Picker
                                    selectedValue={guessCard}
                                    style={{ flex: 1 }}
                                    onValueChange={(value) => setGuessCard(value)}
                                >
                                    <Picker.Item label="猜測他的手牌" value={0} enabled={false} />
                                    {[2, 3, 4, 5, 6, 7, 8].map((card) =>
                                        <Picker.Item key={card} label={card + " - " + cardText[card]} value={card} />)}
                                </Picker>
                            </View>
                        </View>
                    }
                </View>
                <Button
                    onPress={play}
                    title="確定"
                    color="goldenrod"
                    disabled={(selectedPlayer === "" || (cards[cardIndexSelected] === 1 && guessCard === 0))}
                />
            </CommonModal>
        </View>
    );
};

const Player = ({ name, shield = false, eliminated = false, action = false }) => (
    <View style={styles.publicState}>
        <Text numberOfLines={2} style={styles.playerNameText}>{name}</Text>
        {eliminated ? <MaterialCommunityIcons name="heart-broken" size={40} color="red" />
            : action ? <Entypo name="triangle-up" size={40} color="red" />
                : shield ? <MaterialCommunityIcons name="shield-cross" size={40} color="green" />
                    : <Entypo name="triangle-up" size={40} color="transparent" />}
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
    publicState: {
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 10,
        backgroundColor: "white",
        borderRadius: 10,
        height: 80,
        width: 80,
    },
    card: {
        flex: 0.8,
        aspectRatio: 210 / 293,
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
    guessCard: {
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
    picker: {
        flex: 8 / 10,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 2,
        borderWidth: 1,
        height: 35,
        marginVertical: 5,
    },
});


export default Game;

