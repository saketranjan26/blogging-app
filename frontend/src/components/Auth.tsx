import { SignupInput } from "@saketranjan/commonblog-app";
import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth = ({type}: {type: "signup" | "signin"}) => {
    const navigate = useNavigate();
    const [postInputs,setPostInputs] = useState<SignupInput>({
        name:"" || "Anonymous",
        username:"",
        password:""
    });

    async function sendRequest(){
        try{
        const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type==="signin"?"signin":"signup"}`,postInputs)
        const jwt = response.data.jwt;
        localStorage.setItem("token",jwt)
        navigate("/blogs");
        }catch(e){
            alert("error while signing up")
        }
    }

  return (
    <div className=" h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
            <div className=" pb-6 px-9 ">
                <div className="font-bold text-4xl">
                {type==="signup"? "Create an account" :"Login to your account"}
                </div>
                <div className="text-slate-500 text-center">
                    {type==="signup"? "Already have an account?" :"Don't have an account"}
                    <Link className="underline pl-3"to={type==="signin" ? "/Signup" : "/Signin"}>
                        {type==="signin" ? "Sign up" : "Signin"}
                    </Link>
                </div> 
            </div>     
        <div className="">
          {type==="signup" ? <LabelledInput label="Username" placeholder="Saket" onChange={(e) => {
                setPostInputs({
                    ...postInputs,
                    name:e.target.value
                })
            }}/>:null}
            <LabelledInput label="Email" placeholder="saket@gmail.com" onChange={(e) => {
                setPostInputs({
                    ...postInputs,
                    username:e.target.value
                })
            }}/>
            <LabelledInput label="Password" type="password" placeholder="" onChange={(e) => {
                setPostInputs({
                    ...postInputs,
                    password:e.target.value
                })
            }}/>
            <button onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 
            focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2
             mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                {type === "signup" ? "Sign up" : "Sign in"}</button>
        </div>  
        </div>
      </div>     
    </div>
  );
};

interface LabelledInputType{
    label:string,
    placeholder:string,
    onChange: (e: ChangeEvent<HTMLInputElement>) => void,
    type?: string
}
function LabelledInput ({label,  placeholder, onChange, type}:LabelledInputType){
    return <div>
    <label className="block mt-5 text-semibold font-medium">{label}</label>
    <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-slate-500
     focus:border-slate-500 block w-full p-2.5 mt-1"
   placeholder={placeholder} required />
</div>

}
