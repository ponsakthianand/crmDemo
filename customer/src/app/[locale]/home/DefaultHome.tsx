import Hero from '../../components/sections/Hero';
import Service from '../../components/sections/service/Service';
import Content_01 from '../../components/sections/Content_01';
import Content_02 from '../../components/sections/Content_02';
import FunFact from '../../components/sections/FunFact';
import Pricing from '../../components/sections/Pricing';
import MasonryCards from '../../components/sections/service/ServiceMandasory';

const DefaultHome = () => {
  return (
    <main className='main-wrapper relative overflow-hidden'>
      <Hero />
      <div className='py-12 px-8 mx-auto lg:py-16 lg:px-12'>
        <MasonryCards />
        {/* <Service /> */}
        <Content_01 />
        <Content_02 />
      </div>
      {/* <FunFact /> */}

      {/* Body Background Shape 1 */}
      {/* <div className='orange-gradient-1 absolute -left-[15px] top-[61%] -z-[1] h-[400px] w-[400px] -rotate-[-9.022deg] rounded-[400px]'></div> */}

      {/* Body Background Shape 2 */}
      {/* <div className='orange-gradient-2 absolute -left-[100px] top-[64%] -z-[1] h-[360px] w-[360px] -rotate-[-9.022deg] rounded-[360px]'></div> */}
    </main>
  );
};

export default DefaultHome;
