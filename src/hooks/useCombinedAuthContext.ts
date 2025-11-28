import { useContext } from 'react';
import { CombinedAuthContext } from '../contexts/CombinedAuthContextValue';

export const useCombinedAuthContext = () => {
  const context = useContext(CombinedAuthContext);
  if (context === undefined) {
    throw new Error('useCombinedAuthContext must be used within a CombinedAuthProvider');
  }
  return context;
};