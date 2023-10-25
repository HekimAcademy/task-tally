import * as React from "react";
import { useRef, RefObject } from 'react'
import { Image } from "expo-image";
import { StyleSheet, Pressable, View, TextInput, FlatList, ActivityIndicator, Touchable, TouchableOpacity, Dimensions, Alert, StatusBar, Button, TouchableWithoutFeedback, Modal, Keyboard } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border } from "../../GlobalStyles";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Animated } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";
import { Text } from 'react-native';
import Loader from '../components/selectInput/loader/Loader'
import BottomMenu from '../components/bottomMenu.tsx/bottom'

const Departman = () => {
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<department[]>([]);
    const [error, setError] = useState(null);
    const [openModal, setOpenModal] = React.useState(false);
    const [department_name, setDepartmentName] = useState("");

    useEffect(() => {
        setIsLoading(true)
        getDepartment();
    }, []);


    const getDepartment = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                fetch('http://192.168.1.141:3000/departments', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        console.log(responseJson)
                        setData(responseJson.departments);
                        setIsLoading(false);
                    })
                setIsLoading(false)
            } else {
                console.log('accessToken bulunamadı.');
            }
        } catch (error) {
            setIsLoading(false)
        }
    };


    const SetDepartId = async (id: any) => {
        try {
            await AsyncStorage.setItem('DepartmentId', id);
            console.log('Value saved:', id);
            navigation.navigate('Projects');
        } catch (error) {
            console.error('Error saving value:', error);
        }
    };
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} color="5500dc" />
            </View>
        )
    }
    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Kullanıcılar listelenirken bir hata oluştu ... Lütfen internet bağlantınızı kontrol ediniz </Text>
            </View>
        )
    }
    interface department {
        department_name: any;
        id: any
    }


    const AnimatedHeaderValue = new Animated.Value(0);
    const Header_Max_Height = 110;
    const Header_Min_Height = 97;
    const animateHeaderColor = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: ['black', '#498286'],
        extrapolate: 'clamp'
    });
    const animateHeaderHeight = AnimatedHeaderValue.interpolate({
        inputRange: [0, Header_Max_Height - Header_Min_Height],
        outputRange: [Header_Max_Height, Header_Min_Height],
        extrapolate: 'clamp'
    })
    const closeModal = () => {
        setOpenModal(false);
        setDepartmentName('');
    };



    const checkAdminDepartment = async () => {
        try {
            const userUid = await AsyncStorage.getItem('uid');
            if (userUid !== null) {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const response = await axios.get('http://192.168.1.141:3000/departments/LmjILZUQWGkoWwccYwFj', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                const departmentData = response.data;
                const adminUserUids: string[] = departmentData.department_members.map((member: { user_uid: string }) => member.user_uid);
                if (adminUserUids.includes(userUid)) {
                    await createDepartment();
                } else {
                    console.log('Kullanıcı ADMIN departmanında değil.');
                }
            }
        } catch (error) {
            console.error('Lütfen Boş Bırakmayınız', error);
        }
    };


    const createDepartment = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const response = await axios.post('http://192.168.1.141:3000/departments', {
                department_name: department_name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            }
            );
            const responseData = response.data;
            console.log(responseData)
            navigation.navigate('Departments')
            Alert.alert('Başarılı', 'Departman başarıyla oluşturuldu');
        } catch (error: any) {
            Alert.alert('Lütfen Boş Bırakmayınız');
            console.log(error)
        }
    }


    function renderModal() {
        return (
            <Modal visible={openModal} animationType="slide" transparent={true} onRequestClose={closeModal}>
                <TouchableWithoutFeedback onPress={closeModal}>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        }}>
                        <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{ alignItems: 'center', justifyContent: 'center' }}>
                            <View
                                style={{
                                    backgroundColor: 'white',
                                    width: '85%',
                                    borderRadius: 10,
                                    height: 250,
                                    padding: 5,
                                    alignItems: 'center',

                                }}>
                                <Text style={styles.title}>Oluşturmak istediğiniz Departmanın Adını Girin </Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Departman Adı"
                                    value={department_name}
                                    onChangeText={(text) => setDepartmentName(text)}
                                />
                                <TouchableOpacity
                                    style={styles.Buttonopacity}
                                    onPress={checkAdminDepartment}
                                >
                                    <Text>Create</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }

    return (
        <View style={styles.departman}>
            {isLoading && <Loader />}
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Loader />
            </View>
            <Animated.View style={[styles.header, { height: animateHeaderHeight, backgroundColor: animateHeaderColor }]}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: '10%' }}>
                    <Text style={styles.headerTitle}>Bulunduğunuz Departmanı Seçiniz</Text>
                </View>
                <TouchableOpacity style={styles.headericon} onPress={() => setOpenModal(true)}>
                    <Ionicons name="add-circle-outline" size={34} color="white" />
                </TouchableOpacity>
                {renderModal()}
            </Animated.View>
            <SafeAreaView style={{ marginHorizontal: 5, marginBottom: '5%', marginTop: '19%' }}>
                {isLoading ? (
                    <Loader />
                ) : (
                    <FlatList
                        data={data}
                        keyExtractor={(item: department) => item.id}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: AnimatedHeaderValue } } }],
                            { useNativeDriver: false }
                        )}
                        contentContainerStyle={{
                            padding: 24,
                        }}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => SetDepartId(item.id)}>
                                <View style={{ flexDirection: 'row', padding: 40, marginBottom: 25, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, shadowColor: '000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: .1, shadowRadius: 20 }}>
                                    <View>
                                        <Text style={{ fontSize: 22, fontWeight: '600' }}> {item.department_name}</Text>
                                        <Text style={{ fontSize: 14, opacity: 0.3 }}> {item.id}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                )}
            </SafeAreaView>
            <View style={styles.bottom}>
                <BottomMenu />
            </View>
        </View >
    );
};

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
    },
    headerTitle: {
        fontSize: 14,
        color: Color.white,
        fontWeight: '200'

    },
    title: {
        fontSize: 12,
        fontWeight: '300',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
    },
    textInput: {
        width: '85%',
        marginLeft: 15,
        fontSize: 20,
        borderWidth: 1,
        borderColor: '#264653',
        color: Color.black,
        padding: 10,
        borderRadius: 20
    },
    headericon: {
        marginLeft: 'auto',
        color: 'white',
        marginTop: '10%',
        margin: 10,
        height: '34%',
        width: '15%',
    },
    header: {
        width: '100%',
        backgroundColor: Color.black,
        color: Color.white,
        position: 'absolute',
        justifyContent: 'space-between',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: 10,
    },
    Buttonopacity: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        backgroundColor: Color.cadetblue,
        alignItems: 'center',
        justifyContent: 'center',
        color: Color.white,
        width: '40%',
        borderRadius: 20,
        marginTop: '15%'
    },
    departman: {
        height: '100%',
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
    },
});

export default Departman;
