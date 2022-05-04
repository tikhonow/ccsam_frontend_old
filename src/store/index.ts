export * from "./container-store";
export * from "./settings-store";
export * from "./history-store";
export * from "./shortcut-store";
export * from "./material-store";
export * from "./result-store";
export * from "./solver-store";
export * from "./app-store";
export * from "./io";
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authSlice from "./auth/auth";

declare global {

  type SetFunction<T> = (fn: (store: T, overwrite?: boolean) => void) => void;

  interface SetPropertyPayload<T> {
    uuid: string;
    property: keyof T;
    value: T[SetPropertyPayload<T>["property"]];
  }
}

const rootReducer = combineReducers({
  auth: authSlice.reducer
});

const persistedReducer = persistReducer(
  {
    key: "root",
    version: 1,
    storage: storage
  },
  rootReducer
);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof rootReducer>;

export default store;

