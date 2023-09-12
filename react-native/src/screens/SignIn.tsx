import * as React from "react";
import { useState } from "react";

import { Image } from "expo-image";
import { StyleSheet, View, Pressable, Text, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Border, FontFamily, Padding, FontSize } from "../../GlobalStyles";
import axios from "axios";


const SignIn = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSignIn = async () => {
        try {
            const response = await fetch("{{main_url}}/auth/signIn", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.status === 200) {
                // Giriş başarılı, işlemi devam ettirin
                // Örneğin, kullanıcıyı ana sayfaya yönlendirin
            } else {
                // Giriş başarısız, hata mesajını işleyin
                // Örneğin, kullanıcıya hata mesajını gösterin
            }
        } catch (error) {
            // Hata durumunu işleyin
            console.error("Giriş sırasında bir hata oluştu:", error);
        }
    };


    return (
        <View style={[styles.signIn, styles.frameBg]}>
            <Image
                style={styles.rectangleIcon}
                contentFit="cover"
                source={require("../assets/rectangle.png")}
            />
            <Image
                style={styles.rectangleIcon}
                contentFit="cover"
                source={require("../assets/rectangle-1.png")}
            />
            <View style={styles.signInInner}>
                <View style={styles.frameWrapper}>
                    <View style={styles.frameWrapper}>
                        <View style={[styles.frameChild, styles.frameBg]} />
                    </View>
                </View>
            </View>
            <View style={styles.frameView}>
                <View style={styles.rectangleParent}>
                    <View style={[styles.frameItem, styles.frameBg]} >
                        <TextInput
                            style={styles.textInput}
                            placeholder="Şire"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                        />
                    </View>
                    <Image
                        style={[styles.lockIcon, styles.iconLayout]}
                        contentFit="cover"
                        source={require("../assets/lock.png")}
                    />
                </View>
            </View>
            <View style={styles.signInInner1}>
                <View />
            </View>
            <View style={styles.signInInner2}>
                <Pressable
                    style={styles.rectanglePressable}
                    onPress={handleSignIn}
                />
            </View>
            <Text style={[styles.hesabnYokM, styles.kaytOlPosition]}>
                hesabın yok mı ?
            </Text>
            <Pressable
                style={[styles.kaytOl, styles.kaytOlPosition]}
                onPress={() => navigation.navigate("SignUp")}
            >
                <Text style={[styles.kaytOl1, styles.kaytOl1Typo]}>kayıt ol</Text>
            </Pressable>
            <Text style={[styles.giriYap, styles.kaytOl1Typo]}>{`Giriş Yap
`}</Text>
            <Image
                style={[styles.maleUserIcon, styles.iconLayout]}
                contentFit="cover"
                source={require("../assets/male-user.png")}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    textInput: {
        width: 100,
        marginLeft: 60,
        marginTop: 13
    },
    frameBg: {
        backgroundColor: Color.white,
        borderRadius: Border.br_base,
    },
    iconLayout: {
        height: 29,
        width: 41,
        position: "absolute",
    },
    kaytOlPosition: {
        top: 731,
        position: "absolute",
    },
    kaytOl1Typo: {
        textAlign: "center",
        color: Color.white,
        fontFamily: FontFamily.interRegular,
    },
    rectangleIcon: {
        top: 0,
        left: 0,
        width: 390,
        position: "absolute",
        height: 844,
    },
    frameChild: {
        height: 47,
        width: 274,
    },
    frameWrapper: {
        padding: Padding.p_3xs,
    },
    signInInner: {
        top: 366,
        left: 28,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    frameItem: {
        height: 44,
        zIndex: 0,
        width: 274,
    },
    lockIcon: {
        top: 17,
        left: 15,
        zIndex: 1,
    },
    rectangleParent: {
        padding: Padding.p_3xs,
    },
    frameView: {
        top: 466,
        left: 38,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    signInInner1: {
        top: 396,
        left: 59,
        flexDirection: "row",
        height: 47,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    rectanglePressable: {
        borderRadius: Border.br_sm,
        backgroundColor: Color.cadetblue,
        height: 47,
        width: 274,
    },
    signInInner2: {
        top: 607,
        left: 48,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    hesabnYokM: {
        left: 8,
        fontWeight: "500",
        fontFamily: FontFamily.interMedium,
        color: Color.black,
        textAlign: "right",
        width: 187,
        height: 18,
        fontSize: FontSize.size_xs,
    },
    kaytOl1: {
        fontSize: FontSize.size_xs,
    },
    kaytOl: {
        left: 252,
    },
    giriYap: {
        top: 631,
        left: 108,
        fontSize: FontSize.size_xl,
        width: 165,
        height: 20,
        position: "absolute",
    },
    maleUserIcon: {
        top: 405,
        left: 63,
    },
    signIn: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
        height: 844,
    },
});

export default SignIn;
