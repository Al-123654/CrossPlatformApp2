import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Header, Button, Tile, Icon} from 'react-native-elements';

class ImageScreen extends Component{
    constructor(props) {
        super(props);
    }

    state = { noOfLikes: "" };
	
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
    
    onLikePressHandler = () => {
		console.log('[images js] Like btn Pressed!');
        const { params } = this.props.navigation.state;
        const images = params ? params.imageId : null;
        
        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        return fetch(imageUri + images, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] responseJson:", responseJson);
			this.setState({noOfLikes: responseJson.likes.length});
		})
		.catch(error => console.log('[images js] Error:', error));    
	}

    render(){
        const { params } = this.props.navigation.state;
        console.log('[images js] PARAMS',params);
        const imageId = params ? params.data._id : "";
		console.log('[images js] IMAGE ID: ', imageId);
		const imageLikes = params ? params.data.likes : "";
        console.log('[images js] IMAGE LIKES: ', imageLikes);

        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        console.log("[images js] Image path: ", imageUri);
        console.log("[images js] CURRENT IMAGE ID: ",imageId);
        
		this.fetchImageDetails(imageUri, imageId);
		
        return (
			
            <View>
				<Header centerComponent={{ text: "IMAGES", style: { color: "#fff" } }} />

				<Tile
					imageSrc={{uri: imageUri + imageId + '/display'}}
					title="Random titletext"
				/>

                {/* <Button
                    title= "Like" onPress={this.onLikePressHandler}
                /> */}
                <View style= {styles.textContainer}>
                    <Text >{this.state.noOfLikes}</Text> 
                </View>

				<TouchableOpacity
					onPress={this.onLikePressHandler}
				>
					<Icon
						reverse
						name='heart'
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
