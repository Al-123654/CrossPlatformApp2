import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
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

// const GET_USERS_URI = 'http://localhost:5000/api/users/';
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_WISHLIST_URI = 'https://app-api-testing.herokuapp.com/api/users?wishlist=1';

class Wishlist extends Component{
    constructor(props){
        super(props);

        console.log('[WishlistTab js] Check props:', this.props)
       
        this.state={
            wishlistArray: [],
            userID: this.props.currentUserID,
            loaded : false
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
                this.setState({ 
                    wishlistArray: [...tempWishlist],
                    loaded: true
                });
                console.log('[Wishlist Tab js] wishlistArray check:', this.state.wishlistArray);
            })
            .catch(error => console.error('Error:', error));


    }

    render(){
        
        let gallery = (<Spinner/>)

        if (this.state.wishlistArray.length == 0 && this.state.loaded) {
            gallery = <Text style={{ marginLeft: 130, marginTop: 150 }}>No images in wishlist</Text>
        } else if (this.state.wishlistArray.length > 0 && this.state.loaded) {
            gallery = (
                <Gallery
                    images={this.state.wishlistArray}
                    clicked={this.props.clicked}
                    longclick={this.props.longclick}
                    passedUserId={this.state.userID}
                />
            )
        }

       
        console.log('[Wishlist Tab js] Checking length of array:', this.state.wishlistArray.length);
        console.log('[Wishlist Tab js] wishlistArray at render:', this.state.wishlistArray);
       
        return (
            <Container>
                <Content>
                    <View>
                        {gallery}
                    </View>
                </Content>

            </Container>
           
        );
        
    }
}

export default Wishlist;