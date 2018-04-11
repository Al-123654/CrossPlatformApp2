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
			showToast:false
			
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

							})
							.catch((error) => {
								console.error(error);
							});
						this.props.navigation.navigate('Home');
						console.log("[images js] onLogoutPressHandler - LOGGED OUT")
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
	//enter comment
	createComment = (comment) => {
		if(comment){
			this.setState({
				comment:comment
			});
			console.log('Comment being entered:', comment);
		}
	}
	//save comment to api
	postComment = () => {
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
					console.log("Comment saved")
					this.setState({ log: "Comment saved" })
				})
				.catch((error) => {
					console.error(error)
				});
		}else{
			Toast.show({
				text: 'Comment too long/short',
				position: 'bottom',
				buttonText: 'Ok'
			})
		}
		// else{
		// 	this.setState({
		// 		log: <Text>Comment too long/short</Text>
		// 	})
		// }
		

	}
	
	//display comments from api
	displayComment = () => {
		// if one comment
		let tempDisplay 
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
				console.log("Response from server:", responseJson)
				console.log("Comment to display:", responseJson.comment)
				console.log("ID to display:", responseJson.owner)
				console.log("Date created:", responseJson.date_created)
				console.log("Owner:", responseJson.owner_username)
				this.setState({
					dateCommented: moment(responseJson.date_created).startOf().fromNow()
				})
				
				
				this.setState({
					// commentedBy: <Text>{responseJson.owner} </Text>,
					displayingComment: 
						<ListItem>
							<Body>
								<Text> {responseJson.owner_username}</Text>
								<Text> {responseJson.comment}</Text>
								<Text style={{alignSelf:'flex-end', fontSize: 12}}>{this.state.dateCommented}</Text>
							</Body>
						{/* <Text> {responseJson.owner} {responseJson.comment}</Text>  */}
					</ListItem>
				})
			})
			.catch((error) => {
				console.error(error)
			});
		
		// if more than one comment 
		}else if(this.state.commentId.length > 1){
			// let tempCommentBy = []
			let tempDisplay = []
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
					console.log('[images js] Response from server', responseJson)
					console.log("Comment to display:", responseJson.comment)
					console.log("ID to display:", responseJson.owner)
					console.log("Date created:", responseJson.date_created)
					console.log("Owner:", responseJson.owner_username)
					this.setState({
						dateCommented: moment(responseJson.date_created).startOf().fromNow()
					})
					
					// tempCommentBy.push(
					// 	<ListItem key={index}>
					// 		<Text>{responseJson.owner}</Text>
							
					// 	</ListItem>,
						
					// )
					tempDisplay.push(
						<ListItem key={index}>
							<Body>
								<Text style={{fontWeight: 'bold', fontSize: 13}}> {responseJson.owner_username}</Text>
								<Text style={{fontSize:15}}> {responseJson.comment}</Text>
								<Text style={{ alignSelf: 'flex-end', fontSize: 10 }}>{this.state.dateCommented}</Text> 
							</Body>
							{/* <Text> {responseJson.owner} {responseJson.comment}</Text>  */}
						</ListItem>
					)
					
					this.setState({
						// commentedBy: [...tempCommentBy],
						displayingComment: [...tempDisplay]
					})
				})
			.catch((error) => {
				console.error(error)
			});
			})

		// if no comments
		}else if(this.state.commentId.length == 0){
			this.setState({
				displayingComment: <Text>No comments</Text>
			})
		}
		
	}
	componentDidMount(){
		this.displayComment();
	}
	onBackBtnPressed = () => {
		console.log('[image js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

    render(){
        // console.log("[images js] render - Image path: ", this.state.IMAGE_ROOT_URI);
        // console.log("[images js] render - CURRENT IMAGE ID: ",this.state.imageId);
		
        return (
            // <View>
			// 	<Header 
			// 		leftComponent={<CustomBackBtn clicked={this.onBackBtnPressed} />} 
			// 		centerComponent={{ text: "IMAGES", style: { color: "#fff" } }}
			// 		rightComponent={<CustomLogoutBtn clicked={this.onLogoutHandler} />} 
			// 	/>

			// 	<View style={styles.imageContainer}>
			// 		<Tile
			// 			imageSrc={{uri: this.state.IMAGE_ROOT_URI + this.state.imageId + '/display'}}
			// 		/>
			// 		<View style={styles.imageBar}>
			// 			<Text style={styles.likesCount}>{this.state.noOfLikes} likes</Text>
			// 			<TouchableOpacity
			// 				onPress={()=>{this.onLikePressHandler(this.state.imageId)}}
			// 				style={styles.icon}
			// 			>
			// 				<Icon
			// 					reverse
			// 					name={this.state.isImageLiked ? 'heart-o':'heart'}
			// 					type='font-awesome'
			// 					color='#f50'
			// 				/>
			// 			</TouchableOpacity>
			// 		</View>
			// 		<View style ={styles.commentEntry} >
			// 			<FormInput placeholder="Comment here" onChangeText={(text) => this.createComment(text)}/>
			// 		</View>
			// 		<View style = {styles.commentButton}>
			// 			<Button
			// 				raised
			// 				title="Enter comment"
			// 				onPress={this.postComment}
			// 			/>
			// 		</View>
			// 		<View style = {styles.commentDisplay}>
			// 			{this.state.displayingComment}
			// 		</View>

			// 	</View>	
            // </View>
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
				
					{/* <Text>{this.state.noOfLikes}likes</Text> */}
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
					<Item floatingLabel>
						<Label>Comment here</Label>
						<Input onChangeText={(text) => this.createComment(text)} />
					</Item>
					<List style={{marginTop:40}} >
						<ListItem itemHeader first>
							<Text style={{fontSize:12}}>COMMENTS</Text>
						</ListItem>
						{this.state.displayingComment}
					</List>
					
                </Content>
				<Text>{this.state.log}</Text>
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
		marginTop:70
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
