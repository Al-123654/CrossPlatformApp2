import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { createStackNavigator, NavigationActions, StackActions } from 'react-navigation';
import {
    Container, Header, Left, Body, Right, Icon, Title,
    Content, Text, Button, Item, Input, Form, Label, Thumbnail,
    Card, CardItem, Badge, ListItem, List, Footer, FooterTab,
    Toast, Root, Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
import validator from 'validator';
import Gallery from '../Gallery/Gallery';



const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class Favorite extends Component {
    constructor(props) {
        super(props);

        console.log('[FavoriteTab js] Check props:', this.props)
        // console.log('[FavoriteTab js] Global.userId check', global.userId);

        this.state = {
            favImageArray: [],
            userID: this.props.currentUserID,
            loaded: false,
            imageClicked: false
        }

    }
    // get images favorited by user only
    componentDidMount() {
        let navigation = this.props.navigation;
        console.log('[Favorite Tab] componentDidMount - navigation: ', navigation);

        fetch(GET_USERS_URI + this.state.userID + '?fav=1', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {

                console.log('[FavoriteTab js] response from server:', response);

                let tempFav = [];
                response.favImages.forEach((image, index) => {
                    console.log('[FavoriteTab js] To push images into array:', image._id)
                    tempFav.push(image._id);
                })
                this.setState({ 
                    favImageArray: [...tempFav],
                    loaded: true 
                });
                console.log('[FavoriteTab js] favImageArray check:', this.state.favImageArray);
            })
            .catch(error => console.error('Error:', error));


    }
    render() {
        let gallery = (<Spinner />)

        if (this.state.favImageArray.length == 0 && this.state.loaded) {
        gallery = (<Text style = {{marginLeft: 90, marginTop: 150}}>No images favorited</Text>)
        } else if (this.state.favImageArray.length > 0 && this.state.loaded){
            
            console.log('[FavoriteTab] this.props: ', this.props)// Check if the values from user js 
                                                                // have been passed 
            gallery = (
                <Gallery
                    images={this.state.favImageArray}
                    clicked={this.props.clicked}
                    longclick={this.props.longclick}
                    passedUserId={this.state.userID}
                />
            )
        }
        console.log('[FavoriteTab js] Checking length of array:', this.state.favImageArray.length);
        console.log('[FavoriteTab js] favImageArray at render:', this.state.favImageArray);
        
        return (
            <Container>
                <Content>
                    <View style = {{marginLeft: 50}}>
                        {gallery}
                    </View>
                </Content>
            </Container>
        )

    }
}

export default Favorite;
