import si from 'systeminformation';
import { headers } from 'next/headers';
// import fml from "find-my-location";


const SysInfo = async () => {
  const headersList = headers();
  const host = headersList.get('host'); // to get domain
  // const fullUrl = headersList.get('referer') || "";

  const valueObject = {
    cpu: '*',
    osInfo: 'platform, release',
    system: 'model, manufacturer',
    networkGatewayDefault: '*',
    host,
  }

  let userInfo = {};

  await si.get(valueObject).then(data => userInfo = data).catch(error => console.error(error));
  // console.log(userInfo);

  // const location = await fml(userInfo?.networkGatewayDefault);

  // console.log(location);


  // await ipLocation(userInfo.networkGatewayDefault, function (err, data) {
  //   console.log(data)
  // })

  // await ipLocation(userInfo.networkGatewayDefault).then(data => console.log(data));
  //=> { latitude: -33.8591, longitude: 151.2002, region: { name: "New South Wales" ... } ... }

  // const locationInfo = ipLocation(userInfo.networkGatewayDefault);

  // console.log(host, fullUrl);

  // site avaoilability check
  // si.inetChecksite('google.com').then(data => console.log(data));
  return { userInfo }
}

export default SysInfo;