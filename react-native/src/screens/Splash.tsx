import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, FontSize, Border } from "../../GlobalStyles";

const Splash = () => {
    const navigation = useNavigation<any>();

    return (
        <View style={styles.splash}>
        <Text></Text>
            <View style={styles.atTheOfficebroWrapper}>
                <Image
                    style={styles.atTheOfficebroIcon}
                    contentFit="cover"
                    source={require("../assets/attheofficebro1.png")}
                />
            </View>
            <Text style={[styles.itsABig, styles.itsABigTypo]}>
                It’s a big world out there go explore
            </Text>
            <Pressable
                style={styles.getStartedWrapper}
                onPress={() => navigation.navigate("SignIn")}
            >
                <Text style={[styles.getStarted, styles.itsABigTypo]}>{`Hadi Başlayalım
`}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    itsABigTypo: {
        textAlign: "center",
        color: Color.black,
        position: "absolute",
    },
    atTheOfficebroIcon: {
        width: 333,
        height: 299,
    },
    atTheOfficebroWrapper: {
        top: 235,
        left: 40,
        width: 325,
        flexDirection: "row",
        position: "absolute",
    },
    itsABig: {
        top: 95,
        left: 52,
        fontSize: FontSize.size_base,
        width: 301,
        height: 44,
    },
    getStarted: {
        top: '20%',
        left: '22%',
        fontSize: 18,
        width: 172,
        height: 27,
        transform: [
            {
                rotate: "0.52deg",
            },
        ],
    },
    getStartedWrapper: {
        top: '89%',
        left: '12%',
        borderRadius: Border.br_smi,
        backgroundColor: Color.cadetblue,
        width: 300,
        height: 49,
        position: "absolute",
        overflow: "hidden",
    },
    splash: {
        borderRadius: Border.br_base,
        backgroundColor: Color.white,
        flex: 1,
        width: "100%",
        height: '100%',
        overflow: "hidden",
    },
});

export default Splash;
