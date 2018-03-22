import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View,  Image, Alert, FlatList } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import validator from 'validator';
import {Button} from 'react-native-elements';




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
            console.log('Username Alphanumeric?',validator.isAlphanumeric(username))
            console.log('Username Length?',validator.isLength(username, {min: 5, max: 10}))
            if (validator.isAlphanumeric(username) && validator.isLength(username, { min: 5, max :10})){
                    this.setState({
                        username: username, log: ''
                    });
            }else{
                this.setState({
                    log: 'Username not valid'
                })
            }
        }
    }

    onChangedPasswordHandler = (password) => {
        if (password) {
            console.log('Password Length?', validator.isLength(password, { min: 8 }))
            console.log('Password uppercase?', validator.isUppercase(password))
            console.log('Password lowercase?', validator.isLowercase(password))
            if ( validator.isLength(password, { min: 8 })){
                    this.setState({
                        password: password
                    });
                
            }
        }
    }

    onChangedFnameHandler = (fname) => {
        if (fname){
            console.log('Firstname Alphabet?',validator.isAlpha(fname))
            if (validator.isAlpha(fname)){
                this.setState({
                    fname: fname
                })
            }
            
        }
    }

    onChangedLnameHandler = (lname) => {
        if (lname){
            console.log('Lastname Alphabet?', validator.isAlpha(lname))
            if(validator.isAlpha(lname)){
                this.setState({
                    lname: lname
                })
            }
           
        }
    }

    onChangedEmailHandler = (email) => {
        if (email){
           console.log('Is email valid?',validator.isEmail(email))
           if (validator.isEmail(email)){ 
               this.setState({
                   email: email
               })
           
           }
          
        }
    }

    onRegisterFinishedHandler = () => {
        // return fetch('http://localhost:5000/api/users', {
        return fetch('https://app-api-testing.herokuapp.com/api/users', {
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
                    if(responseJson.messageCode == 101){
                       
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
           <View style={styles.registrationFields}> 
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="First Name" onChangeText={(text) => this.onChangedFnameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Last Name" onChangeText={(text) => this.onChangedLnameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Email" onChangeText={(text) => this.onChangedEmailHandler(text)} />
                <Button
                    title="Register"
                    onPress={this.onRegisterFinishedHandler}
                />
                <Text >{this.state.log}</Text> 

                {/* <Button
                    title='BUTTON'
                /> */}
            </View>   
            
            
        );
    }
}

const styles = StyleSheet.create({
    registrationFields: {
        flex:0.5,
        // alignItems:'center',
        justifyContent:'space-around',
        // width: 20,
        // borderColor: 'black',
        // borderWidth: 50

    }
})
module.exports = RegisterScreen;