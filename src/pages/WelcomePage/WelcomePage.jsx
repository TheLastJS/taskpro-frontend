import React from 'react';
import styles from './WelcomePage.module.css';
import { NavLink, useNavigate } from 'react-router-dom';
import welcomeImage from '../../assets/welcome-image.png';
import icon from '../../assets/icon.svg';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const GoogleButton = styled(Button)({
  background: '#010001',
  color: '#fff',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: 16,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  padding: '10px 0',
  width: '344px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 12,
  border: '1px solid #BEDBB0',
  '&:hover': {
    background: '#151515',
    borderColor: '#5255BC',
  },
});

function WelcomePage() {
  const navigate = useNavigate();

  const handleGoogleSignUp = async () => {
    // Fetch Google OAuth URL from backend and redirect
    try {
      const res = await fetch('http://localhost:3000/auth/google');
      const data = await res.json();
      if (data?.data?.url) {
        window.location.href = data.data.url;
      } else {
        alert('Google auth URL could not be fetched.');
      }
    } catch (e) {
      alert('Google auth URL could not be fetched.');
    }
  };

  // --- Google callback sonrası için effect ---
  React.useEffect(() => {
    // Eğer URL /auth/google/success ise ve accessToken varsa, login işlemini tamamla
    if (window.location.pathname === '/auth/google/success') {
      const params = new URLSearchParams(window.location.search);
      const accessToken = params.get('accessToken');
      const name = params.get('name');
      const email = params.get('email');
      if (accessToken) {
        // Token'ı store'a kaydet (ör: localStorage veya redux)
        localStorage.setItem('token', accessToken);
        // Kullanıcı bilgilerini de kaydedebilirsin
        localStorage.setItem('user', JSON.stringify({ name, email }));
        // Ana sayfaya yönlendir
        navigate('/home');
      }
    }
  }, [navigate]);

  return (
    <div className={styles.backgroundLinear}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <img src={welcomeImage} alt='welcome-image' width='162' height='162' />
          <div className={styles.logo}>
            <img src={icon} alt='icon' />
            <p>Task Pro</p>
          </div>
          <p className={styles.welcomeText}>
            Supercharge your productivity and take control of your tasks with Task Pro - Don't wait,
            start achieving your goals now!
          </p>
        </div>

        <div className={styles.button}>
          {/* Google ile kayıt ol butonu */}
          <button className={styles.googleAuthButton} onClick={handleGoogleSignUp} type='button'>
            <span style={{ display: 'flex', alignItems: 'center' }}>
              {/* Google SVG ikonu */}
              <svg width='22' height='22' viewBox='0 0 22 22'>
                <g>
                  <circle fill='#fff' cx='11' cy='11' r='11' />
                  <path
                    d='M17.64 11.2c0-.56-.05-1.1-.14-1.6H11v3.04h3.74a3.2 3.2 0 01-1.39 2.1v1.74h2.25c1.32-1.22 2.04-3.02 2.04-5.28z'
                    fill='#4285F4'
                  />
                  <path
                    d='M11 18c1.8 0 3.3-.6 4.4-1.62l-2.25-1.74c-.62.42-1.42.68-2.15.68-1.65 0-3.05-1.12-3.55-2.62H5.1v1.8A7 7 0 0011 18z'
                    fill='#34A853'
                  />
                  <path
                    d='M7.45 12.7A4.2 4.2 0 017.1 11c0-.3.05-.6.1-.9V8.3H5.1A7 7 0 004 11a7 7 0 001.1 2.7l2.35-1z'
                    fill='#FBBC05'
                  />
                  <path
                    d='M11 7.5c.98 0 1.85.34 2.54 1.02l1.9-1.9A6.98 6.98 0 0011 4a7 7 0 00-5.9 3.3l2.35 1.8C7.95 8.62 9.35 7.5 11 7.5z'
                    fill='#EA4335'
                  />
                </g>
              </svg>
            </span>
            Sign Up with Google
          </button>

          <NavLink to='/register'>
            <button className={styles.buttonRegister}>
              <p>Registration</p>
            </button>
          </NavLink>
          <NavLink to='/login'>
            <button className={styles.buttonLogin}>Log In</button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default WelcomePage;
