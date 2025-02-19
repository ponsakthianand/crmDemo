import Link from 'next/link';

// eslint-disable-next-line react/prop-types
const Member_Social = ({ facebook, twitter, linkedin, instagram }) => {
  return (
    <ul className='mt-auto flex gap-x-[15px]'>
      <li>
        <Link
          rel='noopener noreferrer'
          to={facebook}
          className='group relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-black hover:bg-rxtGreen'
        >
          <img
            src='assets/img/th-1/facebook-icon-white.svg'
            alt='facebook'
            width={14}
            height={14}
            className='opacity-100 group-hover:opacity-0'
          />
          <img
            src='assets/img/th-1/facebook-icon-black.svg'
            alt='facebook'
            width={14}
            height={14}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100'
          />
        </Link>
      </li>
      <li>
        <Link
          rel='noopener noreferrer'
          to={twitter}
          className='group relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-black hover:bg-rxtGreen'
        >
          <img
            src='assets/img/th-1/twitter-icon-white.svg'
            alt='twitter'
            width={14}
            height={14}
            className='opacity-100 group-hover:opacity-0'
          />
          <img
            src='assets/img/th-1/twitter-icon-black.svg'
            alt='twitter'
            width={14}
            height={14}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100'
          />
        </Link>
      </li>
      <li>
        <Link
          rel='noopener noreferrer'
          to={linkedin}
          className='group relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-black hover:bg-rxtGreen'
        >
          <img
            src='assets/img/th-1/linkedin-icon-white.svg'
            alt='linkedin'
            width={14}
            height={14}
            className='opacity-100 group-hover:opacity-0'
          />
          <img
            src='assets/img/th-1/linkedin-icon-black.svg'
            alt='linkedin'
            width={14}
            height={14}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100'
          />
        </Link>
      </li>
      <li>
        <Link
          rel='noopener noreferrer'
          to={instagram}
          className='group relative flex h-[30px] w-[30px] items-center justify-center rounded-[50%] bg-black hover:bg-rxtGreen'
        >
          <img
            src='assets/img/th-1/instagram-icon-white.svg'
            alt='instagram'
            width={14}
            height={14}
            className='opacity-100 group-hover:opacity-0'
          />
          <img
            src='assets/img/th-1/instagram-icon-black.svg'
            alt='instagram'
            width={14}
            height={14}
            className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100'
          />
        </Link>
      </li>
    </ul>
  );
};

export default Member_Social;
