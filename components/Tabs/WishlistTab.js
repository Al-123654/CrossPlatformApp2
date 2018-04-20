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
// const GET_USERS_WISHLIST_URI = 'https://app-api-testing.herokuapp.com/api/users?wishlist=1';

class Wishlist extends Component{
    constructor(props){
        super(props);

        console.log('[WishlistTab js] Check props:', this.props)
       
        this.state={
            wishlistArray: [],
            userID: this.props.currentUserID
        }
    }

    // get images in user wishlist only
    componentDidMount() {

        fetch(GET_USERS_URI + this.state.userID + '?wish=1', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {

                let tempWishlist = [];
                response.wishImages.forEach((image, index) => {
                    console.log('[Wishlist Tab js] To push images into array:', image._id)
                    tempWishlist.push(image._id);
                })
                this.setState({ wishlistArray: [...tempWishlist] });
                console.log('[Wishlist Tab js] wishlistArray check:', this.state.wishlistArray);
            })
            .catch(error => console.error('Error:', error));


    }

    render(){

        const { clicked } = this.props;
        console.log('[Wishlist Tab js] Checking length of array:', this.state.wishlistArray.length);
        console.log('[Wishlist Tab js] clicked:', clicked);
        console.log('[Wishlist Tab js] wishlistArray at render:', this.state.wishlistArray);
        if (this.state.wishlistArray.length == 0) {
            return (
                <Text>No images in wishlist</Text>
            )
        } else {
            return (
                <Content>
                    <Gallery
                        images={this.state.wishlistArray}
                        clicked={clicked}
                        passedUserId={this.state.userID}
                    />
                </Content>

            );
        }
    }
}

export default Wishlist;