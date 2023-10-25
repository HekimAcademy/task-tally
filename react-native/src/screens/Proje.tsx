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
import { err } from "react-native-svg/lib/typescript/xml";

const Proje = () => {
    const navigation = useNavigation<any>();
    const [data, setData] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openModal, setOpenModal] = React.useState(false);
    const [project_name, setProjectName] = useState("")
    const [description, setDescription] = useState("")



    useEffect(() => {
        getProjectMemnbers()
    }, []);

    const closeModal = () => {
        setOpenModal(false);
    };



    interface Project {
        project_manager_id: string;
        department_id: string;
        description: string;
        project_name: string;
        users: User[];
    }

    interface User {
        user_email: string;
        user_name: string;
        user_id: string;
    }


    const AnimatedHeaderValue = new Animated.Value(0);
    const Header_Max_Height = 150;
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



    const isUserInProject = async () => {
        const userUid = await AsyncStorage.getItem('uid');
        const project_id = await AsyncStorage.getItem('ProjectId');
        const accessToken = await AsyncStorage.getItem('accessToken');

        try {
            const response = await fetch(`http://192.168.1.141:3000/projects/${project_id}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const responseBody = await response.text();
            console.log(responseBody);
            const projectData = JSON.parse(responseBody);

            const usersInProject: User[] = projectData.users;
            const isUserInProject = usersInProject.some(User => User.user_id === userUid);

            return isUserInProject;
        } catch (error) {
            console.error('Projeye dahil olup olmadığı kontrol edilemedi:', error);
            return false;
        }
    };

    const joinProjects = async () => {
        try {
            const isUserAlreadyInProject = await isUserInProject();

            if (isUserAlreadyInProject) {
                // Kullanıcı zaten projeye dahilse
                Alert.alert('Uyarı', 'Zaten Bu Projeye Katıldınız.');
            } else {
                // Kullanıcı projeye dahil değilse, katılma işlemi başlatılır
                Alert.alert(
                    'Katılma Onayı',
                    'Katılmak istediğinize emin misiniz?',
                    [
                        {
                            text: 'İptal',
                            style: 'cancel',
                        },
                        {
                            text: 'Evet',
                            onPress: async () => {
                                // Katılma işlemi burada gerçekleştirilir
                                const accessToken = await AsyncStorage.getItem('accessToken');
                                const project_id = await AsyncStorage.getItem('ProjectId');
                                const response = await axios.post(
                                    'http://192.168.1.141:3000/projects/join',
                                    {
                                        project_id: project_id,
                                    },
                                    {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${accessToken}`,
                                        },
                                    }
                                );
                                const responseData = response.data;
                                console.log(responseData);
                                Alert.alert('Başarılı', 'Projeye Başarıyla Katıldınız');
                                navigation.navigate('Home');
                            },
                        },
                    ],
                );
            }
        } catch (error) {
            Alert.alert('Bir hata oluştu:');
            console.error(error);
        }
    };

    async function leaveProject() {
        const apiUrl = 'http://192.168.1.141:3000/projects/leave';
        const accessToken = await AsyncStorage.getItem('accessToken');
        const project_id = await AsyncStorage.getItem('ProjectId');

        try {
            Alert.alert(
                'Projeden Ayrılma',
                'Projeden ayrılmak istediğinize emin misiniz?',
                [
                    {
                        text: 'Vazgeç',
                        style: 'cancel',
                    },
                    {
                        text: 'Evet',
                        onPress: async () => {
                            const response = await fetch(apiUrl, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${accessToken}`,
                                },
                                body: JSON.stringify({
                                    project_id: project_id,
                                }),
                            });

                            if (response.ok) {
                                console.log('Proje başarıyla terkedildi.');
                                Alert.alert('Projeden Ayrıldınız')
                            } else {
                                Alert.alert('Zaten Projeye Dahil Değilsiniz');
                            }
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error('Bir hata oluştu:', error);
        }
    }

    const getProjectMemnbers = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const projectId = await AsyncStorage.getItem('ProjectId');
            const userUid = await AsyncStorage.getItem('uid'); // Kullanıcının UID'si ya da benzersiz bir değer

            if (accessToken) {
                fetch(`http://192.168.1.141:3000/projects/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.text())
                    .then(responseText => {
                        try {
                            const data = JSON.parse(responseText);
                            setData(data.users);
                            console.log(data.users)
                            const users = data.users;
                            setProjectName(data.project_name)
                            setDescription(data.description)
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

    const handleGoBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.proje}>
            {isLoading && <Loader />}
            <Animated.View style={[styles.header, { height: animateHeaderHeight, backgroundColor: animateHeaderColor }]}>
                <TouchableOpacity style={styles.headericon2} onPress={handleGoBack}>
                    <Ionicons name="arrow-back-outline" size={30} color="white" />
                </TouchableOpacity>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerText2}>{project_name}</Text>
                    <Text style={styles.headerText3}>{description}</Text>
                </View>
                <View style={styles.headerContent}>
                    <View style={styles.headerIconsContainer}>
                        <TouchableOpacity style={styles.headericon} onPress={() => joinProjects()}>
                            <Ionicons name="enter-outline" size={30} color="white" />
                            <Text style={styles.menuText}>Projeye Katıl</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headericon} onPress={() => leaveProject()}>
                            <Ionicons name="exit-outline" size={30} color="white" />
                            <Text style={styles.menuText}>Terk et</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
            <SafeAreaView style={{ marginHorizontal: 20, marginTop: 105, zIndex: 2 }}>
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.user_email}
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
                                <Text style={{ fontSize: 16, fontWeight: '600' }}> {item.user_name}</Text>
                                <Text style={{ fontSize: 16, fontWeight: '600' }}> {item.user_email}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '600' }}> {item.user_id}</Text>
                            </View>
                            {/* <TouchableOpacity onPress={() => { leaveProject(item.project_id); }} style={{ marginLeft: 'auto', marginTop: '3%' }}>
                                        <Ionicons name="enter-outline" size={40} color="black" />
                                    </TouchableOpacity> */}
                        </View>
                    )}
                />
            </SafeAreaView> 
        </View>
    );
};


const styles = StyleSheet.create({
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
        width: '100%',
        marginRight: '15%'
    },
    headerIconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginRight: '10%'
    },
    headerText3: {
        color: Color.white,
        fontSize: 16,
        marginHorizontal: 30,
        marginTop: 20
    },
    headerText2: {
        color: Color.white,
        fontSize: 24,
        marginHorizontal: 30,
        marginTop: 20
    },
    headerTitle: {
        color: Color.white,
        position: 'absolute',
        justifyContent: 'flex-end',
        textAlign: 'center',
        flexDirection: 'column',
        marginLeft: '10%'
    },
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
        marginLeft: 20,
        color: 'white',
        marginTop: '18%',
        alignItems: 'center',
    },
    headericon2: {
        marginLeft: 5,
        color: 'white',
        marginTop: '10%',
        alignItems: 'center',
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
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
    },
    proje: {
        backgroundColor: Color.white,
        flex: 1,
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
        height: '100%',
    },
});


export default Proje;
