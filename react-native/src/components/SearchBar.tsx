import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View } from "react-native";
import { Border, Color } from "../../GlobalStyles";

const SearchBar = () => {
    return (
        <View style={styles.searchbar}>
            <Image
                style={[styles.property1defaultIcon, styles.iconPosition]}
                contentFit="cover"
                source={require("../assets/property-1default.png")}
            />
            <Image
                style={[styles.property1variant2Icon, styles.iconPosition]}
                contentFit="cover"
                source={require("../assets/property-1variant2.png")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    iconPosition: {
        borderRadius: Border.br_28xl,
        left: 0,
        position: "absolute",
        overflow: "hidden",
    },
    property1defaultIcon: {
        top: 1,
        width: 128,
        height: 105,
    },
    property1variant2Icon: {
        top: 80,
        width: 363,
        height: 98,
    },
    searchbar: {
        borderRadius: Border.br_8xs,
        borderStyle: "dashed",
        borderColor: Color.colorBlueviolet,
        borderWidth: 1,
        width: 400,
        height: 178,
        overflow: "hidden",
    },
});

export default SearchBar;
