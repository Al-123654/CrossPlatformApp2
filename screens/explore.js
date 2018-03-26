import React, { Component } from 'react';
import { Platform, FlatList, Text, TextInput, StyleSheet, View, Button, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator,  } from 'react-navigation';
import { List, ListItem } from "react-native-elements";

class ExploreScreen extends Component {

	state = { 
		log: "",
		listOfUsers: ""
	};

	componentDidMount(){
		fetch('https://app-api-testing.herokuapp.com/api/users')
		.then(response=>{
			console.log('[explore js] componentDidMount response: ', response);
			if(response.status !== 200){
				console.log('[explore js] componentDidMount bad response: ', response);
				return;
			}
			response.json().then(data=>{
				console.log('[explore js] componentDidMount json response: ', data);
				this.setState({listOfUsers:[...data]});
				console.log('[explore js] componentDidMount listOfUsers state: ', this.state.listOfUsers);
			});
		})
		.catch(err=>console.log('[explore js] componentDidMount error: ', err));
	}

    onLogoutPressHandler = () => {
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
							console.log("[explore js] onLogoutPressHandler LOGGED OUT")
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
			});
		})
		.catch(err=>console.log('[explore js] onListItemPressed error: ', err));
	}

    render() {
		// get passed data from previous screen
		const {params} = this.props.navigation.state;
		console.log('[explore js] render PARAMS: ',params);
		const passedUserId = params.currentUserId;
		console.log('[explore js] render passedUserId: ',passedUserId);
		
		let listOfUsersCopy = [...this.state.listOfUsers];

		// remove currently logged in user from list
		let indexToRemove = "";
		listOfUsersCopy.forEach((user,index)=>{
			if(user._id == passedUserId){
				console.log("[explore js] Found a match at index: ", index);
				indexToRemove = index;
			}
		});
		console.log("[explore js] indexToRemove type: ", typeof indexToRemove);
		if(typeof indexToRemove == 'number'){
			listOfUsersCopy.splice(indexToRemove, 1);
		}

		return(
			<List>
				<FlatList
					data={listOfUsersCopy}
					renderItem={ ({item}) => (
						<TouchableOpacity
							onPress={()=>this.onListItemPressed(item._id, passedUserId)}
						>
							<ListItem
								title={item.username}
								subtitle={item.email}
							/>
						</TouchableOpacity>
					)}
					keyExtractor={item => item._id}
				/>
			</List>
		);
    }
}

const styles = StyleSheet.create({
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
