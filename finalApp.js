const { createStore, applyMiddleware } = require('redux');
const chalk = require('chalk');

// curry 
const decorateText = (color = 'bgRed') => ({ text = 'blah blah', others = 'DEBUG' }) => {
  color = (color === 'bgRed' || color === 'bgBlue')? color : 'bgYellow';
  console.log(chalk[color](text), others);
}

const logger = store => next => action => {
  let yellowColor = decorateText();
  
  yellowColor({
    others: action.type
  });

  let result = next(action)

  yellowColor({
    text: 'state after action: ',
    others: store.getState()
  });

  console.log('\n\n');

  return result
}

const defaultState = {
  skills: [{name: 'Angular'}],
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

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_COURSE':
      return Object.assign({}, state, {
        courses: [...state.courses, action.course]
      });
    case 'REMOVE_COURSE':
        const filteredCourses = state.courses.filter(course => {
          return course.name !== action.course.name
        });
        return {...state, courses: [...filteredCourses], skills: 'React' };
    default:
      return state;
  }
}

const store = createStore(reducer, defaultState, applyMiddleware(logger));


function addView(viewFunc) {
  store.subscribe(() => {
    viewFunc(store.getState());
  });
}

addView((state) => {
  console.log(`There are ${state.courses.length} courses in the library`);
});

addView((state) => {
  console.log(`The latest course in the library: ${state.courses[state.courses.length -1].name}`);
});


store.dispatch({
  type: 'ADD_COURSE',
  course: {
    name: 'This is the new course',
    topic: 'Really does not matter'
  }
});

store.dispatch({
  type: 'ADD_COURSE',
  course: {
    name: 'Design pattern',
    topic: 'Memento, Mediator'
  }
});


store.dispatch({
    type: 'REMOVE_COURSE',
    course: {
        name: 'This is the new course',
        topic: 'Really does not matter'
    }
});

