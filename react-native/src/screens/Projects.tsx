import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border } from "../../GlobalStyles";

const Projeler = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.projeler}>
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
                        <Pressable
                            style={styles.vector1}
                            onPress={() => navigation.navigate("Users")}
                        >
                            <Image
                                style={styles.iconLayout}
                                contentFit="cover"
                                source={require("../assets/vector1.png")}
                            />
                        </Pressable>
                    </View>
                    <View style={[styles.vectorFrame, styles.vectorSpaceBlock]}>
                        <Pressable
                            style={styles.vector1}
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
                    onPress={() => navigation.navigate("Projeler")}
                >
                    <Image
                        style={[styles.icon3, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/snippet-folder.png")}
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
    vector: {
        width: 26,
        height: 22,
    },
    vectorWrapper: {
        left: 22,
        top: 18,
        padding: Padding.p_3xs,
    },
    vector1: {
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
    icon3: {
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
        left: 33,
        borderRadius: Border.br_31xl,
        paddingHorizontal: 0,
        paddingVertical: Padding.p_7xs,
        position: "absolute",
    },
    projeler: {
        backgroundColor: Color.cadetblue,
        flex: 1,
        height: 852,
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
    },
});

export default Projeler;
