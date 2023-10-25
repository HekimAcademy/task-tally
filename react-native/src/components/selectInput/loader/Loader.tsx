import { StyleSheet, Text, View, StatusBar, ActivityIndicator } from 'react-native'
import React from 'react'

export default function Loader() {

    return (
        <View style={styles.root}>
            <ActivityIndicator
                color='#1893F8'
                size={'large'} />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        ...StyleSheet.absoluteFillObject, // Tam ekran boyutunu kaplamak için
        backgroundColor: 'rgba(255, 255, 255, 1)', // Opak bir arka plan ekleyebilirsiniz,
        zIndex:88
    },
    text: {
        color: 'black', margin: 24
    }
})