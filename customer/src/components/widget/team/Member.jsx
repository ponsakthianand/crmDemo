import Link from 'next/link';

import Team_Social from './Member_Social';

// eslint-disable-next-line react/prop-types
const Member = ({
  img,
  name,
  info,
  facebook,
  twitter,
  linkedin,
  instagram,
}) => {
  return (
    <li
      className='jos rounded-[20px] bg-colorLinenRuffle p-[20px]'
      data-jos_animation='flip'
      data-jos_delay='0.1'
    >
      <div className='xl:h[300px] w-full overflow-hidden rounded-[20px] xxl:h-[400px]'>
        <img
          src={img}
          alt='team-member-img-1'
          width={376}
          height={400}
          className='h-full w-full object-cover'
        />
      </div>
      <div className='mt-5'>
        <Link
          href='/team-details'
          className='font-dmSans text-[26px] leading-[1.33] hover:text-rxtGreen xxl:text-[30px]'
        >
          {name}
        </Link>
        <div className='mt-3 flex flex-col justify-between gap-3 xxl:flex-row xxl:flex-wrap xxl:items-center'>
          <span className='text-[21px]'>{info}</span>
          {
            <Team_Social
              facebook={facebook}
              twitter={twitter}
              linkedin={linkedin}
              instagram={instagram}
            />
          }
        </div>
      </div>
    </li>
  );
};

export default Member;
