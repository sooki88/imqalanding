import Image from "next/image";
import Magnet from './Magnet';

export default function Header () {
    return(
        <header className="flex justify-between items-center px-10 h-16 fixed top-0 right-0 left-0 z-1">
            <Image
                // className="dark:invert"
                src="/imqa_logo_wht.svg"
                alt="IMQA logo"
                width={94}
                height={23}
                priority
            />
            <Magnet padding={50} disabled={false} magnetStrength={10}>
                <p className="rounded-sm border-[0.5px] border-white px-4 pt-2 pb-[7px] text-white text-sm font-medium leading-[1.5] backdrop-blur-[15px] hover:bg-white/10 duration-300">문의하기</p>
            </Magnet>
        </header>
    )
}