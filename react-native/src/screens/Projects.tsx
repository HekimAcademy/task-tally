import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, View, Text, TextInput, FlatList, ActivityIndicator, TouchableOpacity, Alert, TouchableWithoutFeedback, Keyboard, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border } from "../../GlobalStyles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Animated } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from "axios";
import Loader from '../components/selectInput/loader/Loader'
import BottomMenu from "../components/bottomMenu.tsx/bottom";

const Projeler = () => {
    const navigation = useNavigation<any>();
    const [data, setData] = useState<projects[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = React.useState(false);
    const [project_name, setProjectName] = useState("")
    const [description, setDescription] = useState("")



    useEffect(() => {
        getProjects();
    }, []);

    const closeModal = () => {
        setOpenModal(false);
    };

    const checkDepartmentManager = async () => {
        const departmentId = await AsyncStorage.getItem('DepartmentId');
        const userUid = await AsyncStorage.getItem('uid');
        const accessToken = await AsyncStorage.getItem('accessToken');
        try {
            if (userUid !== null) {
                const response = await axios.get(`http://192.168.1.141:3000/departments/${departmentId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    }
                });
                const departmentData = response.data;
                const departmentManUid = departmentData.department_manager;

                if (departmentManUid === userUid) {
                    await createProject();
                } else {
                    Alert.alert("Sadece Departman Menajeri Proje oluşturabilir")
                }
            }
        } catch (error) {
            console.error('Lütfen Boş Bırakmayınız', error);
        }
    };



    const createProject = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const userUid = await AsyncStorage.getItem('uid');
            const departmentId = await AsyncStorage.getItem('correctDepartment');

            // Alanların boş olup olmadığını kontrol et
            if (!project_name || !description) {
                throw new Error('Lütfen tüm alanları doldurun.');
            }

            const response = await axios.post('http://192.168.1.141:3000/projects', {
                project_name: project_name,
                project_manager_id: userUid,
                department_id: departmentId,
                description: description
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                }
            });

            const responseData = response.data;
            console.log(responseData)
            Alert.alert('Başarılı', 'Projeye oluşturuldu');
        } catch (error: any) {
            Alert.alert(error.message); // Hata mesajını göster
            console.log(error);
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
                                    height: '40%',
                                    padding: 5,
                                    alignItems: 'center',
                                }}>
                                <Text style={styles.title}>Oluşturmak istediğiniz Projenin Bilgilerini Girin </Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Projenin Adı"
                                    placeholderTextColor='rgba(0,0,0, 0.1)'
                                    value={project_name}
                                    onChangeText={(text) => setProjectName(text)}
                                />
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="Projenin Tanımı"
                                    placeholderTextColor='rgba(0,0,0, 0.1)'
                                    value={description}
                                    onChangeText={(text) => setDescription(text)}
                                />
                                <TouchableOpacity
                                    style={styles.Buttonopacity}
                                    onPress={checkDepartmentManager}
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

    const SetProjectId = async (project_id: any) => {
        try {
            await AsyncStorage.setItem('ProjectId', project_id);
            console.log('Value saved:', project_id);
            navigation.navigate('Projects');
        } catch (error) {
            console.error('Error saving value:', error);
        }
    };





    const getProjects = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const departmentId = await AsyncStorage.getItem('correctDepartment');
            if (accessToken) {
                fetch(`http://192.168.1.141:3000/projects/department/${departmentId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.text())
                    .then(responseText => {
                        try {
                            const data = JSON.parse(responseText);
                            console.log(data)
                            setData(data);
                            setIsLoading(false);
                        } catch (error) {
                            setIsLoading(false);
                        }
                    })
                    .catch(error => {
                        console.error('API isteği başarısız:', error);
                        setIsLoading(false);
                    });
            } else {
                console.log('accessToken bulunamadı.');
            }
        } catch (error) {
            setIsLoading(false)
        }
    };


    interface projects {
        department_id: any,
        description: any,
        project_manager_id: any,
        project_name: any,
        project_id: any
    }

    const AnimatedHeaderValue = new Animated.Value(0);
    const Header_Max_Height = 120;
    const Header_Min_Height = 80;

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


    const goProjects = async () => {
        navigation.navigate('Proje')
    }


    return (
        <View style={styles.projeler}>
            {isLoading && <Loader />}
            <Animated.View style={[styles.header, { height: animateHeaderHeight, backgroundColor: animateHeaderColor }]}>
                <TouchableOpacity style={styles.headericon} onPress={() => setOpenModal(true)}>
                    <Ionicons name="add-circle-outline" size={34} color="white" />
                    <Text style={styles.menuText}>Proje Oluştur</Text>
                </TouchableOpacity>
                {renderModal()}
            </Animated.View>
            <SafeAreaView style={{ marginHorizontal: 20, marginTop: 80 }}>

                <FlatList
                    data={data}
                    keyExtractor={(item) => item.project_id.toString()}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: AnimatedHeaderValue } } }],
                        { useNativeDriver: false }
                    )}
                    contentContainerStyle={{
                        padding: 14,
                        paddingTop: 14,
                        height: '100%',
                    }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                SetProjectId(item.project_id)
                                    .then(() => goProjects())
                                    .catch((error) => console.error(error));
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    padding: 20,
                                    marginBottom: 15,
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    borderRadius: 12,
                                    shadowColor: '000',
                                    shadowOffset: { width: 10, height: 10 },
                                    shadowOpacity: 0.1,
                                    shadowRadius: 20,
                                }}
                            >
                                <View>
                                    <Text style={{ fontSize: 30, fontWeight: '600' }}> {item.project_name}</Text>
                                    <Text style={{ fontSize: 20, fontWeight: '500', opacity: 0.7 }}>{' '} {item.description}
                                    </Text>
                                </View>
                                {/* <TouchableOpacity onPress={() => { leaveProject(item.project_id); }} style={{ marginLeft: 'auto', marginTop: '3%' }}>
                                        <Ionicons name="enter-outline" size={40} color="black" />
                                    </TouchableOpacity> */}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </SafeAreaView>
            <View style={styles.bottom}>
                <BottomMenu />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({


    menuText: {
        fontSize: 12,
        marginTop: 5,
        color: 'white'
    },
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
    title: {
        fontSize: 12,
        fontWeight: '300',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
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
    textInput: {
        width: '85%',
        marginLeft: 15,
        fontSize: 20,
        borderWidth: 1,
        borderColor: '#264653',
        color: Color.black,
        padding: 10,
        borderRadius: 20,
        margin: '3%'
    },
    headericon: {
        marginLeft: 'auto',
        color: 'white',
        marginTop: '10%',
        margin: 10,
        alignItems: 'center',
        marginHorizontal: '6%',

    },
    HeaderText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        marginTop: '10%'
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
    itemStyle: {
        padding: 15
    },
    textName: {
        fontSize: 17,
        marginLeft: 10,
        fontWeight: "600",
        margin: 10
    },
    textEmail: {
        fontSize: 14,
        marginLeft: 10,
        color: "white"
    },
    searchBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderColor: '#CCC',
        borderWidth: 1,
        borderRadius: 8
    },
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
        top: '85%',
        left: '6.7%',
        borderRadius: Border.br_31xl,
        paddingHorizontal: 0,
        paddingVertical: Padding.p_7xs,
        position: "absolute",
    },
    projeler: {
        backgroundColor: Color.white,
        flex: 1,
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
        height: '100%',
    },
});

export default Projeler;
