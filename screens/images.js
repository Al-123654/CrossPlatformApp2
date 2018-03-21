import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';

class ImageScreen extends Component{
    constructor(props) {
        super(props);
        
    }
    

    onLikePressHandler = () => {
        const { params } = this.props.navigation.state;
        const _id = params ? params._id : null;
        const images = params ? params.imageId : null;
        
        let imageUri = 'http://localhost:5000/api/users/' + _id + '/images/';
        return fetch(imageUri + images, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("NUMBER OF LIKES:", responseJson.likes)
                imageLiked = true;
                // console.log("IMAGE LIKED:", this.imageLiked)
            })                  
    }

    render(){
        const { params } = this.props.navigation.state;
        console.log('PARAMS',params)
        const _id = params ? params._id : null;
        const images = params ? params.imageId : null;
        const likes = params ? params.likes : null;
        

        // let imageUri = 'https://app-api-testing.herokuapp.com/api/users/' + _id + '/images/';
        let imageUri = 'http://localhost:5000/api/users/' + _id + '/images/';
        console.log("Image selected", imageUri)
        console.log('CURRENT ID',_id)
        console.log("CURRENT IMAGE",images)
        // console.log("IMAGE LIKED:", this.imageLiked)
        // console.log("NO. OF LIKES:",responeseJson.likes)

        return (
            <View style={styles.imageContainer}>

                <Image
                    source= {{uri: imageUri + images}}
                    style={{height:'90%', width: '98%'}}
                />

                <Button
                    title= "Like" onPress={this.onLikePressHandler}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',

    }

})
module.exports = ImageScreen;
