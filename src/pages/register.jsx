import { useState } from 'react'; 
import './styles/globals.css';
import router from 'next/router';

export default function Register() {
  const [username, setUsername] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful');
        console.log(data,"data");
        router.push('/login'); 
      } else {
        setError('An error occurred');
      }
    } catch (fetchError) {
      console.log('Error during registration:', fetchError);
      setError('Failed to connect to server. Please try again later.');
    }
  };

  const handleGoBack = () => {
    router.push('/'); 
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
          <button
            type="button" 
            className="submit-button"
            onClick={handleGoBack}
            style={{ marginTop: '10px' }}
          >
            Back to Homepage
          </button>
        </form>
      </div>
    </div>
  );
}
