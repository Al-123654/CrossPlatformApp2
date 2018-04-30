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
		console.log('[feeds js] constructor - Data carried over: ', this.props.navigation.state);
		console.log('[feeds js] constructor - Data carried over: params ', this.props.navigation.state.params);
		console.log('[feeds js] constructor - Data carried over: params.data ', this.props.navigation.state.params.data);
		// console.log('[feeds js] constructor - Data carried over: params.processedImages ', this.props.navigation.state.params.processedImages);

        //initialize states
        this.state = {
			passedUsername : props.navigation.state.params.data.username,
			fname : props.navigation.state.params.data.fname,
			lname : props.navigation.state.params.data.lname,
			email : props.navigation.state.params.data.email,
			passedId : props.navigation.state.params.data._id,
			images : props.navigation.state.params.data.images,
			followed : props.navigation.state.params.data.following,
			feedImagesArray: props.navigation.state.params.processedImages ?  props.navigation.state.params.processedImages : null,
			areImagesLoaded: false,
			disableButtonLogout: false,
			isLoggedOut: false,
			role: props.navigation.state.params.data.role,
			imageIdToDelete : props.navigation.state.params.imageIdToDelete ?  props.navigation.state.params.imageIdToDelete : null,
			userImages: null,
			followedImages: null
		}
		console.log('[feeds js] constructor - Current states:', this.state);
	}

	closeDrawer = () => {
		this.drawer._root.close()
	};
	openDrawer = () => {
		this.drawer._root.open()
	};

	componentDidMount = () => {
		if(this.state.imageIdToDelete){
			// runs only if deleting using btn from images js
			console.log("[feeds js] componentDidMount - feedImagesArray from images: ", this.state.feedImagesArray);
			console.log("[feeds js] componentDidMount - imageIdToDelete: ", this.state.imageIdToDelete);
			this.onImageDelete(this.state.imageIdToDelete);
		}else{
			this.getUserImages();
			this.getFollowedImages();
		}
	}

	componentDidUpdate(prevProps, prevState){
		console.log("[feeds js] componentDidUpdate - is imageIdToDelete set? ", this.state.imageIdToDelete);
		console.log("[feeds js] componentDidUpdate - is userImages set? ", this.state.userImages);
		console.log("[feeds js] componentDidUpdate - is followedImages set? ", this.state.followedImages);
		console.log("[feeds js] componentDidUpdate - is feedImagesArray set? ", this.state.feedImagesArray);

		// load user images and followed images only when states are available
		if( this.state.imageIdToDelete === null && this.state.userImages !== null && this.state.followedImages !== null && this.state.feedImagesArray === null ){
			console.log("[feeds js] componentDidUpdate - state update!");
			this.setState({
				feedImagesArray: [...this.state.userImages, ...this.state.followedImages ],
				areImagesLoaded: true
			});
		}
	}

	onImageDelete = (imageId) => {
		if(this.state.imageIdToDelete){
			this.deleteImage(imageId);
		}else{
			Alert.alert(
				'Delete image?',
				'This cannot be undone',
				[
					{
						text: 'OK', onPress: () => { this.deleteImage(imageId); }
					},
					{
						text: 'Cancel', onPress: () => { style: 'cancel' }
					}
				]
			)
		}	
	}

	deleteImage = (imageId) => {
		let newImageArray = [...this.state.feedImagesArray];
		console.log('[feeds js] deleteImage - Current array of images: ', newImageArray);
		console.log('[feeds js] deleteImage - Image Id to delete: ', imageId);
		console.log('[feeds js] deleteImage - Index to delete: ', newImageArray.findIndex(function (el) {
			return el === imageId;
		}));
		let deleteIndex = newImageArray.findIndex(function (el) {
			return el === imageId;
		});
			
		if (this.state.role === 2) {
			return fetch(GET_IMAGES_URI + imageId, {
				method: 'DELETE',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
			}).then((response) => {
				console.log('feeds js] onImageDelete: ', response);
				if (response.status !== 200) {

					console.log('feeds js] deleteImage - bad response: ', response);
					console.log('[feeds js] deleteImage - testing Json.parse:', JSON.parse(response._bodyInit));
					
					Toast.show({
						text: JSON.parse(response._bodyInit).message,
						buttonText: 'Ok',
						position: 'top',
						duration: 4000
					});
					
					if(response.status !== 401){
						return;
					}else {
						// unauthorized 401
						if(this.state.imageIdToDelete){
							this.setState({
								imageIdToDelete: null,
								areImagesLoaded: true
							});
						}
					}
				}else{
					Toast.show({
						text: 'Image deleted',
						buttonText: 'Ok',
						position: 'top',
						duration: 4000
					});
					
					if(this.state.imageIdToDelete){
						let removeImage = newImageArray.splice(deleteIndex, 1);
						console.log('[feeds js] deleteImage - from images js - image removed from array: ', removeImage);
						console.log('[feeds js] deleteImage - from images js - new array of images: ', newImageArray);
						this.setState({
							imageIdToDelete: null,
							areImagesLoaded: true,
							feedImagesArray: [...newImageArray]
						});
					}else{
						let removeImage = newImageArray.splice(deleteIndex, 1);
						console.log('[feeds js] deleteImage - from long press - image removed from array: ', removeImage);
						console.log('[feeds js] deleteImage - from long press - new array of images: ', newImageArray);
						this.setState({
							feedImagesArray: [...newImageArray]
						});
					}
				}
			}).catch((error) => {
				console.log(error);
			});
		} else {
			Toast.show({
				text: 'Cannot delete, invalid role',
				buttonText: 'OK',
				position: 'top',
				duration: 4000
			})
		}
	}

	getUserImages(){
		let userImagesArray = [];
		// let imageThumbnail;
		//check if user have images and display them
		if(typeof this.state.images != undefined && this.state.images != null && this.state.images.length != null && this.state.images.length > 0){

			// find out length of image array
			console.log("[feeds js] getUserImages - Image Count: ", this.state.images.length);

			if(this.state.images.length >= 1 ){
				userImagesArray = [...this.state.images];
			}
		}
		console.log("[feeds js] getUserImages - userImagesArray: ", userImagesArray);
		this.setState({userImages: [...userImagesArray]});
	}

	getFollowedImages(){
		console.log('[feeds js] getFollowedImages - Number of following: ', this.state.followed.length);
		let followedImagesArray = [];
		if (this.state.followed.length === 0) {
			// 0 FOLLOWED
			console.log("[feeds js] getFollowedImages - 0 FOLLOWED");
			console.log('[feeds js] getFollowedImages - followedImagesArray:', followedImagesArray);
			this.setState({followedImages: [...followedImagesArray]});
		} else if (this.state.followed.length === 1) {
			// ONE FOLLOWED
			console.log('[feeds js] getFollowedImages - 1 FOLLOWED: ', this.state.followed);
			console.log('[feeds js] getFollowedImages - One followed Contents: ', this.state.followed[0]);
			const followedId = this.state.followed[0];

			return fetch(GET_USERS_URI + followedId)
				.then(response => response.json())
				.then(response => {
					console.log('[feeds js] getFollowedImages - fetch response: ', response);
					console.log('[feeds js] getFollowedImages - fetch response images: ', response.images);
					console.log('[feeds js] getFollowedImages - fetch response images length: ', response.images.length);

					if (response.images.length >= 1) {
						followedImagesArray = [...response.images];
					} else {
						console.log('[feeds js] getFollowedImages - No images from follow')
					}
					this.setState({followedImages: [...followedImagesArray]});
				})
				.catch(error => console.log('[feeds js] getFollowedImages - ONE followed fetch error: ', error));
		} else if (this.state.followed.length > 1) {
			// MULTIPLE FOLLOWED
			console.log('[feeds js] getFollowedImages - Multiple followed: ', this.state.followed);
			return fetch(GET_USERS_FOLLOWED_URI)
				.then(response => response.json())
				.then(response => {
					// save images
					console.log('[feeds js] getFollowedImages - Multiple followed response: ', response);

					// loop through followed users
					response.data.forEach((followedUser, index) => {
						// check image array length
						if (followedUser.images.length >= 1) {
							let followedImagesArray2 = followedUser.images.map((imageId, index) => {
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
							followedImagesArray = [...followedImagesArray, ...followedUser.images];
						}
					});
					this.setState({followedImages: [...followedImagesArray]});
					
				})
				.catch(error => console.log('[feeds js] getFollowedImages - MULTIPLE followed fetch error: ', error));
		}
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
		console.log('[feeds js] onExplorePressedHandler - clicked!');
		console.log('[feeds js] onExplorePressedHandler - ID passed by app js: ', currentUserId);
		this.props.navigation.navigate({ key: 'Explore1', routeName: 'Explore', params: {
				currentUserId:currentUserId
			} 
		});
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

				console.log('[feeds js] onImagePickerHandler - Image Picker Response: ', response.fileSize);
				this.setState({ log: '' });
				if (response.didCancel) {
					console.log('[feeds js] onImagePickerHandler - User cancelled the picker.');
				} else if (response.error) {
					console.log('[feeds js] onImagePickerHandler - ImagePicker Error:', response.error);
				} else if (response.customButton) {
					console.log('[feeds js] onImagePickerHandler - User tapped custom button: ', response.customButton);
				} else {
					let source = { uri: response.uri };
					this.setState({
						imageSource: source,
						log: "Image chosen"
					});

					console.log('[feeds js] onImagePickerHandler - IMAGE CHOSEN: ', source);

					let platformPath = '';
					if (Platform.OS == 'ios') {
						console.log("[feeds js] onImagePickerHandler - PATH OF IMAGE SELECTED IOS: ", response.uri);
						platformPath = response.uri.replace(/^file?\:\/\//i, "");
						console.log('[feeds js] onImagePickerHandler - SPECIAL CHARACTERS REMOVED: ', platformPath);
					} else if (Platform.OS == 'android') {
						console.log("[feeds js] onImagePickerHandler - PATH OF IMAGE SELECTED ANDROID: ", response.path);
						platformPath = response.path;
					}

					if (platformPath == '') {
						return this.setState({
							log: "Platform path empty"
						});
					}
					console.log('[feeds js] onImagePickerHandler - TEST:', response.uri);
					console.log("[feeds js] onImagePickerHandler - PLATFORM PATH ", platformPath);

					RNFetchBlob.fetch('POST',
						UPLOAD_URI,
						{},
						[
							{ name: 'sampleFile', filename: response.fileName, data: RNFetchBlob.wrap(platformPath) }
						])
						.then((res) => {
							// console.log('[user js] Response from server - ', res);
							console.log('[feeds js] onImagePickerHandler - Status code - ', res.respInfo.status);
							if (res.respInfo.status == 200) {
								console.log('[feeds js] onImagePickerHandler - UPLOAD OK');
								this.setState({ log: 'Upload ok!' });
							} else {
								console.log('[feeds js] onImagePickerHandler - UPLOAD FAILED - ', res);
								this.setState({ log: 'Upload failed!' });
							}
						})
						.catch((err) => {
							console.log('[feeds js] onImagePickerHandler - showImagePicker: ', res);
						});
				}
			});
		}
	}
	
	onImageClicked = (imageId,passedId) => {
        console.log("[feeds js] onImageClicked - imageId: ", imageId );
        return fetch(GET_IMAGES_URI+ imageId, {
            method: 'GET',
            headers:{
                Accept: 'application/json',
                'Content-Type': 'application/json'
            }
		})
		.then (response => response.json())
        .then(response => {
            console.log('[feeds js] onImageClicked - response from server: ', response);
			this.props.navigation.navigate({ key: 'Images1', routeName: 'Image', params: { 
					data:response,
					userId: passedId,
					userData: this.props.navigation.state.params,
					imagesDisplayed: this.state.feedImagesArray
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
		console.log('[feeds js] onProfilePressedHandler - passedId: ', passedId);
		
		this.props.navigation.navigate({ key: 'Profile1', routeName: 'Profile', params: {
				userId:passedId	
			} 
		});
	}

	render() {
		console.log('[feeds js] render - Role of user at onImageDelete:', this.state.role);
		console.log('[feeds js] render - feedImagesArray:', this.state.feedImagesArray);
		let gallery = (<Spinner/>);
		let imagePickerButton;
		let logoutLoader = (
			<Button transparent onPress={this.onLogoutHandler}>
				<Icon name='home' />
			</Button>);
		
		if(this.state.feedImagesArray && this.state.areImagesLoaded){
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
			footers = (
				<Footer>
					<FooterTab>
						<Button full onPress={this.onImagePickerHandler}>
							<Icon name="camera" />
							<Text>Image Picker</Text>
						</Button>
						<Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
							<Icon name="navigate" />
							<Text>Explore</Text>
						</Button>
						<Button full onPress={() => { this.onProfilePressedHandler(this.state.passedId) }}>
							<Icon name="ios-person" />
							<Text>Profile</Text>
						</Button>
					</FooterTab>
				</Footer>
			)
			
		}else{
			footers = (
				<Footer>
					<FooterTab>
						<Button full onPress={() => { this.onExplorePressedHandler(this.state.passedId) }}>
							<Icon name="navigate" />
							<Text>Explore</Text>
						</Button>
						<Button full onPress={() => { this.onProfilePressedHandler(this.state.passedId) }}>
							<Icon name="ios-person" />
							<Text>Profile</Text>
						</Button>
					</FooterTab>
				</Footer>
			)
		}
       
        return (
			<Container>
				<Header>
					<Body><Title>{this.state.passedUsername}</Title></Body>
					<Right>
						{logoutLoader}
					</Right>
				</Header>
				<Content>
					{gallery}
				</Content>
				{footers}
			</Container>
        );
    }
}

const styles = StyleSheet.create({    
    thumbnail: {
        width: 80,
        height: 80,
    }
});

module.exports = FeedsScreen;