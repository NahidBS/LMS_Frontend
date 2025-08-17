// import React from 'react';
// import { useMediaQuery } from 'react-responsive';
// import { FiMail } from 'react-icons/fi'; // Import mail icon

// const Newsletter = () => {
//   const isMobile = useMediaQuery({ maxWidth: 600 });

//   const styles = {
//     newsletterSection: {
//       width: '100%',
//       padding: '60px 20px',
//       display: 'flex',
//       justifyContent: 'center',
//       backgroundColor: 'white', // Pure white background
//       backgroundImage: 'linear-gradient(to bottom, #e0f2fe 0%, white 100%)', // Sky color gradient
//       backgroundSize: '100% 150px',
//       backgroundRepeat: 'no-repeat',
//     },
//     newsletterContainer: {
//       maxWidth: '800px',
//       width: '100%',
//       textAlign: 'center',
//     },
//     newsletterTitle: {
//       fontSize: '28px',
//       fontWeight: '600',
//       marginBottom: '20px',
//       color: '#333',
//     },
//     newsletterText: {
//       fontSize: '16px',
//       lineHeight: '1.6',
//       color: '#666',
//       marginBottom: '30px',
//     },
//     newsletterInputContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       maxWidth: '500px',
//       margin: '0 auto',
//       flexDirection: isMobile ? 'column' : 'row',
//       position: 'relative',
//     },
//     newsletterInput: {
//       flex: '1',
//       padding: '12px 20px 12px 40px', // Extra padding for icon
//       fontSize: '16px',
//       border: '1px solid #ddd',
//       borderRadius: isMobile ? '4px' : '4px 0 0 4px',
//       outline: 'none',
//       marginBottom: isMobile ? '10px' : '0',
//     },
//     newsletterButton: {
//       padding: '12px 25px',
//       backgroundColor: '#3b82f6', // Sky blue button
//       color: 'white',
//       border: 'none',
//       borderRadius: isMobile ? '4px' : '0 4px 4px 0',
//       fontSize: '16px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s',
//       width: isMobile ? '100%' : 'auto',
//     },
//     mailIcon: {
//       position: 'absolute',
//       left: '15px',
//       top: '50%',
//       transform: 'translateY(-50%)',
//       color: '#999',
//     },
//   };

//   return (
//     <div style={styles.newsletterSection}>
//       <div style={styles.newsletterContainer}>
//         <h2 style={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
//         <p style={styles.newsletterText}>
//           Sed eu feugiat amet, libero ipsum enim pharetra hac dolor sit amet,
//           <br />
//           consectetur.Elit adipiscing enim pharetra hac.
//         </p>
//         <div style={styles.newsletterInputContainer}>
//           <FiMail style={styles.mailIcon} />
//           <input
//             type="email"
//             placeholder="brain.station23@gmail.com"
//             style={styles.newsletterInput}
//           />
//           <button 
//             style={styles.newsletterButton}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
//           >
//             SUBSCRIBE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Newsletter;

// import React from 'react';
// import { useMediaQuery } from 'react-responsive';
// import { FiMail } from 'react-icons/fi'; // Import mail icon

// const Newsletter = () => {
//   const isMobile = useMediaQuery({ maxWidth: 600 });
//   const isTablet = useMediaQuery({ minWidth: 601, maxWidth: 1024 });

//   const styles = {
//     newsletterSection: {
//       width: '100%',
//       padding: isMobile ? '40px 16px' : isTablet ? '56px 24px' : '60px 20px',
//       display: 'flex',
//       justifyContent: 'center',
//       backgroundColor: 'white', // Pure white background
//       backgroundImage: 'linear-gradient(to bottom, #e0f2fe 0%, white 100%)', // Sky color gradient
//       backgroundSize: isMobile ? '100% 90px' : isTablet ? '100% 130px' : '100% 150px',
//       backgroundRepeat: 'no-repeat',
//       boxSizing: 'border-box',
//     },
//     newsletterContainer: {
//       maxWidth: isMobile ? '92%' : '800px',
//       width: '100%',
//       textAlign: 'center',
//       margin: '0 auto',
//     },
//     newsletterTitle: {
//       fontSize: isMobile ? '24px' : '28px',
//       fontWeight: '600',
//       marginBottom: isMobile ? '14px' : '20px',
//       color: '#333',
//       lineHeight: 1.25,
//     },
//     newsletterText: {
//       fontSize: isMobile ? '15px' : '16px',
//       lineHeight: 1.6,
//       color: '#666',
//       marginBottom: isMobile ? '22px' : '30px',
//     },
//     newsletterInputContainer: {
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'stretch',
//       maxWidth: isMobile ? '100%' : '500px',
//       margin: '0 auto',
//       flexDirection: isMobile ? 'column' : 'row',
//       position: 'relative',
//       gap: isMobile ? '10px' : '0px',
//     },
//     newsletterInput: {
//       flex: '1',
//       padding: '12px 20px 12px 44px', // Extra padding for icon
//       fontSize: '16px',
//       border: '1px solid #ddd',
//       borderRadius: isMobile ? '8px' : '8px 0 0 8px',
//       outline: 'none',
//       marginBottom: isMobile ? '0' : '0',
//       height: '48px',
//       boxSizing: 'border-box',
//       width: '100%',
//     },
//     newsletterButton: {
//       padding: '12px 25px',
//       backgroundColor: '#3b82f6', // Sky blue button
//       color: 'white',
//       border: 'none',
//       borderRadius: isMobile ? '8px' : '0 8px 8px 0',
//       fontSize: '16px',
//       fontWeight: '600',
//       cursor: 'pointer',
//       transition: 'background-color 0.3s',
//       width: isMobile ? '100%' : 'auto',
//       height: '48px',
//       minWidth: isMobile ? '100%' : isTablet ? '160px' : '140px',
//       boxSizing: 'border-box',
//     },
//     mailIcon: {
//       position: 'absolute',
//       left: '14px',
//       top: isMobile ? '24px' : '50%',
//       transform: isMobile ? 'translateY(-50%)' : 'translateY(-50%)',
//       color: '#999',
//       pointerEvents: 'none',
//     },
//   };

