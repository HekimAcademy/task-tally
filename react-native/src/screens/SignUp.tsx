import {
    Text,
    Button,
    View,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image
} from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";


export default function SignUpScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [name, setname] = useState('')

    const SignUp = useContext(AuthContext);

    const handleLogin = () => {
        const data = {
            email: email,
            password: password,
            name: name
        };
    }

    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <SafeAreaView style={{ flex: 0.66 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ backgroundColor: Colors.white, borderTopRightRadius: 10, borderBottomLeftRadius: 10, padding: 4, marginLeft: 10 }}
                    >
                        <ArrowLeftIcon color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 10 }}>
                    <Image source={require('../assets/images/elephant-clipart-transparent-background-12.png')}
                        style={{ width: 250, height: 250 }} />
                </View>
            </SafeAreaView>
            <View style={{ flex: 1, backgroundColor: Colors.white, paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <View style={{ marginTop: 9, marginVertical: 9 }}>
                    <Text
                        style={{ color: Colors.gray, fontWeight: '700', marginLeft: 20 }}>Ad</Text>
                    <TextInput
                        style={{ padding: 16, backgroundColor: Colors.InputGray, fontWeight: '700', borderRadius: 20, marginBottom: 20 }}
                        value={name}
                        placeholder=" Adinizi Giriniz"
                        onChangeText={text => setname(text)}

                    />
                    <Text
                        style={{ color: Colors.gray, fontWeight: '700', marginLeft: 20 }}> Email </Text>
                    <TextInput
                        style={{ padding: 16, backgroundColor: Colors.InputGray, fontWeight: '700', borderRadius: 20, marginBottom: 13 }}
                        value={email}
                        placeholder="Mail Adresinizi Giriniz"
                        onChangeText={text => setEmail(text)}

                    />
                    <Text
                        style={{ color: Colors.gray, fontWeight: '700', marginLeft: 20 }}> Sifre</Text>
                    <TextInput
                        style={{ padding: 16, backgroundColor: Colors.InputGray, fontWeight: '700', borderRadius: 20, marginBottom: 20 }}
                        value={password}
                        secureTextEntry
                        placeholder="Sifrenizi Giriniz"
                        onChangeText={text => setPassword(text)}



                    />
                    <TouchableOpacity
                        style={{ paddingVertical: 12, backgroundColor: Colors.black, borderRadius: 15 }}
                        onPress={() => { SignUp(name, email, password); }}
                    >
                        <Text style={{ fontSize: 15, color: Colors.white, fontWeight: 'bold', textAlign: 'center' }}>
                            Kayit Ol
                        </Text>
                    </TouchableOpacity>


                    <Text style={{ fontSize: 15, color: Colors.gray, fontWeight: 'bold', textAlign: 'center', paddingVertical: 30 }}>Ya da</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        <Text style={{ color: Colors.gray, fontWeight: 'bold', marginRight: 10 }}>Hesabiniz Var Mi ? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                            <Text style={{ fontWeight: 'bold', color: Colors.primary, marginLeft: 10 }}>Giris Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}
