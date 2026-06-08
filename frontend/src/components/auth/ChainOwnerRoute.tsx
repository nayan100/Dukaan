import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ChainOwnerRouteProps {
  children: React.ReactNode;
}

const ChainOwnerRoute: React.FC<ChainOwnerRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (user?.role !== 'Chain Owner') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ChainOwnerRoute;
