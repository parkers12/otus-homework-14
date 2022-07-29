export type Store<State = any, Action = { type: string }> = {
  getState(): State;
  dispatch(action: Action): any;
  subscribe(cb: () => void): () => void;
};

export type Reducer<State, Action> = (
  state: State | undefined,
  action: Action
) => State;

export type Middleware<State, Action> = (
  store: Store<State, Action>
) => (next: (action: Action) => any) => (action: Action) => any;

export type ConfigureStore<State, Action> = (
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[]
) => Store<State, Action>;

export function configureStore<State, Action>(
  reducer: Reducer<State, Action>,
  initialState?: State | undefined,
  middlewares?: Middleware<State, Action>[]
): Store<State, Action> {
  let state: State = initialState;
  let subscribers: [] = [];

  return {
    getState(): State {
      return state;
    },
    dispatch(action: Action): any {
      state = reducer(state, action);
      subscribers.forEach((cb) => cb());
    },
    subscribe(cb: () => void): () => void {
      subscribers.push(cb);
      return () => {
        subscribers = subscribers.filter((el) => el !== cb);
      };
    }
  };
}


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