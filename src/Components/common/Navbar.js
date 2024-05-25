import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, matchPath, useLocation } from 'react-router-dom'
import logo from '../../assets/Logo/Logo-Full-Dark.png'
import {NavbarLinks} from "../../data/navbar-links"
import {AiOutlineShoppingCart} from "react-icons/ai"
import { IoIosArrowDropdownCircle } from "react-icons/io";
import { apiConnector } from '../../services/apiconnector'
import { categories } from '../../services/apis'
import { useState } from 'react'

const Navbar = () => {

    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const {totalItems} = useSelector((state)=> state.cart);
    const location = useLocation();

    // SUbLinks of Catalog
    const [subLinks, setSubLinks] = useState([]);
    const [loading,setLoading] = useState(false);

    //Function to fetch sublinks of catalog
    const fetchSubLinks = async () => {
        setLoading(true);
        try{
            const result = await apiConnector("GET",categories.CATEGORIES_API);
            console.log("Result of Catalog Sublinks: ", result.data.allCategory);
            setSubLinks(result.data.allCategory);
        }catch(err){
            console.log("Error while fetching the sublinks of catalog", err);
        }
        setLoading(false);
    }

    useEffect(()=> {
        fetchSubLinks();
    },[])


    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname)
    }
  return (
    <div className='relative w-screen '>
        <div className='fixed md:top-0 md:bottom-0 md:left-0 md:right-0 z-10 flex bg-[#0289a1] md:rounded-b-lg h-14 '>
        <div className='md:w-11/12 flex md:flex-row items-center justify-center md:mx-auto'>
            <nav className='md:w-10/12 flex lg:gap-x-10'>
                <div className='w-full flex flex-row items-center  justify-evenly'>
                    <div className='flex md:w-1/3 '><Link to='/'><img src={logo} width={160} ></img></Link></div>
                    <div className='md:w-1/3 flex flex-row justify-evenly '>
                        {
                            NavbarLinks.map((ele,index)=> {
                                return ele.title === "Catalog" ? (<div key={index}
                                className='relative flex flex-row items-center gap-1 group'>
                                    <Link >
                                        {ele.title}
                                    </Link>
                                    <IoIosArrowDropdownCircle />
                                    <div className='invisible opacity-0 absolute w-[20vw] group-active:visible group-focus:visible  bg-richblack-25
                                    translate-x-[-60%] translate-y-[25px]
                                    top-[50%] left-[50%] z-5 rounded group-hover:visible hover:visible py-[10px] px-[20px]  group-hover:opacity-100 '>
                                        <div className='absolute z-[-1] h-8 w-6 top-0 translate-y-[-35%] translate-x-[45px] left-[50%] bg-richblack-25 rotate-45
                                        rounded'>
                                        </div>
                                        <div className='h-full w-full hover:visible text-lg'>
                                        {
                                            loading? (<div>
                                                <p className='text-richblack-900 my-3 py-[10px] px-[8px] bg-richblack-100 rounded '></p>
                                            </div>):(subLinks.length > 0 ? (subLinks.map((link,index)=> {
                                                return <Link key={index} to={`/category/${link.name.split(" ").join("")}`} ><p className='text-richblack-900 my-3 py-[10px] px-[8px] hover:bg-richblack-100 hover:rounded'>{link.name}</p></Link>
                                            })):(<div>No Categories</div>))
                                        }
                                        </div>
                                    </div>
                                    </div>):(
                                    <div  key={index}  >
                                        <Link to={ele?.path} className={` ${matchRoute(ele?.path)? "text-richblack-900 font-bold border-b-[4px] ":"text-richblack-800"} `}>{ele.title}</Link>
                                    </div>
                                )
                            })   
                        }
                    </div>
                    <div className='w-1/3 flex flex-row  justify-end gap-x-4'>
                        {
                            token === null && <button className=' border-richblack-900 rounded-sm'>
                                <Link to='/login' className={` ${matchRoute('login')? " text-richblue-100 bg-richblue-700 font-bold px-[6px] py-[4px] rounded-lg":"border-2 rounded-md text-richblack-800 py-[3px] px-[5px] "} `}>Log in</Link>
                            </button>
                        }
                        {
                            token === null && <button>
                                <Link to='/signup' className={` ${matchRoute('signup')? "text-richblue-100 bg-richblue-700 font-bold px-[6px] py-[4px] rounded-lg ":"border-2 rounded-md text-richblack-800 py-[3px] px-[5px]"} `}>Sign up</Link>
                            </button>
                        }
                        {
                            user && user?.accountType !== "Instructor" && <div>
                                <AiOutlineShoppingCart />
                                {
                                    totalItems > 0 && <span>
                                        {totalItems}
                                    </span>
                                }
                            </div>
                        }
                    </div>
                </div>
            </nav>
        </div>
    </div>
    </div>
  )
}

export default Navbar