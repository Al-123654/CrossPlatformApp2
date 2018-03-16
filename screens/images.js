import React, { Component } from 'react';
import { Platform, Text, TextInput, StyleSheet, View, Button, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';

import ImageGallery from '.user.js'
class ImageScreen extends Component{

    constructor(props) {
        super(props);
        this.handleNavigation = this.handleNavigation.bind(this);
    }

    static navigationOptions ={
        title: 'ImageView',
    };

    handleNavigation(source){
        this.props.navigation.navigate('ImageTap', {imageSrc:source});
    }

    renderGalleryImages(){
        
    }

}









module.exports = ImageScreen;
