import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
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
// const GET_USERS_URI = 'http://localhost:5000/api/users/';

class Favorite extends Component {
    constructor(props) {
        super(props);

        console.log('[FavoriteTab js] Check props:', this.props)
        // console.log('[FavoriteTab js] Global.userId check', global.userId);

        this.state = {
            favImageArray: [],
            userID: this.props.currentUserID,
            loaded: false
        }

    }
    // get images favorited by user only
    componentDidMount() {

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
            gallery = (<Text>No images favorited</Text>)
        } else if (this.state.favImageArray.length > 0 && this.state.loaded){
            gallery = (
                <Gallery
                    images={this.state.favImageArray}
                    clicked={clicked}
                    longclick={longclick}
                    passedUserId={this.state.userID}
                />
            )
        }
        const { clicked } = this.props;
        const {longclick} = this.props;
        console.log('[FavoriteTab js] Checking length of array:', this.state.favImageArray.length);
        console.log('[FavoriteTab js] clicked:', clicked);
        console.log('[FavoriteTab js] favImageArray at render:', this.state.favImageArray);
        
        return (
            <Container>
                <Content>
                    {gallery}
                </Content>
            </Container>
        )

    }
}

export default Favorite;
