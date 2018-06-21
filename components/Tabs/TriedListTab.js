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

const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_WISHLIST_URI = 'https://app-api-testing.herokuapp.com/api/users?crave=1';

class Triedlist extends Component {
    constructor(props) {
        super(props);

        console.log('[TriedlistTab js] Check props:', this.props)

        this.state = {
            triedlistArray: [],
            userID: this.props.currentUserID,
            loaded: false
        }
    }

    // get images in user triedlist only
    componentDidMount() {

        fetch(GET_USERS_URI + this.state.userID + '?tried=1', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(response => response.json())
            .then(response => {

                let tempTriedlist = [];
                response.triedImages.forEach((image, index) => {
                    console.log('[Triedlist Tab js] To push images into array:', image._id)
                    tempTriedlist.push(image._id);
                })
                this.setState({ 
                    triedlistArray: [...tempTriedlist],
                    loaded: true
                });
                console.log('[Triedlist Tab js]triedlistArray check:', this.state.triedlistArray);
            })
            .catch(error => console.error('Error:', error));


    }

    render() {

        let gallery = (<Spinner />)

        if (this.state.triedlistArray.length == 0 && this.state.loaded) {
            gallery = (<Text style={{ marginLeft: 130, marginTop: 150 }}>No images in triedlist</Text>)
        } else if (this.state.triedlistArray.length > 0 && this.state.loaded){
            gallery = (
                <Gallery
                    images={this.state.triedlistArray}
                    clicked={this.props.clicked}
                    longclick={this.props.longclick}
                    passedUserId={this.state.userID}
                />
            )
        }
        console.log('[Triedlist Tab js] Checking length of array:', this.state.triedlistArray.length);
        console.log('[Triedlist Tab js]triedlistArray at render:', this.state.triedlistArray);
        
        return(
            <Container>
                <Content>
                    <View>
                        {gallery}
                    </View>
                </Content>
            </Container>
        )

    }
}

export default Triedlist;