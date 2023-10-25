import React, { useContext, useEffect, useState } from "react";
import { Image } from "expo-image";
import { StyleSheet, View, Pressable, Text, TextInput, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Padding, Color, Border, FontSize } from "../../GlobalStyles";
import Colors from "../constants/Colors";
import axios from "axios";
import { Formik } from 'formik';



const SignUp = () => {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [token, setToken] = React.useState<String>("")
    const [error, showError] = React.useState<Boolean>(false);


    const handleSignUp = async () => {
        try {
            const response = await axios.post('http://192.168.1.141:3000/auth/signUp', {
                name: name,
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            const responseData = response.data;
            console.log(responseData);
            console.log(responseData.accessToken);
            Alert.alert('Başarılı', 'Kayıt işlemi başarıyla tamamlandı');
            navigation.navigate('SignIn')
        } catch (error: any) {
            console.error('Kayıt Hatası:', error.response.data);
        }
    };


    
    return (

        <View style={styles.signUp} >
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

            <View style={[styles.rectangleParent, styles.rectanglePosition]}>

                <View style={[styles.frameChild, styles.framePosition]}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Şifre"
                        onChangeText={(text: string) => setPassword(text)}
                        value={password}
                        secureTextEntry={true}
                    />
                </View>
                <Image
                    style={[styles.lockIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/lock.png")}
                />
            </View>
            <View style={[styles.signUpInner, styles.rectanglePosition]}>
                <Pressable
                    style={[styles.frameItem, styles.frameLayout]}
                    onPress={handleSignUp}
                />
            </View>

            <Text style={[styles.hesabnVarM, styles.giriYap1Typo]}>{`Hesabın Var Mı ? 
`}</Text>
            <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
                <View style={[styles.frameInner, styles.frameLayout]} >
                    <TextInput
                        style={styles.textInput}
                        placeholder="İsminizi Giriniz"
                        onChangeText={(text: string) => setName(text)}
                        value={name}
                    /></View>
                <Image
                    style={[styles.driveFileRenameOutline, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/drive-file-rename-outline.png")}
                />
            </View>
            <Text style={styles.kaytOl}>Kayıt Ol</Text>
            <Pressable
                style={styles.giriYap}
                onPress={() => navigation.navigate("SignIn")}
            >
                <Text style={[styles.giriYap1, styles.giriYap1Typo]}>{`Giriş Yap
`}</Text>
            </Pressable>
            <View style={styles.rectangleContainer}>
                <View style={[styles.frameChild, styles.framePosition]}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="E-posta adresi"
                        onChangeText={(text: string) => setEmail(text)}
                        value={email}
                    />
                </View>
                <Image
                    style={[styles.maleUserIcon, styles.iconPosition]}
                    contentFit="cover"
                    source={require("../assets/male-user.png")}
                />
            </View>

        </View >
    );
};

const styles = StyleSheet.create({
    textInput: {
        width: 200,
        marginLeft: 60,
        marginTop: 13,
        color: Colors.black
    },
    rectanglePosition: {
        padding: Padding.p_3xs,
        left: 48,
        position: "absolute",
    },
    framePosition: {
        zIndex: 0,
        backgroundColor: Color.white,
        borderRadius: Border.br_base,
    },
    iconPosition: {
        zIndex: 1,
        height: 29,
        width: 41,
        position: "absolute",
    },
    frameLayout: {
        height: 47,
        width: 274,
    },
    giriYap1Typo: {
        textAlign: "right",
        fontWeight: "500",
        fontSize: FontSize.size_xs,
    },
    rectangleIcon: {
        top: 0,
        left: 0,
        width: 390,
        position: "absolute",
        height: 844,
    },
    frameChild: {
        height: 44,
        width: 274,
        zIndex: 0,
    },
    lockIcon: {
        top: 17,
        left: 20,
    },
    rectangleParent: {
        top: 506,
    },
    frameItem: {
        borderRadius: Border.br_sm,
        backgroundColor: Color.cadetblue,
    },
    signUpInner: {
        top: 605,
    },
    hesabnVarM: {
        top: 728,
        left: 8,
        color: Color.black,
        width: 187,
        height: 18,
        position: "absolute",
    },
    frameInner: {
        zIndex: 0,
        backgroundColor: Color.white,
        borderRadius: Border.br_base,
    },
    driveFileRenameOutline: {
        top: 19,
        left: 21,
        overflow: "hidden",
    },
    rectangleGroup: {
        top: 308,
    },
    kaytOl: {
        top: 626,
        left: 125,
        fontSize: FontSize.size_xl,
        textAlign: "center",
        width: 143,
        height: 23,
        color: Color.white,
        position: "absolute",
    },
    giriYap1: {
        width: 83,
        height: 11,
        color: Color.white,
    },
    giriYap: {
        left: 226,
        top: 729,
        position: "absolute",
    },
    maleUserIcon: {
        top: 13,
        left: 17,
    },
    rectangleContainer: {
        top: 409,
        paddingHorizontal: 9,
        paddingVertical: 6,
        left: 48,
        position: "absolute",
    },
    signUp: {
        flex: 1,
        width: "100%",
        overflow: "hidden",
        height: 844,
        backgroundColor: Color.white,
        borderRadius: Border.br_base,
    },
});

export default SignUp;
