export default function Chips({ color, label }) {
  return (<div className='flex items-center justify-center flex-row gap-[10px]'>
    <div style={{ backgroundColor: color }} className={`bg-[${color}] text-white font-sans text-[14px] font-bold w-[18px] h-[18px] rounded-full flex justify-center items-center`}></div>
    <label className='text-[30px]'>{label}</label>
  </div>)
}