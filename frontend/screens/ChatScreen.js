import React, {useState} from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, ScrollView } from 'react-native';
import {connect} from 'react-redux';
import { ListItem, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import socketIOClient from "socket.io-client";

var socket = socketIOClient("http://192.168.1.14:3000");

function ChatScreen(props) {
    const [currentMessage, setCurrentMessage] = useState('');
    const [listMessage, setListMessage] = useState([]);

    
    socket.on('sendMessageToAll', (messageData) => {
        setListMessage([...listMessage, messageData]);
    })
    
    // Emojis
    var tabUnicodes = [
        {string: /\:\)/g, unicode: '\u263A'},
        {string: /\:\(/g, unicode: '\u2639'},
        {string: /\:p/gi, unicode: '\uD83D\uDE1B'},
        {string: /\<3/g, unicode: '\u2764'},
        {string: /\:\@/g, unicode: '\uD83D\uDE20'},
        {string: /[a-z]*fuck[a-z]*/gi, unicode: '\u2022 \u2022 \u2022'}
    ];

    var checkEmojisAndSwearword = (message) => {
        for (var i = 0; i < tabUnicodes.length; i++) {
            message = message.replace(tabUnicodes[i].string, tabUnicodes[i].unicode);
        }
        return message;
    }

    return (
        <View style={{flex: 1, flexDirection: 'column', justifyContent: "space-between"}}>
            <ScrollView>
                <View>
                    {
                        listMessage.map((messageData, i) => (
                            <ListItem
                                key={i}
                                title={messageData.pseudo}
                                subtitle={checkEmojisAndSwearword(messageData.message)}  
                            />
                        ))
                    }
                </View>
            </ScrollView>
            <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"}>
                <View style={styles.inner}>
                    <TextInput placeholder="Your message" onChange={(e) => {setCurrentMessage(e.nativeEvent.text)}} value={currentMessage} style={styles.textInput} />
                    <View style={styles.btnContainer}>
                        
                    </View>
                </View>
                <Button 
                    title="Send"
                    icon={
                        <Icon
                            name="envelope-o"
                            size={20}
                            color="#ffffff"
                        />
                    }
                    type="solid"
                    buttonStyle={{backgroundColor: '#ea4e52'}}
                    onPress={() => {
                        socket.emit("sendMessage", {pseudo: props.userPseudo, message: currentMessage});
                        setCurrentMessage('');
                    }}
                /> 
            </KeyboardAvoidingView>

        </View>
    );
}

function mapStateToProps(state) {
    return { userPseudo: state.pseudo }
}

const styles = StyleSheet.create({
    inner: {
      padding: 24,
      flex: 1,
      justifyContent: "space-around"
    },
    textInput: {
      height: 40,
      borderColor: "#000000",
      borderBottomWidth: 1,
      marginBottom: 36
    },
    btnContainer: {
      backgroundColor: "white",
      marginTop: 12
    }
});

export default connect(
    mapStateToProps, 
    null
  )(ChatScreen);