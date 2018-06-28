/**
 * @desc restaurant.js
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity, TouchableHighlight, Animated, Dimensions } from 'react-native';
import { createStackNavigator, NavigationActions, StackActions } from 'react-navigation';
import RNFetchBlob from 'react-native-fetch-blob';
import {
    Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input,
    Form, Label, Thumbnail, Footer, FooterTab, Tab, Tabs, TabHeading, Toast, ListItem,
    Spinner
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import Gallery from '../components/Gallery/Gallery';
import MapView, {Marker} from 'react-native-maps';

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
        console.log('[restaurant js] constructor - routeName: ', this.props.navigation.state.routeName);
        
        

        /**
         * Initialise states
         */
        this.state = {
            restaurantID: this.props.navigation.state.params.userId,
            restaurantTitle: this.props.navigation.state.params.title,
            food: this.props.navigation.state.params.images,
            userId: this.props.navigation.state.params.previousId,
            locationSaved: null,
            restaurantCoord: this.props.navigation.state.params.coordinates,
            followedUsers: "",
            profilePic: this.props.navigation.state.params.profile_pic,
            currentUserDetails:'',
        }
        console.log('[restaurant js] constructor - Restaurant ID: ', this.state.restaurantID);
        console.log('[restaurant js] constructor - Name of restaurant: ', this.state.restaurantTitle);
        console.log('[restaurant js] constructor - Restaurant Image: ', this.state.food[0]);
        console.log('[restaurant js] constructor - Food: ', this.state.food);
        console.log('[restaurant js] constructor - restaurantCoord', this.state.restaurantCoord);
        console.log('[restaurant js] constructor - profilePic', this.state.profilePic);
        console.log('[restaurant js] constructor - image uri + profilePic: ',  GET_IMAGES_URI + this.state.profilePic + '/display');
        console.log('[restaurant js] constructor - previousRoute: ',  this.state.previousRoute);
    }
    componentDidMount = () => {
        this.getLocationSaved();
        this.displayFollowed();
        // this.onFeedsPressHandler();
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
                                    duration: 3000
                                })

                                console.log("[user js] onLogoutPressHandler - LOGGING OUT!");
                                const resetAction = StackActions.reset({
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
       
        console.log('[restaurant js] onBackBtnPressed');
        this.props.navigation.goBack();
    }
    onImageClicked = (imageId, passedId) => {
        console.log("[restaurant js] onImageClicked - imageId: ", imageId);
        return fetch(GET_IMAGES_URI + imageId, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log('[restaurant js] onImageClicked - response from server: ', response);
                this.props.navigation.navigate({
                    key: 'Food1', routeName: 'Food', params: {
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
        console.log('[restaurant js] onImageLongClick!!')
    }

    // get followed
    displayFollowed = () => {
        fetch(GET_FOLLOWED_BY + this.state.restaurantID, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then(response => {

            if (response.status !== 200) {
                Toast.show({
                    text: 'Search failed!',
                    buttonText: 'Ok',
                    position: 'top',
                    duration: 2000
                });
                return;
            }
            // if fetch ok
            response.json().then(respObj => {
                console.log('[restaurant js] displayFollowed - respObj:', respObj)

                this.setState({
                    followedUsers: respObj
                })

            }).catch(error => console.error('Error: ', error));

        })
    }

   /**
    * Check to see if the restaurant has already been saved and display the correct prompt
    * serverLat and serverLng: variables used to compare the restaurant coordinates with those saved by the user in the api
    */
   getLocationSaved = () => {
       
       let serverLat;
      
       let serverLng;

       // fetch data from api
       return fetch(GET_USERS_URI + this.state.userId, {
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
                this.setState({
                    currentUserDetails: data
                })
                console.log('[restaurant js] getLocationSaved - data.locations: ', data.locations)
                console.log('[restaurant js] getLocationSaved - data.locations.length: ', data.locations.length)
                if(data.locations.length > 0){
                    // loop through all available saved restaurants
                    for(i = 0; i != data.locations.length; i++){
                        console.log('restaurant js getLocationSaved -  data.locations at for loop: ', data.locations)
                        console.log('restaurant js getLocationSaved -  data.locations.lat at for loop: ', data.locations[i].lat)
                        serverLat = data.locations[i].lat
                        serverLng = data.locations[i].lng
                        console.log('[restaurant js] getLocationSaved - serverLat: ', serverLat);
                        console.log('[restaurant js] getLocationSaved - serverLng: ', serverLng);
                        console.log('[restaurant js] getLocationSaved - this.state.restaurantCoord.lat: ', this.state.restaurantCoord.lat)
                        console.log('[restaurant js] getLocationSaved - this.state.restaurantCoord.lng: ', this.state.restaurantCoord.lng)

                        //check if the restaurant's latitude and longtitude matches with saved latitude and longtitude from server
                        if (serverLat == this.state.restaurantCoord.lat && serverLng == this.state.restaurantCoord.lng) {
                            this.setState({
                                locationSaved: true,
                            })
                            break;
                        } 
                    }
                    console.log('[restaurant js] getLocationSaved - this.state.locationSaved: ', this.state.locationSaved);
                   
                }else{
                    this.setState({
                        locationSaved:false,

                    })
                }
           });
           }).catch(err => console.log('[restaurant js] getLocationSaved - error: ', err));
           
   }

    /**
     * Save location to api 
     * If location is already saved remove from api
     * newMarker- variable to do the .map function
     * markerLat- variable to store the latitude 
     * markerLng- variable to store the longtitude
     */
    onLocationSave = () =>{
       
        let newMarker;
        let markerLat;
        let markerLng;

        return fetch(GET_USERS_URI, {
            method: 'PUT',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                location: {
                    id: this.state.restaurantID,
                    lat: this.state.restaurantCoord.lat,
                    lng: this.state.restaurantCoord.lng,
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
                console.log('[restaurant js] onLocationSavePressed-  this.state.restaurantCoord: ', this.state.restaurantCoord)
                newMarker =  data.updatedUser.locations.map(markers => {
                    markerLat = markers.lat
                    markerLng = markers.lng
                })
                console.log('[restaurant js] onLocationSavePressed - markerLat: ', markerLat);
                console.log('[restaurant js] onLocationSavePressed - markerLng: ', markerLng);

                
                if (markerLat == this.state.restaurantCoord.lat && markerLng == this.state.restaurantCoord.lng) {
                    this.setState({
                        locationSaved : true,

                    }) 
                    Toast.show({
                        text: 'Location saved',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 3000
                    })
                } else {
                    this.setState({
                        locationSaved : false,

                    }) 
                    Toast.show({
                        text: 'Location removed',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 3000
                    })
                }   
            }); 
        }).catch(err => console.log('[restaurant js] onLocationSavePressed - error: ', err));
    }

    onFeedsPressHandler = () => {
        /** 
         * return to feeds
         * refresh with new data
        */
        return fetch(GET_USERS_URI + this.state.userId, {
            method: 'GET',
            headers: {
                'content-type': 'application/json'
            },
        }).then(response => {
            console.log('[restaurant js] onFeedsPressHandler - response: ', response);
            response.json().then(data => {
                console.log('restaurant js onFeedsPressHandler - data: ', data)
                this.props.navigation.navigate({
                    key: 'Feeds1', routeName: 'Feeds', params: {
                        data: data
                    }
                })
            })
        }).catch(err => console.log('[restaurant js] getLocationSaved - error: ', err));
    }

    onExplorePressedHandler = (currentUserId) => {
        console.log('[feeds js] onExplorePressedHandler - clicked!');
        console.log('[feeds js] onExplorePressedHandler - ID passed by app js: ', currentUserId);
        this.props.navigation.navigate({
            key: 'Explore1', routeName: 'Explore', params: {
                currentUserId: currentUserId
            }
        });
    };

   
    render(){
        
        console.log('[restaurant js] render - this.state.currentUserDetails: ', this.state.currentUserDetails)
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
            latitude: Number(this.state.restaurantCoord.lat),
            longitude: Number(this.state.restaurantCoord.lng),
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
        })
        console.log('[restaurant js] render - regionCoordinates: ', regionCoordinates)

        let restaurantMarker = ({
            latitude: Number(this.state.restaurantCoord.lat),
            longitude: Number(this.state.restaurantCoord.lng)
        })

        let markerButton = (<Spinner/>);
        console.log('[restaurant js] render - locationSaved: ', this.state.locationSaved);
        if(!this.state.locationSaved){
            markerButton=(
                <Button onPress={this.onLocationSave}>
                    <Text>Save location</Text>
                </Button>
            )
            
        }else if(this.state.locationSaved){
            markerButton = (
                <Button onPress={this.onLocationSave}>
                    <Text>Remove location</Text>
                </Button>
            )
        }
        return(
            /**
             * render data onscreen
             */
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
                            <Icon name='home'/>
                        </Button>
                    </Right>
                </Header>
                <Container>
                    <Content>
                        <Row style={{ marginTop: 10, alignItems: 'center', justifyContent: 'space-between'}}>
                            
                            <Thumbnail style={{ marginLeft: 20 }} large source={{ uri: GET_IMAGES_URI + this.state.profilePic + '/display'}}/>
                            
                            <View style={{flex: 1, alignItems: 'center', marginLeft: 90}}>
                                <Text>{this.state.food.length}</Text>
                                <Label style = {{fontSize: 14,}}> Meals</Label>
                            </View>
                            <View style={{ flex: 1, alignItems: 'center',}}>
                                <Text>{this.state.followedUsers.length}</Text>
                                <Label style = {{fontSize: 14,}}> Followers</Label> 
                            </View>
                        </Row>
                        <Row>
                            <Label style={{marginLeft: 20, marginTop: 20, alignItems:'center',
                            fontSize: 20, fontWeight: 'bold'}}
                            >
                                Food available:
                            </Label>
                        </Row>
                        <Row style={{marginLeft: 50, marginTop: 20, alignItems: 'center'}}>
                            {displayFood}
                        </Row>
                        
                        <Row>
                            <Label style={{
                                marginLeft: 125, alignItems: 'center', marginTop: 20,
                                fontSize: 20, fontWeight: 'bold'
                            }}>
                                Map of restaurant
                            </Label>
                        </Row>
                        <Row style={{flex:1,marginLeft: 130}}>
                            {markerButton}
                        </Row>
                        <Row style = {{alignItems: 'center', marginTop: 20}}>
                            
                            <MapView
                                ref={map => this.map = map}
                                style={styles.mapContainer}
                                initialRegion={regionCoordinates}
                            >
                                <Marker
                                    coordinate={restaurantMarker}
                                    title={this.state.restaurantTitle}
                                />
                            </MapView>
                        </Row>      
                    </Content>
                </Container>
                <Footer>
                    <FooterTab >
                        <Button onPress={this.onFeedsPressHandler}>
                            <Icon name='pizza' />
                            <Text>Feeds</Text>
                        </Button>
                        <Button full onPress={() => { this.onExplorePressedHandler(this.state.userId) }}>
                            <Icon name="navigate" />
                            <Text>Explore</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    imageContainer: {
        width: '85%',
        height: 250,
        // flex: 1,
        position: 'relative',
        // marginLeft: 50,
        // alignItems:'center'
    },
    mapContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        width: '100%',
        height: 350
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