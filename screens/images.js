import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import { Container, Header, Left, Body, Right, Icon, Title, 
	Content, Text, Button, Item, Input, Form, Label, Thumbnail, 
	Card, CardItem, Badge, ListItem, List, Footer, FooterTab,
	Toast, Root, Spinner} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
import validator from 'validator';

const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';
const IMAGE_ROOT_URI = 'https://app-api-testing.herokuapp.com/api/images/';
const COMMENT_URI = 'https://app-api-testing.herokuapp.com/api/comments/';
// const LOGOUT_URI = 'http://localhost:5000/logout';



class ImageScreen extends Component{
    constructor(props) {
		super(props);
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);
		console.log('[images js] constructor - passedParams-userData: ', props.navigation.state.params.userData);
		console.log('[images js] constructor - passedParams-message: ', props.navigation.state.params.userData.message);
		console.log('[images js] constructor - passedParams-userData.data: ', props.navigation.state.params.userData.data);

		// check if image favorited from serverside
		let isFavorite= false;
		if (typeof props.navigation.state.params.data.favorite !== 'undefined' && 
		props.navigation.state.params.data.favorite.length > 0){
			props.navigation.state.params.data.favorite.forEach(function(favoriteId){
				console.log('[images js] constructor - favoriteId: ', favoriteId);
				if(favoriteId == props.navigation.state.params.userId){
					console.log('[images js] constructor - User already Favorited this image.');
					isFavorite = true;
				}
			});
		}
		// check if image in wishlist from serverside
		let inWishlist= false;
		if (typeof props.navigation.state.params.data.wishlist !== 'undefined' && 
		props.navigation.state.params.data.wishlist.length > 0){
			props.navigation.state.params.data.wishlist.forEach(function(wishlistId){
				console.log('[images js] constructor - wishlistId: ', wishlistId);
				if(wishlistId == props.navigation.state.params.userId){
					console.log('[images js] constructor - User already Favorited this image.');
					inWishlist = true;
				}
			});
		}

		// check if image is tried from serverside
		let inTriedlist = false;
		if (typeof props.navigation.state.params.data.tried !== 'undefined' &&
			props.navigation.state.params.data.tried.length > 0) {
			props.navigation.state.params.data.tried.forEach(function (triedId) {
				console.log('[images js] constructor - triedId: ', triedId);
				if (triedId == props.navigation.state.params.userId) {
					console.log('[images js] constructor - User already Favorited this image.');
					inTriedlist = true;
				}
			});
		}
		let inCravelist = false;
		if (typeof props.navigation.state.params.data.craving !== 'undefined' &&
			props.navigation.state.params.data.craving.length > 0) {
			props.navigation.state.params.data.craving.forEach(function (cravingId) {
				console.log('[images js] constructor - cravingId: ', cravingId);
				if (cravingId == props.navigation.state.params.userId) {
					console.log('[images js] constructor - User already Favorited this image.');
					inCravelist = true;
				}
			});
		}

		// INITIALIZE STATES
		this.state = {
			
			
			imageId: props.navigation.state.params.data._id,
			userId: props.navigation.state.params.userId,
			isImageFavorite: isFavorite,
			noOfFavorite: props.navigation.state.params.data.favorite.length,
			commentId: props.navigation.state.params.data.comments,
			comment: "",
			dateCommented: [],
			showToast:false,
			getResponse: null,
			arrayOfComments: [],
			areCommentsLoaded: false,
			isLoggedOut: false,
			disableComment: false,
			noOfWishlist: props.navigation.state.params.data.wishlist.length,
			inImageWishlist: inWishlist,
			moreComments: [],
			isMoreCommentsPressed: false,
			noOfTriedlist: props.navigation.state.params.data.tried.length,
			inImageTriedlist: inTriedlist,
			postingComment: false,
			inImageCravelist: inCravelist,
			noOfCravelist: props.navigation.state.params.data.craving.length,
			canDeleteImage: false
			
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - imageId: ', this.state.imageId);
		console.log('[images js] constructor - userId: ', this.state.userId);
		console.log('[images js] constructor - isImageFavorite: ', this.state.isImageFavorite);
		console.log('[images js] constructor - noOfFavorite: ', this.state.noOfFavorite);
		console.log('[images js] constructor - comment: ', this.state.commentId);
	}
	
