import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Button, Image, Alert } from 'react-native';
import { StackNavigator, } from 'react-navigation';

class RegisterScreen extends Component {
    constructor(props) {
        super(props);
    }

    
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
            this.props.navigation.navigate('User');
    }

    render() {
        return (
            <View > 
                <Text>{
                    this.state.username
                }</Text>
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