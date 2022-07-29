export function combineReducers(config) {
    return function reducer(state, action) {
      let newObj = {};
      Object.entries(config).forEach(([key, value]) => {
        if(state === undefined) {
          newObj[key] = value(undefined, action);
        }else {
          newObj[key] = value(state[key], action);
        }
      });
      return newObj;
    };
  }