import { StyleSheet, Button, Pressable, Text } from "react-native"
import theme from "../styles/theme"

interface ButtonProps {
    radius: number,
    state: string,
    setState: Function,
}


export default function CronometerButtonComponent({ radius, state, setState }: ButtonProps) {

    const buttonStyle = StyleSheet.flatten([
        styles.button,
        { width: radius, height: radius, borderColor: "white", borderWidth: 4 },
        state === "Start" ? { backgroundColor: theme.colors.green } : { backgroundColor: theme.colors.red }
    ]);
    const buttonContainerStyle = StyleSheet.flatten([
        styles.button,
        { width: radius * 1.05, height: radius * 1.05 },
        state === "Start" ? { backgroundColor: theme.colors.green } : { backgroundColor: theme.colors.red }
    ]);


    function click() {
        setState(state === "Start" ? "Stop" : "Start")
    }

    return (
        <Pressable style={buttonContainerStyle}>
            <Pressable style={buttonStyle} onPress={click}>
                <Text style={styles.text}>{state}</Text>
            </Pressable>
        </Pressable>
    )

}

const styles = StyleSheet.create({
    buttonContainer: {},
    button: {
        backgroundColor: theme.colors.green,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 1000,
    },
    text: {
        fontSize: 36,
        color: "white",
    }
});