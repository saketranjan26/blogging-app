
import { Appbar } from "../components/Appbar"
import { BlogCard } from "../components/BlogCard"
import { Spinner } from "../components/Spinner";
import { useBlogs} from "../hooks";


export const Blogs = () => {
    const {loading,blogs} = useBlogs();
    

    if(loading){
        return <div>
            <div>
                <Appbar name="A" />
            </div>
            <div className="h-screen flex flex-col justify-center">               
                <div className="flex justify-center">
                    <Spinner/>
                </div>
            </div>
        </div>
    }
    return (
        <div >
            <div>
                <Appbar name="A" />
            </div>
            <div className=" mx-7 ">
                <div className="flex justify-center">
                    <div className="flex-col">
                        {blogs.map(blog =>
                         <BlogCard  name={blog.author || "Anonymous"}
                            title={blog.title}
                            publishedDate="12.12.12"
                            content={blog.content} id={blog.id} ></BlogCard>
                    )} 
                    </div>                 
                </div>
            </div>
        </div>
    
    
    
    
)}


