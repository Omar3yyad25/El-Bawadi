import {message} from 'antd';
import { useRouter } from "next/router";
import Cookies from 'js-cookie'; // Import js-cookie
import login from '../../utils/login'; // Import the login function
const LoginForm = () => {
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault(); 
  
    const username = event.target.username.value.replace(/\s/g, '');
    //remove any spaces in username

    const password = event.target.password.value;
  
    const loginRes = await login({ username, password });
    if (loginRes) {
      Cookies.set('token', loginRes.authStore.token); // Set the token in a cookie
      Cookies.set('role', loginRes.authStore.model.role)
      
      message.success("Logged in");
      if (loginRes.authStore.model.role =="planner"){
        router.push("/dashboard");
      } // Redirect to the home page
      else if(loginRes.authStore.model.role =="operator"){
        router.push("/dashboard-operator");
      }
      else{
        router.push("/404")
      }

    } else {
      message.error('Invalid username or password');
    }
  };
  
  return (
    <form className="row y-gap-20" onSubmit={handleLogin}>
      <div className="col-12">
        <h1 className="text-22 fw-500">Welcome back</h1>
        
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input ">
          <input type="text" name="username" required />
          <label className="lh-1 text-14 text-light-1">Username</label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-12">
        <div className="form-input ">
          <input type="password" name="password" required />
          <label className="lh-1 text-14 text-light-1">Password</label>
        </div>
      </div>
      {/* End .col */}

      

      <div className="col-12">
        <button
          type="submit"
          href="#"
          className="button py-20 -dark-1 bg-blue-1 text-white w-100"
        >
          Sign In <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
      {/* End .col */}
    </form>
  );
};

export default LoginForm;
