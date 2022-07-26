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
        require("../assets/role_1.jpg"),
        require("../assets/role_2.jpg"),
        require("../assets/role_3.jpg"),
        require("../assets/role_4.jpg"),
        require("../assets/role_5.jpg"),
        require("../assets/role_6.jpg"),
        require("../assets/role_7.jpg"),
        require("../assets/role_8.jpg"),
    ],
};

const StyleText = ({ fontSize, color, fontWeight, style, children }) => (
    <Text style={[{ fontSize: fontSize, color: color, fontWeight: fontWeight }, style]}>
        {children}
    </Text>
);

const Manual = () => (
    <View style={{ flexDirection: "row", justifyContent: "flex-end", padding: 10, }}>
        <Hint />
        <Rule />
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
                <View style={styles.container}>
                    <Text>
                        遊戲初始設置：每位玩家一人一張角色卡{"\n\n"}
                        回合流程：{"\n"}
                        {"\t\t"}一、從牌庫中抽一張牌。
                    </Text>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}二、</Text>
                        <Text numberOfLines={2}>從手中的兩張牌中打出一張，並執行該張牌的效果。</Text>
                    </View>
                    <View style={{ flexDirection: "row" }}>
                        <Text>{"\t\t"}三、</Text>
                        <Text numberOfLines={2}>若抽完牌庫，且剩餘兩位以上玩家，則手牌最大者獲勝。</Text>
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
                <View style={{ flex: 8 / 10 }}>
                    <Image
                        source={images.cardHelping}
                        style={styles.cardHelping}
                    />
                    <Text style={styles.closeHint} onPress={closeModal}>
                        點擊空白處關閉...
                    </Text>
                </View>
            </Modal>
        </View>
    );
};

const AlertModal = ({ show, closeModal, message }) => (
    <Modal isVisible={show} onBackdropPress={closeModal} style={styles.center}>
        <View style={{ flex: 8 / 10, alignItems: "center", justifyContent: "center" }}>
            <View style={{ backgroundColor: "white", padding: 10 }} >
                <StyleText fontSize={20} color="black">{message}</StyleText>
            </View>
            <Text style={styles.closeHint} onPress={closeModal}>
                點擊空白處關閉...
            </Text>
        </View>
    </Modal>
);

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 20,
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



export { StyleText, Manual, AlertModal, images };
