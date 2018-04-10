// GalleryImage.js

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dimensions, Image } from 'react-native';
import { Button } from 'native-base';
// import { Image } from 'react-native-animatable';

const WIDTH = Dimensions.get('window').width;

export default class GalleryImage extends Component {
	render() {
		const { uri, index, onPress } = this.props;
		return (
			<Button
				onPress={() => onPress(index)}
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