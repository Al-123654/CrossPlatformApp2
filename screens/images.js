import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Container, Header, Left, Body, Right, Icon, Title, 
	Content, Text, Button, Item, Input, Form, Label, Thumbnail, 
	Card, CardItem, Badge, ListItem, List, Footer, FooterTab,
	Toast, Root} from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment';
import validator from 'validator';

const LOGOUT_URI = 'https://app-api-testing.herokuapp.com/logout';

class ImageScreen extends Component{
    constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);

		// check if image favorited
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

		// initialize state
		this.state = {
			IMAGE_ROOT_URI: 'https://app-api-testing.herokuapp.com/api/images/',
			COMMENT_URI: 'https://app-api-testing.herokuapp.com/api/comments/',
			imageId: props.navigation.state.params.data._id,
			// imageLikesArray: props.navigation.state.params.data.favorite,
			userId: props.navigation.state.params.userId,
			isImageFavorite: isFavorite,
			noOfFavorite: props.navigation.state.params.data.favorite.length,
			commentId: props.navigation.state.params.data.comments,
			comment: "",
			displayingComment: [],
			log: "",
			dateCommented: [],
			showToast:false,
			// timePostedComment:[],
			// postedComments: []
			getResponse: null,
			arrayOfComments: [],
			areCommentsLoaded: false
			
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - imageId: ', this.state.imageId);
		// console.log('[images js] constructor - imageLikesArray: ', this.state.imageLikesArray);
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
								Toast.show({
                                    text: 'Logout successful',
                                    buttonText: 'Ok',
                                    position: 'top',
                                    duration: 4000
                                })
								this.props.navigation.navigate('Home');
								console.log("[images js] onLogoutPressHandler - LOGGED OUT");
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
    
    onFavoritePressHandler = (imageId) => {
		console.log('[images js] onFavoritePressHandler - Favorite btn Pressed!');
		console.log('[images js] onFavoritePressHandler - imageUri: ', this.state.IMAGE_ROOT_URI);
		console.log('[images js] onFavoritePressHandler - imageId: ', imageId);
		console.log('[images js] onFavoritePressHandler - URI + imageId: ', this.state.IMAGE_ROOT_URI + imageId);

		
		// send request to API
        return fetch(this.state.IMAGE_ROOT_URI + imageId, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
		})
		.then((response) => response.json())
		.then((responseJson) => {
			console.log("[images js] onFavoritePressHandler - responseJson: ", responseJson);

			// check if image favorited
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
		
		// let tempDisplayingComment = []
		if (validator.isLength(this.state.comment,{min:1, max: 200})){
			fetch(this.state.IMAGE_ROOT_URI + this.state.imageId + '/comments', {
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
					// console.log("Comment saved")
					//DISPLAY THE NEW COMMENT ON SCREEN WITH PREVIOUS COMMENTS
					let tempCommentId = [];
					responseJson.comments.forEach((comments, index) => {
						tempCommentId.push(
							comments
						)
					})
					console.log('[images js] tempCommentId', tempCommentId);
					
					this.setState({
						commentId: tempCommentId
					})
					console.log('[images js]postComment this.state.commentId', this.state.commentId)
					Toast.show({
                        text: 'Comment posted',
                        buttonText: 'Ok',
                        position: 'top',
                        duration: 4000
					});
					// this.displayComment();				
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
	
	//DISPLAY COMMENTS FROM API
	displayComment = () => {
		console.log('[images js] Inside display comment')
		console.log('[images js] displayComment this.state.commentid', this.state.commentId)
		// IF ONE COMMENT
		let tempDisplay;
		if (this.state.commentId.length == 1){
			fetch(this.state.COMMENT_URI + this.state.commentId, {
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
			})
			.then((response) => response.json())
			.then((responseJson) => {
				console.log("Response from server displayComment IF ONE COMMENT:", responseJson)
				console.log("Comment to display displayComment IF ONE COMMENT:", responseJson.comment)
				console.log("ID to display displayComment IF ONE COMMENT:", responseJson.owner)
				console.log("Date created displayComment IF ONE COMMENT:", responseJson.date_created)
				console.log("Owner displayComment IF ONE COMMENT :", responseJson.owner_username)
				this.setState({
					dateCommented: moment(responseJson.date_created).startOf().fromNow()
				})
				
				
				this.setState({
					// commentedBy: <Text>{responseJson.owner} </Text>,
					displayingComment: 
					<ListItem>
							<Body>
								<Text style={{ fontWeight: 'bold', fontSize: 13 }}> {responseJson.owner_username}</Text>
								<Text style={{ fontSize: 15 }}> {responseJson.comment}</Text>
								<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text> 
							</Body>
						{/* <Text> {responseJson.owner} {responseJson.comment}</Text>  */}
					</ListItem>
				})
			})
			.catch((error) => {
				console.error(error)
			});
		
		// IF MORE THAN ONE COMMENT
		}else if(this.state.commentId.length > 1){
			// let tempCommentBy = []
			let tempDisplay = [];
			let tempTime = [];
			let tempResponse = [];
			function sortFunction(a,b){
				var dateA = new Date(a.date).getTime();
				var dateB = new Date(b.date).getTime();
				return dateA > dateB ? 1 : -1;
			}
			this.state.commentId.forEach((comments, index) => {
				fetch(this.state.COMMENT_URI + comments, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
				})
				.then((response) => response.json())
				.then((responseJson) => {
					console.log('[images js] Response from server displayComment IF MORE THAN ONE COMMENT:', responseJson)
					console.log("Comment to display displayComment IF MORE THAN ONE COMMENT:", responseJson.comment)
					console.log("ID to display displayComment IF MORE THAN ONE COMMENT:", responseJson.owner)
					console.log("Date created displayComment IF MORE THAN ONE COMMENT:", responseJson.date_created)
					console.log("Owner displayComment IF MORE THAN ONE COMMENT:", responseJson.owner_username)
					// this.setState({
					// 	dateCommented: moment(responseJson.date_created).startOf().fromNow()
					// })
					// tempTime.push(
					// 	moment(responseJson.date_created).startOf().fromNow()
					// )

					// tempTime = [moment(responseJson.date_created).startOf().fromNow()]
					// tempTime.sort(sortFunction); 

					// tempResponse.push(
					// 	responseJson
					// );

					// this.setState({
					// 	// commentedBy: [...tempCommentBy],
					// 	getResponse: [...tempResponse]
					// })
					// tempDisplay.push(
					// 	<ListItem key={index}>
					// 		<Body>
					// 			<Text style={{fontWeight: 'bold', fontSize: 13}}> {responseJson.owner_username}</Text>
					// 			<Text style={{fontSize:15}}> {responseJson.comment}</Text>
					// 			{/* <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text>  */}
					// 			<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{tempTime}</Text> 
								
					// 		</Body>
					// 	</ListItem>
					// )
					// tempDisplay.sort(function(a,b){
					// 	return new Date(b.date) - new Date(a.date)
					// });
					
					// this.setState({
					// 	// commentedBy: [...tempCommentBy],
					// 	displayingComment: [...tempDisplay]
					// })

					// this.state.dateCommented.sort(function(a,b){
					// 	var c = new Date(a.date);
					// 	var d = new Date(b.date);
					// 	return d-c;
					// });
					
					// this.setState({
					// 	dateCommented: tempTime
					// })

					// if (tempResponse.length > 1) {
					// 	// let now = moment();
					// 	console.log('[images js] getResponse at displayComment MORE THAN ONE COMMENT:', tempResponse);
					// 	let sortedArray = tempResponse.sort(function (a, b) {
					// 		console.log('[images js] render a = ', a.date_created);
					// 		console.log('[images js] render b = ', b.date_created);
					// 		// if(now > date_created)
					// 		// return true;
					// 		// return moment(a.date_created).isBefore(b.date_created)
					// 		console.log('[images js] Comparing two times: ', moment(a.date_created).isBefore(b.date_created));
					// 		// return true;
					// 		if (moment(a.date_created).isBefore(b.date_created)) {
					// 			return 1;
					// 		}
					// 		return -1;
					// 	});
					// 	console.log('[images js] sortedArray at displayComment MORE THAN ONE COMMENT: ', sortedArray);
					// 	console.log('[images js] tempDisplay BEFORE SORTING', tempDisplay);
					// 	let tempDisplay2 = [];
					// 	console.log('[images js] tempDisplay2 BEFORE SORTING', tempDisplay2)
					// 	tempDisplay2 = sortedArray.map(obj =>{
					// 		<ListItem key={responseJson.date_created}>
					// 			<Body>
					// 				<Text style={{ fontWeight: 'bold', fontSize: 13 }}> {responseJson.owner_username}</Text>
					// 				<Text style={{ fontSize: 15 }}> {responseJson.comment}</Text>
					// 				{/* <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text>  */}
					// 				<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{tempTime}</Text>

					// 			</Body>
					// 		</ListItem>
					// 	})
					// 	console.log('[images js] tempDisplay2 AFTER SORTING', tempDisplay2)
						
					// 	// console.log('[images js] this.state.getResponse: ', this.state.getResponse)
					// 	// console.log('[images js] DID tempDisplay SORT?:', tempDisplay)

					// 	// this.setState({
					// 	// 	displayingComment: [...sortedArray]
					// 	// })
					// }
				})
			.catch((error) => {
				console.error(error)
			});
			
				
			})

		// IF NO COMMENTS
		}else if(this.state.commentId.length == 0){
			this.setState({
				displayingComment: <Text>No comments</Text>
			})
		}
		
	}
	componentDidMount(){
		console.log('[images js] inside componentDidMount');
		// this.displayComment();
		//INITIALISING VARIABLES
		let commentArray = [];
		
		//FETCHING COMMENTS
		if (this.state.commentId.length >= 1){
			console.log('[images js] commentId at componentDidMount:', this.state.commentId)
			this.state.commentId.forEach((commentID, index) => {
				return fetch(this.state.COMMENT_URI + commentID, {
					method: 'GET',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json'
					},
				})
					.then((response) => response.json())
					.then((responseJson) => {
						console.log("Response from server componentDidMount:", responseJson);
						console.log("Comment to display componentDidMount:", responseJson.comment);
						console.log("ID to display componentDidMount:", responseJson.owner);
						console.log("Date created componentDidMount:", responseJson.date_created);
						console.log("Owner componentDidMount :", responseJson.owner_username);
						
						commentArray.push(
							responseJson
						);
						console.log('[images js] commentArray at componentDidMount:', commentArray);
						console.log('[images js] Length of commentArray at componentDidMount', commentArray.length);
						console.log('[images js] Length of commentId at componentDidMount', this.state.commentId.length);
						if(this.state.commentId.length === commentArray.length){
							console.log('[images js] NO MORE IMAGES TO LOOP THROUGH');
							if(commentArray.length > 1){
								let sortedArray = commentArray.sort(function (a, b) {
									console.log('[images js] render a = ', a.date_created);
									console.log('[images js] render b = ', b.date_created);
									// if(now > date_created)
									// return true;
									// return moment(a.date_created).isBefore(b.date_created)
									console.log('[images js] Comparing two times: ', moment(a.date_created).isBefore(b.date_created));
									// return true;
									if (moment(a.date_created).isBefore(b.date_created)) {
										return 1;
									}
									return -1;
								});
								console.log('[images js] sortedArray at componentDidMount:', sortedArray);
								this.setState({
									areCommentsLoaded: true,
									arrayOfComments: [...sortedArray]
								});
							}else if (commentArray.length == 1){
								this.setState({
									areCommentsLoaded:true,
									arrayOfComments: [...commentArray]
								})
							}
							
						}

						
					})
					.catch((error) => {
						console.error(error)
					});
			})
		}
		else if (this.state.commentId.length == 0){
			this.setState({
				areCommentsLoaded:true
			})
		}
		
	
	}
	onBackBtnPressed = () => {
		console.log('[image js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

    render(){
		// if(this.state.getResponse){
		// 	// let now = moment();
		// 	console.log('[images js] getResponse at render:', this.state.getResponse);
		// 	let sortedArray = this.state.getResponse.sort(function(a,b){
		// 			console.log('[images js] render a = ', a.date_created);
		// 			console.log('[images js] render b = ', b.date_created);
		// 			// if(now > date_created)
		// 			// return true;
		// 			// return moment(a.date_created).isBefore(b.date_created)
		// 			console.log('[images js] Comparing two times: ', moment(a.date_created).isBefore(b.date_created));
		// 			// return true;
		// 			if (moment(a.date_created).isBefore(b.date_created)){
		// 				return 1;
		// 			}
		// 			return -1;
		// 		});
		// 	// console.log('[images js] this.state.getResponse: ', this.state.getResponse);
		// 	console.log('[images js] sortedArray: ', sortedArray);
		// }

		// tempDisplay.push(
		// 	<ListItem key={index}>
		// 		<Body>
		// 			<Text style={{fontWeight: 'bold', fontSize: 13}}> {responseJson.owner_username}</Text>
		// 			<Text style={{fontSize:15}}> {responseJson.comment}</Text>
		// 			{/* <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text>  */}
		// 			<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{tempTime}</Text> 

		// 		</Body>
		// 	</ListItem>
		// )
		let listOfComments = (<Text>Loading...</Text>);
		if(this.state.areCommentsLoaded){
			console.log('[images js] arrayOfComments.length at render:',  this.state.arrayOfComments.length);
			if(this.state.arrayOfComments.length >= 1){
				listOfComments = [];
				listOfComments = this.state.arrayOfComments.map(comment => {
					return (<ListItem key={comment.date_created}>
						<Body>
							<Text style={{ fontWeight: 'bold', fontSize: 13 }}> {comment.owner_username}</Text>
							<Text style={{ fontSize: 15 }}> {comment.comment}</Text>
							{/* <Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text>  */}
							<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{moment(comment.date_created).startOf().fromNow()}</Text>

						</Body>
					</ListItem>)
				});
			}else if (this.state.arrayOfComments.length === 0){
				console.log('[images js] inside else if in render')
				listOfComments = (<Text>No comments</Text>);
			}
			
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
						<Button transparent onPress={this.onLogoutHandler}>
							<Icon name='home' />
						</Button>
					</Right>
                </Header>
                <Content>
					<Image source={{ uri: this.state.IMAGE_ROOT_URI + this.state.imageId + '/display' }} style={{height: 200, width: null, flex: 1}}/>
					<Button
						transparent style={{alignSelf:'flex-end', position: "relative"}}onPress={() =>{this.onFavoritePressHandler(this.state.imageId)}}
					>
						<Badge style={{position: "absolute", bottom: 0, right:1, zIndex:100}}>
							<Text style={{fontSize:12}}>{this.state.noOfFavorite}</Text>
						</Badge>
						<Icon
						style={{fontSize:35}}
						name={this.state.isImageFavorite ? "ios-heart" : "ios-heart-outline"} 
						/>
					</Button>
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
						{/* {this.state.postedComments} */}
					</List>
					
                </Content>
				<Footer>
					<FooterTab >
						<Button full onPress={this.postComment}>
							<Text>Post Comment</Text>
						</Button>
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
	favoritesCount: {
	},
	commentEntry:{
		// marginTop:70
		flex:1,
		flexDirection: 'column'
	},
	commentButton:{
		marginTop:40
	},
	commentDisplay:{
		// marginTop: 30
		flex: 1,
		flexDirection: 'column',
		// justifyContent:'space-between'
	}

})
module.exports=ImageScreen;
