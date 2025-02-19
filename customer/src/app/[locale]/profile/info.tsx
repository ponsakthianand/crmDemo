import { RiProfileLine, RiShieldKeyholeLine } from "react-icons/ri";
import { CustomerData } from "../../store/reducers/profile";

interface ProfileData {
  currentUser: CustomerData
}

export default function ProfileInfo(props: ProfileData) {

  return (
    <div className="w-full md:w-12/12 h-64">
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
              <div className="px-4 py-2">{props?.currentUser?.name ? props?.currentUser?.name : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Gender</div>
              <div className="px-4 py-2">{props?.currentUser?.gender ? props?.currentUser?.gender : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Email</div>
              <div className="px-4 py-2">{props?.currentUser?.email ? props?.currentUser?.email : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Contact No.</div>
              <div className="px-4 py-2">{props?.currentUser?.phone ? props?.currentUser?.phone : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Current City</div>
              <div className="px-4 py-2">{props?.currentUser?.current_city ? props?.currentUser?.current_city : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Qualification</div>
              <div className="px-4 py-2">{props?.currentUser?.educational_qualification ? props?.currentUser?.educational_qualification : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Marital Status</div>
              <div className="px-4 py-2">
                {props?.currentUser?.marital_status ? props?.currentUser?.marital_status : 'No data'}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">No.of Dependents</div>
              <div className="px-4 py-2">{props?.currentUser?.no_of_dependants ? props?.currentUser?.no_of_dependants : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Source of Income</div>
              <div className="px-4 py-2">{props?.currentUser?.source_of_income ? props?.currentUser?.source_of_income : 'No data'}</div>
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
              <div className="px-4 py-2">{props?.currentUser?.pan_number ? props?.currentUser?.pan_number : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Aadhar Number</div>
              <div className="px-4 py-2">{props?.currentUser?.aadhaar_number ? props?.currentUser?.aadhaar_number : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Anual Income</div>
              <div className="px-4 py-2">{props?.currentUser?.annual_income ? props?.currentUser?.annual_income : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Address</div>
              <div className="px-4 py-2">{props?.currentUser?.address ? props?.currentUser?.address : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Date of Birth</div>
              <div className="px-4 py-2">{props?.currentUser?.date_of_birth ? props?.currentUser?.date_of_birth : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Permanent Address</div>
              <div className="px-4 py-2">{props?.currentUser?.permanent_address ? props?.currentUser?.permanent_address : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Annual Income</div>
              <div className="px-4 py-2">
                {props?.currentUser?.annual_income ? props?.currentUser?.annual_income : 'No data'}
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Name</div>
              <div className="px-4 py-2">{props?.currentUser?.nominee_name ? props?.currentUser?.nominee_name : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Date of Birth</div>
              <div className="px-4 py-2">{props?.currentUser?.nominee_dob ? props?.currentUser?.nominee_dob : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Nominee Relationship</div>
              <div className="px-4 py-2">{props?.currentUser?.nominee_relationship ? props?.currentUser?.nominee_relationship : 'No data'}</div>
            </div>
            <div className="grid grid-cols-2">
              <div className="px-4 py-2 font-semibold">Secondary Phone</div>
              <div className="px-4 py-2">{props?.currentUser?.secondary_contact ? props?.currentUser?.secondary_contact : 'No data'}</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}