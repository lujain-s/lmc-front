import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import Operations from "../back_component/Operations";
import "./Login.css";
export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [formError, setFormError] = useState('');
    const { request, setToken } = Operations();

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'email') {
            setEmail(value);
            setEmailError('');
        } else if (name === 'password') {
            setPassword(value);
            setPasswordError('');
        }
    };

    const submitForm =  (e) => {
        setIsSubmitting(true);
        e.preventDefault();

        // للتحقق من صحة البيانات
        if (email === "" || password === "") {
            setError("Please fill in both email and password fields.");
            return;
        }
        //-----------ارسال الطلب للباك
        request.post('login', { email: email, password: password }).then((res) => {
            setFormError("");
            setToken(res.data.user, res.data.token);
        }
        ).catch(function (error) {
            console.log(error);
            //في حال كان السيرفر متوقف
            if (error.code == "ERR_NETWORK")
                setFormError(error.message);
            else
            setFormError("error in email or password")
            setIsSubmitting(false);

        })
        //-----------------------
    };

    return (
        
        <div className="login-container d-flex align-items-center justify-content-center">
  <div className="contact-wrapper w-100">
    <div className="login-card shadow-lg p-5 mx-auto">
      <div className="text-center mb-4">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtext">Please login to your account</p>
      </div>

      <form>
        <div className="mb-4">
          <input
            type="email"
            className={`form-control login-input ${emailError ? 'is-invalid' : ''}`}
            placeholder="Email"
            value={email}
            onChange={handleChange}
            name="email"
            required
          />
          {emailError && <div className="invalid-feedback">{emailError}</div>}
        </div>

        <div className="mb-4">
          <input
            type="password"
            className={`form-control login-input ${passwordError ? 'is-invalid' : ''}`}
            placeholder="Password"
            value={password}
            onChange={handleChange}
            name="password"
            required
          />
          {passwordError && <div className="invalid-feedback">{passwordError}</div>}
        </div>

        <div className="d-grid mb-3">
          <button
            type="button"
            className="btn login-btn"
            onClick={submitForm}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </div>

        {formError && <div className="text-danger text-center">{formError}</div>}
      </form>
    </div>
  </div>
</div>

      
    );
}
