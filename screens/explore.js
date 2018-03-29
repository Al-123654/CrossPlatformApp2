import React, { Component } from 'react';
import { 
	Platform, FlatList, Text, 
	TextInput, StyleSheet, View, 
	Button, Image, Alert , 
	TouchableOpacity, TouchableHighlight
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { List, ListItem, Icon, Header } from "react-native-elements";
import CustomBackBtn from './../components/CustomBackBtn/CustomBackBtn';
import CustomLogoutBtn from './../components/CustomLogoutBtn/CustomLogoutBtn';

class ExploreScreen extends Component {

	// state = { 
	// 	log: "",
	// 	listOfUsers: ""
	// };

	constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);

		// initialize state
		this.state = {
			listOfUsers: "",
			passedUserId: props.navigation.state.params.currentUserId,
			log: ""
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - listOfUsers: ', this.state.listOfUsers);
		console.log('[images js] constructor - passedUserId: ', this.state.passedUserId);
		console.log('[images js] constructor - log: ', this.state.log);
    }

	componentDidMount(){
		this.fetchListofUsers();
	}

	fetchListofUsers = () => {
		fetch('https://app-api-testing.herokuapp.com/api/users')
		.then(response=>{
			console.log('[explore js] fetchListofUsers - response: ', response);
			if(response.status !== 200){
				console.log('[explore js] fetchListofUsers - bad response: ', response);
				return;
			}
			response.json().then(data=>{
				console.log('[explore js] fetchListofUsers - json response: ', data);
				this.setState({listOfUsers:[...data]});
				console.log('[explore js] fetchListofUsers - listOfUsers state: ', this.state.listOfUsers);
			});
		})
		.catch(err=>console.log('[explore js] fetchListofUsers - error: ', err));
	}

	onBackBtnPressed = () => {
		console.log('[explore js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onLogoutBtnPressed = () => {
		console.log('[explore js] onLogoutBtnPressed');
		this.onLogoutHandler();
	}

    onLogoutHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
        // return fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
		.then((responseJson) => {
			Alert.alert(
				'Logging out',
				"",
				[
					{
						text: 'OK', onPress: () => {
							this.props.navigation.navigate('Home');
							console.log("[explore js] onLogoutPressHandler - LOGGED OUT")
						}
					}
				]
			) 
		})
		.catch ((error) => {
			console.error(error);
		});
	}

	onListItemPressed = (itemId, userId) => {
		console.log('[explore js] onListItemPressed itemID: ', itemId);
		console.log('[explore js] onListItemPressed itemID type: ', typeof itemId);
		console.log('[explore js] onListItemPressed userID: ', userId);

		return fetch('https://app-api-testing.herokuapp.com/api/users/',
		{
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				email:'app@mail.com',
				following:itemId
			})
		})
		.then(response=>{
			console.log('[explore js] onListItemPressed response: ', response);
			if(response.status !== 200){
				console.log('[explore js] onListItemPressed bad response: ', response);
				return;
			}
			response.json().then(data=>{
				console.log('[explore js] onListItemPressed json response: ', data);
				this.fetchListofUsers();
			});
		})
		.catch(err=>console.log('[explore js] onListItemPressed error: ', err));
	}

    render() {
		// copy list of users from state
		let listOfUsersCopy = [...this.state.listOfUsers];
		let currentlyFollowingList = [];

		// remove currently logged in user from list
		let indexToRemove = "";
		listOfUsersCopy.forEach((user,index)=>{
			if(user._id == this.state.passedUserId){
				console.log("[explore js] Found a match at index: ", index);
				indexToRemove = index;
				// save currently following list
				console.log("[explore js] Following list: ", user.following);
				currentlyFollowingList = [...user.following];
			}
		});
		console.log("[explore js] indexToRemove type: ", typeof indexToRemove);
		if(typeof indexToRemove == 'number'){
			listOfUsersCopy.splice(indexToRemove, 1);
		}

		console.log("[explore js] Currently following: ", currentlyFollowingList);

		// loop through list of users
		for (var i = 0; i < listOfUsersCopy.length; i++) {
			console.log('[explore js] ID lisOfUsersCopy: ', listOfUsersCopy[i]._id );
			for (var j = 0; j < currentlyFollowingList.length; j++) {
				console.log('[explore js] ID currentlyFollowingList: ', currentlyFollowingList[j] );
				if (listOfUsersCopy[i]._id == currentlyFollowingList[j]) {
					console.log('[explore js] Found a match!');
					listOfUsersCopy[i].isFollowed = true;
				}
			}
		}

		console.log("[explore js] List of Users after looping: ", listOfUsersCopy);

		return(
			<View>
				<Header 
					leftComponent={<CustomBackBtn clicked={this.onBackBtnPressed} />}
					centerComponent={{ text: "EXPLORE", style: { color: "#fff" } }}
					rightComponent={<CustomLogoutBtn clicked={this.onLogoutBtnPressed} />}
				/>
				<List containerStyle={styles.outerList}>
					<FlatList
						data={listOfUsersCopy}
						renderItem={ ({item}) => (
							<TouchableOpacity
								onPress={()=>this.onListItemPressed(item._id, this.state.passedUserId)}
							>
								<ListItem
									title={item.username}
									subtitle={item.email}
									rightIcon={item.isFollowed ? <Icon name='remove'/> : <Icon name='add'/>}
									rightTitle={item.isFollowed ? 'Unfollow' : 'Follow'}
								/>
							</TouchableOpacity>
							
						)}
						keyExtractor={item => item._id}
					/>
				</List>
			</View>
				
		);
    }
}

const styles = StyleSheet.create({
	outerList : {
		marginTop: 0
	},
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
    },
    pictures: {
        flex: 1, flexDirection: 'row',
        width: '80%',
        flexWrap:'wrap',
        justifyContent: 'center',
        
    },

    thumbnail: {
        width: 75,
        height: 75,
    }
});

module.exports = ExploreScreen;
