'use client';
import '../app/globals.css'; 

import { useState, FormEvent } from 'react';

export default function SignupForm() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Your signup logic here
    console.log('Signing up:', form);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({...form, name: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({...form, email: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({...form, password: e.target.value})}
          className="form-input"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="form-button"
      >
        {loading ? 'Signing up...' : 'Sign Up'}
      </button>
    </form>
  );
}