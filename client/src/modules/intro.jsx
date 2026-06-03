// • React
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// • TailwindCSS
import '../tailwind-setup.css';

// • Assets
import downArrowImg from '../assets/frontpage/down-arrow.png';
import upArrowImg from '../assets/frontpage/up-arrow.png';
import logo from '../../public/assets/frontpage/logo.png';

export default function IntroPage() {
    const [isPage, setIsPage] = useState(0);
    let navigate = useNavigate();

    // • Flèches directionnelles
    const handleDownArrowClick = () => {
        setIsPage(1);
    };

    const handleUpArrowClick = () => {
        setIsPage(0);
    };

    // • Redirections

    const handleOnBoardingClick = () => {
        navigate('/onboarding');
    }

    const handledashboardLayout = () => {
        navigate('/dashboard');
    }

    return (
        <div className="relative w-screen h-screen overflow-hidden font-[verdana] text-white bg-[url(../../public/assets/frontpage/background.jpg)] bg-center bg-cover">
            <div id="firstContent" className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-all duration-700 ease-in-out ${isPage === 0 ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}>
                <img className="w-[600px] h-[500px] pb-[40px]" src={logo} alt="logo du site" />
                <p className='text-[18px] text-cyan-300'>Garance Willemin, Lawrence Haesler & Yael Favre</p>
                <img onClick={handleDownArrowClick} className="absolute w-[150px] h-[120px] bottom-0 opacity-20 cursor-pointer scale-[1.0] transition-all duration-300 ease-in-out hover:opacity-30 hover:scale-[1.1]" src={downArrowImg} alt="flèche vers le bas" />
            </div>
            <div id="secondContent" className={`absolute inset-0 flex flex-col items-center justify-center w-full h-[100%]  scale-[1.0] transition-all duration-700 ease-in-out ${isPage === 0 ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}  >
                <div className='flex flex-col items-center justify-center h-[20%]'>
                    <img onClick={handleUpArrowClick} className="absolute w-[150px] h-[120px] top-0 opacity-20 cursor-pointer scale-[1.0] transition-all duration-300 ease-in-out hover:opacity-30 hover:scale-[1.1]" src={upArrowImg} alt="flèche vers le haut" />
                </div>
                <div className='w-[60%] h-auto min-h-[50%] flex flex-col items-center justify-center rounded-[20px] bg-[#161930]/30 text-justify px-[40px] py-[60px] md:px-[100px]'>
                    <p className="leading-relaxed">
                        Programme créé dans le cadre de la découverte de l'art digital.
                        Venez découvrir avec nous l'intrépide immersion au sein de notre univers.
                        Ici il n'y a que l'imagination qui compte.
                        Faites preuve de prudence, bienvenue dans la spamalaxie.
                    </p>
                </div>
                <div className='h-[20%] flex flex-col items-center justify-center gap-5'>
                    <h2 onClick={handleOnBoardingClick} className='text-cyan-300 text-2xl opacity-[70%] scale-[1.0] cursor-pointer hover:opacity-[100%] transition-scale duration-250 ease-in-out  hover:scale-[1.1]  '>
                        Dicactitiel
                    </h2>
                    <h3 onClick={handledashboardLayout} className='text-gray-400 text-xs scale-[1.0] cursor-pointer transition-scale duration-250 ease-in-out  hover:scale-[1.1] '>
                        Passer
                    </h3>
                </div>
            </div>
        </div>
    );
}