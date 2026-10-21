import Image from "next/image";

type Props = {
  title: string;
};

export const Header = ({ title }: Props) => {
  return (
    <div className="sticky top-0 bg-white pb-3 lg:pt-[28px] lg:mt-[-28px] flex items-center justify-between border-b-2 mb-5 text-neutral-400 lg:z-50">
      <div className="flex items-center gap-x-2">
        <Image 
          src="/hr.svg" 
          height={24} 
          width={32} 
          alt="Hrvatska" 
          className="rounded border shadow-sm" 
        />
        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Hrvatski
        </span>
      </div>
      <h1 className="font-bold text-lg text-neutral-700">
        {title}
      </h1>
      <div className="w-8" />
    </div>
  );
};
