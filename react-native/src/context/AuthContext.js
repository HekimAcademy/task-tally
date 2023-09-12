import axios from 'axios';
import React, { createContext } from 'react';
import { BASE_URL } from '../constants/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const SignUp = (name, email, password) => {
        axios
            .post(`${BASE_URL}/auth/signUp`, {
                name, email, password
            }).then(res => {
                let userInfo = res.data;
                console.log(userInfo)
            })
            .catch(e => {
                console.log(`Kayit Hatasi ${e}`)
            })
    }

    return (
        <AuthContext.Provider value={{ SignUp }}>
            {children}
        </AuthContext.Provider>
    )
}

export default SignUp;