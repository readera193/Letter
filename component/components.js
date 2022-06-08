import React from "react";
import { Text } from "react-native";

const StyleText = ({ fontSize, color, fontWeight, style, children }) => {
    return (
        <Text style={[{ fontSize: fontSize, color: color, fontWeight: fontWeight }, style]}>
            {children}
        </Text>
    );
}

// function Row({ h, v, flex, style, children }) {
// 	return (
// 		<View
// 			style={[{ flexDirection: "row", justifyContent: h, alignItems: v, flex: flex }, style]}
// 		>
// 			{children}
// 		</View>
// 	);
// }

// function Column({ h, v, flex, style, children }) {
// 	return (
// 		<View style={[{ justifyContent: v, alignItems: h, flex: flex }, style]}>{children}</View>
// 	);
// }


export { StyleText/* , Row, Column */ };
