import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View,  Image, Alert, FlatList } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import validator from 'validator';
import {Button, FormInput, FormLabel, FormValidationMessage} from 'react-native-elements';
// import {Icon} from 'react-native-vector-icons;



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
        logUsername: "",
        logFname: "",
        logLname: "",
        logPassword: "",
        logEmail: "",
        logDetails: "",
        isLoggedIn: false,
        id: "",
        
    };

    
    onChangedUsernameHandler = (username) => {
        if (username) {
            console.log('Username Alphanumeric?',validator.isAlphanumeric(username))
            console.log('Username Length?',validator.isLength(username, {min: 5, max: 10}))
            if (validator.isAlphanumeric(username) && validator.isLength(username, { min: 5, max :10}) ){
                    this.setState({
                        username: username, logUsername: ''
                    });
            }else{
                this.setState({
                    logUsername: 'Username not valid'
                })
            }
        }
    }

    onChangedPasswordHandler = (password) => {
        if (password) {
            console.log('Password Length?', validator.isLength(password, { min: 8 }))
            if ( validator.isLength(password, { min: 8 })){
                    this.setState({
                        password: password, logPassword: ''
                    });
                
            }else{
                this.setState({
                    logPassword: 'Password not valid'
                })
            }
        }
    }

    onChangedFnameHandler = (fname) => {
        if (fname){
            console.log('Firstname Alphabet?',validator.isAlpha(fname))
            if (validator.isAlpha(fname)){
                this.setState({
                    fname: fname, logFname: ''
                })
            }else{
                this.setState({
                    logFname: 'Firstname not valid'
                })
            }
            
        }
    }

    onChangedLnameHandler = (lname) => {
        if (lname){
            console.log('Lastname Alphabet?', validator.isAlpha(lname))
            if(validator.isAlpha(lname)){
                this.setState({
                    lname: lname, logLname: ''
                })
            } else{

                this.setState({
                    logLname: 'Lastname not valid'
                })
            }
              
           
        }
    }

    onChangedEmailHandler = (email) => {
        if (email){
           console.log('Is email valid?',validator.isEmail(email))
           if (validator.isEmail(email)){ 
               this.setState({
                   email: email, logEmail: ''
               })
           
           } else {

               this.setState({
                   logEmail: 'Email not valid'
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
                <FormInput placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
                <FormValidationMessage >{this.state.log}</FormValidationMessage> 
                <FormInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
                <FormValidationMessage >{this.state.log2}</FormValidationMessage> 
                <FormInput placeholder="First Name" onChangeText={(text) => this.onChangedFnameHandler(text)} />
                <FormValidationMessage >{this.state.log3}</FormValidationMessage> 
                <FormInput placeholder="Last Name" onChangeText={(text) => this.onChangedLnameHandler(text)} />
                <FormValidationMessage >{this.state.log4}</FormValidationMessage> 
                <FormInput placeholder="Email" onChangeText={(text) => this.onChangedEmailHandler(text)} />
                <FormValidationMessage >{this.state.log5}</FormValidationMessage> 
                {/* <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="First Name" onChangeText={(text) => this.onChangedFnameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Last Name" onChangeText={(text) => this.onChangedLnameHandler(text)} />
                <TextInput  style={{ borderColor: 'grey', borderWidth: 4}} placeholder="Email" onChangeText={(text) => this.onChangedEmailHandler(text)} /> */}
                <Button
                    raised
                    icon= {{name: 'code'}}
                    title="Register"
                    onPress={this.onRegisterFinishedHandler}
                />
               
                

              
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