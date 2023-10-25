import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import BottomMenu from '../components/bottomMenu.tsx/bottom';
const Admin = ({ }) => {
    const navigation = useNavigation<any>();

    return (
        <BottomMenu/>
    );
};

const styles = StyleSheet.create({

});

export default Admin;
