import { useState } from 'react';
import '../tailwind-setup.css';
import downArrowImg from '../assets/frontpage/down-arrow.png';
import upArrowImg from '../assets/frontpage/up-arrow.png';

export default function FrontPage() {
    const [isPage, setIsPage] = useState(0);

    const handleDownArrowClick = () => {
        setIsPage(1);
    };

    const handleUpArrowClick = () => {
        setIsPage(0);
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden font-[verdana] text-white bg-[url(../../public/assets/frontpage/background.jpg)] bg-center bg-cover">
            <div id="firstContent"  className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-all duration-700 ease-in-out ${isPage === 0 ? 'translate-y-0 opacity-100'   : '-translate-y-full opacity-0 pointer-events-none'  }`}>
                <img className="w-[600px] h-[500px] pb-[40px]" src="../../public/assets/frontpage/logo.png" alt="logo du site" />
                <p className='text-[18px] text-cyan-300'>Garance Willemin, Lawrence Haesler & Yael Favre</p>
                <img onClick={handleDownArrowClick} className="absolute w-[150px] h-[120px] bottom-0 opacity-20 cursor-pointer transition-opacity duration-300 hover:opacity-50" src={downArrowImg} alt="flèche vers le bas" />
            </div>
            <div id="secondContent"  className={`absolute inset-0 flex flex-col items-center justify-center w-full h-full transition-all duration-700 ease-in-out ${isPage === 0 ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}  >
                <img onClick={handleUpArrowClick} className="absolute w-[150px] h-[120px] top-0 opacity-20 cursor-pointer transition-opacity duration-300 hover:opacity-50" src={upArrowImg} alt="flèche vers le haut" />
                <div className='flex flex-col items-center justify-center rounded-[20px] bg-[#161930]/30 w-[60%] text-justify px-[40px] py-[60px] md:px-[100px]'>
                    <p className="leading-relaxed">
                        Programme créé dans le cadre de la découverte de l'art digital.
                        Venez découvrir avec nous l'intrépide immersion au sein de notre univers.
                        Ici il n'y a que l'imagination qui compte.
                        Faites preuve de prudence, bienvenue dans la spamalaxie.
                    </p>
                </div>
            </div>
        </div>
    );
}