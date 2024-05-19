import { Link } from "react-router-dom"
import { Avatar } from "./BlogCard"

export const Appbar = ({name}:{name:string}) =>{
    return (
        <div className="flex justify-between border-b py-2">
            <div className="  px-7  cursor-pointer">
                <Link to={'/blogs'}>
                    <div className="pt-1.5 text-xl">
                        Medium
                    </div>
                </Link>
            </div>
            <div className="px-7 ">
                <Link to = {"/publish"}>
                    <button type="button" className="mr-4  text-white bg-green-700 hover:bg-green-800 
                        focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm 
                        px-7 py-2.5 text-center me-2  ">New
                    </button>
                </Link>
                    <Avatar name={name || "A"} size={7}/>
            </div>      
        </div>
        
    )
}