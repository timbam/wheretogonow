import { ADD_MAP } from '../actions/index';

const INITIAL_STATE = {
  map: null
};

export default function(state = INITIAL_STATE , action) {
  switch (action.type) {
    case ADD_MAP:
      console.log("reducer_map says: " + action.payload);
      return {...state, map: action.payload};
  }
  return state;
}
