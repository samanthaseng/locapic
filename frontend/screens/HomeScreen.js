import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import { AsyncStorage, Text, StyleSheet, ImageBackground } from 'react-native';
import { Input, Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

function HomeScreen({navigation, validatePseudo}) {
    const [pseudo, setPseudo] = useState('')

    useEffect(() => {
        AsyncStorage.getItem("pseudo", 
            function(error, pseudoData) {
                setPseudo(pseudoData);
            }
        );     
    }, []);

    var messageHome;
    if (pseudo) {
        messageHome = <Text style={{marginBottom: 20, color: '#ffffff', fontSize: 18}}>Welcome back {pseudo}!</Text>
    } else {
        messageHome = <Input
                        containerStyle = {{marginBottom: 25, width: '70%'}}
                        placeholder='John'
                        leftIcon={
                            <Icon
                                type='font-awesome'
                                name='user'
                                size={24}
                                color='#EA4E52'
                                style={{margin: 10}}
                            />
                        }
                        onChangeText={(value) => setPseudo(value)}
                        value = {pseudo}
                      />
    }

    return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.mainContainer}>
            {messageHome}
            <Button 
                title="Go to Map"
                icon={
                    <Icon
                        name="arrow-right"
                        size={20}
                        color="#EA4E52"
                    />
                }
                onPress={() => {
                    validatePseudo(pseudo);
                    AsyncStorage.setItem("pseudo", pseudo);
                    navigation.navigate('Map');
                }}
            />        
        </ImageBackground>
    );
}

function mapDispatchToProps(dispatch) {
    return {
        validatePseudo: function(pseudo) { 
            dispatch( {type: 'savePseudo', newPseudo: pseudo} ) 
        }
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        width: '100%',
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
    },
    image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
      },
})

export default connect(
    null,
    mapDispatchToProps
)(HomeScreen);