import * as React from "react";
import { StyleSheet, View, Pressable, SafeAreaView, Text, TouchableOpacity, Modal, TouchableWithoutFeedback, Keyboard, FlatList } from "react-native";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { Border, Padding, Color } from "../../GlobalStyles";
import { useContext, useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomMenu from "../components/bottomMenu.tsx/bottom";


const Home: React.FC = () => {

    const navigation = useNavigation<any>();
    const [openModal, setOpenModal] = React.useState(false);
    const [data, setData] = useState<projects[]>([]);

    useEffect(() => {
        getProjects();
        checkUserDepartment();
    }, []);

    const getProjects = async () => {
        try {
            const departmentId = await AsyncStorage.getItem('DepartmentId');
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                const apiUrl = `http://192.168.1.141:3000/projects/department/${departmentId}`;
                fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    },
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        setData(responseJson)
                    })
                    .catch(error => {
                        console.error('Fetch Error:', error);
                    });
            } else {
                console.log('accessToken bulunamadı.');
            }
        } catch (error) {
            console.error('AsyncStorage Error:', error);
        }
    };

    const closeModal = () => {
        setOpenModal(false);
    };
    interface Department {
        id: any;
        department_name: any;
        department_manager: any;
        department_members: Array<{
            user_name: any;
            user_email: any;
            user_uid: any;
        }>;
    }

    const checkUserDepartment = async () => {
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            const userUid = await AsyncStorage.getItem('uid');

            // Tüm departmanları getir
            const response = await fetch('http://192.168.1.141:3000/departments', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const departmentResponse = await response.json();
            const departments: Department[] = Object.values(departmentResponse.departments);

            let foundDepartment: Department | null = null;

            for (const department of departments) {
                const departmentResponse = await fetch(`http://192.168.1.141:3000/departments/${department.id}`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const departmentData = await departmentResponse.json();
                if (Array.isArray(departmentData.department_members) && departmentData.department_members.some((department_members: any) => department_members.user_uid === userUid)) {
                    foundDepartment = department;
                    const departmentId = department.id;
                    console.log('Kullanıcının bulunduğu departman:', departmentId);
                    await AsyncStorage.setItem('correctDepartment', departmentId);
                }
            }
            if (foundDepartment === null) {
                console.log('Kullanıcı herhangi bir departmanda bulunmuyor.');
            } else {
            }
        } catch (error: any) {
            console.error('Departmanlar getirilirken bir hata oluştu:', error);
        }
    };




    interface projects {
        department_id: any,
        description: any,
        project_manager_id: any,
        project_name: any,
        project_id: any
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
                                <SafeAreaView style={{ marginHorizontal: 20, marginTop: 80 }}>
                                    <FlatList
                                        data={data}
                                        keyExtractor={(item: projects) => item.project_id}
                                        contentContainerStyle={{
                                            padding: 14,
                                            paddingTop: 14,
                                            height: '100%'
                                        }}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity>
                                                <View>
                                                    <View>
                                                        <Text style={{ fontSize: 10, fontWeight: '600' }}> {item.project_name}</Text>
                                                        <Text style={{ fontSize: 10, fontWeight: '500', opacity: 0.7 }}> {item.description}</Text>
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </SafeAreaView>

                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }
    const goToProjects = () => {
        navigation.navigate('Projects');
    };
    return (
        <View style={styles.home}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.projectsButton} onPress={goToProjects}>
                    <Text style={styles.buttonText}>Projeye Katıl</Text>
                </TouchableOpacity>
            </View>
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
    buttonText: {
        color: Color.black,
        fontSize: 16,
        textAlign: 'center',
    },
    projectsButton: {
        backgroundColor: Color.white,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    header: {
        width: '100%',
        backgroundColor: Color.black,
        color: Color.white,
        justifyContent: 'flex-end',
        alignItems: 'center',
        textAlign: 'center',
        height: '15%',
        flexDirection: 'row',
        paddingHorizontal: '4%',
        paddingTop: '6%'
    },
    home1Layout: {
        borderRadius: Border.br_11xl,
        overflow: "hidden",
    },
    homeSpaceBlock: {
        padding: Padding.p_3xs,
        position: "absolute",
    },
    home1Position: {
        left: 0,
        top: 0,
        position: "absolute",
    },
    vectorPosition: {
        top: 18,
        padding: Padding.p_3xs,
        position: "absolute",
    },
    iconLayout: {
        height: "100%",
        width: "100%",
    },
    frameChild: {
        borderRadius: Border.br_xl,
        width: 50,
        height: 50,
        backgroundColor: Color.white,
    },
    homeInner: {
        top: 29,
        left: 280,
        flexDirection: "row",
        padding: Padding.p_3xs,
    },
    frameItem: {
        height: 250,
        width: 228,
    },
    hourglassIcon: {
        top: 10,
        left: 10,
        width: 96,
        height: 96,
        position: "absolute",
    },
    hourglassWrapper: {
        top: 67,
        left: 56,
        width: 116,
        height: 116,
        position: "absolute",
    },
    vectorParent: {
        height: 260,
        width: 228,
    },
    homeChild: {
        top: 287,
        left: 71,
        flexDirection: "row",
        padding: Padding.p_3xs,
    },
    vectorIcon: {
        width: 30,
        height: 25,
    },
    vectorWrapper: {
        top: 42,
        left: 290,
    },
    vectorIcon1: {
        width: 26,
        height: 22,
    },
    vectorContainer: {
        left: 22,
    },
    vector: {
        width: 23,
        height: 20,
    },
    vectorFrame: {
        left: 109,
    },
    frameView: {
        top: 20,
        left: 193,
    },
    pages: {
        width: 327,
        height: 81,
        zIndex: 0,
        backgroundColor: Color.white,
    },
    icon2: {
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
        overflow: "hidden",
        backgroundColor: Color.white,
    },

    home: {
        backgroundColor: Color.white,
        flex: 1,
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
        height: '100%',
    },
});

export default Home;
