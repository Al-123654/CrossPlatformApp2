import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert , TouchableOpacity, TouchableHighlight} from 'react-native';
import { StackNavigator, NavigationActions  } from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import { 
	Container, Header, Left, Body, Right, Icon, 
	Title, Content, Text, Button, Item, Input, 
	Form, Label, Thumbnail, Footer, FooterTab, Spinner, Toast, Drawer
} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import Gallery from '../components/Gallery/Gallery';
// import Sidebar from '../components/Sidebar/SidebarMenu';
// import SidebarHeader from '../components/Sidebar/SidebarHeader'

// const GET_USERS_URI = 'http://localhost:5000/api/users/';
// const GET_USERS_FOLLOWED_URI = 'http://localhost:5000/api/users?followed=followed';
// const GET_IMAGES_URI = 'http://localhost:5000/api/images/';
// const LOGOUT_URI = 'http://localhost:5000/logout';
const GET_USERS_URI = 'https://app-api-testing.herokuapp.com/api/users/';
const GET_USERS_FOLLOWED_URI = 'https://app-api-testing.herokuapp.com/api/users?followed=1';
const GET_IMAGES_URI = 'https://app-api-testing.herokuapp.com/api/images/';
const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';
const UPLOAD_URI = 'https://app-api-testing.herokuapp.com/upload';
class FeedsScreen extends Component {
	constructor(props) {
		super(props);
		
        // call props.navigation.state.params here
		const { params } = this.props.navigation.state;
		console.log('[feeds js] Data carried over:', this.props.navigation.state);
		console.log('[feeds js] Data carried over- params:', this.props.navigation.state.params);
		console.log('[feeds js] Data carried over- params.data:', this.props.navigation.state.params.data);
        //initialize states
        this.state = {
             passedUsername : props.navigation.state.params.data.username,
             fname : props.navigation.state.params.data.fname,
             lname : props.navigation.state.params.data.lname,
             email : props.navigation.state.params.data.email,
             passedId : props.navigation.state.params.data._id,
             images : props.navigation.state.params.data.images,
             followed : props.navigation.state.params.data.following,
             followImageHeading: [],
             followedImagesContainer: [],
			 followIDArray: [],
			 oneFollowMultiImageFlag: false,
			 feedImagesArray: [],
			 areImagesLoaded: false,
			 disableButtonLogout: false,
			 isLoggedOut: false,
			 disableButtonImage: false,
			 role: props.navigation.state.params.data.role,
			 imagePickerEnabled: false,
			

		}
		console.log('[feeds js] Current states:', this.state);
        
        //check for number of follows and who
        console.log('[feeds js] Constructor - Number of followed users: ', this.state.followed.length);
		console.log('[feeds js] Constructor - Followed users list: ', this.state.followed);
		console.log('[feeds js] Constructor - Role of current user:', this.state.role)
	}

	closeDrawer = () => {
		this.drawer._root.close()
	};
	openDrawer = () => {
		this.drawer._root.open()
	};

	

