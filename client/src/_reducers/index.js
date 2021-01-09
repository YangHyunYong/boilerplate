//여러 reducer들을 합쳐주는 기능을 위한 combineReducers 사용
import { combineReducers } from 'redux';
import user from './user_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;