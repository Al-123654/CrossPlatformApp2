import React, {Component} from 'react';
import { Platform, StyleSheet,  View, Image } from 'react-native';
import { StackNavigator, navigationOptions} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { Button, FormInput, FormLabel, Text,FormValidationMessage, Header, Icon } from 'react-native-elements';
// import Icon from 'react-native-vector-icons/FontAwesome';

var RegisterScreen = require('./screens/register.js');
var UserScreen = require('./screens/user.js');
var ImageScreen = require('./screens/images.js');
var ExploreScreen = require('./screens/explore.js');

class HomeScreen extends Component {
	state = {
		username: "",
		password: "",
		log: "",
		logDetails: "",
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
				.then((response) => {
					console.log('[app.js] responseOnLogin: ', response);
					if (response.status !== 200){
						console.log('[explore js] responseOnLogin bad response: ', response);
						this.setState({log:"Cannot log in"})
						return;
					}
					response.json().then(data => {

						console.log('[explore js] componentDidMount json response: ', data);					
						console.log("[app js] LOGGED IN!");
						// go to user page
						console.log('[app js] Response', data);
						this.props.navigation.navigate('User', data);
					});
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

			<View style={styles.outerContainer}>

				<Header centerComponent={{ text: "TEST APP", style: { color: "#fff" } }} />

				<View style={styles.formContainer}>
					<FormLabel>Login</FormLabel>
					<FormInput style={styles.input} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
					<FormInput style={styles.input} placeholder="Password" secureTextEntry ={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
					<Button	title="Login" onPress={this.onLoginPressHandler} /> 
				</View>

				<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
					
				<View style={styles.logContainer}>
					<FormLabel>{this.state.log}</FormLabel>
					<FormLabel>{this.state.logDetails}</FormLabel>
				</View>
					
			</View>
		);
	}
}

const RootStack = StackNavigator(
	{
		Home: {
			screen: HomeScreen,
			navigationOptions: {
				header: null,
				gesturesEnabled:false
			}
		},
		Register: {
			screen: RegisterScreen,
			navigationOptions:{
				header: null,
				gesturesEnabled: false
			}
		},
		User: {
			screen: UserScreen,
			navigationOptions: {
				header: null,
				gesturesEnabled:false
			}
		},
		Image:{
			screen:ImageScreen,
			navigationOptions:{
				header: null,
				gesturesEnabled: false
			} 
		},
		Explore:{
			screen:ExploreScreen,
			navigationOptions:{
				header: null,
				gesturesEnabled: false
			}
		}
	},
	{initialRouteName: 'Home'}
);

export default class App extends Component {
	render() {
		return <RootStack />;
	}
}

const styles = StyleSheet.create({
	outerContainer: {
		flex:1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
	formContainer: {
		width:'95%',
		alignSelf: 'center'
	},
	logContainer: {
		width:'95%',
		alignSelf: 'center'
	},
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'space-between',
		flexDirection: 'column',
		height: '10%'
	},
	input:{
		...Platform.select({
			ios:{
				width: '50%',
				height: '13%',
				borderColor: 'grey',
				justifyContent: 'space-around',	
			},
			android:{}
		})
	},
	entryFields: {
		width: '50%',
		height: '13%',
		borderColor: 'grey',
		justifyContent: 'space-around',
	},
	registerLink: {
		color: 'blue',
		marginTop: 10,
		textAlign:'center'
	},
	imageDimensions: {
		width: 100,
		height: 100
	},
	headerContainer: {
		width: '100%',
		height:'100%'
	},
	loginButton:{
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '50%',
		height: '50%'
	}
});
