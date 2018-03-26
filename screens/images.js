import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Header, Button} from 'react-native-elements'

class ImageScreen extends Component{
    constructor(props) {
        super(props);
        
    }

    state = {
        noOfLikes: ""
    };
    

    onLikePressHandler = () => {
        const { params } = this.props.navigation.state;
        // const _id = params ? params._id : null;
        const images = params ? params.imageId : null;
        
        // let imageUri = 'http://localhost:5000/api/images/';
        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        return fetch(imageUri + images, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },

        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("[image js]responseJson:", responseJson)
                // console.log("IMAGE LIKED:", this.imageLiked)
                // noOfLikes = likes.length;
            })                  
    }

    render(){
        const { params } = this.props.navigation.state;
        console.log('PARAMS',params)
        // const _id = params ? params._id : null;
        const images = params ? params.imageId : null;
        // const likes = params ? params.likes : null;
        // console.log('LIKES: ', likes);
        console.log('IMAGE ID: ', images);
        
        // noOfLikes = likes.length;

        let imageUri = 'https://app-api-testing.herokuapp.com/api/images/';
        // let imageUri = 'http://localhost:5000/api/images/';
        console.log("Image selected", imageUri)
        console.log("CURRENT IMAGE",images)
        // console.log("IMAGE LIKED:", this.imageLiked)
        // console.log("NO. OF LIKES:",responeseJson.likes)]
        var noOfLikes;
        fetch(imageUri + images, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                console.log("[image js]Likes array:", responseJson)
                let likes = responseJson.likes
                console.log("NO OF LIKES: ", likes.length);
                this.setState({noOfLikes: likes.length});
            })

        return (
            // <View style={styles.imageContainer}>
            //     <Header
            //         leftComponent={{ icon: 'menu', color: '#fff' }}
            //         centerComponent={{ text: "IMAGES", style: { color: "#fff" } }}
            //         rightComponent={{ icon: 'home', color: '#fff' }}
            //     />

            //     <Image
            //         source= {{uri: imageUri + images + '/display'}}
            //         style={{height:'90%', width: '98%'}}
            //     />

            //     <Button
            //         title= "Like" onPress={this.onLikePressHandler}
            //     />
            //     <Text>{this.state.noOfLikes}</Text> 
            // </View>

            <View style={{
                flex: 1,
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}>
                <Header
                    leftComponent={{ icon: 'menu', color: '#fff' }}
                    centerComponent={{ text: "IMAGES", style: { color: "#fff" } }}
                    rightComponent={{ icon: 'home', color: '#fff' }}
                />

                <Image
                    source= {{uri: imageUri + images + '/display'}}
                    style={{height:'80%', width: '100%'}}
                    alignItems='center'
                    justifyContent='center'
                />

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
