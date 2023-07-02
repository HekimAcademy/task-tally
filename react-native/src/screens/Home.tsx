import { useState } from "react";
import { StyleSheet, Button, Pressable, Text, View } from "react-native";
import theme from "../styles/theme"
import CronometerButtonComponent from "../components/cronometerButton";
import SelectInputComponent from "../components/selectInput/selectInput";

export default function HomeScreen() {

    const [state, setState] = useState("Start");

    return (
        <View>
            <Text>Home Screen</Text>
            <SelectInputComponent />
            <View style={styles.container}>
                <Button title="Deatils" />
                <CronometerButtonComponent radius={250} state={state} setState={setState} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    }
});