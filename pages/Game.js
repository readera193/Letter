import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { StyleText, Manual, images } from "../component/components";

const Game = ({ route }) => {
    const { username } = route.params;

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
                    <View style={{
                        flex: 1
                    }}>
                        <Text numberOfLines={2} style={styles.playerName}>{"一二三四五六七八九一二三四五六七八九"}</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <Entypo
                                name="triangle-up"
                                size={40}
                                color="red"
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1
                    }}>
                        <Text numberOfLines={2} style={styles.playerName}>{"195"}</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            <MaterialCommunityIcons
                                name="shield-cross"
                                size={40}
                                color="green"
                            />
                        </View>
                    </View>
                    <View style={{
                        flex: 1
                    }}>
                        <Text numberOfLines={2} style={styles.playerName}>{"juliet124456789"}</Text>
                        <View style={{
                            flex: 1,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                        </View>
                    </View>
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
                }}>

                </View>
            </ImageBackground>
        </View>
    );
}

const Player = ({ name, card }) => (
    <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }}>
        <Image
            source={card}
            resizeMode="contain"
            style={{
                flex: 1,
                aspectRatio: 518 / 708,
            }}
        />
        <Text numberOfLines={2} style={styles.playerName}>{name}</Text>
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

