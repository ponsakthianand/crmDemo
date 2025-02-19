import { useCallback, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import icon_black_long_arrow_right from '@/assets/img/icon-black-long-arrow-right.svg';
import icon_black_cheveron_right from '@/assets/img/icon-black-cheveron-right.svg';

// eslint-disable-next-line react/prop-types
const Navbar = ({ mobileMenu, setMobileMenu, color }) => {
  const activeSegment = useSelectedLayoutSegment();
  const [mobileSubMenu, setMobileSubMenu] = useState('');
  const [mobileSubMenuSub, setMobileSubMenuSub] = useState('');
  const [menuTitle, setMenuTitle] = useState('');

  const handleMenu = () => {
    setMobileMenu(false);
    setMobileSubMenu('');
    setMobileSubMenuSub('');
  };

  const handleSubMenu = (e, id) => {
    e.preventDefault();
    // Toggle the submenu by checking if it's already active
    if (mobileSubMenu === id) {
      setMobileSubMenu('');
    } else {
      setMobileSubMenu(id);
    }

    // Set the menu title for the active item
    const content =
      e.target.tagName === 'A'
        ? e.target.firstChild.textContent
        : e.target.parentElement.textContent;
    setMenuTitle(content);
  };

  const handleSubMenuSub = (e, id) => {
    e.preventDefault();
    setMobileSubMenuSub(id);
    const content =
      e.target.tagName === 'A'
        ? e.target.firstChild.textContent
        : e.target.parentElement.textContent;
    setMenuTitle(content);
  };

  const handleGoBack = () => {
    if (mobileSubMenuSub) {
      setMobileSubMenuSub('');
      return;
    }
    if (mobileSubMenu) {
      setMobileSubMenu('');
      return;
    }
  };

  const menuItems = [
    { title: 'About', href: '/about', activeSegment: 'about' },
    {
      title: 'Services',
      href: '#',
      activeSegment: 'services',
      subMenu: [
        // {
        //   title: 'NRI Financial Services',
        //   href: '/services/nri-financial-services',
        //   activeSegment: 'nri-financial-services',
        // },
        // {
        //   title: 'Portfolio Analysis & Review',
        //   href: '/services/portfolio-analysis-and-review',
        //   activeSegment: 'portfolio-analysis-and-review',
        // },
        // {
        //   title: 'Unlisted Shares | Private Placements',
        //   href: '/services/unlisted-shares-private-placements',
        //   activeSegment: 'unlisted-shares-private-placements',
        // },
        // {
        //   title: 'Mutual Funds | Share Market | IPO',
        //   href: '/services/mutual-funds-share-market-ipo',
        //   activeSegment: 'mutual-funds-share-market-ipo',
        // },
        // {
        //   title:
        //     'Risk Management | Insurance | Loan Advisory | Optimal Solutions',
        //   href: '/services/risk-management-insurance-loan-advisory-optimal-solutions',
        //   activeSegment:
        //     'risk-management-insurance-loan-advisory-optimal-solutions',
        // },
        // {
        //   title:
        //     'Financial Education | Assessments | Consulting | Tax Planning',
        //   href: '/services/financial-education-assessments-consulting-financial-planning-tax-planning',
        //   activeSegment:
        //     'financial-education-assessments-consulting-financial-planning-tax-planning',
        // },

        // {
        //   title: 'Credit Card Consultation',
        //   href: '/services/credit-card-consultation/request',
        //   activeSegment: 'credit-card-consultation',
        // },
        {
          title: 'Personalized Financial Consultation',
          href: '/sessions/personalized-financial-consultation',
          activeSegment: 'personalized-financial-consultation',
        },
        {
          title: 'Financial Planning',
          href: '/sessions/financial-planning-by-a-certified-financial-planner-mr-manohar',
          activeSegment:
            'financial-planning-by-a-certified-financial-planner-mr-manohar',
        },
        {
          title: 'RxT Infinity',
          href: '/services/rxt-infinity/request',
          activeSegment: 'rxt-infinity',
        },
        {
          title: 'Fractional Cloud CFO',
          href: '/services/fractional-cloud-cfo/request',
          activeSegment: 'fractional-cloud-cfo',
        },
        {
          title: 'Credit Card Consultation',
          href: '/sessions/credit-card-consultation',
          activeSegment: 'credit-card-consultation',
        },
        {
          title: 'Auditing Services',
          href: '/services/auditing-services/request',
          activeSegment: 'auditing-services',
        },
        {
          title: 'Loans Consultation',
          href: '/services/loans-consultation/request',
          activeSegment: 'loans-consultation',
        },
        {
          title: 'Insurance Consultation',
          href: '/services/insurance-consultation/request',
          activeSegment: 'insurance-consultation',
        },

        // {
        //   title: 'Celebrity Financial Consultation',
        //   href: '/services/celebrity-financial-consultation/request',
        //   activeSegment: 'celebrity-financial-consultation',
        // },
      ],
    },
    { title: 'Courses', href: '/courses', activeSegment: 'courses' },
    { title: 'Contact', href: '/contact', activeSegment: 'contact' },
    { title: 'FAQs', href: '/faqs', activeSegment: 'faqs' },
    {
      title: 'Partner Area',
      href: 'https://partner.rxtn.in/',
      activeSegment: 'partner-area',
      external: true,
    },
  ];

  const DynamicMenu = useCallback(() => {
    return (
      <div className='menu-block-wrapper'>
        <div
          onClick={handleMenu}
          className={`menu-overlay ${mobileMenu && 'active'}`}
        />
        <nav
          className={`menu-block ${mobileMenu && 'active'}`}
          id='append-menu-header'
        >
          <div className={`mobile-menu-head ${mobileSubMenu && 'active'}`}>
            <div onClick={handleGoBack} className='go-back'>
              <Image
                className='dropdown-icon'
                src={icon_black_long_arrow_right}
                alt='cheveron-right'
                width={16}
                height={16}
              />
            </div>
            <div className='current-menu-title'>Services</div>
            <div onClick={handleMenu} className='mobile-menu-close'>
              ×
            </div>
          </div>
          <ul className={`site-menu-main  ${color}`}>
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`${
                  activeSegment === item.activeSegment ? 'text-primary-800' : ''
                } nav-item ${item.subMenu ? 'nav-item-has-children' : ''}`}
                onClick={(e) => item.subMenu && handleSubMenu(e, index + 1)}
              >
                <Link
                  href={item.href}
                  onClick={() => {
                    if (item.subMenu) {
                      handleSubMenu(null, index + 1);
                    }
                    handleMenu();
                  }}
                  className={`nav-link-item ${item.subMenu ? 'drop-trigger' : ''} hover:text-primary-800`}
                  target={item.external ? '_blank' : '_self'}
                >
                  {item.title}
                  {item.subMenu && (
                    <Image
                      className='dropdown-icon'
                      src={icon_black_cheveron_right}
                      alt='cheveron-right'
                      width={16}
                      height={16}
                    />
                  )}
                </Link>
                {item.subMenu && (
                  <ul
                    className={`sub-menu w-[280px] ${mobileSubMenu === index + 1 && 'active'}`}
                  >
                    {item.subMenu.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className={`sub-menu--item ${
                          activeSegment === subItem.activeSegment
                            ? 'text-primary-800'
                            : ''
                        }`}
                      >
                        <Link href={subItem.href} onClick={() => handleMenu()}>
                          {subItem.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    );
  }, [
    activeSegment,
    mobileSubMenu,
    mobileMenu,
    color,
    menuItems,
    handleMenu,
    handleSubMenu,
    handleGoBack,
  ]);

  return <> {DynamicMenu()}</>;
};

export default Navbar;
