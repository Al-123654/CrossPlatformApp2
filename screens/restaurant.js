import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Gallery from '../components/Gallery/Gallery';
import MapView, {Marker} from 'react-native-maps';

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
            restaurantID: this.props.navigation.state.params.userId,
            restaurantTitle: this.props.navigation.state.params.title,
            food: this.props.navigation.state.params.images,
            loggedID: this.props.navigation.state.params.previousId,
            locationSaved: null,
            bruneiRegion: this.props.navigation.state.params.coordinates
        }
        console.log('[restaurant js] constructor - Restaurant ID: ', this.state.restaurantID)
        console.log('[restaurant js] constructor - Name of restaurant: ', this.state.restaurantTitle)
        console.log('[restaurant js] constructor - Restaurant Image: ', this.state.food[0])
        console.log('[restaurant js] constructor - Food: ', this.state.food)
        console.log('[restaurant js] constructor - bruneiRegion', this.state.bruneiRegion)
    }
    componentDidMount = () => {
        this.getLocationSaved();
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

    //CHECK IF USER SAVED RESTAURANT, ALLOW USER TO ADD OR REMOVE
   getLocationSaved = () => {
       let serverCoord;
       return fetch(GET_USERS_URI + this.state.loggedID, {
           method: 'GET',
           headers: {
               'content-type': 'application/json'
           },
       }).then(response => {
           console.log('[restaurant js] getLocationSaved - response: ', response);
           if (response.status !== 200) {
               console.log('[restaurant js] getLocationSaved - bad response: ', response);
               return;
           }
           response.json().then(data => {
                console.log('[restaurant js] getLocationSaved - json response: ', data);
                console.log('[restaurant js] getLocationSaved - data.locations: ', data.locations)
                console.log('[restaurant js] getLocationSaved - data.locations.length: ', data.locations.length)
                if(data.locations.length > 0){
                    serverCoord = data.locations.map(latLng => {
                        serverLat = latLng.lat
                        serverLng = latLng.lng
                        console.log('[restaurant js] getLocationSaved - serverLat: ', serverLat);
                        console.log('[restaurant js] getLocationSaved - serverLng: ', serverLng);
                        console.log('[restaurant js] getLocationSaved - this.state.bruneiRegion.lat: ', this.state.bruneiRegion.lat)
                        console.log('[restaurant js] getLocationSaved - this.state.bruneiRegion.lng: ', this.state.bruneiRegion.lng)
                      
                        if (serverLat == this.state.bruneiRegion.lat && serverLng == this.state.bruneiRegion.lng) {
                            this.setState({
                                locationSaved: true
                            })                        
                        } else {
                            this.setState({
                                locationSaved: false
                            })
                        }
                    })
                    console.log('[restaurant js] getLocationSaved - this.state.locationSaved: ', this.state.locationSaved);
                   
                }
           });
           }).catch(err => console.log('[restaurant js] getLocationSaved - error: ', err));
           
   }

    // SAVE/REMOVE LOCATION DATA TO API 
    onLocationSave = () =>{
        let newMarker;
        let tempLocationLength;
        let markerLat;
        let markerLng;
        // const latMin = 4, latMax =  4.6;
        // const lngMin = 114, lngMax = 115;
        // let randomLat = (Math.random() * (latMax - latMin) + latMin).toFixed(4);
        // let randomLng = (Math.random() * (lngMax - lngMin) + lngMin).toFixed(4);
        // console.log('restaurant js onLocationSave -  randomLat: ', randomLat);
        // console.log('restaurant js onLocationSave -  randomLng: ', randomLng);

        return fetch(GET_USERS_URI, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    id: this.state.restaurantID,
                    lat: this.state.bruneiRegion.lat,
                    lng: this.state.bruneiRegion.lng,
                    title: this.state.restaurantTitle
                },
            })
        }).then(response => {
            console.log('[restaurant js] onLocationSavePressed - response: ', response);
            if (response.status !== 200) {
                console.log('[restaurant js] onLocationSavePressed - bad response: ', response);
                return;
            }
            response.json().then(data => {
                console.log('[restaurant js] onLocationSavePressed-  data.locations: ', data.updatedUser.locations)
                console.log('[restaurant js] onLocationSavePressed-  this.state.bruneiRegion: ', this.state.bruneiRegion)
                tempLocationLength = data.updatedUser.locations.length;
                console.log('[restaurant js] onLocationSavePressed - tempLocationLength: ', tempLocationLength)
                newMarker =  data.updatedUser.locations.map(markers => {
                    markerLat = markers.lat
                    markerLng = markers.lng
                })
                console.log('[restaurant js] onLocationSavePressed - markerLat: ', markerLat);
                console.log('[restaurant js] onLocationSavePressed - markerLng: ', markerLng);

                if (markerLat == this.state.bruneiRegion.lat && markerLng == this.state.bruneiRegion.lng) {
                    this.setState({
                        locationSaved : true
                    }) 
                    Toast.show({
                        text: 'Location saved',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 4000
                    })
                } else {
                    this.setState({
                        locationSaved : false
                    }) 
                    Toast.show({
                        text: 'Location removed',
                        buttonText: 'Ok',
                        position: 'top',
                    })
                    
                }   
            }); 
            console.log('[restaurant js] onLocationSavePressed - locationSaved: ', this.state.locationSaved);
            duration: 4000
        }).catch(err => console.log('[restaurant js] onLocationSavePressed - error: ', err));
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

        let regionCoordinates = ({
            latitude: Number(this.state.bruneiRegion.lat),
            longitude: Number(this.state.bruneiRegion.lng),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
        })
        console.log('[restaurant js] render - regionCoordinates: ', regionCoordinates)

        let restaurantMarker = ({
            latitude: Number(this.state.bruneiRegion.lat),
            longitude: Number(this.state.bruneiRegion.lng)
        })

        let markerButton = (<Spinner/>);
        console.log('[restaurant js] render - locationSaved: ', this.state.locationSaved);
        if(!this.state.locationSaved ){
            markerButton=(
                <Button onPress={this.onLocationSave}>
                    <Text>Save location</Text>
                </Button>
            )
            
        }else{
            markerButton = (
                <Button onPress={this.onLocationSave}>
                    <Text>Remove location</Text>
                </Button>
            )
        }
        return(
            <Container>
                <Header hasTabs>
                    <Left>
                        <Button transparent onPress={this.onBackBtnPressed}>
                            <Icon name='arrow-back' />
                        </Button>
                    </Left>
                    <Body><Title>{this.state.restaurantTitle}</Title></Body>
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
                            <Label>Map of restaurant</Label>
                        </Row>
                        <Row>
                            <MapView
                                ref={map => this.map = map}
                                style={styles.mapContainer}
                                initialRegion={regionCoordinates}
                            >
                                <Marker
                                    coordinate={restaurantMarker}
                                    title={this.state.restaurantTitle}
                                    // description={this.state.restaurantID}
                                />
                            </MapView>
                        </Row>      
                    </Content>
                </Container>
                <Footer>
                    <FooterTab >
                       {markerButton}
                    </FooterTab>
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: 300
    },
    markerWrap:{
        alignItems: "center",
        justifyContent: "center"
    },

    ring: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(130,4,150, 0.3)",
        position: "absolute",
        borderWidth: 1,
        borderColor: "rgba(130,4,150, 0.5)",
    },
    marker: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "rgba(130,4,150, 0.9)",
    }
})
module.exports = RestaurantScreen;