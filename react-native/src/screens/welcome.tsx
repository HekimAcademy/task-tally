import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../constants/Colors'
import { useNavigation } from '@react-navigation/native'
const Welcome = () => {
    const navigation = useNavigation<any>();
    return (
        <SafeAreaView style={{ backgroundColor: Colors.white, flex: 1 }}>
            <View style={{ flex: 1, justifyContent: 'space-around' }}>
                <Text style={{ color: Colors.black, fontWeight: 'bold', textAlign: 'center', fontSize: 30 }}>
                    Hadi Baslayalim !
                </Text>
                <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                    <Image source={require("../assets/images/robot-1214536_1280.png")} style={{ width: 350, height: 350, marginRight: 10 }}></Image>
                </View>
                <View style={{ marginTop: 15 }}>
                    <TouchableOpacity 
                    onPress={() => navigation.navigate('SignIn')}
                    style={{ paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.black, marginHorizontal: 30, borderRadius: 10 }}>
                        <Text style={{ fontSize: 25, textAlign: 'center', color: Colors.white }}>Hosgeldin</Text>
                    </TouchableOpacity>
                    {/* <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Text style={{ color: Colors.primary, fontWeight: '600', margin: 10 }}> Hesabın Yok mu ?  </Text>
                        <TouchableOpacity onPress={navigation.navigate.bind(null, 'SignUp')}>
                            <Text style={{ fontWeight: '600', color: Colors.black, margin: 10 }}>Kayit Ol</Text>
                        </TouchableOpacity>
                    </View> */}
                </View>

            </View>
        </SafeAreaView>
    )
}

export default Welcome

const styles = StyleSheet.create({})