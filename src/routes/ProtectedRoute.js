import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation , useParams, useNavigate ,Route } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';


export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export function PublicRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


export function ExamRoute({ children }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id || isNaN(id)) {
      navigate('/exams', { replace: true });
    }
  }, [id, navigate]);

  if (!id || isNaN(id)) {
    return null; // or a loading spinner
  }

  return children;
}

ExamRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
