// eslint-disable-next-line react/prop-types
const Testimonial = ({ review, profile, name, info, rating }) => {
  return (
    <div
      className='jos flex flex-col gap-y-8 rounded-[10px] border-[1px] border-colorCodGray p-[30px] text-white'
      data-jos_animation='fade-left'
      data-jos_delay='0.1'
    >
      <div className='block'>
        <img src={rating} alt='rating' width={146} height={25} />
      </div>
      <p>{review}</p>
      <div className='flex items-center gap-x-4'>
        <div className='h-[60px] w-[60px] overflow-hidden rounded-full'>
          <img
            src={profile}
            alt='testimonial-img'
            width={60}
            height={60}
            className='h-full w-full object-cover object-center'
          />
        </div>
        <div className='flex flex-col gap-y-1'>
          <span className='block text-lg font-semibold leading-[1.6]'>
            {name}
          </span>
          <span className='block text-sm font-light leading-[1.4]'>{info}</span>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
