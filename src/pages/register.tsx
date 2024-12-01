import { useState, FormEvent } from 'react'; // Import proper types
import './styles/globals.css';
import router from 'next/router';

export default function Register() {
  const [username, setUsername] = useState<string>(''); // Specify types
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault(); // FormEvent type for `e`

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful');
        router.push('/login'); // Redirect to login page after successful registration
      } else {
        setError(data.error || 'An error occurred');
      }
    } catch (fetchError) {
      console.error('Error during registration:', fetchError);
      setError('Failed to connect to server. Please try again later.');
    }
  };

  const handleGoBack = () => {
    router.push('/'); // Navigate to the homepage
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
            type="button" // Change to type="button" to avoid submitting the form
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
