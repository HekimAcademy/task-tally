import { StyleSheet, Button, Pressable, Text, Modal, View } from "react-native"
import { useState, useEffect } from "react";
import SelectionScreenComponent from "./selectionScreen"
import theme from "../../styles/theme"

interface ButtonProps {
    radius: number,
    state: string,
    setState: Function,
}


export default function SelectInputComponent() {

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(String);

    const items = [
        { name: 'Item 1', description: 'Description 1' },
        { name: 'Item 2', description: 'Description 2' },
        { name: 'Item 3', description: 'Description 3' },
    ]

    useEffect(() => {
        setSelectedItem(items[0].name)
    }, [])

    function inputClick() {
        setModalVisible(true)
    }

    function selectItem(item: any) {
        console.log(item)
        setModalVisible(false)
    }

    return (
        <View>

            <Pressable style={styles.container} onPress={inputClick}>

                <Text style={styles.text}>
                    {selectedItem}
                </Text>

            </Pressable>
            <Modal
                visible={modalVisible}
                style={{ height: "100%", width: "100%" }}
            >
                <SelectionScreenComponent items={items} onSelectItem={selectItem}></SelectionScreenComponent>
            </Modal>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: 250,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        fontSize: 17,
    }
});