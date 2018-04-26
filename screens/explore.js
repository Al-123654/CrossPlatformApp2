import React, { Component } from 'react';
import { 
	Platform,  StyleSheet, View, 
	 Image, Alert , 
	TouchableOpacity, TouchableHighlight
} from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Item, Input, 
	Form, Label, Thumbnail, Card, CardItem, ListItem, 
	List, Toast 
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

// const GET_USERS_URI = 'http://localhost:5000/api/users';
// const LOGOUT_URI = 'http://localhost:5000/logout';
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users';
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';

class ExploreScreen extends Component {

	constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);

		// initialize state
		this.state = {
			searchTerm: null,
			listOfUsers: null,
			passedUserId: props.navigation.state.params.currentUserId,
			log: "",
			listLoadedCount: 0
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - listOfUsers: ', this.state.listOfUsers);
		console.log('[images js] constructor - passedUserId: ', this.state.passedUserId);
		console.log('[images js] constructor - log: ', this.state.log);
    }

	onBackBtnPressed = () => {
		console.log('[explore js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

    onLogoutHandler = () => {

		Alert.alert(
			'Logging out',
			"",
			[
				{
					text: 'OK', onPress: () => {
						return fetch(LOGOUT_URI, {
							method: 'GET',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
						}).then((response) => response.json())
							.then((responseJson) => {
								Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                });
								console.log("[explore js] onLogoutPressHandler - LOGGING OUT!");
								const resetAction = NavigationActions.reset({
									index: 0,
									actions: [NavigationActions.navigate({ routeName: 'Home' })],
								});
								this.props.navigation.dispatch(resetAction);
							})
							.catch((error) => {
								console.error(error);
							});
						
					}
				},
				{
					text: 'Cancel', onPress: () => {
						style: 'cancel'
					}
				}
			]
		) 
       
	}

	onListItemPressed = (itemId, userId) => {
		console.log('[explore js] onListItemPressed itemID: ', itemId);
		console.log('[explore js] onListItemPressed itemID type: ', typeof itemId);
		console.log('[explore js] onListItemPressed userID: ', userId);

		return fetch(GET_USERS_URI,
		{
			method: 'PUT',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
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
				this.fetchUsers();
			});
		})
		.catch(err=>console.log('[explore js] onListItemPressed error: ', err));
	}

	onChangedSearchHandler = (text) => {
		if(text && text.length >= 4){
			console.log('[explore js] text in searchbox: ', text);
			if(this.state.searchTerm !== text){
				console.log('[explore js] Save text into state! ');
				this.setState({searchTerm: text});
			}
		}
	}

	onSubmitSearchHandler = () => {
		console.log("[explore js] Clicked search btn onSubmitSearchHandler!");
		this.fetchUsers();
	}

	fetchUsers = () => {
		console.log("[explore js] In fetchUsers!");
		if(this.state.searchTerm){
			fetch(GET_USERS_URI + '/?username=' + this.state.searchTerm)
			.then(response => {
				console.log("[explore js] Response from api: ", response);
				if (response.status !== 200) {
					Toast.show({
						text: 'Search failed!',
						buttonText: 'Ok',
						position: 'top',
						duration: 2000
					});
					return;
				}

				// if fetch ok
				response.json().then(respObj => {
					console.log('[explore js] Response object: ', respObj);
					console.log('[explore js] Search ok!!!');
					console.log('[explore js] Response object data: ', respObj.data);

					// check data contents
					if(respObj.data){
						if(respObj.data.length === 0){
							// if no results
							this.setState({listOfUsers: []});
						}else{
							// if more than one results
							this.setState({listOfUsers: respObj.data});
						}
					}
				});
			})
			.catch(error => console.log("[explore js] Error fetching search results: ", error));
		}
	}

    render() {

		let listOfUsers = (<Text>Search for users</Text>);
		if(this.state.listOfUsers){

			if(this.state.listOfUsers.length >= 1){
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
				listOfUsers = (
					<List dataArray = {listOfUsersCopy}
						renderRow={(item) =>
							<ListItem 
								style={styles.listItem}
								button 
								onPress={() => this.onListItemPressed(item._id, this.state.passedUserId)}>
								<Text style={{color:'#007594'}}>{item.username}</Text>
								<Text style={{color:'#000000',fontSize:12}}>{item.isFollowed ? 'Unfollow' : 'Follow'}</Text>
							</ListItem>
						}>
					</List>
				);
			}else{
				listOfUsers = (
					<Text>No users found!</Text>
				);
			}		
		}

		return(    
            <Container>
                <Header>
					<Left>
						<Button transparent onPress={this.onBackBtnPressed}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
                    <Body><Title>Explore</Title></Body>
					<Right>
						<Button transparent onPress={this.onLogoutHandler}>
							<Icon name='home' />
						</Button>
					</Right>
                </Header>
                <Content>
					<Item>
						<Icon name="ios-search" />
						<Input placeholder="Search" onChangeText={(text) => this.onChangedSearchHandler(text)}/>
						<Icon name="ios-people" />
					</Item>
					<Button transparent onPress={this.onSubmitSearchHandler}>
						<Text>Search</Text>
					</Button>
                    {listOfUsers}
                </Content>
            </Container>
				
		);
    }
}

const styles = StyleSheet.create({
	listItem: {
		flex:1,
		flexDirection:'row',
		justifyContent:'space-between'
	},
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
