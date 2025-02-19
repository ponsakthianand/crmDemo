import { RiProfileLine, RiShieldKeyholeLine } from "react-icons/ri";
import { CustomerData } from "../../store/reducers/profile";

interface ProfileData {
  currentUser: CustomerData
}

export default function Settings(props: ProfileData) {

  return (
    <div className="w-full md:w-12/12 h-64">
      Settings
    </div>
  )
}