import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import { FontSize, FontFamily, Color } from "../../GlobalStyles";

const SearchBar1 = () => {
    return (
        <View style={styles.searchbar}>
            <Image
                style={styles.searchIcon}
                contentFit="cover"
                source={require("../assets/search.png")}
            />
            <Text style={styles.search}>{`search
`}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    searchIcon: {
        width: 45,
        height: 96,
    },
    search: {
        fontSize: FontSize.size_6xl,
        fontFamily: FontFamily.interRegular,
        color: Color.black,
        textAlign: "left",
        width: 99,
        height: 32,
        marginLeft: 51,
    },
    searchbar: {
        flexDirection: "row",
        alignItems: "center",
    },
});

export default SearchBar1;
