import {useState}from 'react'
import authBg from '../assets/authBg.png'
import { IoEye } from "react-icons/io5";
import { IoMdEyeOff } from "react-icons/io";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { userDataContext } from '../context/userContext';
import axios from 'axios';

function SignUp() {

const [showPassword, setShowPassword] = useState(false);
 const [name, setName] = useState("");
 const {serverUrl ,setUserData}=useContext(userDataContext)   
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState('')
 const[loading,setloading]=useState(false)
 const [error,seterror]=useState("")
const navigate=useNavigate()

 const handleSignup=async(e)=>{
    try {
      setloading(true)
          e.preventDefault();
          console.log("Server URL:", serverUrl);
          seterror("")
          let result=await axios.post(`${serverUrl}/api/auth/signup`,{
            name,
            email,  
            password
          },{withCredentials:true});

          if(result.status===201){
            navigate('/customize')
          }
        result.data && console.log("Signup successful");
        setUserData(result.data);
        console.log("Signup response:", result.data);
        setloading(false)
    } catch (error) {
      seterror(error.response?.data?.message || "Something went wrong");
      setloading(false)
      setUserData(null);
        // seterror(error.response.data.message)
    }
 }  

  return (
    <div className='w-full h-[100vh] bg-cover flex justify-center items-center' style={{backgroundImage:`url(${authBg})`}}>
     
     <form onSubmit={handleSignup} className='w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop:blur-2xl mb-[30px] shadow-lg shadow-black rounded-lg flex flex-col justify-center items-center gap-8 p-4'>

    <h1 className='text-white text-[30px] font-semibold mb-5' >Register to <span className='text-blue-400'>Virtual Assistant</span> </h1>
    <input type="text"  onChange={(e)=>setName(e.target.value)} value={name}
    placeholder='Enter your name' required  className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px] px-[20px] py-[10px] ' />
    <input type="email"  onChange={(e)=>setEmail(e.target.value)} value={email} required
     placeholder='email' className='w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 rounded-full text-[18px] px-[20px] py-[10px]'  />
    <div className='w-full h-[60px]  relative flex  outline-none border-2 border-white bg-transparent rounded-full text-white'>
    <input  onChange={(e)=>setPassword(e.target.value)} value={password} type={showPassword?"text":"password"} required
     placeholder='password' className='w-full h-[60px] outline-none  text-white placeholder-gray-300  text-[18px] px-[20px] py-[10px]' />
   {showPassword ? <IoEye className='absolute top-[17px] right-5 text-white   w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(false)}/>
   :
    <IoMdEyeOff className='absolute top-[17px] right-5 text-white   w-[25px] h-[25px] cursor-pointer' onClick={()=>setShowPassword(true)}/>
   }
    </div>
    {error.length>0 && <p className='text-red-500 text-lg'>{error}</p>}
    <button  disabled={loading}
    className='min-w-[150px] h-[60px] bg-white text-black rounded-full text-[17px] font-semibold mt-[20px] cursor-pointer'>
      {loading?"Loading":"Sign Up"}
    </button>
    <p     onClick={()=>navigate('/signin')}
     className='text-white text-[20px] cursor-pointer'>Already have an Account <span className='text-blue-400'>Sign In</span> </p>
     </form>
    </div>
  )
}

export default SignUp
