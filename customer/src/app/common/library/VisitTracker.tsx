'use client';
import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useLocalStorage } from 'react-use';

interface Location {
  city: string;
  region: string;
  country: string;
}

interface Page {
  url: string;
  domain: string;
  visitTime: Date;
  duration: number;
  params?: Record<string, string | string[]>;
}

const SESSION_EXPIRY_TIME = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

const VisitTracker = () => {
  const params: any = useSearchParams();
  const getParamRefID = params.get('rxt');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [referralId, setReferralId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const partnerRefId = localStorage.getItem('partner_ref');
      return partnerRefId ? partnerRefId : getParamRefID ? getParamRefID : '';
    }
    return ''; // Default to an empty array during SSR
  });



  useEffect(() => {
    if (getParamRefID) {
      console.log('Saving referral ID to localStorage:', getParamRefID);
      localStorage.setItem('partner_ref', getParamRefID);
    }
  }, [getParamRefID]);

  // const [referralId] = useLocalStorage('partner_ref');

  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();
  const [ip, setIp] = useState<string | null>(null);
  // const [location, setLocation] = useState(null);

  // useEffect(() => {
  //   if ('geolocation' in navigator) {
  //     // Retrieve latitude & longitude coordinates from `navigator.geolocation` Web API
  //     navigator.geolocation.getCurrentPosition(({ coords }) => {
  //       const { latitude, longitude } = coords;
  //       setLocation({ latitude, longitude });
  //     })
  //   }
  // }, []);

  // Fetch the IP address
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org/?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('Failed to fetch IP:', error);
      }
    };

    fetchIp();
  }, []);

  // Parse query parameters into an object
  const getQueryParams = (): Record<string, string | string[]> => {
    const searchParams = new URLSearchParams(window.location.search);
    const params: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      if (params[key]) {
        params[key] = Array.isArray(params[key])
          ? [...(params[key] as string[]), value]
          : [params[key] as string, value];
      } else {
        params[key] = value;
      }
    });
    return params;
  };

  // Initialize sessionId and referralId
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sessionTimestamp = localStorage.getItem('sessionTimestamp');
      const now = Date.now();

      // Check if the session is expired
      if (sessionTimestamp && now - parseInt(sessionTimestamp, 10) > SESSION_EXPIRY_TIME) {
        localStorage.removeItem('sessionId');
        localStorage.removeItem('sessionTimestamp');
        console.log('Session expired. Creating a new session.');
      }

      let session = localStorage.getItem('sessionId');
      if (!session) {
        session = uuidv4();
        localStorage.setItem('sessionId', session);
      }
      setSessionId(session);

      // Update or create the session timestamp
      localStorage.setItem('sessionTimestamp', now.toString());

      const partnerRef = localStorage.getItem('partner_ref');
      if (partnerRef) {
        setReferralId(partnerRef);
      }

      setIsInitialized(true); // Mark as initialized
    }
  }, []);

  // Log page visits when pathname changes
  useEffect(() => {
    if (!isInitialized || !sessionId) {
      console.log('VisitTracker is not initialized yet.');
      return;
    }

    const now = new Date();

    if (currentPage) {
      const duration = Math.floor(
        (now.getTime() - currentPage.visitTime.getTime()) / 1000
      );

      logVisit({
        sessionId,
        url: currentPage.url,
        domain: currentPage.domain,
        visitTime: currentPage.visitTime,
        duration,
        params: currentPage.params,
      });
    }

    setCurrentPage({
      url: pathname,
      domain: window.location.hostname,
      visitTime: now,
      duration: 0,
      params: getQueryParams(),
    });

    console.log(`Navigated to: ${pathname}`);
  }, [pathname, sessionId]);

  // Function to log a visit to the API
  async function logVisit(pageData: Page & { sessionId: string | null }) {
    try {
      if (!ip) {
        console.error('IP address is not yet available.');
        return;
      }

      console.log('Logging visit:', pageData);

      const response = await fetch(`/api/locate-ip/${ip}`);
      const geoData = await response.json();

      const payload = {
        sessionId: pageData.sessionId,
        ip: ip,
        location: geoData,
        userAgent: navigator.userAgent,
        pages: [
          {
            url: pageData.url,
            domain: pageData.domain,
            visitTime: pageData.visitTime.toISOString(),
            duration: pageData.duration,
            params: pageData.params,
          },
        ],
        referralId,
      };

      const logResponse = await fetch('/api/statistics/logVisit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!logResponse.ok) {
        console.error(
          'Failed to log visit, server responded with:',
          logResponse.status
        );
      } else {
        console.log('Visit logged successfully');
      }
    } catch (error) {
      console.error('Failed to log visit:', error);
    }
  }

  return null;
};

export default VisitTracker;
