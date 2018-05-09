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
            restaurantName: this.props.navigation.state.params.username,
            food: this.props.navigation.state.params.images,
            previousId: this.props.navigation.state.params.previousId,
            locationSaved: null,
            markers: [
                {
                    coordinate:{
                        latitude: 4.872518,
                        longitude: 114.901595
                    },
                    title: '1st Marker',
                    description: 'Test 1'
                },
                {
                    coordinate:{
                        latitude: 4.901655,
                        longitude: 114.900434
                    },
                    title: '2nd Marker',
                    description: 'Test 2'
                },
                {
                    coordinate:{
                        latitude: 4.879594,
                        longitude: 114.893613
                    },
                    title: '3rd Marker',
                    description: 'Test 3'
                }
            ],
            region:{
                latitude: 4.868272,
                longitude: 114.900799,
                latitudeDelta: 0.0222,
                longitudeDelta: 0.0201,
            }
        }
        console.log('[restaurant js] constructor - Restaurant ID: ', this.state.restaurantID)
        console.log('[restaurant js] constructor - Name of restaurant: ', this.state.restaurantName)
        console.log('[restaurant js] constructor - Restaurant Image: ', this.state.food[0])
        console.log('[restaurant js] constructor - Food: ', this.state.food)
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

   getLocationSaved = () => {

       return fetch(GET_USERS_URI + this.state.previousId, {
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
               console.log('[restaurant js] getLocationSaved = data.location: ', data.locations)
               console.log('[restaurant js] getLocationSaved = data.location.length: ', data.locations.length)
               if(data.locations.length != 0){
                this.setState({
                    locationSaved : true
                })    
                
               }else{
                this.setState({
                    locationSaved : false
                })    
               }
               console.log('[restaurant js] getLocationSaved - locationSaved: ', this.state.locationSaved);

           });
           }).catch(err => console.log('[restaurant js] getLocationSaved - error: ', err));
           
   }

    onLocationSave = () =>{

        let tempLocationLength;

        return fetch(GET_USERS_URI, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    id: this.state.restaurantID,
                    lat: "4.868272",
                    lng: "114.900799,"
                }
            })
        }).then(response => {
            console.log('[restaurant js] onLocationSavePressed - response: ', response);
            if (response.status !== 200) {
                console.log('[restaurant js] onLocationSavePressed - bad response: ', response);
                return;
            }
            response.json().then(data => {
                console.log('[restaurant js] onLocationSavePressed - json response: ', data);
                console.log('[restaurant js] onLocationSavePressed-  data.locations: ', data.updatedUser.locations)
                tempLocationLength = data.updatedUser.locations.length;
                console.log('[restaurant js] onLocationSavePressed - tempLocationLength: ', tempLocationLength)

                if (tempLocationLength != 0) {
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
                        duration: 4000
                    })
                
                }   
            }); 
            console.log('[restaurant js] onLocationSavePressed - locationSaved: ', this.state.locationSaved);
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

        let markerButton = (<Spinner/>);
        console.log('[restaurant js] render - locationSaved: ', this.state.locationSaved);
        if(!this.state.locationSaved){
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
                            <Label>Map of restaurant</Label>
                        </Row>
                        <Row>
                            <MapView
                                ref={map => this.map = map}
                                style={styles.mapContainer}
                                initialRegion={this.state.region}
                            >
                            {this.state.markers.map((marker, index) => {
                                return (
                                    <MapView.Marker 
                                        key={index} 
                                        coordinate={marker.coordinate} 
                                        title = {marker.title} 
                                        description = {marker.description}   
                                    >
                                    </MapView.Marker>
                                );
                            })}
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
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: 200
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