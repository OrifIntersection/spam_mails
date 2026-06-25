export default function button({width, height ,color, textcolor, label}) {
    return (<>
        <div className={`flex items-center justify-center flex-col flex-nowrap w-[${width}] h-[${height}] text-[${textcolor}] bg-[${color}] border border-[#34e5eb]`}>
            {label}
        </div>
    </>);
}