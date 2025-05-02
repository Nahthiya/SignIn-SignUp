import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ConnectGoogle() {
  const { user } = useContext(AuthContext);

  if (user?.googleTokens) {
    return <p>Gmail is already connected!</p>;
  }
  return (
    <div>
      <h2>Connect your Gmail</h2>
      <a href="http://localhost:5000/api/auth/google">
        <button>Connect with Google</button>
      </a>
    </div>
  );
}
