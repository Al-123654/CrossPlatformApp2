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
        log:"",
        logUsername: "",
        logFname: "",
        logLname: "",
        logPassword: "",
        logEmail: "",
        logDetails: "",
        
        id: "",
        
    };

    
    onChangedUsernameHandler = (username) => {
        if (username) {
            this.setState({
                username: username, logUsername: ''
            });
        }
    }

    onChangedPasswordHandler = (password) => {
        if (password) {
            this.setState({
                password: password, logPassword: ''
            });
        }
    }
    

    onChangedFnameHandler = (fname) => {
        if (fname){
            this.setState({
                fname: fname, logFname: ''
            });
        }
    }

    onChangedLnameHandler = (lname) => {
        if (lname){
            this.setState({
                lname: lname, logLname: ''
            });
        }
    }

    onChangedEmailHandler = (email) => {
        if (email){           
            this.setState({
                email: email, logEmail: ''
            });
        }
    }

    onRegisterFinishedHandler = () => {
        // return fetch('http://localhost:5000/api/users', {
        
        this.setState({
            logFname: "",
            logLname: "",
            logPassword: "",
            logEmail: "",
        });
        
        
        if (!validator.isAlphanumeric(this.state.username) || !validator.isLength(this.state.username,{min: 5, max: 10})) {
            this.setState({ logUsername: "Invalid username" });
            return;
        }
        if(!validator.isLength(this.state.password,{min:8})){
            this.setState({logPassword: "Invalid password"});
            return;
        }
        if(!validator.isAlpha(this.state.fname) || !validator.isLength(this.state.fname, {min:2})){
            this.setState({logFname: "Invalid Firstname"});
            return;
        }        
        if (!validator.isAlpha(this.state.lname) || !validator.isLength(this.state.lname, { min: 2 })){
            this.setState({logLname: "Invalid Lastname"});
            return;
        }        
        if(!validator.isEmail(this.state.email)){
            this.setState({logEmail: "Invalid Email"});
            return;
        }        

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
            .then((response) => {
                console.log('[register.js] responseOnRegister: ', response);
                if (response.status !== 200) {
                    console.log('[register js] responseOnLogin bad response: ', response);
                    this.setState({ log: "Cannot register" })
                    return;
                }
                response.json().then(data => {
                    console.log('[register js] componentDidMount json response: ', data);
                    console.log("[register js] REGISTERED");
                    // go to user page
                    console.log('[register js] Response', data);
                    this.props.navigation.navigate('User', data);
                });

            })
            .catch((error) => {
                console.error(error);
            });
        
    }

    render() {
        return (
           <View style={styles.registrationFields}> 
                <FormInput placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
                <FormValidationMessage >{this.state.logUsername}</FormValidationMessage> 
                <FormInput placeholder="Password" secureTextEntry={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
                <FormValidationMessage >{this.state.logPassword}</FormValidationMessage> 
                <FormInput placeholder="First Name" onChangeText={(text) => this.onChangedFnameHandler(text)} />
                <FormValidationMessage >{this.state.logFname}</FormValidationMessage> 
                <FormInput placeholder="Last Name" onChangeText={(text) => this.onChangedLnameHandler(text)} />
                <FormValidationMessage >{this.state.logLname}</FormValidationMessage> 
                <FormInput placeholder="Email" onChangeText={(text) => this.onChangedEmailHandler(text)} />
                <FormValidationMessage >{this.state.logEmail}</FormValidationMessage> 
              
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