import React, {Component} from 'react';
import { Platform, StyleSheet,  View, Image } from 'react-native';
import { StackNavigator, navigationOptions} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Button, FormInput, FormLabel, Text,FormValidationMessage } from 'react-native-elements';

var RegisterScreen = require('./screens/register.js');
var UserScreen = require('./screens/user.js');
var ImageScreen = require('./screens/images.js');
var ExploreScreen = require('./screens/explore.js');

class App extends Component {
	state = {
		username: "",
		password: "",
		log: "",
		logDetails: "",
		isLoggedIn: false,
		id: "",
		imageSource: "",
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

	onLoginPressHandler = () => {
		if(this.state.username.length > 1 && this.state.password.length > 1){
			return fetch('https://app-api-testing.herokuapp.com/login', {
			// return fetch('http:localhost:5000/login', {
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
						console.log("[app js] LOGGED IN!");
						this.setState({ 
							
							isLoggedIn: true,
							log: "Logged in!"
						});
						// go to user page
						console.log('[app js] Response',responseJson.data);
						this.props.navigation.navigate('User', responseJson.data);
					}else{
						console.log("[app js] NOT LOGGED IN!");
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
					<FormLabel style={styles.appHeading}>Test App</FormLabel>
					<FormInput style={styles.platformBasedText} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
					<FormInput style={styles.platformBasedText} placeholder="Password" secureTextEntry ={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
					<Button title="Login" onPress={this.onLoginPressHandler} />
					<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
					{/* <Button title="Forgot password?" onPress={this.onForgotHandler} /> */}
					<FormLabel>{this.state.log}</FormLabel>
					<FormLabel>{this.state.logDetails}</FormLabel>
					<FormLabel>{this.state.imageSource.fileName}</FormLabel>
				</View>
			</View>
		);
	}
}

const RootStack = StackNavigator(
	{
		Home: {
			screen: App,
			navigationOptions: {
				title: "App",
				headerLeft: null,
				gesturesEnabled:false
			}
		},
		Register: {
			screen: RegisterScreen,
			navigationOptions:{
				gesturesEnabled: false
			}
		},
		User: {
			screen: UserScreen,
			navigationOptions: {
				title: "User",
				headerLeft: null,
				gesturesEnabled:false
			}
		},
		ImagePage:{
			screen:ImageScreen,
			navigationOptions:{
				gesturesEnabled: false
			} 
		},
		Explore:{
			screen:ExploreScreen,
			navigationOptions:{
				gesturesEnabled: false
			}
		}
	},
	{initialRouteName: 'Home'}
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
		justifyContent: 'space-around',
	},
	formContainer: {
		
		width: '60%',
		
	},
	platformBasedText:{
		...Platform.select({
			ios:{
				width: '50%',
				height: '13%',
				borderColor: 'grey',
				justifyContent: 'space-around',	
			},
			android:{

			}
		})
	},
	entryFields: {
		width: '50%',
		height: '13%',
		borderColor: 'grey',
		justifyContent: 'space-around',
	},
	appHeading: {
		fontSize: 30,
		textAlign: 'center'
	},
	registerLink: {
		color: 'blue',
		marginTop: 10,
		textAlign:'center'
	},
	imageDimensions: {
		width: 100,
		height: 100
	}
});
