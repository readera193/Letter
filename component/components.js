import React, { useState } from "react";
import {
    Button,
    Image,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Modal from "react-native-modal";

const images = {
    background: require("../assets/background.jpg"),
    logo: require("../assets/logo.png"),
    cardHelping: require("../assets/card_helping.jpg"),
    roles: [
        undefined,
        require("../assets/role_1.png"),
        require("../assets/role_2.png"),
        require("../assets/role_3.png"),
        require("../assets/role_4.png"),
        require("../assets/role_5.png"),
        require("../assets/role_6.png"),
        require("../assets/role_7.png"),
        require("../assets/role_8.png"),
    ],
};

const StyleText = ({ fontSize, color, fontWeight, style, children }) => (
    <Text style={[{ fontSize: fontSize, color: color, fontWeight: fontWeight }, style]}>
        {children}
    </Text>
);

const Manual = () => (
    <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", padding: 5 }}>
            <Hint />
            <Rule />
        </View>
    </View>
);

const Rule = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const closeModal = () => setModalVisible(false);

    return (
        <View style={{ marginLeft: 10 }}>
            <Button
                onPress={() => setModalVisible(true)}
                title="規則說明"
                color="goldenrod"
            />
            <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
                <View style={styles.ruleContainer}>
                    <Text>
                        遊戲初始設置：{"\n"}
                        16 張角色牌洗牌後，2 人玩家需隨機移除 3 張角色牌，3~4 人玩家則隨機移除 1 張角色牌。{"\n"}
                        每人抽一張角色卡做為起始手牌。{"\n\n"}
                        回合流程：{"\n"}
                        {"\t\t"}一、從牌庫中抽一張牌。
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}二、</Text>
                        <Text style={{ flex: 1 }}>從手中的兩張牌中打出一張，並執行該張牌的效果。</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}三、</Text>
                        <Text style={{ flex: 1 }}>若抽完牌庫，且剩餘兩位以上玩家，則手牌最大者獲勝。{"\n"}</Text>
                    </View>
                    <Text>補充：</Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}一、</Text>
                        <Text style={{ flex: 1 }}>1/2/3/6 角色牌打出時，若其餘所有玩家皆被侍女保護，則直接打出沒有效果。</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}二、</Text>
                        <Text style={{ flex: 1 }}>5 打出時，若其餘所有玩家皆被侍女保護，則捨棄自己手牌再抽一張。效果發動時，如果牌庫已抽完，改為抽遊戲開始前被移出的牌。</Text>
                    </View>

                    <View style={{ flexDirection: "row" }}>
                        <Text style={{ textDecorationLine: "line-through" }}>{"\t\t"}三、</Text>
                        <Text style={{ flex: 1, textDecorationLine: "line-through" }}>伯爵夫人改成皇后，卡牌剩餘數量那邊比較方便排版......</Text>
                    </View>
                </View>
                <Text style={styles.closeHint} onPress={closeModal}>
                    點擊空白處關閉...
                </Text>
            </Modal>
        </View>
    );
};

const Hint = () => {
    const [isModalVisible, setModalVisible] = useState(false);

    const closeModal = () => setModalVisible(false);

    return (
        <View>
            <Button
                onPress={() => setModalVisible(true)}
                title="提示卡"
                color="goldenrod"
            />

            <Modal isVisible={isModalVisible} onBackdropPress={closeModal} style={styles.center}>
                <View style={{ flexDirection: "row" }}>
                    <Image
                        source={images.cardHelping}
                        resizeMode="contain"
                        style={styles.cardHelping}
                    />
                </View>
                <Text style={styles.closeHint} onPress={closeModal}>
                    點擊空白處關閉...
                </Text>
            </Modal>
        </View>
    );
};

const CommonModal = ({ show, closeModal, children }) => (
    <Modal isVisible={show} onBackdropPress={closeModal} style={styles.center}>
        <View style={styles.commonModalContainer} >
            {children}
        </View>
        <Text style={styles.closeHint} onPress={closeModal}>
            點擊空白處關閉...
        </Text>
    </Modal>
);

const styles = StyleSheet.create({
    ruleContainer: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
    },
    commonModalContainer: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
    },
    cardHelping: {
        flex: 1,
        aspectRatio: 618 / 834,
        borderRadius: 20,
    },
    marginTopRight: {
        marginRight: 10,
    },
    closeHint: {
        color: "white",
        padding: 10,
        textAlign: "center",
    },
    center: {
        alignItems: "center",
        justifyContent: "center",
    },
});


export { StyleText, Manual, CommonModal, images };
