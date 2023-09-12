import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border } from "../../GlobalStyles";

const Users = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.users}>
            <Image
                style={styles.searchbarIcon}
                contentFit="cover"
                source={require("../assets/property-1default.png")}
            />
            <View style={[styles.bottommenu, styles.pagesBg]}>
                <View style={[styles.pages, styles.pagesBg]}>
                    <View style={[styles.vectorWrapper, styles.vectorSpaceBlock]}>
                        <Pressable
                            style={styles.vector}
                            onPress={() => navigation.navigate("Home")}
                        >
                            <Image
                                style={styles.iconLayout}
                                contentFit="cover"
                                source={require("../assets/vector.png")}
                            />
                        </Pressable>
                    </View>
                    <View style={[styles.vectorContainer, styles.vectorSpaceBlock]}>
                        <Image
                            style={styles.vectorIcon}
                            contentFit="cover"
                            source={require("../assets/vector5.png")}
                        />
                    </View>
                    <View style={[styles.vectorFrame, styles.vectorSpaceBlock]}>
                        <Pressable
                            style={styles.vectorIcon}
                            onPress={() => navigation.navigate("Departmans")}
                        >
                            <Image
                                style={styles.iconLayout}
                                contentFit="cover"
                                source={require("../assets/vector2.png")}
                            />
                        </Pressable>
                    </View>
                </View>
                <Pressable
                    style={styles.snippetFolder}
                    onPress={() => navigation.navigate("Projects")}
                >
                    <Image
                        style={[styles.icon2, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/snippet-folder1.png")}
                    />
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    pagesBg: {
        backgroundColor: Color.white,
        overflow: "hidden",
    },
    vectorSpaceBlock: {
        padding: Padding.p_3xs,
        position: "absolute",
    },
    iconLayout: {
        height: "100%",
        width: "100%",
    },
    searchbarIcon: {
        top: 15,
        left: 16,
        borderRadius: Border.br_28xl,
        width: 131,
        height: 105,
        position: "absolute",
        overflow: "hidden",
    },
    vector: {
        width: 26,
        height: 22,
    },
    vectorWrapper: {
        left: 22,
        top: 18,
        padding: Padding.p_3xs,
    },
    vectorIcon: {
        width: 23,
        height: 20,
    },
    vectorContainer: {
        left: 109,
        top: 18,
        padding: Padding.p_3xs,
    },
    vectorFrame: {
        top: 20,
        left: 193,
    },
    pages: {
        width: 327,
        height: 81,
        zIndex: 0,
        borderRadius: Border.br_11xl,
        backgroundColor: Color.white,
    },
    icon2: {
        overflow: "hidden",
    },
    snippetFolder: {
        left: 255,
        top: 21,
        width: 45,
        height: 47,
        zIndex: 1,
        position: "absolute",
    },
    bottommenu: {
        top: 690,
        left: 31,
        borderRadius: Border.br_31xl,
        height: 85,
        paddingHorizontal: 0,
        paddingVertical: Padding.p_7xs,
        position: "absolute",
    },
    users: {
        backgroundColor: Color.cadetblue,
        flex: 1,
        height: 844,
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
    },
});

export default Users;
