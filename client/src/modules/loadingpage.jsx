// • React
import { useEffect, useState, useRef } from "react";

// • Assets
import background from '../assets/loadingpage/spaceshipbackground.mp4'

const layers = [
    {
        bg: "#67e8f9",
        clip: "polygon(50% 0%, 62% 33%, 38% 33%)",
        z: 1,
    },
    {
        bg: "#22d3ee",
        clip: "polygon(38% 33%, 62% 33%, 71% 55%, 29% 55%)",
        z: 2,
    },
    {
        bg: "#06b6d4",
        clip: "polygon(29% 55%, 71% 55%, 80% 77%, 20% 77%)",
        z: 3,
    },
    {
        bg: "#14b8a6",
        clip: "polygon(20% 77%, 80% 77%, 90% 100%, 10% 100%)",
        z: 4,
    },
];

export default function LoadingPage({content, bg}) {
    const [step, setStep] = useState(0);
    const videoRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setStep((prev) => (prev < 4 ? prev + 1 : 0));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 7;
        }
    };

    return (<>
        <video ref={videoRef} autoPlay muted loop onLoadedMetadata={handleLoadedMetadata} className="absolute z-[-1] object-cover w-full h-full">
            <source src={background} type="video/mp4" />
        </video>

        <div className="flex flex-col items-center justify-center h-screen bg-none overflow-hidden ">
            <h1 className="pb-[100px] text-cyan-300 text-2xl">{content}</h1>

            <div className="relative w-[110px] h-[160px]">
                {layers.map((layer, i) => {
                    const visible = step >= i + 1;
                    return (
                        <div
                            key={i}
                            className="absolute left-0 top-0 w-[110px] h-[95px] transition-all duration-300 ease-in-out"
                            style={{
                                background: layer.bg,
                                clipPath: layer.clip,
                                zIndex: layer.z,
                                opacity: visible ? 1 : 0,
                                transform: visible
                                    ? `translateY(${i * 8}px) scale(1)`
                                    : `translateY(${i * 8 + 12}px) scale(0.98)`,
                                filter: visible ? "brightness(1.3)" : "brightness(0.8)",
                            }}
                        />
                    );
                })}

                <h1 className="absolute top-[200px] left-1/2 -translate-x-1/2 text-cyan-300 text-base tracking-widest whitespace-nowrap">
                    Loading...
                </h1>
            </div>
        </div>
    </>);
}