import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Gallery from '../components/Gallery/Gallery';
import MapView from 'react-native-maps';

// const ALL_USER_URI = 'http://localhost:5000/api/users?followedList=1&userid='
// const LOGOUT_URI = 'http://localhost:5000/logout'
// const GET_USERS_URI = 'http://localhost:5000/api/users/';
// const GET_FOLLOWED_BY = 'http://localhost:5000/api/users?usersFollowing=1&userid='
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
const ALL_USER_URI = 'https://app-api-testing.herokuapp.com/api/users?followedList=1&userid='
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout'
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_FOLLOWED_BY = 'https://app-api-testing.herokuapp.com/api/users?usersFollowing=1&userid='
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';

class RestaurantScreen extends Component{
    constructor(props){
        super(props);
        const { params } = this.props.navigation.state;
        console.log('[restaurant js]constructor - params:', this.props.navigation.state);

        // INITIALISE STATES
        this.state = {
            restaurantName: this.props.navigation.state.params.username,
            food: this.props.navigation.state.params.images
        }
        console.log('[restaurant js] constructor - Name of restaurant: ', this.state.restaurantName)
        console.log('[restaurant js] constructor - Restaurant Image: ', this.state.food[0])
        console.log('[restaurant js] constructor - Food: ', this.state.food)
    }
    componentDidMount = () => {

    }
    onLogoutHandler = () => {

        Alert.alert(
            'Log out?',
            "",
            [
                {
                    text: 'OK', onPress: () => {
                        return fetch(LOGOUT_URI, {
                            method: 'GET',
                            headers: {
                                Accept: 'application/json',
                                'Content-Type': 'application/json'
                            },
                        }).then((response) => response.json())
                            .then((responseJson) => {
                                Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })

                                console.log("[user js] onLogoutPressHandler - LOGGING OUT!");
                                const resetAction = NavigationActions.reset({
                                    index: 0,
                                    actions: [NavigationActions.navigate({ routeName: 'Home' })],
                                });
                                this.props.navigation.dispatch(resetAction);
                            })
                            .catch((error) => {
                                console.error(error);
                            });

                    }
                },
                {
                    text: 'Cancel', onPress: () => {
                        style: 'cancel'
                    }
                }
            ]
        )
    }
    onBackBtnPressed = () => {
        console.log('[user js] onBackBtnPressed');
        this.props.navigation.goBack();
    }
    onImageClicked = (imageId, passedId) => {
        console.log("[user js] onImageClicked - imageId: ", imageId);
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[user js] onImageClicked - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Images1', routeName: 'Image', params: {
                        data: response,
                        userId: passedId,
                        userData: this.props.navigation.state.params,
                        imagesDisplayed: this.state.userImages
                    }
                })
            })
            .catch(error => console.error('Error: ', error));
    };

    onImageLongClick = (imageId, passedId) => {
        console.log('[user js] onImageLongClick!!')
    }
    render(){
        let displayFood = (<Spinner/>);
        if(this.state.food.length >= 1){
            displayFood = (<Gallery
                images={this.state.food}
                clicked={this.onImageClicked}
                longclick={this.onImageLongClick}
                passedUserId={this.state.userId}
            />)
        }else{
            displayFood = (<Text>No food available</Text>)
        }
        // let displayRestaurant = (<Spinner />);
        // if(this.state.restaurantImage){
        //     displayRestaurant = (<Image source = {{uri: GET_IMAGES_URI + this.state.restaurantImage + '/display'}}/>
        //     )
        //     // console.log('[user js] render - displayRestaurant: ', displayRestaurant)
        // }else{
        //     displayRestaurant = (<Text>No image available</Text>)
        // }
        console.log('[restaurant js] render - uri to get restaurant image:', GET_IMAGES_URI + this.state.food[0] + '/display')
        

        return(
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>{this.state.restaurantName}</Title></Body>
                    <Right>
                        <Button transparent onPress={this.onLogoutHandler}>
                            <Icon name='home' />
                        </Button>
                    </Right>
                </Header>
                <Container>
                    
                    <Content>
                        <Row>
                            <Label>Restaurant Image: </Label>
                        </Row>
                        <Row>
                           <Image 
                           style = {styles.imageContainer}
                           source = {{uri: GET_IMAGES_URI + this.state.food[0] + '/display'}}/>
                        </Row>
                        <Row>
                            <Label>Food Available: </Label>
                        </Row>
                        <Row>
                            {displayFood}
                        </Row>
                        <Row>
                            <MapView
                                style={styles.mapContainer}
                                initialRegion={{
                                    latitude: 37.78825,
                                    longitude: -122.4324,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                }}
                            />
                        </Row>
                       
                        
                    </Content>

                </Container>


                <Footer>
                    {/* <FooterTab >
                        <Button full onPress={this.onFeedsPressedHandler()}>
                            <Icon name="camera" />
                            <Text>Feeds</Text>
                        </Button>
                        <Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
                            <Icon name="navigate" />
                            <Text>Explore</Text>
                        </Button>
                    </FooterTab> */}
                </Footer>
               
            </Container>
            
            
        
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '100%',
        height: 250,
        flex: 1,
        position: 'relative'
    },
    mapContainer:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: 200
    }
})
module.exports = RestaurantScreen;