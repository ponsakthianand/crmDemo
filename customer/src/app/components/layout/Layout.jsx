import { Outlet } from 'react-router-dom';
import Footer_01 from '../footer/Footer_01';
import Header from '../header/Header';

const Layout = () => {
  return (
    <div className='page-wrapper relative z-[1] bg-white'>
      {/*...::: Header Start :::... */}
      <Header
        loginCSS='button hidden rounded-[50px] border-[#7F8995] bg-transparent text-black after:bg-rxtGreen hover:border-rxtGreen hover:text-white lg:inline-block'
        signupCSS='button hidden rounded-[50px] border-black bg-black text-white after:bg-rxtGreen hover:border-rxtGreen hover:text-white lg:inline-block'
      />
      {/*...::: Header End :::... */}

      {/*...::: Main Start :::... */}
      <Outlet />
      {/*...::: Main End :::... */}

      {/*...::: Footer Start :::... */}
      <Footer_01 />
      {/*...::: Footer End :::... */}
    </div>
  );
};

export default Layout;
