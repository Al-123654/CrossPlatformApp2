import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Header, Button, Tile, Icon} from 'react-native-elements';

class ImageScreen extends Component{
    constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor: ', props.navigation.state.params);

		// check if image liked
		let isLiked = false;
		props.navigation.state.params.data.likes.forEach(function(likeId){
			console.log('[images js] constructor - likeId: ', likeId);
			if(likeId == props.navigation.state.params.userId){
				console.log('[images js] constructor - User already liked this image.');
				isLiked = true;
			}
		});

		// initialize state
		this.state = {
			imageId: props.navigation.state.params.data._id,
			imageLikesArray: props.navigation.state.params.data.likes,
			userId: props.navigation.state.params.userId,
			isImageLiked: isLiked,
			noOfLikes: props.navigation.state.params.data.likes.length
		};

		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - imageId: ', this.state.imageId);
		console.log('[images js] constructor - imageLikesArray: ', this.state.imageLikesArray);
		console.log('[images js] constructor - userId: ', this.state.userId);
		console.log('[images js] constructor - isImageLiked: ', this.state.isImageLiked);
		console.log('[images js] constructor - noOfLikes: ', this.state.noOfLikes);
    }
	
	fetchImageDetails = (imageUri, imageId) => {
        return fetch(imageUri + imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] Likes array:", responseJson);
			console.log("[images js] NO OF LIKES: ", responseJson.likes.length);
		})
		.catch(error => console.log('[images js] Error:', error));
	}
    
    onLikePressHandler = (imageUri,imageId) => {
		console.log('[images js] onLikePressHandler Like btn Pressed!');
		console.log('[images js] onLikePressHandler imageUri: ', imageUri);
		console.log('[images js] onLikePressHandler imageId: ', imageId);
        
        return fetch(imageUri + imageId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] onLikePressHandler responseJson:", responseJson);

			// check if image liked
			let isLiked = false;
			const userId = this.state.userId;
			console.log("[images js] onLikePressHandler responseJson Likes: ", responseJson.likes);
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
		.catch(error => console.log('[images js] onLikePressHandler Error:', error));    
	}

    render(){
        // const { params } = this.props.navigation.state;
		// console.log('[images js] PARAMS PASSED FROM USER JS: ',params);
		
        // const imageId = params ? params.data._id : "";
		// console.log('[images js] IMAGE ID: ', imageId);

		// const imageLikesArray = params ? params.data.likes : "";
		// console.log('[images js] IMAGE LIKES Array: ', imageLikesArray);
		
		// const currentUserId = params ? params.userId : "";
		// console.log('[images js] Currently logged in user id: ', params.userId);

		// let isLiked = false;
		// imageLikesArray.forEach(function(likeId){
		// 	console.log('[images js] likeId: ', likeId);
		// 	if(likeId == currentUserId){
		// 		console.log('[images js] User already liked this image.');
		// 		isLiked = true;
		// 	}
		// });
		
		// get likes id
		// if likes id matches with current user id
			// set btn icon to full
		// else
			// set btn icon to empty
		
        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        console.log("[images js] Image path: ", imageUri);
        console.log("[images js] CURRENT IMAGE ID: ",this.state.imageId);
        
		// this.fetchImageDetails(imageUri, imageId);
		
        return (
			
            <View>
				<Header centerComponent={{ text: "IMAGES", style: { color: "#fff" } }} />

				<Tile
					imageSrc={{uri: imageUri + this.state.imageId + '/display'}}
					title="Random titletext"
				/>

                {/* <Button
                    title= "Like" onPress={this.onLikePressHandler}
				/> */}
				
                <View style= {styles.textContainer}>
                    <Text >{this.state.noOfLikes}</Text> 
                </View>

				<TouchableOpacity
					onPress={()=>{this.onLikePressHandler(imageUri,this.state.imageId)}}
				>
					<Icon
						reverse
						name={this.state.isImageLiked ? 'heart-o':'heart'}
						type='font-awesome'
						color='#f50'
					/>
				</TouchableOpacity>

					
            </View>
        )
    }
}

const styles = StyleSheet.create({
	outerContainer: {
		flex:1,
		flexDirection: 'column',
		justifyContent: 'space-between'
	},
    imageContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
		width: '100%',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    }
})
module.exports = ImageScreen;
