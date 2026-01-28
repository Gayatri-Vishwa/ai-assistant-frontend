
import { useRef } from 'react'
import { useContext } from 'react'
import { userDataContext } from '../context/userContext'
import { IoMdArrowRoundBack } from "react-icons/io";
import Card from '../component/Card'
import image1 from '../assets/image1.png'
import image2 from '../assets/image2.jpg'
import image3 from '../assets/authBg.png'
import image4 from '../assets/image4.png'
import image5 from '../assets/image5.png'
import image6 from '../assets/image6.jpeg'
import image7 from '../assets/image7.jpeg'
import { RiImageAiFill } from "react-icons/ri";
import { useNavigate } from 'react-router-dom'


function Customize() {


  const navigate= useNavigate()
const inputImage = useRef();
  const {
      setBackendImage,
      frontendImage, 
      selectedImage, 
    setSelectedImage,
   
      setFrontendImage}=useContext(userDataContext)


 const handleChange=(e)=>{
    const file=e.target.files[0];
    // const reader=new FileReader();
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));  // file is obj ,url convert it inti url
    setSelectedImage(URL.createObjectURL(file));
    console.log(file);
 }


  return (
    
    <div 
     className="w-full min-h-screen bg-gradient-to-t from-black to-[#030368] flex flex-col justify-center items-center py-10 px-4">
      
       <IoMdArrowRoundBack  onClick={()=>navigate('/')}
             className="absolute top-[10px] left-[30px] cursor-pointer text-white  w-[30px] h-[30px]"/>
      <h1 className='text-white text-4xl text-center mb-22'>Select Your  <span className='text-blue-400'> Assistant Image</span></h1>

      {/* Flex container */}
      <div className="w-[95%] max-w-[1000px]  flex flex-wrap justify-center gap-7">
        <Card onClick={()=>setSelectedImage(image1)} image={image1} />
        <Card  onClick={()=>setSelectedImage(image2)} image={image2} />
        <Card  onClick={()=>setSelectedImage(image3)} image={image3} />
        <Card  onClick={()=>setSelectedImage(image4)} image={image4} />
        <Card  onClick={()=>setSelectedImage(image5)} image={image5} />
        <Card  onClick={()=>setSelectedImage(image6)} image={image6} />
        <Card  onClick={()=>setSelectedImage(image7)} image={image7} />


        {/* Extra Add Card */}
        <div onClick={()=>(
          setSelectedImage("input"),
          inputImage.current.click())}
         className={ ` ${selectedImage==="input" ? "border-4 border-white shadow-2xl  shadow-blue-950 " : "null"} w-[80px] h-[160px]  lg:w-[150px] lg:h-[250px] bg-[#0b0b2c] border-2 border-[#3f3fc4] rounded-2xl overflow-hidden cursor-pointer hover:scale-105 hover:shadow-blue-950 hover:border-4 hover:border-white transition-all duration-300 flex justify-center items-center `}>
         {!frontendImage ? <RiImageAiFill className='text-white w-[50px] h-[50px]'/> : <img src={frontendImage} alt="custom img" className='h-full object-cover' />   }
        </div>     
      <input type="file"  accept='image/* ' hidden ref={inputImage}
      onChange={handleChange}/>


      { selectedImage &&
              <button onClick={()=>navigate('/customize2')}
              className='sm:min-w-[150px] w-[90px] h-[60px] mt-auto  text-white bg-black rounded-full text-[17px] font-semibold mt-[25px] cursor-pointer'
                 style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
              >
          Next </button>}
      </div>


            {/* { selectedImage &&
              <button onClick={()=>navigate('/customize2')}
              className='min-w-[150px] h-[60px]   text-white bg-black rounded-full text-[17px] font-semibold mt-[25px] cursor-pointer'
                 style={{
                background: "linear-gradient(90deg, #1b2a4b, #0f1a33)", // dark bluish gradient
                boxShadow:
                  "0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 20px #3b82f6", // subtle blue glow
              }}
              >
          Next </button>} */}

    </div>
  )
}

export default Customize
