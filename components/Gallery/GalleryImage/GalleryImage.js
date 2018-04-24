// GalleryImage.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import { Button } from 'native-base';
// import { Image } from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;

export default class GalleryImage extends Component {
	render() {
		const { uri, index, onPress, imageId, passedUserId, disabled, onLongPress } = this.props;
		console.log('[GalleryImage js] props from Gallery:', this.props)
		// console.log('[GalleryImage js] value of disabled:', disabled)
		return (
			<Button
				// disabled = {disabled}
				onPress={() => 
					{
						onPress(imageId, passedUserId)
					}
				}
				onLongPress={()=>
					{
						onLongPress(imageId,passedUserId)
					}
				}
				style={{
					backgroundColor: 'transparent',
					borderRadius: 0,
					height: 80,
					width: WIDTH / 3,
				}}
			>
				<Image
					source={ {uri: uri} }
					style={{
						height: 80,
						left: 0,
						position: 'absolute',
						resizeMode: 'cover',
						top: 0,
						width: WIDTH / 3,
					}}
				/>
			</Button>
		);
	}
}