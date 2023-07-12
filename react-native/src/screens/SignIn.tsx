import { Text, Button, View, SafeAreaView, TouchableOpacity, TextInput, Image } from "react-native";
import Colors from "../constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from 'react-native-heroicons/solid'
import { useState } from "react";
import axios from "axios";

export default function SignInScreen() {
    const navigation = useNavigation<any>();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')

    const handleLogin = () => {
        const data = {
            email: email,
            password: password
        };

        axios.post('http://localhost:3000/auth/signIn', data)
            .then(Response => {
                console.log('Yanit', Response.data);
            })
            .catch(error => {
                console.log('hata', error.Response.data)
            })
    }
    return (
        <View style={{ flex: 1, backgroundColor: Colors.black }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        style={{ backgroundColor: Colors.white, borderTopRightRadius: 10, borderBottomLeftRadius: 10, padding: 4, marginLeft: 15, }}
                    >
                        <ArrowLeftIcon color={Colors.black} />
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 40 }}>
                    <Image source={require('../assets/images/elephant-clipart-transparent-background-12.png')}
                        style={{ width: 250, height: 250 }} />
                </View>
            </SafeAreaView>
            <View style={{ flex: 1.3, backgroundColor: Colors.white, paddingHorizontal: 32, paddingTop: 32, borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
                <View style={{ marginTop: 9, marginVertical: 9 }}>
                    <Text
                        style={{ color: Colors.gray, fontWeight: '700', marginLeft: 20 }}> Email </Text>
                    <TextInput
                        style={{ padding: 16, backgroundColor: Colors.InputGray, fontWeight: '700', borderRadius: 20, marginBottom: 13 }}
                        value={email}
                        onChangeText={text => setEmail(text)}
                        placeholder="Mail Adresinizi Giriniz"
                    />
                    <Text
                        style={{ color: Colors.gray, fontWeight: '700', marginLeft: 20 }}> Sifre</Text>
                    <TextInput
                        style={{ padding: 16, backgroundColor: Colors.InputGray, fontWeight: '700', borderRadius: 20, marginBottom: 20 }}
                        value={password}
                        onChangeText={text => setPassword(text)}
                        // secureTextEntry
                        placeholder="Sifrenizi Giriniz"
                    />
                    <TouchableOpacity style={{ paddingVertical: 12, backgroundColor: Colors.black, borderRadius: 15 }}
                        onPress={handleLogin}
                    >
                        <Text style={{ fontSize: 15, color: Colors.white, fontWeight: 'bold', textAlign: 'center' }}>
                            Giris Yap
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontSize: 15, color: Colors.gray, fontWeight: 'bold', textAlign: 'center', paddingVertical: 30 }}>Ya da</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', }}>
                        <Text style={{ color: Colors.gray, fontWeight: 'bold', marginRight: 10 }}>Hesabiniz Yok mu ?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={{ fontWeight: 'bold', color: Colors.primary, marginLeft: 10 }}>Kayit Ol</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}