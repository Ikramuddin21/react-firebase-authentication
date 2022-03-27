import './App.css';
import initializeAuthentication from './Firebase/firebase.init';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, updateProfile } from "firebase/auth";
import { useState } from 'react';


initializeAuthentication();

const googleProvider = new GoogleAuthProvider();

function App() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLigin] = useState(false);

  const auth = getAuth();
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
  };

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = e => {
    setPassword(e.target.value);
  };

  // toggle login register
  const toggleLogin = e => {
    setIsLigin(e.target.checked);
  }

  // form submit handle
  const handleRegistration = e => {
    e.preventDefault();
    console.log(email, password);
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password must contain 2 upper case');
      return;
    }

    // conditionally login or register show
    isLogin ? processLogin(email, password) : registerNewUser(email, password);
  }

  // login
  const processLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
      })
      .catch(error => {
        setError(error.message);
      })
  };

  // register
  const registerNewUser = (email, password) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setError('');
        varifyEmail();
        setUserName();
      })
      .catch(error => {
        setError(error.message);
      })
  };

  // user name
  const setUserName = () => {
    updateProfile(auth.currentUser, {displayName: name})
    .then(result => {
      console.log(result);
    })
  };

  // varify email
  const varifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then(result => {
        console.log(result);
      })
  }

  // reset password
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(result => {
        console.log(result);
      })
  }

  // name input field
  const handleNameChange = e => {
    setName(e.target.value);
  };

  return (
    <div className="mx-5">
      <form onSubmit={handleRegistration}>
        <h2 className='text-primary'>Please {isLogin ? 'Login' : 'Register'}</h2>

        { !isLogin && <div className="row mb-3">
          <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input onBlur={handleNameChange} type="text" className="form-control" id="inputName" placeholder="Your name" />
          </div>
        </div>}

        <div className="row mb-3">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-10">
            <input onBlur={handleEmailChange} type="email" className="form-control" id="inputEmail3" />
          </div>
        </div>

        <div className="row mb-3">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-10">
            <input onBlur={handlePasswordChange} type="password" className="form-control" id="inputPassword3" />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-sm-10 offset-sm-2">
            <div className="form-check">
              <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck1" />
              <label className="form-check-label" htmlFor="gridCheck1">
                Already Registered?
              </label>
            </div>
          </div>
        </div>
        <div className='row mb-3 text-danger'>{error}</div>
        <button type="submit" className="btn btn-primary">{isLogin ? 'Login' : 'Register'}</button>
        <button onClick={handleResetPassword} type="button" className="btn btn-secondary btn-sm">Reset password</button>
      </form>
      <br /><br /><br />
      <div>------------------------------</div>
      <br /><br /><br />
      <button onClick={handleGoogleSignIn}>Google sign in</button>
    </div>
  );
}

export default App;
