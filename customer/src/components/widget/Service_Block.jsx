import Link from 'next/link';

// eslint-disable-next-line react/prop-types
const Service_Block = ({ icon_black, icon_orange, title, text, link }) => {
  return (
    <li className='group bg-white p-[30px] transition-all duration-300 ease-in-out hover:bg-black'>
      {/* <div className='relative mb-9 h-[70px] w-[70px]'>
        <img
          src={icon_black}
          alt='service-icon-black-1'
          width={70}
          height={70}
        />
        <img
          src={icon_orange}
          alt='service-icon-orange-1'
          width={70}
          height={70}
          className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
        />
      </div> */}
      <h3 className='mb-4 block text-xl leading-tight -tracking-[0.5px] group-hover:text-white xl:text-2xl xxl:text-[28px]'>
        <Link href={link} className='hover:text-rxtGreen'>
          {title}
        </Link>
      </h3>
      <p className='mb-12 duration-300 group-hover:text-white'>{text}</p>
      <Link
        href={link}
        className='relative inline-block h-[30px] w-[30px] duration-300'
      >
        {/* <img
          src='assets/img/th-1/arrow-right-black.svg'
          alt='arrow-right-black'
          width={30}
          height={30}
        /> */}
        {/* <img
          src='assets/img/th-1/arrow-right-orange.svg'
          alt='arrow-right-black'
          width={30}
          height={30}
          className='absolute left-0 top-0 h-full w-full opacity-0 transition-all duration-300 ease-linear group-hover:opacity-100'
        /> */}
      </Link>
    </li>
  );
};

export default Service_Block;
