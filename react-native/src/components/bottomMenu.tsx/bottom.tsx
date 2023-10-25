import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Loader from '../selectInput/loader/Loader'
const BottomMenu = ({ }) => {
    const navigation = useNavigation<any>();
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        checkAdminDepartment();
        setIsLoading(true)
    }, []);

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
                    setIsAdmin(true);
                    setIsLoading(false);

                } else {
                    setIsAdmin(false);
                    setIsLoading(false)
                }
            }
        } catch (error) {
            console.error('Lütfen Boş Bırakmayınız', error);
        }
    };

    return (
        <View style={styles.bottomMenu}>
            {isLoading && <Loader />}
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Home')}
            >
                <Ionicons name="home" size={24} color="white" />
                <Text style={styles.menuText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Users')}
            >
                <Ionicons name="people-sharp" size={24} color="white" />
                <Text style={styles.menuText}>Users</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('Projects')}
            >
                <Ionicons name="documents-sharp" size={24} color="white" />
                <Text style={styles.menuText}>Projects</Text>
            </TouchableOpacity>
            {isAdmin && (
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate('Admin')}
                >
                    <Ionicons name="shield-checkmark" size={24} color="white" />
                    <Text style={styles.menuText}>Admin Paneli</Text>
                </TouchableOpacity>
            )
            }
        </View >
    );
};

const styles = StyleSheet.create({
    bottomMenu: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
        width: '100%',
        color: 'white'
    },

    menuItem: {
        alignItems: 'center',
        marginHorizontal: '6%',
        color: 'white'
    },
    menuText: {
        fontSize: 12,
        marginTop: 5,
        color: 'white'
    },
});

export default BottomMenu;
