import { createContext } from 'react';

// just the context object - kept in its own file so AuthContext.jsx
// only exports the provider component (fast refresh rule)
export const AuthContext = createContext();
