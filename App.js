import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, TextInput, Button, Image } from 'react-native';
import { StackNavigator, navigationOptions} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';

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
		imageSource: ""
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

	onDownloadPressHandler = () => {
		let dirs = RNFetchBlob.fs.dirs;
		RNFetchBlob.config({
			fileCache: true,
			path: dirs.DownloadDir + '/test.png',
			addAndroidDownloads: {
				notification: true,
				title: 'File downloaded',
				description: 'An image file',
				mime: 'image/png',
				mediaScannable: true
			}
		}).fetch('GET', 'https://via.placeholder.com/100x100')
		.then((res) => {
			console.log('CONTENTS OF RES');
			console.log(res);
			console.log('File saved to ', res.path());
			this.setState({
				log: "File downloaded!",
				logDetails: res.path()
			});
		})
		.catch((err) => {
			this.setState({
				log: "Error downloading file",
				logDetails: err
			});
		});
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
			
			// return fetch('http://localhost:5000/login', {
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
							// id: responseJson.data._id,
							isLoggedIn: true,
							log: "Logged in!"
						});
						// go to user page
						// this.props.navigation.navigate('User', {
						// 	id: responseJson.data._id,
						// 	username: responseJson.data.username,
						// 	fname: responseJson.data.fname,
						// 	lname: responseJson.data.lname,
						// 	email: responseJson.data.email,
						// 	isLoggedIn: this.state.isLoggedIn
						// });
						this.props.navigation.navigate('User', responseJson.data);
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

	onLoginPressTestHandler = () => {
		if(this.state.username.length > 1 && this.state.password.length > 1){
			
			// return fetch('http://localhost:5000/login', {
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
							// id: responseJson.data._id,
							isLoggedIn: true,
							log: "Logged in!"
						});
						// go to user page
						// this.props.navigation.navigate('User', {
						// 	id: responseJson.data._id,
						// 	username: responseJson.data.username,
						// 	fname: responseJson.data.fname,
						// 	lname: responseJson.data.lname,
						// 	email: responseJson.data.email,
						// 	isLoggedIn: this.state.isLoggedIn
						// });
						// this.props.navigation.navigate('User', responseJson.data);
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

	onImagePickerHandler = () => {
		if(!this.state.isLoggedIn){
			return this.setState({
				log: "Please login first!"
			});
		}

		let imagePickerOptions = {
			title: 'Select Image',
			
			storageOptions: {
				skipBackup: true,
				
				
			}
		};

		ImagePicker.showImagePicker(imagePickerOptions, (response) => {
			
			console.log('Image Picker Response: ', response);
			if (response.didCancel) {
				console.log('User cancelled the picker.');
			} else if (response.error) {
				console.log('ImagePicker Error:', response.error);
			} else if (response.customButton) {
				console.log('User tapped custom button: ', response.customButton);
			} else {
				let source = { uri: response.uri };
				this.setState({
					imageSource: source,
					log: "Image chosen"
				});

				console.log('IMAGE CHOSEN: ', source);

				let platformPath = '';
				if(Platform.OS == 'ios'){
					console.log("PATH OF IMAGE SELECTED IOS: ", response.uri);
					platformPath = response.uri.replace(/^file?\:\/\//i, "");
					console.log('SPECIAL CHARACTERS REMOVED: ', platformPath);
				}else if(Platform.OS == 'android'){
					console.log("PATH OF IMAGE SELECTED ANDROID: ", response.path);
					platformPath = response.path;
				}

				if(platformPath == ''){
					return this.setState({
						log: "Platform path empty"
					});
				}

				// save image
				RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload',
					{ 'Content-Type': 'multipart/form-data' },
					[
						{
							name: 'sampleFile', filename: response.fileName,
							// type: response.type, data: RNFetchBlob.wrap(response.path)
							data: RNFetchBlob.wrap(platformPath)
						}
					]
				).then((res) => {
					console.log("TEST RESPONSE: " + res.text());
					this.setState({
						log: "Response from server",
						logDetails: "test" + res.text()
					});
				}).catch((err) => {
					console.log("TEST ERROR: " + err);
					this.setState({
						log: "Error uploading",
						logDetails: err
					});
				});
			}
		});
	}

	onPlatformHandler = () => {
		if (Platform.OS == 'ios')
		{
			this.setState({
				log:"This is ios"
			})
		}
		else if (Platform.OS ==  'android')
		{
			this.setState({
				log:"This is android"
			})
		}
	}



	render() {
	
		return (
			<View style={styles.container}>
				<View style={styles.formContainer}>
					<Text style={styles.appHeading}>Test App</Text>
					
					<TextInput placeholder="Username" onChangeText={(text) => this.onChangedUsernameHandler(text)} />
					<TextInput placeholder="Password" secureTextEntry ={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
					<Button title="Login" onPress={this.onLoginPressHandler} />
					<Button title="Test Login" onPress={this.onLoginPressTestHandler} />
					<Button title="Test Download" onPress={this.onDownloadPressHandler} />
					<Button title="Test Upload" onPress={this.onUploadPressHandler} />
					{/* <Image source={this.state.imageSource} style={styles.imageDimensions} /> */}
					<Button title="Image Picker" onPress={this.onImagePickerHandler} />
					<Button title="Platform Detector" onPress={this.onPlatformHandler} />
					<Text style={styles.registerLink} onPress={this.onRegisterPressHandler}>Register</Text>
					<Text>{this.state.log}</Text>
					<Text>{this.state.logDetails}</Text>
					<Text>{this.state.imageSource.fileName}</Text>
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
			headerLeft: null
		}
		  
	  },
	  Register: {
		screen: RegisterScreen,
	  },
	  User: {
		screen: UserScreen,
		  navigationOptions: {
			  title: "App",
			  headerLeft: null
		  }
	  },

	//   ImagePage:{
	// 	  screen:ImageScreen,

	//   }
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
	},
	imageDimensions: {
		width: 100,
		height: 100
	}
});
