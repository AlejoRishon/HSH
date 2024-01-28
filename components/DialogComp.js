//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';

// create a component
const MyComponent = ({ visible, onClose, children }) => {
    return (
        <Modal animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => {
                onClose(false);
            }}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', minWidth: '50%', alignItems: 'center', display: 'flex', borderRadius: 8 }}>
                    <View style={{}}>
                        <Text style={{ color: '#01315C', marginVertical: 10, fontSize: 20 }}>Bluetooth devices</Text>
                    </View>
                    <ScrollView contentContainerStyle={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                        {children}
                    </ScrollView>
                    <TouchableOpacity onPress={onClose} style={{ padding: 10, backgroundColor: '#01315C', marginVertical: 10 }}><Text style={{ color: 'white' }}>Close</Text></TouchableOpacity>
                </View>
            </View>

        </Modal>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default MyComponent;
