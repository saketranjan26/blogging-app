import { Link } from "react-router-dom";

interface BlogCardProps {
  name: string;
  title: string;
  content: string;
  publishedDate: string;
  id?: number
}

export const BlogCard = ({
  name,
  title,
  content,
  publishedDate,
  id
}: BlogCardProps) => {
  return (
        <div><Link to={`/blog/${id}`}>
            <div className="my-7 cursor-pointer">
                <div className="flex ">
                    <div>
                        <Avatar name={name}/>
                    </div>
                    <div className=" flex justify-center flex-col font-medium  text-slate-800 px-2 ">
                        {name}
                    </div>
                    <div className="flex justify-center flex-col  pr-2">
                        <Circle/>
                    </div>
                    <div className="font-medium text-slate-500 flex justify-center flex-col ">
                        {publishedDate}
                    </div>    
                </div>
                <div className=" font-extrabold text-2xl py-2">
                    {title}
                </div>
                <div className=" text-slate-800 ">
                    {content.slice(0, 100) + "..."}
                </div>
                <div className="text-slate-500 pt-5">
                    {`${Math.ceil(content.length / 500)} min read`}
                </div>
                <hr className="h-px my-9 bg-gray-200 border-0"></hr>
            </div>
            </Link>
        </div>
  );
};

export function Avatar ({name,size=6}:{name:string, size?:number}){
    return(
        <div className={` cursor-pointer relative inline-flex items-center justify-center w-${size} h-${size} overflow-hidden bg-gray-400 rounded-full`}>
            <span className="font-medium text text-gray-800">{extractInitials(name)}</span>
        </div>

    )
}

function extractInitials(name: string): string {
    const initials = name.split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');
    return initials;
}

function Circle (){
    return (
        <div className=" h-1 w-1 rounded-full bg-slate-500">

        </div>
    )
}