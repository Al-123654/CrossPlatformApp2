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

    render() {
		// usersArray = [];
		const listOfUsersCopy = [...this.state.listOfUsers];
		// usersArray = listOfUsersCopy.map((user, index) => {
		// 	return (
		// 		<Text key={user._id}>{user.username}</Text>
		// 	);
		// });

        // return (
        //     <View style={styles.viewContainer}> 
		// 		{usersArray}
		// 		<Text>{this.state.log}</Text>
		// 		<Button title="Logout" onPress={this.onLogoutPressHandler} />
        //     </View>
		// );
		return(
			<List>
				<FlatList
					data={listOfUsersCopy}
					renderItem={ ({item}) => (
						<ListItem
							title={item.username}
							subtitle={item.email}
						/>
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
