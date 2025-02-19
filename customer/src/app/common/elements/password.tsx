import { useState } from "react";
import { PiEyeSlash } from "react-icons/pi";
import { PiEye } from "react-icons/pi";
import PasswordStrengthBar from 'react-password-strength-bar';

const PasswordField = ({ passwordValue, strength = false }) => {
  const [viewPassword, setViewPassword] = useState(false)
  const [inputType, setInputType] = useState('password')
  const [password, setPassword] = useState('')

  const toggle = () => {
    setViewPassword(!viewPassword)
    setInputType(inputType === 'text' ? 'password' : 'text')
  }

  const passwordHandler = (e) => {
    setPassword(e.target.value)
    passwordValue(e.target.value)
  }

  return (
    <div className="relative">
      <input type={inputType} onChange={(e) => passwordValue(e.target.value)} className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
      {strength && <PasswordStrengthBar password={password} />}
      <div className="absolute right-[2px] top-[2px] bg-white rounded-md py-1 px-2">
        {
          viewPassword ?
            <PiEye size={24} className="cursor-pointer" onClick={() => toggle()} /> :
            <PiEyeSlash size={24} className="cursor-pointer" onClick={() => toggle()} />
        }
      </div>
    </div>
  )
}

export default PasswordField