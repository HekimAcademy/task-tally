import React from 'react';
import { View, Button, Pressable, Text } from 'react-native';
import { StyleSheet } from 'react-native';

interface SelectionScreenProps {
    items: Array<any>,
    onSelectItem: Function
}


export default function SelectionScreenComponent({ items, onSelectItem }: SelectionScreenProps) {
    return (
        <View style={styles.container}>
            {items.map((item, index) => (
                <Pressable
                    key={index}
                    onPress={() => onSelectItem(item)}
                    style={styles.itemContainer}
                >
                    <Text style={styles.title}>{item.name}</Text>
                    <Text>{item.description}</Text>
                </Pressable>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
    },
    itemContainer: {
        backgroundColor: "grey",
        width: "100%",
        marginTop: 30,
        padding: 20,
        paddingLeft: 50,
        paddingRight: 50,
    },
    title:{
        fontSize: 20,
    }
})
