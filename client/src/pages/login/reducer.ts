import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AuthState } from '@aws-amplify/ui-components';
import jwtDecode from 'jwt-decode';
import { Login } from './types';

export const initialState: Login = {
  authState: AuthState.SignIn,
  user: undefined,
  groups: [],
};

const slice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any | undefined>) => {
      if (!action.payload) {
        // logging off the user
        state.authState = initialState.authState;
        state.user = initialState.user;
        state.groups = initialState.groups;
        return;
      }
      state.user = action.payload;
      state.authState = AuthState.SignedIn;
      if (state.user?.signInUserSession?.idToken.jwtToken) {
        // decode and set the user's groups
        type CognitoGroups = { ['cognito:groups']: string[] };
        const decoded = jwtDecode<CognitoGroups>(state.user?.signInUserSession?.idToken.jwtToken);
        if (decoded['cognito:groups']) {
          state.groups = decoded['cognito:groups'];
        }
      }
    },
    setGroups: (state, action: PayloadAction<string[]>) => {
      state.groups = action.payload;
    },
  },
});

export const { actions } = slice;
export const { reducer } = slice;
