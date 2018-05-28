const redux = require('redux');

let initialState = {
	counter: 0
}

function reducer(state = initialState, action){
	switch(action.type){
		case 'INCREMENT':
			return {
				counter: state.counter + 1
			}
		case 'DECREMENT':
			return {
				counter: state.counter - 1
			}
	}
	return state;
}

const store = redux.createStore(reducer);

// increment state counter
store.dispatch({ type: 'INCREMENT' });
console.log("[reduxTest] counter after INCREMENT: ", store.getState());

// decrement state counter
store.dispatch({ type: 'DECREMENT' });
console.log("[reduxTest] counter after DECREMENT: ", store.getState());