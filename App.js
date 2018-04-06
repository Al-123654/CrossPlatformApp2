import React, {Component} from 'react';
import { Platform, StyleSheet,  View, Image } from 'react-native';
import { StackNavigator, navigationOptions} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Item, Input, 
	Form, Label, Footer, FooterTab,Root
} from 'native-base';
import{ Row, Grid} from 'react-native-easy-grid';
import validator from 'validator';

var RegisterScreen = require('./screens/register.js');
var FeedsScreen = require('./screens/feeds.js');
var ImageScreen = require('./screens/images.js');
var ExploreScreen = require('./screens/explore.js');
var ProfileScreen = require('./screens/profile.js')

class HomeScreen extends Component {
	state = {
		username: "",
		logUsername: "",
		password: "",
		logPassword: "",
		log: "",
		logDetails: "",
		id: "",
		imageSource: "",
	};

	onChangedUsernameHandler = (username) => { if(username) this.setState({ username: username }); }
	onChangedPasswordHandler = (password) => { if(password) this.setState({ password: password }); }

	onLoginPressHandler = () => {
		console.log('[app js] Login btn pressed.');
		
		this.setState({
			logUsername: "",
			logPassword: "",
		});

		if (!validator.isLength(this.state.username, { min: 5 })){
            this.setState({ logUsername: "Min: 5" });
            return;
		}
		
		if(!validator.isLength(this.state.password,{min:5})){
            this.setState({logPassword: "Min: 5"});
            return;
		}
		
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
		}).then((response) => {
			console.log('[app js] responseOnLogin: ', response);
			if (response.status !== 200){
				console.log('[app js] responseOnLogin bad response: ', response);
				this.setState({log:"Cannot log in"})
				return;
			}
			response.json().then(data => {

				console.log('[app js] componentDidMount json response: ', data);					
				console.log("[app js] LOGGED IN!");
				// go to feeds page
				console.log('[app js] Response', data);
				this.props.navigation.navigate('Feeds', data);
			});
		}).catch((error) => {
			console.log(error);
		});
	}
	
	onRegisterPressHandler = () => {
		console.log('[app js] Register btn pressed.');
		this.props.navigation.navigate('Register');
	}

	render() {
		
		return (
			<Container>
				<Header>
					<Body>
						<Title>Test App</Title>
					</Body>
				</Header>
				<Content>
					<Grid>
						<Row style={styles.iconContainer}>
							<Text>Image Goes Here</Text>
						</Row>
						<Row style={styles.formContainer}>
							<Form style={{width:'100%'}}>
								<Item floatingLabel error={this.state.logUsername.length > 0}>
									<Label>Username</Label>
									<Input onChangeText={(text) => this.onChangedUsernameHandler(text)} />
								</Item>
								{this.state.logUsername.length > 0 ? (<Text style={styles.formLogText}>{this.state.logUsername}</Text>) : null}

								<Item floatingLabel error={this.state.logPassword.length > 0}>
									<Label>Password</Label>
									<Input secureTextEntry={true} onChangeText={(text) => this.onChangedPasswordHandler(text)} />
								</Item>
								{this.state.logPassword.length > 0 ? (<Text style={styles.formLogText}>{this.state.logPassword}</Text>) : null}
							</Form>
							<Button style={{alignSelf:'flex-end'}} transparent onPress={this.onRegisterPressHandler}>
								<Text style={{fontSize:12}}>Register</Text>
							</Button>
							<Text style={{fontSize:12, color:'red'}}>{this.state.log}</Text>
							<Text style={{ fontSize: 12, color: 'red' }}>{this.state.logDetails}</Text>
						</Row>
					</Grid>
				</Content>
				<Footer>
					<FooterTab>
						<Button onPress={this.onLoginPressHandler}>
							<Text style={{fontSize:15}}>Login</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
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
		Feeds: {
			screen: FeedsScreen,
			navigationOptions: {
				header: null,
				// gesturesEnabled:false
			}
		},
		Image:{
			screen:ImageScreen,
			navigationOptions:{
				header: null,
				// gesturesEnabled: false
			} 
		},
		Explore:{
			screen:ExploreScreen,
			navigationOptions:{
				header: null,
				gesturesEnabled: false
			}
		},
		Profile:{
			screen:ProfileScreen,
			navigationOptions:{
				header:null,
				gesturesEnabled: false
			}
		}
	},
	{initialRouteName: 'Home'}
);

// export default class App extends Component {
// 	render() {
// 		return <RootStack />;
// 	}
// }

export default () =>
	<Root>
		<RootStack/>
	</Root>;

const styles = StyleSheet.create({
	iconContainer: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#D3D3D3',
		height: 175
	},
	formContainer: {
		flex: 1,
		flexDirection: 'column'
	},
	formLogText: {
		fontSize: 12,
		color: 'red',
		marginTop: 5,
		marginLeft: 18
	}
});
