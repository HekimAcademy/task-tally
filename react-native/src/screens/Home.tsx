import * as React from "react";
import { StyleSheet, View, Pressable } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Border, Padding, Color } from "../../GlobalStyles";

const Home = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.home}>
            <View style={[styles.home1, styles.home1Layout]}>
                <View style={[styles.homeInner, styles.homeSpaceBlock]}>
                    <View style={styles.frameChild} />
                </View>
                <View style={[styles.homeChild, styles.homeSpaceBlock]}>
                    <View style={styles.vectorParent}>
                        <Image
                            style={[styles.frameItem, styles.home1Position]}
                            contentFit="cover"
                            source={require("../assets/ellipse-1.png")}
                        />
                        <View style={styles.hourglassWrapper}>
                            <Image
                                style={styles.hourglassIcon}
                                contentFit="cover"
                                source={require("../assets/hourglass.png")}
                            />
                        </View>
                    </View>
                </View>
                <View style={[styles.vectorWrapper, styles.homeSpaceBlock]}>
                    <Image
                        style={styles.vectorIcon}
                        contentFit="cover"
                        source={require("../assets/male-user.png")}
                    />
                </View>
                <View style={styles.bottommenu}>
                    <View style={[styles.pages, styles.home1Layout]}>
                        <View style={[styles.vectorContainer, styles.vectorPosition]}>
                            <Image
                                style={styles.vectorIcon1}
                                contentFit="cover"
                                source={require("../assets/vector4.png")}
                            />
                        </View>
                        <View style={[styles.vectorFrame, styles.vectorPosition]}>
                            <Pressable
                                style={styles.vector}
                                onPress={() => navigation.navigate("Users")}
                            >
                                <Image
                                    style={styles.iconLayout}
                                    contentFit="cover"
                                    source={require("../assets/vector1.png")}
                                />
                            </Pressable>
                        </View>
                        <View style={[styles.frameView, styles.homeSpaceBlock]}>
                            <Pressable
                                style={styles.vector}
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
        </View>
    );
};

const styles = StyleSheet.create({
    home1Layout: {
        borderRadius: Border.br_11xl,
        overflow: "hidden",
    },
    homeSpaceBlock: {
        padding: Padding.p_3xs,
        position: "absolute",
    },
    home1Position: {
        left: 0,
        top: 0,
        position: "absolute",
    },
    vectorPosition: {
        top: 18,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    iconLayout: {
        height: "100%",
        width: "100%",
    },
    frameChild: {
        borderRadius: Border.br_xl,
        width: 50,
        height: 50,
        backgroundColor: Color.white,
    },
    homeInner: {
        top: 29,
        left: 280,
        flexDirection: "row",
        padding: Padding.p_3xs,
    },
    frameItem: {
        height: 250,
        width: 228,
    },
    hourglassIcon: {
        top: 10,
        left: 10,
        width: 96,
        height: 96,
        position: "absolute",
    },
    hourglassWrapper: {
        top: 67,
        left: 56,
        width: 116,
        height: 116,
        position: "absolute",
    },
    vectorParent: {
        height: 260,
        width: 228,
    },
    homeChild: {
        top: 287,
        left: 71,
        flexDirection: "row",
        padding: Padding.p_3xs,
    },
    vectorIcon: {
        width: 30,
        height: 25,
    },
    vectorWrapper: {
        top: 42,
        left: 290,
    },
    vectorIcon1: {
        width: 26,
        height: 22,
    },
    vectorContainer: {
        left: 22,
    },
    vector: {
        width: 23,
        height: 20,
    },
    vectorFrame: {
        left: 109,
    },
    frameView: {
        top: 20,
        left: 193,
    },
    pages: {
        width: 327,
        height: 81,
        zIndex: 0,
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
        paddingHorizontal: 0,
        paddingVertical: Padding.p_7xs,
        position: "absolute",
        overflow: "hidden",
        backgroundColor: Color.white,
    },
    home1: {
        backgroundColor: Color.cadetblue,
        width: 390,
        left: 0,
        top: 0,
        position: "absolute",
        height: 844,
    },
    home: {
        flex: 1,
        overflow: "hidden",
        height: 844,
        width: "100%",
        backgroundColor: Color.white,
    },
});

export default Home;
