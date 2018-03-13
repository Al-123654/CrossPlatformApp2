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
			.fetch('GET', 'https://via.placeholder.com/350x150', {
				//some headers ..
			})
			.then((res) => {
				// the temp file path
				console.log('The file saved to ', res.path());
				this.setState({log: "Image downloaded!"});
				this.setState({logDetails: res.path()});
		})
	}

	onUploadPressHandler = () => {
		if(!this.state.isLoggedIn){
			return this.setState({
				log: "LOGIN FIRST"
			});
		}
		// download image
		RNFetchBlob
		.config({
			// add this option that makes response data to be stored as a file,
			// this is much more performant.
			fileCache : true,
		})
		.fetch('GET', 'https://via.placeholder.com/200x150', {
			//some headers ..
		})
		.then((res) => {
			// the temp file path
			console.log('The file saved to ', res.path());
			test = res.path();
			console.log("PATH to FILE: " + test);

			// save image
			RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload', {
				'Content-Type' : 'multipart/form-data',
			}, [
				{ name : 'sampleFile', filename : 'file.png', type:'image/png', data: RNFetchBlob.wrap(test)},
			]).then((res) => {
				console.log("TEST RESPONSE: " + res.text());
				this.setState({
					log: "Response from server",
					logDetails: "test" + res.text()
				});
			}).catch((err) => {
				console.log("TEST ERROR: " + err);
			});
		});
	}

	onLoginPressHandler = () => {
		if(this.state.username.length > 1 && this.state.password.length > 1){
			
			return fetch('https://app-api-testing.herokuapp.com/login', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: this.state.username,
					password: this.state.password
				}),
			})
				.then((response) => response.json())
				.then((responseJson) => {
					if(responseJson.data){
						console.log("LOGGED IN!");
						this.setState({ 
							id: responseJson.data._id,
							isLoggedIn: true
						});
						// go to user page
						this.props.navigation.navigate('User', {
							id: responseJson.data._id,
							username: responseJson.data.username,
							fname: responseJson.data.fname,
							lname: responseJson.data.lname,
							email: responseJson.data.email,
							isLoggedIn: this.state.isLoggedIn
						});
					}else{
						console.log("NOT LOGGED IN!");
						this.setState({ 
							log: "NOT LOGGED IN"
						});
					}	
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
					<Button title="Test Upload" onPress={this.onUploadPressHandler} />
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
