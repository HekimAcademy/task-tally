import * as React from "react";
import { useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from "expo-image";
import { StyleSheet, View, Pressable, Text, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Border, Padding, FontSize } from "../../GlobalStyles";
import axios from "axios";



const SignIn = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    const handleSignIn = async () => {
        try {
            const response = await axios.post('http://192.168.1.141:3000/auth/signIn', {
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            const responseData = response.data;
            console.log(responseData.uid);
            Alert.alert('Başarılı', 'Giriş işlemi başarıyla tamamlandı');
            await AsyncStorage.setItem('accessToken', responseData.accessToken);
            await AsyncStorage.setItem('uid', responseData.uid);
            navigation.navigate('Home')
        } catch (error: any) {
            console.error('Kayıt Hatası:', error.response.data);
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
                        <View style={[styles.frameChild, styles.frameBg]}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="E-mail"
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                            /></View>
                    </View>
                </View>
            </View>
            <View style={styles.frameView}>
                <View style={styles.rectangleParent}>
                    <View style={[styles.frameItem, styles.frameBg]} >
                        <TextInput
                            style={styles.textInput}
                            placeholder="şifre"
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
        width: 200,
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
