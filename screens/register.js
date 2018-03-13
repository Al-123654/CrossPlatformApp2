import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Button, Image, Alert } from 'react-native';
import { StackNavigator, } from 'react-navigation';

class RegisterScreen extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        username: "",
        password: "",
        fname: "",
        lname: "",
        email: "",
        log: "",
        logDetails: "",
        isLoggedIn: false,
        id: "",
    };

    
    onChangedUsernameHandler = (username) => {
        if (username) {
            this.setState({
                username: username
            });
        }
    }

    onChangedPasswordHandler = (password) => {
        if (password) {
            this.setState({
                password: password
            });
        }
    }

    onChangedFnameHandler = (fname) => {
        if (fname){
            this.setState({
                fname:fname
            })
        }
    }

    onChangedLnameHandler = (lname) => {
        if (lname){
            this.setState({
                lname:lname
            })
        }
    }

    onChangedEmailHandler = (email) => {
        if (email){
            this.setState({
                email:email
            })
        }
    }

    onRegisterFinishedHandler = () => {
        return fetch('http://localhost:5000/api/users', {
        // return fetch('https://app-api-testing.herokuapp.com/api/users', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password,
                fname: this.state.fname, 
                lname: this.state.lname, 
                email: this.state.email 
            }),
        })
            .then((response) => response.json())
            .then((responseJson) => {
                    if(responseJson.messageCode == 100){
                       
                        Alert.alert(
                        'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () => console.log(responseJson.message), style: 'cancel'
                                        // {this.props.navigation.navigate('Home')};   
                                }
                            ]
                        )
                    }
                    if(responseJson.messageCode == 102){
                       
                        Alert.alert(
                            'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () => console.log(responseJson.message), style: 'cancel'
                                }
                            ]
                        )
                    }
                    if(responseJson.messageCode == 103){
                       
                        Alert.alert(
                            'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () => console.log(responseJson.message), style: 'cancel'
                                }
                            ]
                        )
                    }
                    if(responseJson.messageCode == 104){
                        
                        Alert.alert(
                            'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () => console.log(responseJson.message), style: 'cancel'
                                }
                            ]
                        )
                    }
                    if(responseJson.messageCode == 105){
                        
                        Alert.alert(
                            'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () => console.log(responseJson.message), style: 'cancel',
                                    
                                }
                            ]
                        )
                    }
                    if(responseJson.messageCode == 106){
                        
                        Alert.alert(
                            'Registration',
                            responseJson.message,
                            [
                                {
                                    text: 'OK', onPress: () =>  {
                                        this.props.navigation.navigate('User',responseJson.data);
                                    }
                                }
                            ]
                        )
                    }
                    
                    
                
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render() {
        return (
            <View > 
                {/* <Text>{
                    this.state.username
                }</Text> */}
                <TextInput placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
                <TextInput placeholder="Password" onChangeText={(text) => this.onChangedPasswordHandler(text)} />
                <TextInput placeholder="First Name" onChangeText={(text) => this.onChangedFnameHandler(text)} />
                <TextInput placeholder="Last Name" onChangeText={(text) => this.onChangedLnameHandler(text)} />
                <TextInput placeholder="Email" onChangeText={(text) => this.onChangedEmailHandler(text)} />
                <Button
                    title="Register"
                    onPress={this.onRegisterFinishedHandler}
                />
            </View>
        );
    }
}

module.exports = RegisterScreen;