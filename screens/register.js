import React, { Component } from 'react';
import {  TextInput, StyleSheet, View,  Image, Alert, FlatList } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import validator from 'validator';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Form, Item, 
	Input, Label, Footer, FooterTab
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
// import CustomBackBtn from './../components/CustomBackBtn/CustomBackBtn';

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
        logDetails: ""
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
	
	onBackBtnPressed = () => {
		console.log('[register js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

    onRegisterFinishedHandler = () => {
        
        this.setState({
			logUsername: "",
            logFname: "",
            logLname: "",
            logPassword: "",
            logEmail: "",
        });
        
        if (!validator.isAlphanumeric(this.state.username) ) {
            this.setState({ logUsername: "Numbers and letters only" });
            return;
        }
        if (!validator.isLength(this.state.username, { min: 5, max: 10 })){
            this.setState({ logUsername: "Min: 5, max: 10" });
            return;
        }
        if(!validator.isLength(this.state.password,{min:8})){
            this.setState({logPassword: "Min: 8"});
            return;
        }
        if(!validator.isAlpha(this.state.fname)){
            this.setState({logFname: "Letters only"});
            return;
        }
        if (!validator.isLength(this.state.fname, { min: 2 })){
            this.setState({ logFname: "Too short" });
            return;
        }        
        if (!validator.isAlpha(this.state.lname)){
            this.setState({logLname: "Letters only"});
            return;
        } 
        if (!validator.isLength(this.state.lname, { min: 2 })){
            this.setState({ logLname: "Too short" });
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
                    this.setState({ log: "Cannot register" });
                    return;
                }
                response.json().then(data => {
                    console.log('[register js] componentDidMount json response: ', data);
					console.log("[register js] REGISTERED");
					this.setState({ log: "Registered!" });
                    // go to user page
                    console.log('[register js] Response', data);
                    // this.props.navigation.navigate('User', data);
                });

            })
            .catch((error) => {
                console.error(error);
            });
        
    }

    render() {
        return (
			<Container>
				<Header>
					<Left>
						<Button transparent onPress={this.onBackBtnPressed}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
					<Body>
						<Title>Register</Title>
					</Body>
				</Header>
				<Content>
					<Form>
						<Item fixedLabel error={this.state.logUsername.length > 0}>
							<Label>Username</Label>
							<Input 
								onChangeText={(text) => this.onChangedUsernameHandler(text)} 
								placeholder={this.state.logUsername.length > 0 ? this.state.logUsername : null}
								/>
							{this.state.logUsername.length > 0 ? (<Icon name='close-circle' />) : null}
						</Item>

						<Item fixedLabel error={this.state.logPassword.length > 0}>
							<Label>Password</Label>
							<Input 
								onChangeText={(text) => this.onChangedPasswordHandler(text)}
								placeholder={this.state.logPassword.length > 0 ? this.state.logPassword : null}
								/>
							{this.state.logPassword.length > 0 ? (<Icon name='close-circle' />) : null}
						</Item>

						<Item fixedLabel error={this.state.logFname.length > 0}>
							<Label>First name</Label>
							<Input 
								onChangeText={(text) => this.onChangedFnameHandler(text)}
								placeholder={this.state.logFname.length > 0 ? this.state.logFname : null}
								/>
							{this.state.logFname.length > 0 ? (<Icon name='close-circle' />) : null}
						</Item>

						<Item fixedLabel error={this.state.logLname.length > 0}>
							<Label>Last name</Label>
							<Input 
								onChangeText={(text) => this.onChangedLnameHandler(text)}
								placeholder={this.state.logLname.length > 0 ? this.state.logLname : null}
								/>
							{this.state.logLname.length > 0 ? (<Icon name='close-circle' />) : null}
						</Item>

						<Item fixedLabel last error={this.state.logEmail.length > 0}>
							<Label>Email</Label>
							<Input 
								onChangeText={(text) => this.onChangedEmailHandler(text)}
								placeholder={this.state.logEmail.length > 0 ? this.state.logEmail : null}
								/>
							{this.state.logEmail.length > 0 ? (<Icon name='close-circle' />) : null}
						</Item>

					</Form>
					{this.state.log.length > 0 ? (<Text>{this.state.log}</Text>) : null}
				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={this.onRegisterFinishedHandler}>
							<Text>Register</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
        );
    }
}

const styles = StyleSheet.create({
    outerContainer: {
		flex:1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	}
});
module.exports = RegisterScreen;