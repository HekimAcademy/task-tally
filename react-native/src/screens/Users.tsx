import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, Pressable, View, TextInput, Keyboard, Button, ActivityIndicator, Text, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border } from "../../GlobalStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import filter from "lodash.filter"
import BottomMenu from "../components/bottomMenu.tsx/bottom";
import Loader from "../components/selectInput/loader/Loader";


const Users = () => {
    const navigation = useNavigation<any>();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<user[]>([]);
    const [error, setError] = useState(null);
    const [fullData, setFullData] = useState<user[]>([]);
    const [filterdData, setFilterdData] = useState([])
    const [masterData, setMasterData] = useState([])


    useEffect(() => {

        getData();
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filterdData = fullData.filter((user) => contains(user.user_name, user.user_email, query));
        setData(filterdData);
    }


    const contains = (user_name: string, user_email: any, query: any) => {

        if (user_email.includes(query) || user_name.includes(query)) {
            return true
        }
        return false;
    }

    const getData = async () => {
        try {
            setIsLoading(true);
            const accessToken = await AsyncStorage.getItem('accessToken');
            if (accessToken) {
                fetch('http://192.168.1.141:3000/users', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                })
                    .then(response => response.json())
                    .then(responseJson => {
                        setFullData(responseJson)
                        setData(responseJson);
                        console.log(responseJson);
                        setFilterdData(responseJson);
                        setMasterData(responseJson);
                        setIsLoading(false);
                    })
            } else {
                console.log('accessToken bulunamadı.');
                setIsLoading(false);

            }
        } catch (error) {
            setIsLoading(false);

        }
    };


    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Kullanıcılar listelenirken bir hata oluştu ... Lütfen internet bağlantınızı kontrol ediniz</Text>
            </View>
        )
    }
    interface user {
        user_name: string,
        user_email: any,
        user_uid: any
    }

    return (
        <View style={styles.users}>
            {isLoading && <Loader />}
            <SafeAreaView style={{ marginBottom: 110 }}>
                <TextInput
                    placeholder="Search"
                    clearButtonMode="always"
                    style={styles.searchBox}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={(query) => handleSearch(query)}
                />
                <FlatList
                    data={data}
                    keyExtractor={(item: user) => item.user_uid.toString()}
                    contentContainerStyle={{
                        padding: 14,
                        paddingTop: 14,
                    }}
                    renderItem={({ item }) =>
                        <View style={{ flexDirection: 'row', padding: 20, marginBottom: 10, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 12, shadowColor: '000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: .3, shadowRadius: 20 }}>
                            <View>
                                <Text style={{ fontSize: 20, fontWeight: '500' }}>{item.user_name}</Text>
                                <Text style={{ fontSize: 18, opacity: 0.7 }}>{item.user_email}</Text>
                            </View>
                        </View>
                    }
                />
            </SafeAreaView>
            <View style={styles.bottom}>
                <BottomMenu />
            </View>
        </View >
    )
};

const styles = StyleSheet.create({
    loaderContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        zIndex: 1,
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
    root: {
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        width: "100%",
        marginTop: 20,
        fontSize: 25,
        fontWeight: "bold",
        marginLeft: "10%",
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
    searchbarIcon: {
        top: 15,
        left: 16,
        borderRadius: Border.br_28xl,
        width: 131,
        height: 105,
        position: "absolute",
        overflow: "hidden",
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
    vectorIcon: {
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
        height: 85,
        paddingHorizontal: 0,
        paddingVertical: Padding.p_7xs,
        position: "absolute",

    },
    users: {
        flex: 1,
        height: '100%',
        overflow: "hidden",
        width: "100%",
        borderRadius: Border.br_11xl,
        backgroundColor: Color.cadetblue
    },
});

export default Users;
