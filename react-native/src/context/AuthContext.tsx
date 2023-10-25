import axios from 'axios';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { BASE_URL } from '../config';
import * as SecureStore from 'expo-secure-store'
import { json } from 'sequelize';
import { err } from 'react-native-svg/lib/typescript/xml';
interface AuthProps {
    authState?: { token: string | null; authenticated: boolean | null };
    onRegister?: (email: string, password: string, name: string) => Promise<any>;
    onLogin?: (email: string, password: string) => Promise<any>;
    onLogout?: () => Promise<any>;
}
const TOKEN_KEY = 'firebase'

export const AuthContext = createContext<AuthProps>({});
export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }: any) => {
    const [authState, setAuthState] = useState<{
        token: String | null,
        authenticated: Boolean | null
    }>({
        token: null,
        authenticated: null
    })

    useEffect(() => {
        const loadToken = async () => {
            const token = await SecureStore.getItemAsync(TOKEN_KEY)
        }
    })

    const register = async (email: String, name: String, password: String) => {
        try {
            const result = await axios.post(`${BASE_URL}auth/signUp`, { email, password, name },);

            result.data.accessToken

            return result;
        } catch (e) {
            console.error('Firebase Hatası:',);
            throw e
        }
    }

    const value = {
        onRegister: register
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
