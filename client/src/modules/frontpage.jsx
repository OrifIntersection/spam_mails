import '../tailwind-setup.css';

export default function FrontPage() {
    return (
        <div className="font-sans gap-[30px] text-white w-screen h-screen flex flex-col flex-wrap items-center justify-center bg-[url(../../public/assets/frontpage/background.jpg)] bg-center bg-cover">
            <img className="w-[20%] h-[32%]" src="../../public/assets/frontpage/logo.png" alt="logo du site" />
            <p>Réalisé par : Garance Willemin, Lawrence Haesler & Yael Favre</p>
            <p>...</p>
        </div>);
}