import { RiProfileLine, RiShieldKeyholeLine } from "react-icons/ri";
import { CustomerData } from "../../store/reducers/profile";

interface ProfileData {
  currentUser: CustomerData
}

export default function Settings(props: ProfileData) {

  return (
    <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#008756]">
      <div className="w-full md:w-12/12 h-64">
        Coming Soon
      </div>
    </div>
  )
}