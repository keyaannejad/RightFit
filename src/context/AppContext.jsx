import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: null,           // { name, avatar, reason, duration, priorHelp, sessionType, language, coverage }
  anonymous: false,     // hide name throughout the app
  matches: [],          // counselor ids matched (simulated)
  liked: [],            // counselor ids swiped right
  passed: [],           // counselor ids swiped left
  messages: {},         // { counselorId: [{ from, text, ts }] }
  activeMatch: null,    // counselor id shown in match celebration modal
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'SET_ANONYMOUS':
      return { ...state, anonymous: action.payload };

    case 'LIKE_COUNSELOR': {
      const id = action.payload;
      if (state.liked.includes(id)) return state;
      const newLiked = [...state.liked, id];
      const isMatch = Math.random() > 0.25; // ~75% match rate
      const newMatches = isMatch ? [...state.matches, id] : state.matches;
      return {
        ...state,
        liked: newLiked,
        matches: newMatches,
        activeMatch: isMatch ? id : state.activeMatch,
      };
    }

    case 'PASS_COUNSELOR': {
      const id = action.payload;
      if (state.passed.includes(id)) return state;
      return { ...state, passed: [...state.passed, id] };
    }

    case 'CLEAR_ACTIVE_MATCH':
      return { ...state, activeMatch: null };

    case 'SEND_MESSAGE': {
      const { counselorId, message } = action.payload;
      const prev = state.messages[counselorId] || [];
      return {
        ...state,
        messages: { ...state.messages, [counselorId]: [...prev, message] },
      };
    }

    case 'RECEIVE_MESSAGE': {
      const { counselorId, message } = action.payload;
      const prev = state.messages[counselorId] || [];
      return {
        ...state,
        messages: { ...state.messages, [counselorId]: [...prev, message] },
      };
    }

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
