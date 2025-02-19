'use client'
import { useAppSelector } from "@/src/app/store/hooks";
import { RiProfileLine, RiShieldKeyholeLine } from "react-icons/ri";
import { FiInfo } from "react-icons/fi";
import Link from "next/link";

const ProfileInfo = () => {
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const currentUser = getCustomerInfo?.data;

  return (
    <div className="w-full md:w-12/12 h-64">
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700 bg-white rounded-md">
        <div className='flex items-center justify-between rounded-t-lg font-semibold'>
          <ul className="flex -mb-px text-sm font-medium text-center" role="tablist">
            <li className="flex p-4 items-center text-[#008756] hover:text-[#008756] dark:text-[#008756] dark:hover:text-[#008756] border-[#008756] dark:border-[#008756] border-b-2" role="presentation">
              My data
            </li>
          </ul>
          <div className="flex gap-5 mr-3">
            <Link className="py-1.5 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-full border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" href={`/profile/edit`}>
              Edit profile
            </Link>
          </div>
        </div>

      </div>
      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
          <span className="text-[#008756]">
            <RiProfileLine />
          </span>
          <span className="tracking-wide">About</span>
        </div>
        <div className="text-gray-700">
          <div className="grid md:grid-cols-2 text-sm">
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Name</div>
              <div className="px-4 py-2">{currentUser?.name ? currentUser?.name : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">
                Usename
                <span className="inline-flex ml-2 items-center py-1.5 px-1.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800" title="(This will be used as your reference)">
                  <FiInfo />
                </span>
              </div>
              <div className="px-4 py-2 truncate" title={currentUser?.partner_user_id ? currentUser?.partner_user_id : 'No data'}>
                {currentUser?.partner_user_id ? currentUser?.partner_user_id : 'No data'}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Email</div>
              <div className="px-4 py-2">{currentUser?.email ? currentUser?.email : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Contact No.</div>
              <div className="px-4 py-2">{currentUser?.phone ? currentUser?.phone : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Gender</div>
              <div className="px-4 py-2">{currentUser?.gender ? currentUser?.gender : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Current City</div>
              <div className="px-4 py-2">{currentUser?.current_city ? currentUser?.current_city : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Qualification</div>
              <div className="px-4 py-2">{currentUser?.educational_qualification ? currentUser?.educational_qualification : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Marital Status</div>
              <div className="px-4 py-2">
                {currentUser?.marital_status ? currentUser?.marital_status : 'No data'}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">No.of Dependents</div>
              <div className="px-4 py-2">{currentUser?.no_of_dependants ? currentUser?.no_of_dependants : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Source of Income</div>
              <div className="px-4 py-2">{currentUser?.source_of_income ? currentUser?.source_of_income : 'No data'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="my-4"></div>

      <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 border-t-4 border-t-[#ef233c] p-5">
        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
          <span className="text-[#ef233c]">
            <RiShieldKeyholeLine />
          </span>
          <span className="tracking-wide">Confidential Data</span>
        </div>
        <div className="text-gray-700">
          <div className="grid md:grid-cols-2 text-sm">
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Pan Number</div>
              <div className="px-4 py-2">{currentUser?.pan_number ? currentUser?.pan_number : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Aadhar Number</div>
              <div className="px-4 py-2">{currentUser?.aadhaar_number ? currentUser?.aadhaar_number : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Anual Income</div>
              <div className="px-4 py-2">{currentUser?.annual_income ? currentUser?.annual_income : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Address</div>
              <div className="px-4 py-2">{currentUser?.address ? currentUser?.address : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Date of Birth</div>
              <div className="px-4 py-2">{currentUser?.date_of_birth ? currentUser?.date_of_birth : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Permanent Address</div>
              <div className="px-4 py-2">{currentUser?.permanent_address ? currentUser?.permanent_address : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Annual Income</div>
              <div className="px-4 py-2">
                {currentUser?.annual_income ? currentUser?.annual_income : 'No data'}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Name</div>
              <div className="px-4 py-2">{currentUser?.nominee_name ? currentUser?.nominee_name : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Date of Birth</div>
              <div className="px-4 py-2">{currentUser?.nominee_dob ? currentUser?.nominee_dob : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Relationship</div>
              <div className="px-4 py-2">{currentUser?.nominee_relationship ? currentUser?.nominee_relationship : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Secondary Phone</div>
              <div className="px-4 py-2">{currentUser?.secondary_contact ? currentUser?.secondary_contact : 'No data'}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default ProfileInfo;