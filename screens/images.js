import React, { Component } from 'react';
import { Platform, StyleSheet, View, Image, Alert, TouchableOpacity } from 'react-native';
import { StackNavigator, } from 'react-navigation';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Text, Button, Item, Input, Form, Label, Thumbnail, Card, CardItem } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

class ImageScreen extends Component{
    constructor(props) {
		super(props);
		//TODO: check if props.navigation.state.params exists
		console.log('[images js] constructor - passedParams: ', props.navigation.state.params);

		// check if image liked
		let isLiked = false;
		if (typeof props.navigation.state.params.data.likes !== 'undefined' && 
		props.navigation.state.params.data.likes.length > 0){
			props.navigation.state.params.data.likes.forEach(function(likeId){
				console.log('[images js] constructor - likeId: ', likeId);
				if(likeId == props.navigation.state.params.userId){
					console.log('[images js] constructor - User already liked this image.');
					isLiked = true;
				}
			});
		}

		// initialize state
		this.state = {
			IMAGE_ROOT_URI: 'https://app-api-testing.herokuapp.com/api/images/',
			COMMENT_URI: 'https://app-api-testing.herokuapp.com/api/comments/',
			imageId: props.navigation.state.params.data._id,
			imageLikesArray: props.navigation.state.params.data.likes,
			userId: props.navigation.state.params.userId,
			isImageLiked: isLiked,
			noOfLikes: props.navigation.state.params.data.likes.length,
			commentId: props.navigation.state.params.data.comments,
			comment: "",
			displayingComment: []
			
		};

		// logs
		console.log('[images js] constructor - After init.');
		console.log('[images js] constructor - imageId: ', this.state.imageId);
		console.log('[images js] constructor - imageLikesArray: ', this.state.imageLikesArray);
		console.log('[images js] constructor - userId: ', this.state.userId);
		console.log('[images js] constructor - isImageLiked: ', this.state.isImageLiked);
		console.log('[images js] constructor - noOfLikes: ', this.state.noOfLikes);
		console.log('[images js] constructor - comment: ', this.state.commentId);
	}
	
	onBackBtnPressed = () => {
		console.log('[images js] onBackBtnPressed');
		this.props.navigation.goBack();
	}

	onLogoutHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
        // return fetch('http://localhost:5000/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
        }).then((response) => response.json())
		.then((responseJson) => {
			Alert.alert(
				'Logging out',
				"",
				[
					{
						text: 'OK', onPress: () => {
							this.props.navigation.navigate('Home');
							console.log("[explore js] onLogoutPressHandler - LOGGED OUT")
						}
					}
				]
			) 
		})
		.catch ((error) => {
			console.error(error);
		});
	}
    
    onLikePressHandler = (imageId) => {
		console.log('[images js] onLikePressHandler - Like btn Pressed!');
		console.log('[images js] onLikePressHandler - imageUri: ', this.state.IMAGE_ROOT_URI);
		console.log('[images js] onLikePressHandler - imageId: ', imageId);
		
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
			console.log("[images js] onLikePressHandler - responseJson: ", responseJson);

			// check if image liked
			let isLiked = false;
			const userId = this.state.userId;
			console.log("[images js] onLikePressHandler - responseJson Likes: ", responseJson.likes);
			if (typeof responseJson.likes !== 'undefined' && responseJson.likes.length > 0) {
				responseJson.likes.forEach(function(likeId){
					console.log('[images js] onLikePressHandler - likeId: ', likeId);
					if(likeId == userId){
						console.log('[images js] onLikePressHandler - User already liked this image.');
						isLiked = true;
					}
				});
			}

			this.setState({
				noOfLikes: responseJson.likes.length,
				isImageLiked: isLiked
			});
		})
		.catch(error => console.log('[images js] onLikePressHandler - Error:', error));    
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
		fetch(this.state.IMAGE_ROOT_URI + this.state.imageId + '/comments', {
			method: 'POST',
			headers:{
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
		})
		.catch((error) => {
			console.error(error)
		});
	}
	
	//display comments from api
	displayComment = () => {
		// if one comment
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
				console.log("Comment to display:", responseJson.comment)
			
				this.setState({
					displayingComment: <Text>{responseJson.comment}</Text>
				})
			})
			.catch((error) => {
				console.error(error)
			});
		// if more than one comment 
		}else if(this.state.commentId.length > 1){
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
					
					tempDisplay.push(<Text key={index}>{responseJson.comment}</Text>)
					this.setState({
						displayingComment: [...tempDisplay]
					})
			})
			.catch((error) => {
				console.error(error)
			});
		})
		
			// fetch(this.state.COMMENT_URI + comments, {
			// 	method:'GET',
			// 	headers:{
			// 		Accept: 'application/json',
			// 		'Content-Type': 'application/json'
			// 	},
			// })
			// .then((response) => response.json())
			// .then((responseJson) => {
			// 	let displayComments = responseJson.comment
			// 	console.log('Comment') 
			// })

			
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
                    <Card>
                        <CardItem cardBody>
                            <Image source={{ uri: this.state.IMAGE_ROOT_URI + this.state.imageId + '/display' }} style={{height: 200, width: null, flex: 1}}/>
                        </CardItem>
                    </Card>
                </Content>
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
	likesCount: {
	},
	commentEntry:{
		marginTop:70
	},
	commentButton:{
		marginTop:40
	},
	commentDisplay:{
		marginTop: 30
	}

})
module.exports = ImageScreen;
