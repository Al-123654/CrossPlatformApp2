import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import {
    Container, Header, Left, Body, Right, Icon, Title,
    Content, Text, Button, Item, Input, Form, Label, Thumbnail,
    Card, CardItem, Badge, ListItem, List, Footer, FooterTab,
    Toast, Root
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
import validator from 'validator';
import Gallery from '../Gallery/Gallery';

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
// const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=followed';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';


class Favorite extends Component{
    constructor(props){
        super(props);

       console.log('[FavoriteTab js] Check props:', this.props)
        // const { params } = this.props.navigation.state;
        //  console.log('[FavoriteTab js] constructor - passedParams: ', props.navigation.state.params);
        // this.state={
        //     favImages = props.navigation.state.params.data.favImages
        // }
        // console.log('[FavoriteTab js] favImages test', this.state.favImages)

    //    console.log('[FavoriteTab js] Global.imageArray check', global.imageArray);
       console.log('[FavoriteTab js] Global.userId check', global.userId);

       this.state={
           favImageArray: []
       }

    }

    componentDidMount(){
        fetch(GET_USERS_URI + global.userId + '?test=test',{
            method:'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
        .then(response => {
            // console.log('[FavoriteTab js] Response check at componentDidMount:', response);
            // console.log('FavoriteTab js] Check favorite images:', response.favImages);
            // console.log('[FavoriteTab js] Number of favorites:', response.favImages.length)
            let tempFav = [];
            response.favImages.forEach((image, index) => {
                console.log('[FavoriteTab js] To push images into array:', image._id)
                tempFav.push(image._id);
                // let tempFav = favorite.favorite.map((imageId, index) => {
                //     this.setState({favImageArray: [...tempFav]})
                // })
            })
            this.setState({ favImageArray: [...tempFav] });
            // this.setState({favImageArray: [...response.favImages]});
            console.log('[FavoriteTab js] favImageArray check:', this.state.favImageArray);
        })
        .catch(error => console.error('Error:', error));
    }

    onImageClicked = (imageId, passedId) => {

        // return fetch('https://app-api-testing.herokuapp.com/api/images/' + imageId, {
        //     method: 'GET',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     }
        // }).then(response => response.json())
        //     .catch(error => console.error('Error: ', error))
        //     .then(response => {
        //         this.props.navigation.navigate('Image', {
        //             data: response,
        //             following: passedId
        //         });
        //     });
    }



    render(){
        console.log('[FavoriteTab js] favImageArray at render:', this.state.favImageArray)
        return (
            <Content>
                <Text>Favorites</Text>
                <Gallery
                    images={this.state.favImageArray}
                    clicked={this.onImageClicked}
                    passedUserId={global.userId}
                />
            </Content>
            
        );
    }   
}

export default Favorite;