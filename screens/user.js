import React, { Component } from 'react';
import { Text, TextInput, StyleSheet, View, Button, Image, Alert } from 'react-native';
import { StackNavigator,  } from 'react-navigation';

import RNFetchBlob from 'react-native-fetch-blob';




class UserScreen extends Component {

    
    constructor(props) {
        super(props);
    }
    state = {
        message: ""
    };

    onUploadPressHandler = () =>{
        RNFetchBlob
        .config({
            fileCache : true,
        })
        .fetch('GET', 'https://via.placeholder.com/200x150', {

        })
        .then((res) => {
            console.log('The file saved to ', res.path());
            test = res.path();
            console.log("PATH to FILE: " + test);

            RNFetchBlob.fetch('POST', 'https://app-api-testing.herokuapp.com/upload', {
                'Content-Type': 'multipart/form-data',
            }, [
                    { name: 'sampleFile', filename: 'file.png', type: 'image/png', data: RNFetchBlob.wrap(test)},
            ]).then((resp) => {
                console.log("TEST RESPONSE" + resp.text());
                this.setState({
                    message: resp.text()
                });
            }).catch((err) => {
                console.log("TEST ERROR: " + err);
                this.setState({
                    message: "ERROR"
                });
            });
        });
    }

    onLogoutPressHandler = () => {
        return fetch('https://app-api-testing.herokuapp.com/logout', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            
        })
            .then((response) => response.json())
            .then((responseJson) => {
                Alert.alert(
                    'Logging out',
                    "",
                    [
                        {
                            text: 'OK', onPress: () => {
                                this.props.navigation.navigate('Home');

                            }
                        }
                    ]
                ) 
            })
            .catch ((error) => {
                console.error(error);
            });
    }

    

    
    render() {
        const {params} = this.props.navigation.state;
        const username = params ? params.username : null;
        const fname = params ? params.fname : null;
        const lname= params ? params.lname: null;
        const email = params ? params.email : null;
        const _id = params ? params._id : null;
        const images = params ? params.images : null;
        console.log('PICTURES', images);
		console.log('PICLENGTH',images.length);
		
		// find out length of image array
		let imageCount = images.length;
		console.log("Image Count: ", imageCount);

		// setup variable to contain Image element
		let imageElement;
		let imageUri = 'https://app-api-testing.herokuapp.com/api/users/' + _id + '/images/';
		if(imageCount == 1){
			imageElement = (
				<Image 
					source={{uri: imageUri + images}}
                    style={styles.thumbnail} 
                    
                    />
			);
		}else if(imageCount > 1 ){
			imageElement = [];
			images.forEach(function(image, index){
				imageElement.push(
					<Image
						key={index} 
						source={{uri: imageUri + image}}
						style={styles.thumbnail} 
					/>
				);
			});
		}

        return (
            <View style={styles.viewContainer}>
				<View>
					<Text>username: {JSON.stringify(username)}</Text>
					<Text>FEEDS</Text>
                 {/* <Text>fname: {JSON.stringify(fname)}</Text>
                    <Text>lname: {JSON.stringify(lname)}</Text>
                    <Text>email: { JSON.stringify(email) }</Text >
                    <Text>id: { JSON.stringify(_id) }</Text > */}
				
				</View>
					
				<View style={styles.pictures}>
                    
					{imageElement}
				</View> 

				<Button title="Upload" onPress={this.onUploadPressHandler} />
				<Button title="Logout" onPress={this.onLogoutPressHandler} />
				
                <Text>{this.state.message}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        width: 75,
        height: 75,
    }
});

module.exports = UserScreen;