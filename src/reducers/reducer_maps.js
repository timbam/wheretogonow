import { SET_CIRCLE_VISIBLE, SET_CIRCLE_RADIUS } from '../actions/index';

const INITIAL_STATE = {
  circleVisible: false,
  circleRadius: 300
}

export default function(state = INITIAL_STATE, action){
  switch(action.type){
    case SET_CIRCLE_VISIBLE:
      return { ...state, circleVisible: action.payload };
    case SET_CIRCLE_RADIUS:
      return { ...state, circleRadius: action.payload };
    return state;
  }
  return state;
}
