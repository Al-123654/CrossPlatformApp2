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
const GET_USERS_WISHLIST_URI = 'https://app-api-testing.herokuapp.com/api/users?crave=1';

class Cravelist extends Component {
    constructor(props) {
        super(props);

        console.log('[CravelistTab js] Check props:', this.props)

        this.state = {
           cravelistArray: [],
            userID: this.props.currentUserID
        }
    }

    // get images in user cravelist only
    componentDidMount() {

        fetch(GET_USERS_URI + this.state.userID + '?crave=1', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {

                let tempCravelist = [];
                response.craveImages.forEach((image, index) => {
                    console.log('[Cravelist Tab js] To push images into array:', image._id)
                    tempCravelist.push(image._id);
                })
                this.setState({cravelistArray: [...tempCravelist] });
                console.log('[Cravelist Tab js]cravelistArray check:', this.state.cravelistArray);
            })
            .catch(error => console.error('Error:', error));


    }

    render() {

        const { clicked } = this.props;
        const { longclick } = this.props;
        console.log('[Cravelist Tab js] Checking length of array:', this.state.cravelistArray.length);
        console.log('[Cravelist Tab js] clicked:', clicked);
        console.log('[Cravelist Tab js]cravelistArray at render:', this.state.cravelistArray);
        if (this.state.cravelistArray.length == 0) {
            return (
                <Text>No images in cravelist</Text>
            )
        } else {
            return (
                <Content>
                    <Gallery
                        images={this.state.cravelistArray}
                        clicked={clicked}
                        longclick={longclick}
                        passedUserId={this.state.userID}
                    />
                </Content>

            );
        }
       
    }
}

export default Cravelist;