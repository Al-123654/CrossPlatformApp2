import React, {Component} from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import { StackNavigator, } from 'react-navigation';

import RNFetchBlob from 'react-native-fetch-blob'


var RegisterScreen = require('./screens/register.js');
var UserScreen = require('./screens/user.js');

class App extends Component {
	state = {
		username: "",
		password: "",
		log: "",
		logDetails: "",
		isLoggedIn: false,
		id: "",
	};

	onChangedUsernameHandler = (username) => {
		if(username){
			this.setState({
				username: username
			});
		}
	}

	onChangedPasswordHandler = (password) => {
		if(password){
			this.setState({
				password: password
			});
		}
	}

	onBlobPressHandler = () => {
		RNFetchBlob
			.config({
				// add this option that makes response data to be stored as a file,
				// this is much more performant.
				fileCache : true,
			})
			.fetch('GET', 'http://via.placeholder.com/350x150', {
				//some headers ..
			})
			.then((res) => {
				// the temp file path
				console.log('The file saved to ', res.path());
				this.setState({log: "Image downloaded!"});
				this.setState({logDetails: res.path()});
		})
	}

	onLoginPressHandler = () => {
		if(this.state.username.length > 1 && this.state.password.length > 1){
			// this.setState(
			// 	log: "Username and Password provided.",
			// 	isLoggedIn: true
			// });
			// this.props.navigation.navigate('User',{username: this.state.username ,});
			
			// return fetch('https://app-api-testing.herokuapp.com/login', {
			return fetch('https://app-api-testing.herokuapp.com/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.state.username,
					// fname: this.state.fname,
					// lname: this.state.lname,
					// email: this.state.email,
					password: this.state.password
				}),
			})

				.then((response) => response.json())
				.then((responseJson) => {
					this.setState({ log: responseJson.data._id });
					// this.props.navigation.navigate('User', { username: this.state.username, });
					this.props.navigation.navigate('User', { 
						id:responseJson.data._id, 
						username: this.state.username, 
						fname: responseJson.data.fname,
						lname: responseJson.data.lname,
						email: responseJson.data.email
					});
					console.log("TEST" + responseJson.username)			
				})
				.catch((error) => {
					console.error(error);
				});
		}else {
			this.setState({
				log: "Username and Password not provided.",
				logDetails: ""
			});
		}
	}

	onRegisterPressHandler = () => {
		this.props.navigation.navigate('Register');
	}

	render() {
	
		return (
			<View style={styles.container}>
				<View style={styles.formContainer}>
					<Text style={styles.appHeading}>Test App</Text>
					<TextInput placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
					<TextInput placeholder="Password" onChangeText={(text) => this.onChangedPasswordHandler(text)} />
					<Button title="Login" onPress={this.onLoginPressHandler} />
					<Button title="Test Download" onPress={this.onBlobPressHandler} />
					<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
					<Text>{this.state.log}</Text>
					<Text>{this.state.logDetails}</Text>
				</View>
			</View>
		);
	}
}

const RootStack = StackNavigator(
	{
	  Home: {
		screen: App,
	  },
	  Register: {
		screen: RegisterScreen,
	  },
	  User: {
		screen: UserScreen,
	  }
	},
	{
	  initialRouteName: 'Home',
	}
  );

  export default class Test extends Component {
	render() {
	  return <RootStack />;
	}
  }

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
	formContainer: {
		width: '50%'
	},
	appHeading: {
		fontSize: 30,
		textAlign: 'center'
	},
	registerLink: {
		color: 'blue',
		marginTop: 10
	}
});
