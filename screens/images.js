import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';


class ImageScreen extends Component{

    constructor(props) {
        super(props);
        // this.handleNavigation = this.handleNavigation.bind(this);
    }

    

    render(){
        const { params } = this.props.navigation.state;
        console.log('PARAMS',params)
        const _id = params ? params._id : null;
        const images = params ? params.imageId : null;
        

        let imageUri = 'https://app-api-testing.herokuapp.com/api/users/' + _id + '/images/';
        console.log("Image selected", imageUri)
        console.log('CURRENT ID',_id)
        console.log("CURRENT IMAGE",images)

        return (
            <View style={styles.imageContainer}>

                <Image
                    source= {{uri: imageUri + images}}
                    style={{height:'85%', width: '85%'}}
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
