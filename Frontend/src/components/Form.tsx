import React, { useState } from 'react';
import '../styles/form.css';
import { useAuth } from './AuthContext';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Form = () => {
    const { login, createUser } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoginMode, setLoginMode] = useState(true);

    const toastOptions: ToastOptions = {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          borderRadius: '15px',
          backgroundColor: '#d6e6f7',
          color: '#2c2b2bb4',
        },
      };
  
    const toggleMode = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setEmail('');
      setName('');
      setPassword('');
      setLoginMode(!isLoginMode);
    };

    const validateName = (name: string) => {
        const regex = /^[a-zA-Z\s]+$/;
        return name.length >= 3 && regex.test(name);
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors: string[] = [];

        if (!isLoginMode) {
            if (!validateName(name)) {
                errors.push('Name must be at least 3 characters long and contain only letters and spaces.');
            }
        }

        if (!validateEmail(email)) {
            errors.push('Invalid email address.');
        }

        if (!validatePassword(password)) {
            errors.push('Password must be at least 8 characters long.');
        }

        if (errors.length > 0) {
            errors.forEach((error) => toast.error(error, toastOptions));
            return;
        }

        try {
            let result;
            if (isLoginMode) {
              result = await login(email, password);
            } else {
              console.log(isLoginMode);
              result = await createUser(name, email, password);
            }
            console.log(result)
            if (result.success) {
              toast.success(result.message, toastOptions);
            } else {
              toast.error(result.message, toastOptions);
            }
          } catch (error) {
            console.log(error)
          }
    };


    const containerStyle: React.CSSProperties = {
        display: 'flex',
        width: '200%',
        transform: `translateX(${isLoginMode ? '0' : '-50%'})`,
        transition: 'transform 0.5s ease-in-out',
        justifyContent: 'space-between',
        position: 'relative',
        left: isLoginMode ? '55%' : '45%',
    };

    return (
        <>
            <form onSubmit={handleFormSubmit}>
                <div className='container-form'>
                    <div className='container-form-logo'>
                        <img src="https://firebasestorage.googleapis.com/v0/b/bytech-71691.appspot.com/o/logo1.png?alt=media&token=d8a0aa77-5f9b-4457-a41d-a1e588b98328" alt="Logo Nuo Planet" />
                        <h2>{isLoginMode ? 'LOGIN' : 'SIGN UP'}</h2>
                    </div>
                    <div style={containerStyle}>
                        <div className='form-login'>
                            <div className='form-item'>
                                <label htmlFor="email">Email Address</label>
                                <div className='form-item-input'>                        
                                    <i className="fas fa-envelope" />
                                    <input 
                                        type='email' 
                                        name='email' 
                                        placeholder='john@bytech.com' 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='form-item'>
                                <label htmlFor='password'>Password</label>
                                <div className='form-item-input'>                        
                                    <i className="fas fa-lock" />
                                    <input 
                                        type='password' 
                                        name='password' 
                                        placeholder="•••••••••••••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="login">Login</button>
                            <div className='create-user'>
                                <h2>Not a user yet?</h2>
                                <button onClick={toggleMode}>Create account</button>
                            </div>
                        </div>
                        <div className='form-new-account'>
                        <div className='form-login'>
                            <div className='form-item-create'>
                                <label htmlFor="email">Insert your name</label>
                                <div className='form-item-input'>                        
                                    <i className="fas fa-envelope" />
                                    <input 
                                        type='text' 
                                        name='text' 
                                        placeholder="Jhon Doe" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='form-item-create'>
                                <label htmlFor="email">Insert your email</label>
                                <div className='form-item-input'>                        
                                    <i className="fas fa-envelope" />
                                    <input 
                                        type='email' 
                                        name='email' 
                                        placeholder='john@bytech.com' 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className='form-item-create'>
                                <label htmlFor='password'>Insert your password</label>
                                <div className='form-item-input'>                        
                                    <i className="fas fa-lock" />
                                    <input 
                                        type='password' 
                                        name='password' 
                                        placeholder="•••••••••••••••••••" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button className="createAccount">Create Account</button>
                            <div className='create-user'>
                                <button onClick={toggleMode}>Return to login</button>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </form>
            <ToastContainer />
        </>
    );
};

export default Form;
