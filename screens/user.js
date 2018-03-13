import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Button, Image, Alert } from 'react-native';
import { StackNavigator, } from 'react-navigation';

import RNFetchBlob from 'react-native-fetch-blob';

class UserScreen extends Component {
    constructor(props) {
        super(props);
    }
    

    onUploadPressHandler = () =>{
        RNFetchBlob
        .config({
            fileCache : true,
        })
        .fetch('GET', 'http://via.placehoder.com/200x150', {

        })
        .then((res) => {
            console.log('The file saved to ', res.path());
            test = res.path();
            console.log("PATH to FILE: " + test);

            RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload', {
                'Content-Type': 'multipart/form-data',
            }, [
                    { name: 'sampleFile', filename: 'file.png', type: 'image/png', data: RNFetchBlob.wrap(test)},
            ]).then((resp) => {
                console.log("TEST RESPONSE" + resp);
            }).catch((err) => {
                console.log("TEST ERROR: " + err);
            });
        });
    }

    onLogoutPressHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(
                    'Logging out',
                    "",
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Home');

                            }
                        }
                    ]
                ) 
            })
            .catch ((error) => {
                console.error(error);
            });

       
    
    
    }


    
    render() {
        const {params} = this.props.navigation.state;
        const username = params ? params.username : null;
        const fname = params ? params.fname : null;
        const lname= params ? params.lname: null;
        const email = params ? params.email : null;
        const id = params ? params.id : null;
        return (
            <View style={styles.viewContainer}>
                <Text>
                    username: {JSON.stringify(username)}
                    fname: {JSON.stringify(fname)}
                    lname: {JSON.stringify(lname)}
                    email: {JSON.stringify(email)}
                    id: {JSON.stringify(id)}
                </Text>
				<Button title="Upload" onPress={this.onUploadPressHandler} />
				<Button title="Logout" onPress={this.onLogoutPressHandler} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	}
});

module.exports = UserScreen;