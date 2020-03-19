const {createStore, applyMiddleware} = require('redux');

const defaultState = {
    courses: [
        {
            name: 'Learning React',
            topic: 'React',
        },
        {
            name: 'Learning Angular',
            topic: 'Angular',
        },
        {
            name: 'Using Redux with Angular',
            topic: 'Angular',
        }
    ]
};

const logger = store => next => action => {
    console.log('dispatch ' , action);
    let result = next(action);
    console.log('state after action ', store.getState());
    return result;
};

const logger2 = store => next => action => {
  console.log('DEBUG: ', action);
  return next(action);
};

const loggers = [logger, logger2];
const ADD_COURSE = 'ADD_COURSE';

function reducer(state, action) {
    switch(action.type) {
			case ADD_COURSE:
				return {
					...state,
					courses: [...state.courses, action.course]
				};
        default:
            return state;
    }
}

const store = createStore(reducer, defaultState, applyMiddleware(...loggers));

function addView(viewFunc) {
    viewFunc(defaultState);
    store.subscribe(() => {
        viewFunc(store.getState());
    });
}

addView((state) => {
    console.log(`There are ${state.courses.length} courses in the library`);
});

addView((state) => {
    console.log(`The latest course in the library: ${state.courses[state.courses.length - 1].name}`);
});

store.dispatch({
    type: ADD_COURSE,
    course: {
        name: 'This is the new course',
        topic: 'Really does not matter'
    }
});