//   return (
//     <div style={styles.newsletterSection}>
//       <div style={styles.newsletterContainer}>
//         <h2 style={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
//         <p style={styles.newsletterText}>
//           Sed eu feugiat amet, libero ipsum enim pharetra hac dolor sit amet,
//           <br />
//           consectetur.Elit adipiscing enim pharetra hac.
//         </p>
//         <div style={styles.newsletterInputContainer}>
//           <FiMail style={styles.mailIcon} />
//           <input
//             type="email"
//             placeholder="brain.station23@gmail.com"
//             style={styles.newsletterInput}
//           />
//           <button 
//             style={styles.newsletterButton}
//             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
//             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
//           >
//             SUBSCRIBE
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Newsletter;


import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { FiMail } from 'react-icons/fi'; // Import mail icon

const Newsletter = () => {
  const isMobile = useMediaQuery({ maxWidth: 600 });
  const isTablet = useMediaQuery({ minWidth: 601, maxWidth: 1024 });

  // ==== State (added) ====
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [status, setStatus] = React.useState({ type: '', message: '' });

  // ==== Env (safe for CRA or Vite) ====
  const getEnv = (keyVite, keyCRA) => {
    try { if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[keyVite]) return import.meta.env[keyVite]; } catch {}
    try { if (typeof process !== 'undefined' && process.env && process.env[keyCRA]) return process.env[keyCRA]; } catch {}
    return '';
  };
  const API_BASE         = getEnv('VITE_API_BASE_URL', 'REACT_APP_API_BASE_URL');   // e.g. https://api.yourdomain.com
  const FORMSPREE_ID     = getEnv('VITE_FORMSPREE_ID', 'REACT_APP_FORMSPREE_ID');   // e.g. abcdwxyz
  const WEB3FORMS_KEY    = getEnv('VITE_WEB3FORMS_KEY', 'REACT_APP_WEB3FORMS_KEY'); // e.g. your-web3forms-access-key

  const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val || '').trim());

  // ==== Provider calls ====
  const postCustomAPI = async () => {
    const url = `${API_BASE.replace(/\/$/, '')}/api/newsletter/subscribe`;
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return { ok: res.ok, status: res.status, data: await safeParse(res) };
  };

  const postFormspree = async () => {
    const url = `https://formspree.io/f/${FORMSPREE_ID}`;
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return { ok: res.ok, status: res.status, data: await safeParse(res) };
  };

  const postWeb3Forms = async () => {
    const url = 'https://api.web3forms.com/submit';
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ access_key: WEB3FORMS_KEY, email }),
    });
    return { ok: res.ok, status: res.status, data: await safeParse(res) };
  };

  async function safeParse(res) {
    try { return await res.json(); } catch {
      try { return { detail: await res.text() }; } catch { return {}; }
    }
  }

  function explainNetworkError(err, endpointHint='') {
    const isMixed = typeof window !== 'undefined' && window.location?.protocol === 'https:' && endpointHint.startsWith('http:');
    if (isMixed) return 'Blocked mixed content: your site is HTTPS but API is HTTP.';
    if (String(err?.message || '').includes('Failed to fetch')) return 'Network/CORS error: API unreachable or blocked by CORS.';
    return err?.message || 'Request failed.';
  }

  // ==== Unified subscribe (tries custom -> Formspree -> Web3Forms) ====
  const subscribe = async () => {
    if (loading) return;
    setStatus({ type: '', message: '' });

    if (!isValidEmail(email)) {
      setStatus({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    try {
      // Build attempts based on what you configured
      const attempts = [];
      if (API_BASE)      attempts.push({ name: 'Custom API', fn: postCustomAPI, hint: API_BASE });
      if (FORMSPREE_ID)  attempts.push({ name: 'Formspree', fn: postFormspree, hint: 'https://formspree.io' });
      if (WEB3FORMS_KEY) attempts.push({ name: 'Web3Forms', fn: postWeb3Forms, hint: 'https://api.web3forms.com' });

      if (attempts.length === 0) {
        setStatus({ type: 'error', message: 'Newsletter endpoint not configured. Ask backend for /api/newsletter/subscribe or set FORMSPREE/WEB3FORMS env.' });
        return;
      }

      let success = false, lastErr = '';
      for (const attempt of attempts) {
        try {
          const resp = await attempt.fn();
          console.log(`[Newsletter] ${attempt.name} =>`, resp.status, resp.data);
          if (resp.ok) {
            const s = String(resp.data?.status || 'subscribed').toLowerCase();
            setStatus({
              type: 'success',
              message: s === 'pending'
                ? 'Check your inbox to confirm your subscription.'
                : 'Thanks for subscribing! Please check your email.',
            });
            setEmail('');
            success = true;
            break;
          } else {
            lastErr = resp.data?.detail || `HTTP ${resp.status}`;
          }
        } catch (err) {
          lastErr = explainNetworkError(err, attempt.hint);
          console.error(`[Newsletter] ${attempt.name} error:`, err);
        }
      }

      if (!success) {
        setStatus({ type: 'error', message: lastErr || 'Subscription failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      subscribe();
    }
  };

  const styles = {
    newsletterSection: {
      width: '100%',
      padding: isMobile ? '40px 16px' : isTablet ? '56px 24px' : '60px 20px',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: 'white', // Pure white background
      backgroundImage: 'linear-gradient(to bottom, #e0f2fe 0%, white 100%)', // Sky color gradient
      backgroundSize: isMobile ? '100% 90px' : isTablet ? '100% 130px' : '100% 150px',
      backgroundRepeat: 'no-repeat',
      boxSizing: 'border-box',
    },
    newsletterContainer: {
      maxWidth: isMobile ? '92%' : '800px',
      width: '100%',
      textAlign: 'center',
      margin: '0 auto',
    },
    newsletterTitle: {
      fontSize: isMobile ? '24px' : '28px',
      fontWeight: '600',
      marginBottom: isMobile ? '14px' : '20px',
      color: '#333',
      lineHeight: 1.25,
    },
    newsletterText: {
      fontSize: isMobile ? '15px' : '16px',
      lineHeight: 1.6,
      color: '#666',
      marginBottom: isMobile ? '22px' : '30px',
    },
    newsletterInputContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'stretch',
      maxWidth: isMobile ? '100%' : '500px',
      margin: '0 auto',
      flexDirection: isMobile ? 'column' : 'row',
      position: 'relative',
      gap: isMobile ? '10px' : '0px',
    },
    newsletterInput: {
      flex: '1',
      padding: '12px 20px 12px 44px', // Extra padding for icon
      fontSize: '16px',
      border: '1px solid #ddd',
      borderRadius: isMobile ? '8px' : '8px 0 0 8px',
      outline: 'none',
      marginBottom: isMobile ? '0' : '0',
      height: '48px',
      boxSizing: 'border-box',
      width: '100%',
    },
    newsletterButton: {
      padding: '12px 25px',
      backgroundColor: '#3b82f6', // Sky blue button
      color: 'white',
      border: 'none',
      borderRadius: isMobile ? '8px' : '0 8px 8px 0',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s',
      width: isMobile ? '100%' : 'auto',
      height: '48px',
      minWidth: isMobile ? '100%' : isTablet ? '160px' : '140px',
      boxSizing: 'border-box',
      opacity: loading ? 0.85 : 1,
    },
    mailIcon: {
      position: 'absolute',
      left: '14px',
      top: isMobile ? '24px' : '50%',
      transform: isMobile ? 'translateY(-50%)' : 'translateY(-50%)',
      color: '#999',
      pointerEvents: 'none',
    },
    statusText: {
      marginTop: '10px',
      fontSize: '14px',
      lineHeight: 1.5,
      color: status.type === 'success' ? '#059669' : '#dc2626',
      minHeight: '21px',
    },
  };

  return (
    <div style={styles.newsletterSection}>
      <div style={styles.newsletterContainer}>
        <h2 style={styles.newsletterTitle}>Subscribe to Our Newsletter</h2>
        <p style={styles.newsletterText}>
         Connect with Top 1% Bangladesh Talent
          <br />
          Scale Your Development Team in Just 4 Weeks
        </p>
        <div style={styles.newsletterInputContainer}>
          <FiMail style={styles.mailIcon} />
          <input
            type="email"
            placeholder="brain.station23@gmail.com"
            style={styles.newsletterInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Email address"
          />
          <button 
            style={styles.newsletterButton}
            onMouseOver={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2563eb'; }}
            onMouseOut={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#3b82f6'; }}
            onClick={subscribe}
            disabled={loading}
          >
            {loading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
          </button>
        </div>
        <div role="status" aria-live="polite" style={styles.statusText}>
          {status.message}
        </div>
      </div>
    </div>
  );
};

export default Newsletter;