import { createStore } from './core.js'
// createStore take parameter 'reducer' so we'll need to import reducer also
import reducer from './reducer.js';
import withLogger from './logger.js';


const { attach, connect, dispatch } = createStore(withLogger(reducer));

window.dispatch = dispatch

export { attach ,connect}