import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext(null);

const initialState = {
  user: null,           // { name, avatar, addiction_type, duration, goal, session_type }
  matches: [],          // counselor ids that were liked back (simulated)
  liked: [],            // counselor ids the user swiped right
  passed: [],           // counselor ids the user swiped left
  messages: {},         // { counselorId: [{ from, text, ts }] }
  activeMatch: null,    // counselor shown in match celebration modal
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };

    case 'LIKE_COUNSELOR': {
      const id = action.payload;
      const newLiked = [...state.liked, id];
      // Simulate ~70% match rate for demo
      const isMatch = Math.random() > 0.3;
      const newMatches = isMatch ? [...state.matches, id] : state.matches;
      return {
        ...state,
        liked: newLiked,
        matches: newMatches,
        activeMatch: isMatch ? id : null,
      };
    }

    case 'PASS_COUNSELOR':
      return { ...state, passed: [...state.passed, action.payload] };

    case 'CLEAR_ACTIVE_MATCH':
      return { ...state, activeMatch: null };

    case 'SEND_MESSAGE': {
      const { counselorId, message } = action.payload;
      const prev = state.messages[counselorId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [counselorId]: [...prev, message],
        },
      };
    }

    case 'RECEIVE_MESSAGE': {
      const { counselorId, message } = action.payload;
      const prev = state.messages[counselorId] || [];
      return {
        ...state,
        messages: {
          ...state.messages,
          [counselorId]: [...prev, message],
        },
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
