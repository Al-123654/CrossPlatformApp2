import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';

const customBackBtn = (props) => {
	return(
		<View>
			<TouchableOpacity
				onPress={props.clicked}
			>
				<Icon
					name='chevron-left'
					type='feather'
					color='#fff'
				/>
			</TouchableOpacity>
		</View>
	);
};

export default customBackBtn;