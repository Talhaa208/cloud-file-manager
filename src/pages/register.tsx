import { useState } from 'react';
import './styles/globals.css';
import router from 'next/router';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      alert('Registration successful');
    } else {
      setError(data.error);
    }
  };
  const handleGoBack = () => {
    router.push('/'); // Go to homepage
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Create Account</h1>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="register-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="submit-button">Register</button>
          <button  className="submit-button" onClick={handleGoBack} style={{ marginTop: '10px' }}>
        Back to Homepage
      </button>
        </form>
      </div>
    </div>
  );
}
