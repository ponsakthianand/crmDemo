import Link from 'next/link';

import logoDark from '../../assets/img/logo-dark.png';
import logoLight from '../../assets/img/logo-light.png';
import LogoIcon from '@/assets/branding/logo';

// eslint-disable-next-line react/prop-types
const LogoDark = ({ light }) => {
  return (
    <Link href='/'>
      {light ? <LogoIcon width='140' /> : <LogoIcon width='140' />}
    </Link>
  );
};

export default LogoDark;