	onBackBtnPressed = () => {
		console.log('[images js] onBackBtnPressed');
		this.props.navigation.goBack();
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
									isLoggedOut: true
								});
								Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })
								// this.props.navigation.navigate('Home');
								// console.log("[images js] onLogoutPressHandler - LOGGED OUT");
								console.log("[images js] onLogoutPressHandler - LOGGING OUT!");
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
    //FAVORITE THE IMAGE
    onFavoritePressHandler = (imageId) => {
		console.log('[images js] onFavoritePressHandler - Favorite btn Pressed!');
		console.log('[images js] onFavoritePressHandler - imageUri: ',IMAGE_ROOT_URI);
		console.log('[images js] onFavoritePressHandler - imageId: ', imageId);
		console.log('[images js] onFavoritePressHandler - URI + imageId: ' ,IMAGE_ROOT_URI + imageId);

		
		// SEND REQUEST TO API
		return fetch (IMAGE_ROOT_URI + imageId + '/?fav=1', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] onFavoritePressHandler - responseJson: ", responseJson);

			// CHECK IF IMAGE FAVORITED
			let isFavorite= false;
			const userId = this.state.userId;
			console.log("[images js] onFavoritePressHandler - responseJson Favorites: ", responseJson.favorite);
			if (typeof responseJson.favorite !== 'undefined' && responseJson.favorite.length > 0) {
				responseJson.favorite.forEach(function(favoriteId){
					console.log('[images js] onFavoritePressHandler - favoriteId: ', favoriteId);
					if(favoriteId == userId){
						console.log('[images js] onFavoritePressHandler - User already Favouritethis image.');
						isFavorite= true;
					}
				});
			}
			this.setState({
				noOfFavorite: responseJson.favorite.length,
				isImageFavorite: isFavorite
			});
		})
		.catch(error => console.log('[images js] onFavoritePressHandler - Error:', error));    
	}
	//CHECK IF IMAGE IN WISHLIST
    onWishlistPressHandler = (imageId) => {
		console.log('[images js] onWishlistPressHandler - Favorite btn Pressed!');
		console.log('[images js] onWishlistPressHandler - imageUri: ',IMAGE_ROOT_URI);
		console.log('[images js] onWishlistPressHandler - imageId: ', imageId);
		console.log('[images js] onWishlistPressHandler - URI + imageId: ' ,IMAGE_ROOT_URI + imageId);

		
		// SEND REQUEST TO API
		return fetch (IMAGE_ROOT_URI + imageId + '/?wish=1', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] onWishlistPressHandler - responseJson: ", responseJson);

			// CHECK IF IMAGE WISHLISTED
			let inWishlist = false;
			const userId = this.state.userId;
			console.log("[images js] onWishlistPressHandler - responseJson Wishlist: ", responseJson.wishlist);
			if (typeof responseJson.wishlist !== 'undefined' && responseJson.wishlist.length > 0) {
				responseJson.wishlist.forEach(function(wishlistId){
					console.log('[images js] onWishlistPressHandler - wishlistId: ', wishlistId);
					if(wishlistId == userId){
						console.log('[images js] onWishlistPressHandler - User already wishlist this image.');
						inWishlist= true;
					}
				});
			}
			this.setState({
				noOfWishlist: responseJson.wishlist.length,
				inImageWishlist: inWishlist
			});
		})
		.catch(error => console.log('[images js] onWishListPressHandler - Error:', error));    
	}

	// CHECK IF IMAGE IN TRIEDLIST
	onTriedlistPressHandler = (imageId) => {
		console.log('[images js] onTriedlistPressHandler - Tried btn Pressed!');
		console.log('[images js] onTriedlistPressHandler - imageUri: ',IMAGE_ROOT_URI);
		console.log('[images js] onTriedlistPressHandler - imageId: ', imageId);
		console.log('[images js] onTriedlistPressHandler - URI + imageId: ',IMAGE_ROOT_URI + imageId);


		// SEND REQUEST TO API
		return fetch (IMAGE_ROOT_URI + imageId + '/?tried=1', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("[images js] onTriedlistPressHandler - responseJson: ", responseJson);

				// CHECK IF IMAGE IN TRIEDLIST
				let inTriedlist = false;
				const userId = this.state.userId;
				console.log("[images js] onTriedlistPressHandler - responseJson Tried: ", responseJson.tried);
				if (typeof responseJson.tried !== 'undefined' && responseJson.tried.length > 0) {
					responseJson.tried.forEach(function (triedId) {
						console.log('[images js] onTriedlistPressHandler - triedId: ', triedId);
						if (triedId == userId) {
							console.log('[images js] onTriedlistPressHandler - User already tried this image.');
							inTriedlist = true;
						}
					});
				}
				this.setState({
					noOfTriedlist: responseJson.tried.length,
					inImageTriedlist: inTriedlist
				});
			})
			.catch(error => console.log('[images js] onTriedListPressHandler - Error:', error)); 
	}
	onCravelistPressHandler = (imageId) => {
		console.log('[images js] onCravelistPressHandler - Crave btn Pressed!');
		console.log('[images js] onCravelistPressHandler - imageUri: ',IMAGE_ROOT_URI);
		console.log('[images js] onCravelistPressHandler - imageId: ', imageId);
		console.log('[images js] onCravelistPressHandler - URI + imageId: ',IMAGE_ROOT_URI + imageId);


		// SEND REQUEST TO API
		return fetch (IMAGE_ROOT_URI + imageId + '/?crave=1', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
		})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("[images js] onCravelistPressHandler - responseJson: ", responseJson);

				// CHECK IF IMAGE IN TRIEDLIST
				let inCravelist = false;
				const userId = this.state.userId;
				console.log("[images js] onCravelistPressHandler - responseJson Crave: ", responseJson.craving);
				if (typeof responseJson.craving !== 'undefined' && responseJson.craving.length > 0) {
					responseJson.craving.forEach(function (cravingId) {
						console.log('[images js] onCravelistPressHandler - cravingId: ', cravingId);
						if (cravingId == userId) {
							console.log('[images js] onCravelistPressHandler - User already craving this image.');
							inCravelist = true;
						}
					});
				}
				this.setState({
					noOfCravelist: responseJson.craving.length,
					inImageCravelist: inCravelist
				});
			})
			.catch(error => console.log('[images js] onCraveListPressHandler - Error:', error)); 
	}
	//ENTER COMMENT IN COMMENT BOX
	createComment = (comment) => {
		if(comment){
			this.setState({
				comment:comment
			});
			console.log('Comment being entered:', comment);
		}
	}
	//SAVE COMMENT TO API
	postComment = () => {
		if (validator.isLength(this.state.comment,{min:1, max: 200})){
			this.setState({
				disableComment: true,
				postingComment: true
			})
			fetch (IMAGE_ROOT_URI + this.state.imageId + '/comments', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					comment: this.state.comment
				}),
			})
				.then((response) => response.json())
				.then((responseJson) => {
					console.log('[images js] response from server postComment:', responseJson);
					//DISPLAY THE NEW COMMENT ON SCREEN WITH PREVIOUS COMMENTS
					let tempCommentId = [];
					responseJson.comments.forEach((comments, index) => {
						tempCommentId.push(
							comments
						)
					})
					console.log('[images js] tempCommentId', tempCommentId);
					console.log('[images js] postingComment just after user posts comment:',this.state.postingComment);
					
					this.setState({
						commentId: tempCommentId
					})
					console.log('[images js] status of disableComment at postComment:', this.state.disableComment)
					console.log('[images js]postComment this.state.commentId', this.state.commentId)
					Toast.show({
                        text: 'Comment posted',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 4000
					});
					this.fetchComments();				
				})
				.catch((error) => {
					console.error(error)
				});
			
			console.log('[images js] commentId after comment posted', this.state.commentId)
			
		}else{
			Toast.show({
				text: 'Comment too long/short',
				position: 'top',
				buttonText: 'Ok',
			 	duration: 4000
			})
		}
	}

	fetchComments(){
		let commentArray = [];
		let firstPageComments = [];
		let nextPageComments = [];

		// //FETCHING COMMENTS
		if (this.state.commentId.length >= 1){
			console.log('[images js] commentId at fetchComment:', this.state.commentId)
			console.log('[images js] commentId.length at fetchComment:', this.state.commentId.length)
			this.state.commentId.forEach((commentID, index) => {
				return fetch(COMMENT_URI + commentID, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
				})
					.then((response) => response.json())
					.then((responseJson) => {
						console.log("Response from server fetchComment:", responseJson);
						console.log("Comment to display fetchComment:", responseJson.comment);
						console.log("ID to display fetchComment:", responseJson.owner);
						console.log("Date created fetchComment:", responseJson.date_created);
						console.log("Owner fetchComment :", responseJson.owner_username);

						commentArray.push(
							responseJson
						);
						console.log('[images js] commentArray at fetchComment:', commentArray);
						console.log('[images js] Length of commentArray at fetchComment', commentArray.length);
						console.log('[images js] Length of commentId at fetchComment', this.state.commentId.length);
						if (this.state.commentId.length === commentArray.length) {
							console.log('[images js] NO MORE IMAGES TO LOOP THROUGH');
							//SORTING COMMENTS FROM NEWEST TO OLDEST
							let sortedArray = commentArray.sort(function (a,b) {
								if(moment(a.date_created).isBefore(b.date_created)){
									return 1;
								}
								return -1;
							})
							console.log('[images js] sortedArray:', sortedArray);
							if(commentArray.length > 4){
								firstPageComments =  commentArray.slice(0,20);
								nextPageComments = commentArray.slice(20);
								this.setState({
									areCommentsLoaded: true,
									arrayOfComments: [...firstPageComments],
									moreComments:[...nextPageComments],
									disableComment: false,
									postingComment:false
								})
							}else{
								this.setState({
									areCommentsLoaded: true,
									arrayOfComments: [...commentArray],
									disableComment: false,
									postingComment: false
								})
							}
							console.log('[images js] postingComments after fetchComments():',this.state.postingComment);
						}
					})
					.catch((error) => {
						console.log('[images js] error:', error)
					});
			})
		}else{
			this.setState({
				areCommentsLoaded: true,
				disableComment: false,
				postingComment: false
			})
			console.log('[images js] status of disableButton at fetchComment:', this.state.disableButton)
			console.log('[images js] postingComments after fetchComments():', this.state.postingComment);
		}
	}
	
	
	componentDidMount(){
		console.log('[images js] inside componentDidMount');
		this.fetchComments();
	}
	onBackBtnPressed = (disabled) => {
		console.log('[image js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onMoreCommentsPressed(){
		let evenMoreComments;
		console.log('[images js] onMoreCommentsPressed');
		console.log('[images js] moreComments:', this.state.moreComments)
		if(this.state.moreComments.length > 20){
			evenMoreComments = this.state.moreComments.slice(0,20)
			console.log('[images js] additional Comments:', evenMoreComments)
			this.setState({
				// isMoreCommentsPressed: true,
				arrayOfComments: [...this.state.arrayOfComments, ...evenMoreComments],
				moreComments: this.state.moreComments.slice(20)
			});
			console.log('[images js] moreComments new slice:', this.state.moreComments.slice(20));
		}else{
			this.setState({
				// isMoreCommentsPressed: true,
				arrayOfComments: [...this.state.arrayOfComments, ...this.state.moreComments]
			});
		}
	}

	// onDeleteImageBtnPressed = () => {
	// 	console.log('[images js] imageId:', this.state.imageId)
	// 	let imagesToFeeds = [...this.props.navigation.state.params.userData.data.images]
	// 	console.log('[images js] imagesToFeeds: ', imagesToFeeds);
	// 	console.log('Finding the index of the image to delete',this.props.navigation.state.params.userData.data.images.indexOf(this.state.imageId));
	// 	let feedsImageIndexDelete = this.props.navigation.state.params.userData.data.images.indexOf(this.state.imageId);
	// 	Alert.alert(	
	// 	'Delete image?',
	// 		'This cannot be undone',
	// 		[
	// 			{
	// 				text: 'OK', onPress: () => {
	// 					return fetch(IMAGE_ROOT_URI + this.state.imageId, {
	// 						method: 'DELETE',
	// 						headers: {
	// 							Accept: 'application/json',
	// 							'Content-Type': 'application/json'
	// 						},
	// 					}).then((response) => {
	// 						console.log('[images js] onImageDelete: ', response);
	// 						if (response.status !== 200) {

	// 							console.log('[images js] onImageDelete bad response: ', response);
	// 							console.log('[images js] onImageDelete testing Json.parse:', JSON.parse(response._bodyInit));

	// 							Toast.show({
	// 								text: JSON.parse(response._bodyInit).message,
	// 								buttonText: 'Ok',
	// 								position: 'top',
	// 								duration: 4000
	// 							});
	// 							return;
	// 						} else {
							
	// 							Toast.show({
	// 								text: 'Image deleted',
	// 								buttonText: 'Ok',
	// 								position: 'top',
	// 								duration: 4000
	// 							});
	// 						}
	// 						console.log('Navigate back to feeds.');
	// 						let removeImage = imagesToFeeds.splice(feedsImageIndexDelete, 1);
	// 						console.log('[images js] userData sent back to feeds:', imagesToFeeds);
	// 						this.props.navigation.state.params.userData.data.images =  imagesToFeeds;
	// 						console.log('images js] this.props.navigation.state.params.userData with new image array: ', this.props.navigation.state.params.userData);
	// 						this.props.navigation.replace('Feeds', this.props.navigation.state.params.userData);
	// 					}).catch((error) => {
	// 						console.log(error);
	// 					});
	// 				}

	// 			},
	// 			{
	// 				text: 'Cancel', onPress: () => {
	// 					style: 'cancel'
	// 				}
	// 			}
	// 		]
	// 	)
	// }

	onDeleteImageBtnPressed = () => {
		console.log('[images js] onDeleteImageBtnPressed imageId:', this.state.imageId);
		const imageIdToDelete = this.state.imageId;
		const imagesFromFeeds = [...this.props.navigation.state.params.userData.data.images];
		console.log('[images js] onDeleteImageBtnPressed imagesFromFeeds: ', imagesFromFeeds);
		// console.log('[images js] onDeleteImageBtnPressed index of image to delete: ', imagesFromFeeds.findIndex(function(el){
		// 	return el === imageIdToDelete;
		// }));
		const imageIndexToDelete = imagesFromFeeds.findIndex(function(el){
			return el === imageIdToDelete;
		});
		console.log('[images js] onDeleteImageBtnPressed index of image to delete: ', imageIndexToDelete);
		this.props.navigation.replace('Feeds', {
			data: this.props.navigation.state.params.userData.data,
			imageIndexToDelete: imageIndexToDelete,
			imageIdToDelete: imageIdToDelete
		});
	}

    render(){
		// initialise comments and image to display
		let listOfComments = (<Spinner />);
		let logoutLoader = (
			<Button transparent onPress={this.onLogoutHandler}>
				<Icon name='home' />
			</Button>);
		let canComment;
		let imageLoader = (<Spinner/>)
		let displayMoreCommentsButton;
		let deleteImageButton = (
			<Button  full onPress={this.onDeleteImageBtnPressed}>
				<Text>Delete Image</Text>
			</Button>
		)

		// logic after user clicks postComment
		if (this.state.disableComment){
			canComment = (
				<Button disabled={this.state.disableComment} full>
					<Spinner/>
				</Button>);
			listOfComments = (<Spinner />);
		}else{
			canComment = (
				<Button full onPress={this.postComment}>
					<Text>Post Comment</Text>
				</Button>
			)
		}

		
		
		if(this.state.areCommentsLoaded){
			console.log('[images js] arrayOfComments.length at render:',  this.state.arrayOfComments.length);
			console.log('[images js] commentId.length at render:',  this.state.commentId.length);
			if(this.state.arrayOfComments.length >= 1){
				listOfComments = [];
				
				listOfComments = this.state.arrayOfComments.map(comment => {
					return (<ListItem key={comment.date_created}>
						<Body>
							<Text style={{ fontWeight: 'bold', fontSize: 13 }}> {comment.owner_username}</Text>
							<Text style={{ fontSize: 15 }}> {comment.comment}</Text>
							<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{moment(comment.date_created).startOf().fromNow()}</Text>
						</Body>
					</ListItem>)
				
			}); 	
			console.log('[images js] listOfComments.length:', listOfComments.length)
				if (listOfComments.length >= 4 && listOfComments.length != this.state.commentId.length && !this.state.postingComment) {
					console.log('[images js] arrayOfComments.length if more than 4 comments:', this.state.arrayOfComments.length);
					displayMoreCommentsButton = <Button onPress={() => { this.onMoreCommentsPressed() }}>
						<Text>More Comments</Text>
					</Button>
				}
				imageLoader = <Image source={{ uri:IMAGE_ROOT_URI + this.state.imageId + '/display' }} style={{ height: 200, width: null, flex: 1 }} />
			}else{
				console.log('[images js] inside else if in render')
				listOfComments = (<Text>No comments</Text>);
				imageLoader = <Image source={{ uri:IMAGE_ROOT_URI + this.state.imageId + '/display' }} style={{ height: 200, width: null, flex: 1 }} />
			}
		} 
		if(this.state.isLoggedOut){
			logoutLoader = (
				<Button transparent disabled={this.state.disableButton}>
					<Spinner />
				</Button>
			)
		}

		if (this.state.postingComment) {
			console.log('[image js] postingComment at render:', this.state.postingComment);
			listOfComments = (<Spinner />);
			
		}
        return (
       
            <Container>
                <Header>
					<Left>
						<Button transparent onPress={this.onBackBtnPressed}>
							<Icon name='arrow-back' />
						</Button>
					</Left>
                    <Body><Title>IMAGES</Title></Body>
					<Right>
						{logoutLoader}
					</Right>
                </Header>
                <Content>
					{/* <Image source={{ uri:IMAGE_ROOT_URI + this.state.imageId + '/display' }} style={{ height: 200, width: null, flex: 1 }} /> */}
					 {imageLoader}
					 {/* Favorite Button */}
					 <Row>
						<Button
							transparent style={{ alignSelf: 'flex-end', position: "relative" }} onPress={() => { this.onFavoritePressHandler(this.state.imageId) }}
						>
							<Badge style={{ position: "absolute", bottom: 0, right: 1, zIndex: 100 }}>
								<Text style={{ fontSize: 12 }}>{this.state.noOfFavorite}</Text>
							</Badge>
							<Icon
								style={{ fontSize: 35 }}
								name={this.state.isImageFavorite ? "ios-heart" : "ios-heart-outline"}
							/>
						</Button>
						{/* Wishlist button */}
						<Button
							transparent style={{ alignSelf: 'flex-start', position: "relative" }} onPress={() => { this.onWishlistPressHandler(this.state.imageId) }}
						>
							<Badge style={{ position: "absolute", bottom: 0, right: 1, zIndex: 100 }}>
								<Text style={{ fontSize: 12 }}>{this.state.noOfWishlist}</Text>
							</Badge>
							<Icon
								style={{ fontSize: 35 }}
								name={this.state.inImageWishlist ? "ios-color-wand" : "ios-color-wand-outline"}
							/>
						</Button>
						{/* Triedlist button */}
						<Button
							transparent style={{ alignSelf: 'flex-start', position: "relative" }} onPress={() => { this.onTriedlistPressHandler(this.state.imageId) }}
						>
							<Badge style={{ position: "absolute", bottom: 0, right: 1, zIndex: 100 }}>
								<Text style={{ fontSize: 12 }}>{this.state.noOfTriedlist}</Text>
							</Badge>
							<Icon
								style={{ fontSize: 35 }}
								name={this.state.inImageTriedlist ? "ios-checkmark-circle" : "ios-checkmark-circle-outline"}
							/>

						</Button>
						<Button
							transparent style={{ alignSelf: 'flex-start', position: "relative" }} onPress={() => { this.onCravelistPressHandler(this.state.imageId) }}
						>
							<Badge style={{ position: "absolute", bottom: 0, right: 1, zIndex: 100 }}>
								<Text style={{ fontSize: 12 }}>{this.state.noOfCravelist}</Text>
							</Badge>
							<Icon
								style={{ fontSize: 35 }}
								name={this.state.inImageCravelist ? "ios-happy" : "ios-happy-outline"}
							/>

						</Button>
						{deleteImageButton}

					 </Row>
					
					
					<Row style={styles.commentEntry}>
						<Form style={{ width: '100%' }}>
							<Item floatingLabel>
								<Label>Comment here</Label>
								<Input onChangeText={(text) => this.createComment(text)} />
							</Item>
						</Form>
					</Row>
					<List style={{marginTop:40}} >
						<ListItem itemHeader first>
							<Text style={{fontSize:12}}>COMMENTS</Text>
						</ListItem>
						{listOfComments}
					</List>
					{displayMoreCommentsButton}
					
                </Content>
				<Footer>
					<FooterTab >
						{canComment}

					</FooterTab>
				</Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    imageContainer: {
		flex: 1,
		flexDirection: 'column',
	},
	imageBar: {
		flex: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingLeft: 10,
		paddingRight: 10
	},
	icon: {
		width: 59,
		height: 59
	},
	
	commentEntry:{
		flex:1,
		flexDirection: 'column',
		marginRight: 20
	},
	commentDisplay:{

		flex: 1,
		flexDirection: 'column',
		
	}

})
module.exports=ImageScreen;