	componentDidMount = () => {
		let userImagesArray = this.getUserImages();
		console.log('[feeds js] componentDidMount - userImagesArray: ', userImagesArray);

		console.log('[feeds js] componentDidMount - Number of following: ', this.state.followed.length);
		let tempFeedImagesArray = [];
		if (this.state.followed.length === 0) {
			// 0 FOLLOWED
			console.log('[feed js] Check No Follow Array:', [...userImagesArray, ...tempFeedImagesArray])
			this.setState({
				feedImagesArray: [...userImagesArray, ...tempFeedImagesArray],
				areImagesLoaded: true,
				
			});
			
		} else if (this.state.followed.length === 1) {
			// ONE FOLLOWED
			console.log('[feeds js] componentDidMount - One followed: ', this.state.followed);
			console.log('[feeds js] componentDidMount - One followed Contents: ', this.state.followed[0]);
			const followedId = this.state.followed[0];

			return fetch(GET_USERS_URI + followedId)
				.then(response => response.json())
				.then(response => {
					console.log('[feeds js] componentDidMount - fetch response: ', response);
					console.log('[feeds js] componentDidMount - fetch response images: ', response.images);
					console.log('[feeds js] componentDidMount - fetch response images length: ', response.images.length);

					if (response.images.length >= 1) {
						tempFeedImagesArray = [...response.images];

						console.log('[feed js] Check Single Follow Array:', [...userImagesArray, ...tempFeedImagesArray])
						this.setState({
							feedImagesArray: [...userImagesArray, ...tempFeedImagesArray],
							areImagesLoaded: true,
							
						});
					} else {
						console.log('[feeds js] testing for userImagesArray', [...userImagesArray]);
						console.log('[feeds js] No images from follow')
						this.setState({
							feedImagesArray: [...userImagesArray],
							areImagesLoaded: true,
							
						})
						
					}
				})
				.catch(error => console.log('[feeds js] componentDidMount - ONE followed fetch error: ', error));
		} else if (this.state.followed.length > 1) {
			// MULTIPLE FOLLOWED
			console.log('[feeds js] componentDidMount - Multiple followed: ', this.state.followed);
			return fetch(GET_USERS_FOLLOWED_URI)
				.then(response => response.json())
				.then(response => {
					// save images
					console.log('[feeds js] componentDidMount - Multiple followed response: ', response);

					// loop through followed users
					response.data.forEach((followedUser, index) => {
						// check image array length
						if (followedUser.images.length >= 1) {
							let tempFeedImagesArray2 = followedUser.images.map((imageId, index) => {
								let tempImageUri = GET_IMAGES_URI + imageId + '/display';
								return (
									<Button
										transparent style={styles.thumbnail}
										onPress={() => this.onImageClicked(imageId, this.state.passedId)}
										key={imageId}
									>
										<Thumbnail
											large square source={{ uri: tempImageUri }}
										/>
									</Button>
								);
							});
							tempFeedImagesArray = [...tempFeedImagesArray, ...followedUser.images];
						}
					});
					console.log('[feed js] Check Multiple Follow Array:', [...userImagesArray, ...tempFeedImagesArray])
					this.setState({
						feedImagesArray: [...userImagesArray, ...tempFeedImagesArray],
						areImagesLoaded: true,
						
					});
					
					console.log('[feeds js] componentDidMount - Multiple feedImagesArray: ', this.state.feedImagesArray);
				})
				.catch(error => console.log('[feeds js] componentDidMount - MULTIPLE followed fetch error: ', error));
		}
	}
	//DISPLAY USER IMAGES
	getUserImages(){
		let userImagesArray = [];
		// let imageThumbnail;
		//check if user have images and display them
		if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){

			// find out length of image array
			console.log("[feeds js] getUserImages Image Count: ", this.state.images.length);

			if(this.state.images.length >= 1 ){
				userImagesArray = [...this.state.images];
			}
		}
		console.log("[feeds js] getUserImages userImagesArray: ", userImagesArray);
		return [...userImagesArray];
	}
	

	onLogoutHandler = () => {

		Alert.alert(
			'Logging out',
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
								this.setState({
									isLoggedOut: true,
									disableButtonLogout: true
								});
								Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })
								console.log("[feeds js] onLogoutPressHandler - LOGGING OUT!");
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

	// when Explore btn is clicked
	onExplorePressedHandler = (currentUserId) => {
		console.log('[feeds js] onExplorePressedHandler clicked!');
		console.log('[feeds js] ID passed by app js: ', currentUserId);
		this.props.navigation.navigate({ key: 'Explore1', routeName: 'Explore', params: {
				currentUserId:currentUserId
			} 
		})
	};

	onImagePickerHandler = () => {
		if(this.state.role == 2){
			let imagePickerOptions = {
				title: 'Select Image',
				storageOptions: {
					skipBackup: true,
				}
			};

			ImagePicker.showImagePicker(imagePickerOptions, (response) => {

				console.log('[feeds js] Image Picker Response: ', response.fileSize);
				this.setState({ log: '' });
				if (response.didCancel) {
					console.log('[feeds js] User cancelled the picker.');
				} else if (response.error) {
					console.log('[feeds js] ImagePicker Error:', response.error);
				} else if (response.customButton) {
					console.log('[feeds js] User tapped custom button: ', response.customButton);
				} else {
					let source = { uri: response.uri };
					this.setState({
						imageSource: source,
						log: "Image chosen"
					});

					console.log('[feeds js] IMAGE CHOSEN: ', source);

					let platformPath = '';
					if (Platform.OS == 'ios') {
						console.log("[feeds js] PATH OF IMAGE SELECTED IOS: ", response.uri);
						platformPath = response.uri.replace(/^file?\:\/\//i, "");
						console.log('[feeds js] SPECIAL CHARACTERS REMOVED: ', platformPath);
					} else if (Platform.OS == 'android') {
						console.log("[feeds js] PATH OF IMAGE SELECTED ANDROID: ", response.path);
						platformPath = response.path;
					}

					if (platformPath == '') {
						return this.setState({
							log: "Platform path empty"
						});
					}
					console.log('[feeds js] TEST:', response.uri);
					console.log("[feeds js] PLATFORM PATH ", platformPath);

					RNFetchBlob.fetch('POST',
						UPLOAD_URI,
						{},
						[
							{ name: 'sampleFile', filename: response.fileName, data: RNFetchBlob.wrap(platformPath) }
						])
						.then((res) => {
							// console.log('[user js] Response from server - ', res);
							console.log('[feeds js] Status code - ', res.respInfo.status);
							if (res.respInfo.status == 200) {
								console.log('[feeds js] UPLOAD OK');
								this.setState({ log: 'Upload ok!' });
							} else {
								console.log('[feeds js] UPLOAD FAILED - ', res);
								this.setState({ log: 'Upload failed!' });
							}
						})
						.catch((err) => {
							console.log('[feeds js] showImagePicker: ', res);
						});
				}
			});
		}
	}
	
	onImageClicked = (imageId,passedId) => {
		// this.setState({
		// 	disableButton: true
		// });
        console.log("[feeds js] onImageClicked: ", imageId );
        return fetch(GET_IMAGES_URI+ imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
        }).then (response => response.json())
        
        .then(response => {
            console.log('[feeds js] IMAGE DETAILS TRANSFER ', response);
			// this.props.navigation.navigate({ key: 'MyScreen1', routeName: 'ProfileScreen', params: { ...} })
			this.props.navigation.navigate({ key: 'Images1', routeName: 'Image', params: { 
					data:response,
					userId: passedId,
					userData: this.props.navigation.state.params
				} 
			})
		})
			.catch(error => console.error('Error: ', error));
	};

	onBackBtnPressed = () => {
		console.log('[feeds js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onProfilePressedHandler = (passedId) => {
		console.log('[feeds js] onProfilePressedHandler passedId', passedId);
		
		this.props.navigation.navigate({ key: 'Profile1', routeName: 'Profile', params: {
				userId:passedId	
			} 
		});
	}

	onImageDelete = (imageId) => {
		
			let newImageArray = [...this.state.feedImagesArray];
			console.log('[feeds js] Current array of images: ', newImageArray);
			console.log('[feeds js] Testing long press');
			console.log('[feeds js] imageId at onImageDelete:', imageId);
			console.log('[feeds js] Role of user at onImageDelete:', this.state.role);
			console.log('[feeds js] Finding the imageId in newImageArray to delete', newImageArray.findIndex(function (el) {
			return el == imageId
			}));
			let deleteIndex = newImageArray.findIndex(function (el) {
				return el == imageId
			});
			
			Alert.alert(
				'Delete image?',
				'This cannot be undone',
				[
					{
						text: 'OK', onPress: () => {
							if (this.state.role == 2) {
								return fetch(GET_IMAGES_URI + imageId, {
									method: 'DELETE',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json'
									},
								}).then((response) => {
									console.log('feeds js] onImageDelete: ', response);
									if (response.status !== 200) {

										console.log('feeds js] onImageDelete bad response: ', response);
										console.log('[feeds js] onImageDelete testing Json.parse:', JSON.parse(response._bodyInit));
										
										Toast.show({
											text: JSON.parse(response._bodyInit).message,
											buttonText: 'Ok',
											position: 'top',
											duration: 4000
										});									
										return;
									}else{
										Toast.show({
											text: 'Image deleted',
											buttonText: 'Ok',
											position: 'top',
											duration: 4000
										});
										let removeImage = newImageArray.splice(deleteIndex, 1);
										console.log('[feeds js] image removed from array: ', removeImage);
										console.log('[feeds js] new array of images: ', newImageArray);
										this.setState({
											feedImagesArray: [...newImageArray]
										});
									}
								}).catch((error) => {
									console.log(error);
								});
							} else {
								Toast.show({
									text: 'Cannot delete,Invalid role',
									buttonText: 'OK',
									position: 'top',
									duration: 4000
								})
							}
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

	render() {
		console.log('[feeds js] Role of user at onImageDelete:', this.state.role);
		let gallery = (<Spinner/>);
		let imagePickerButton;
		let logoutLoader = (
			<Button transparent onPress={this.onLogoutHandler}>
				<Icon name='home' />
			</Button>);
		console.log('[feeds js] feedImagesArray length:', this.state.feedImagesArray.length) 
		if(this.state.areImagesLoaded){
			if (this.state.feedImagesArray.length > 0) {
				gallery = (<Gallery
					images={this.state.feedImagesArray}
					clicked={this.onImageClicked}
					longclick={this.onImageDelete}
					passedUserId={this.state.passedId}
				/>);
			} else if (this.state.feedImagesArray.length === 0) {
				gallery = (<Text>No images available</Text>);
			}
		}

		if(this.state.isLoggedOut){
			logoutLoader = (
				<Button transparent disabled ={this.state.disableButtonLogout}>
					<Spinner/>
				</Button>
			)
		}

		if(!this.state.areImagesLoaded){
			gallery = (<Spinner/>);
		}

		if(this.state.role == 2){
			imagePickerButton = (
				<Button full onPress={this.onImagePickerHandler}>
					<Icon name="camera" />
					<Text>Image Picker</Text>
				</Button>
			)
		}else{
			imagePickerButton = null;
		}
       
        return (
			<Container>
				<Header>
					<Left>
						
					</Left>
					<Body><Title>{this.state.passedUsername}</Title></Body>
					<Right>
						{logoutLoader}
					</Right>
				</Header>
				<Content>
					
					{gallery}
				</Content>
				<Footer>
					<FooterTab >
						{imagePickerButton}
						<Button  full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
							<Icon name="navigate" />
							<Text>Explore</Text>
						</Button>
						<Button full onPress={() => { this.onProfilePressedHandler(this.state.passedId) }}>
							<Icon name= "ios-person"/>
							<Text>Profile</Text>
						</Button>
					</FooterTab>
				</Footer>
			</Container>
        );
    }
}

const styles = StyleSheet.create({
	page: {
		width: window.width,
		height: window.height,
		flex: 1,
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	outerHeader:{},
	body: {
		flex:1,
		flexDirection:'column',
		justifyContent: 'space-between'
	},
	imagesContainer: {
		flex: 1,
		width: '100%',
		height: '100%',
		flexDirection:'row',
		flexWrap:'wrap'
	},
	currentUserOuter: {
		flex: 1,
		flexDirection:'column',
		width: '100%',
		height: '100%'
	},
	currentUserInner: {
		flexDirection:'row',
		flexWrap:'wrap'
	},
	buttonsContainer: {
		width: 60,
		height: 60,
		flex: 1,
		flexDirection:'column'
	},
	followedImagesOuter: {
		flex:1,
		flexDirection:'column'
	},
	followedImagesInner: {
		flex:1,
		flexDirection:'row',
		flexWrap:'wrap'
	},
	followedUsersOuterSingle: {
		flex:1,
		flexDirection: 'row'
	},
	followedUsersOuterMulti: {
		flex:1,
		flexDirection: 'column'
	},
	viewContainer: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
    pictures: {
        flex: 1, flexDirection: 'row',
        width: '80%',
        flexWrap:'wrap',
        justifyContent: 'center',
    },
    thumbnail: {
        width: 80,
        height: 80,
    }
});

module.exports = FeedsScreen;
