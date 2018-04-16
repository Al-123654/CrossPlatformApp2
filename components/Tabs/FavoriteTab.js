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


class Favorite extends Component {
    constructor(props) {
        super(props);

        console.log('[FavoriteTab js] Check props:', this.props)
        console.log('[FavoriteTab js] Global.userId check', global.userId);

        this.state = {
            favImageArray: []
        }

    }
    // get images favorited by user only
    componentDidMount() {

        fetch(GET_USERS_URI + global.userId + '?test=test', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {

                let tempFav = [];
                response.favImages.forEach((image, index) => {
                    console.log('[FavoriteTab js] To push images into array:', image._id)
                    tempFav.push(image._id);
                })
                this.setState({ favImageArray: [...tempFav] });
                console.log('[FavoriteTab js] favImageArray check:', this.state.favImageArray);
            })
            .catch(error => console.error('Error:', error));


    }

    render() {
        const { clicked } = this.props;
        console.log('[FavoriteTab js] Checking length of array:', this.state.favImageArray.length);
        console.log('[FavoriteTab js] clicked:', clicked);
        console.log('[FavoriteTab js] favImageArray at render:', this.state.favImageArray);
        if (this.state.favImageArray.length == 0) {
            // gallery = (<Gallery
            //     images={this.state.favImageArray}
            //     clicked={clicked}
            //     passedUserId={global.userId}
            // />);
            return (
                <Text>No images favorited</Text>
            )
        } else {
            return (
                <Content>
                    <Gallery
                        images={this.state.favImageArray}
                        clicked={clicked}
                        passedUserId={global.userId}
                    />
                </Content>

            );
        }

    }
}

export default Favorite;
