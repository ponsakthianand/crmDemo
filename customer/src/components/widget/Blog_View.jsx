import Link from 'next/link';

// eslint-disable-next-line react/prop-types
const Blog_View = ({ img, category, date, title, dec }) => {
  return (
    <li className='jos group overflow-hidden rounded-[10px] bg-white shadow-[0_4px_80px_rgba(0,0,0,0.08)]'>
      <Link href='/blog-details' className='block overflow-hidden'>
        <img
          src={img}
          alt='blog-main-1'
          width={856}
          height={540}
          className='h-auto w-full scale-100 object-cover transition-all duration-300 group-hover:scale-105'
        />
      </Link>
      <div className='border border-[#EAEDF0] p-[30px]'>
        {/* Blog Post Meta */}
        <ul className='flex flex-wrap items-center gap-6'>
          <li className='relative font-semibold after:absolute after:left-full after:top-1/2 after:h-[7px] after:w-[7px] after:-translate-y-1/2 after:translate-x-2 after:rounded-full after:bg-colorCodGray last:after:hidden'>
            <Link href='/blog-details' className='hover:text-rxtGreen'>
              {category}
            </Link>
          </li>
          <li className='relative font-semibold after:absolute after:left-full after:top-1/2 after:h-[7px] after:w-[7px] after:-translate-y-1/2 after:translate-x-2 after:rounded-full after:bg-colorCodGray last:after:hidden'>
            <Link href='/blog-details' className='hover:text-rxtGreen'>
              {date}
            </Link>
          </li>
        </ul>
        {/* Blog Post Meta */}
        <h5 className='mb-3 mt-7 hover:text-rxtGreen'>
          <Link href='/blog-details'>{title}</Link>
        </h5>
        <p className='mb-7 line-clamp-2 last:mb-0'>{dec}</p>
        <Link
          href='/blog-details'
          className='text-rxtGreen hover:text-rxtGreen'
        >
          Read More
        </Link>
      </div>
    </li>
  );
};

export default Blog_View;
