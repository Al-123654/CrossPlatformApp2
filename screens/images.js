import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Header, Button, Tile} from 'react-native-elements'

class ImageScreen extends Component{
    constructor(props) {
        super(props);
    }

    state = {
        noOfLikes: ""
    };
    
    onLikePressHandler = () => {
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
			console.log("[images js] responseJson:", responseJson)
			// console.log("IMAGE LIKED:", this.imageLiked)
			// noOfLikes = likes.length;
		})
		.catch(error => console.log('[images js] Error:', error));    
    }

    render(){
        const { params } = this.props.navigation.state;
        console.log('[images js] PARAMS',params)
        const images = params ? params.imageId : null;
        console.log('[images js] IMAGE ID: ', images);

        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        console.log("[images js] Image selected", imageUri)
        console.log("[images js] CURRENT IMAGE",images)
        
        var noOfLikes;
        fetch(imageUri + images, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js]Likes array:", responseJson)
			let likes = responseJson.likes
			console.log("[images js] NO OF LIKES: ", likes.length);
			this.setState({noOfLikes: likes.length});
		})
		.catch(error => console.log('[images js] Error:', error));

        return (
			
            <View>
				<Header centerComponent={{ text: "IMAGES", style: { color: "#fff" } }} />

				<Tile
					imageSrc={{uri: imageUri + images + '/display'}}
					title="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dolores dolore exercitationem"
					featured
					caption="Some Caption Text"
				/>

                {/* <Image
                    source= {{uri: imageUri + images + '/display'}}
                    style={{height:'80%', width: '100%'}}
                    alignItems='center'
                    justifyContent='center'
                /> */}

                <Button
                    title= "Like" onPress={this.onLikePressHandler}
                />
                <View style= {styles.textContainer}>
                    <Text >{this.state.noOfLikes}</Text> 
                </View>
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
