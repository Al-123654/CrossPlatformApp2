import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Header, Button, Tile, Icon} from 'react-native-elements';
import CustomBackBtn from './../components/CustomBackBtn/CustomBackBtn';

class ImageScreen extends Component{
    constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);

		// check if image liked
		let isLiked = false;
		if (typeof props.navigation.state.params.data.likes !== 'undefined' && 
		props.navigation.state.params.data.likes.length > 0){
			props.navigation.state.params.data.likes.forEach(function(likeId){
				console.log('[images js] constructor - likeId: ', likeId);
				if(likeId == props.navigation.state.params.userId){
					console.log('[images js] constructor - User already liked this image.');
					isLiked = true;
				}
			});
		}

		// initialize state
		this.state = {
			IMAGE_ROOT_URI: 'https://app-api-testing.herokuapp.com/api/images/',
			imageId: props.navigation.state.params.data._id,
			imageLikesArray: props.navigation.state.params.data.likes,
			userId: props.navigation.state.params.userId,
			isImageLiked: isLiked,
			noOfLikes: props.navigation.state.params.data.likes.length
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - imageId: ', this.state.imageId);
		console.log('[images js] constructor - imageLikesArray: ', this.state.imageLikesArray);
		console.log('[images js] constructor - userId: ', this.state.userId);
		console.log('[images js] constructor - isImageLiked: ', this.state.isImageLiked);
		console.log('[images js] constructor - noOfLikes: ', this.state.noOfLikes);
	}
	
	onBackBtnPressed = () => {
		console.log('[images js] onBackBtnPressed');
		this.props.navigation.goBack();
	}
    
    onLikePressHandler = (imageId) => {
		console.log('[images js] onLikePressHandler - Like btn Pressed!');
		console.log('[images js] onLikePressHandler - imageUri: ', this.state.IMAGE_ROOT_URI);
		console.log('[images js] onLikePressHandler - imageId: ', imageId);
		
		// send request to API
        return fetch(this.state.IMAGE_ROOT_URI + imageId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] onLikePressHandler - responseJson: ", responseJson);

			// check if image liked
			let isLiked = false;
			const userId = this.state.userId;
			console.log("[images js] onLikePressHandler - responseJson Likes: ", responseJson.likes);
			if (typeof responseJson.likes !== 'undefined' && responseJson.likes.length > 0) {
				responseJson.likes.forEach(function(likeId){
					console.log('[images js] onLikePressHandler - likeId: ', likeId);
					if(likeId == userId){
						console.log('[images js] onLikePressHandler - User already liked this image.');
						isLiked = true;
					}
				});
			}

			this.setState({
				noOfLikes: responseJson.likes.length,
				isImageLiked: isLiked
			});
		})
		.catch(error => console.log('[images js] onLikePressHandler - Error:', error));    
	}

    render(){
        console.log("[images js] render - Image path: ", this.state.IMAGE_ROOT_URI);
        console.log("[images js] render - CURRENT IMAGE ID: ",this.state.imageId);
		
        return (
            <View>
				<Header 
					leftComponent={<CustomBackBtn clicked={this.onBackBtnPressed} />} 
					centerComponent={{ text: "IMAGES", style: { color: "#fff" } }} 
				/>

				<View style={styles.imageContainer}>
					<Tile
						imageSrc={{uri: this.state.IMAGE_ROOT_URI + this.state.imageId + '/display'}}
					/>
					<View style={styles.imageBar}>
						<Text style={styles.likesCount}>{this.state.noOfLikes} likes</Text>
						<TouchableOpacity
							onPress={()=>{this.onLikePressHandler(this.state.imageId)}}
							style={styles.icon}
						>
							<Icon
								reverse
								name={this.state.isImageLiked ? 'heart-o':'heart'}
								type='font-awesome'
								color='#f50'
							/>
						</TouchableOpacity>
					</View>
				</View>	
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	imageBar: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	icon: {
		width: 59,
		height: 59
	},
	likesCount: {
	}
})
module.exports = ImageScreen;
