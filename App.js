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

class App extends Component {
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
			
			// <View style={styles.container}>
			
			// 	<View style={styles.formContainer}>
			// 		<Header 
			// 			leftComponent={{ icon: 'menu', color: '#fff' }}
			// 			centerComponent={{ text: "HOME", style: { color: "#fff" } }}
			// 			rightComponent={{ icon: 'home', color: '#fff' }}
			// 		/>
			// 		<FormLabel style={styles.appHeading}>Test App</FormLabel>
			// 		<FormInput style={styles.platformBasedText} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
			// 		<FormInput style={styles.platformBasedText} placeholder="Password" secureTextEntry ={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
			// 		<Button title="Login" onPress={this.onLoginPressHandler} />
			// 		<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
			// 		{/* <Button title="Forgot password?" onPress={this.onForgotHandler} /> */}
			// 		<FormLabel>{this.state.log}</FormLabel>
			// 		<FormLabel>{this.state.logDetails}</FormLabel>
			// 		<FormLabel>{this.state.imageSource.fileName}</FormLabel>
			// 	</View>
			// </View>

			<View style={{
				flex: 1,
				flexDirection: 'column',
				justifyContent: 'space-between',
			}}>
				{/* <View style={{ width: 50, height: 50,  }} />
				<View style={{ width: 50, height: 50, }} />
				<View style={{ width: 50, height: 50,  }} /> */}

				<Header
						leftComponent={{ icon: 'menu', color: '#fff' }}
						centerComponent={{ text: "HOME", style: { color: "#fff" } }}
						rightComponent={{ icon: 'home', color: '#fff' }}
					/>
					<FormLabel style={styles.appHeading}>Test App</FormLabel>
					<FormInput style={styles.platformBasedText} placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
					<FormInput style={styles.platformBasedText} placeholder="Password" secureTextEntry ={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
					<Button	
							icon={
								<Icon
								// alignItems='center'
								// reverse
								iconStyle={styles.loginButton}
								name='login'
								type='material-community'
								size={15}
								color='red'
								/>
							}	
					title="Login" onPress={this.onLoginPressHandler}
						
					
					/> 
					
					{/* <Icon 
						// alignItems='center'
						reverse
						iconStyle={styles.loginButton}
						name='login'
						type='material-community'
						onPress={this.onLoginPressHandler}
					/> */}
					<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
					{/* <Button title="Forgot password?" onPress={this.onForgotHandler} /> */}
					<FormLabel>{this.state.log}</FormLabel>
					<FormLabel>{this.state.logDetails}</FormLabel>
					<FormLabel>{this.state.imageSource.fileName}</FormLabel>
					<Icon
						name='key'
						type='font-awesome'
					/>
					<Icon
						name='login'
						type='material-community'
					/>
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
		justifyContent: 'space-between',
		flexDirection: 'column',
		height: '10%'
	},


	formContainer: {
		
		width: '60%',
		alignItems: 'center',
		// justifyContent: 'space-around',
		
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
	},

	headerContainer: {
		// alignItems: ,
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
