import { FormEvent, useState } from "react";
import { CustomerData } from "../../../store/reducers/profile";
import {
  Button,
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { toast } from "sonner";
import { useAppSelector } from "@/src/app/store/hooks";
import Select from "react-select";
import { baseUrl } from "@/global";
import { Calendar } from "@/src/app/components/ui/calendar";
import { DatePicker } from "@/src/app/components/ui/datepicker";
import { formatDate } from "@/src/app/components/lib/utils";
import { TbUserEdit } from "react-icons/tb";

interface ProfileData {
  currentUser: CustomerData;
}

const frequencyOptions = [
  { value: "daily", label: "Daily", name: "frequency" },
  { value: "monthly", label: "Monthly", name: "frequency" },
];
const mfTypeOptions = [
  { value: "A", label: "A", name: "mftype" },
  { value: "B", label: "B", name: "mftype" },
  { value: "C", label: "C", name: "mftype" },
];
const statusOptions = [
  { value: "active", label: "Active", name: "status" },
  { value: "inactive", label: "Inactive", name: "status" },
];
const processStatusOptions = [
  { value: "active", label: "Active", name: "process_status" },
  { value: "inactive", label: "Inactive", name: "process_status" },
];
const initialFormData = {
  id: "",
  admin_id: "66618ce2d1e7e04d056385a4",
  customer_id: "6680189aa17f9052ed2c4811",
  mftype: null,
  amount: "",
  frequency: null,
  status: "active",
  start_from: "",
  requested_by: "6680189aa17f9052ed2c4811",
  description: "",
  process_status: "active",
};
export default function MutualFunds(props: ProfileData) {
  const getCustomerInfo = useAppSelector((state) => state.profileData);
  const accessToken = useAppSelector((state) => state.authToken);

  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);

  const [formData, setFormdata] = useState(initialFormData);

  function open() {
    setIsOpen(true);
  }
  function close() {
    setIsOpen(false);
    setFormdata(initialFormData);
    setStartDate(null);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSelectChange = (e) => {
    console.log(e);

    const { name, value } = e;
    setFormdata((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const payload = {
      ...formData,
      start_from: "1724416904517",
      // admin_id: partner.id,
      // customer_id: id,
      // requested_by: id,
    };

    // setLoader(true);
    // const formData = new FormData(event.currentTarget);
    // const title = formData.get("title");
    // const description = formData.get("description");
    // // const ticketId = ticketId

    const response = await fetch(`${baseUrl}/request-mf/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: `Bearer ${accessToken?.access_token}`,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // setFormdata(initialFormData);
      // setTitle("");
      // setDescription("");
      close();
      accessToken?.access_token?.length &&
        // dispatch(fetchTicketsDataAPI(accessToken?.access_token));
        toast("New Mutual fund created.");
      // setLoader(false);
    } else {
      accessToken?.access_token?.length &&
        // dispatch(fetchTicketsDataAPI(accessToken?.access_token));
        toast("Something went wrong! Please try again");
      setFormdata(initialFormData);
      setStartDate(null);
      // setLoader(false);
    }
  };
  console.log("forn", formData);

  return (
    <div className="bg-white border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 p-5 border-t-4 border-t-[#673AB7]">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8">
          <span className="text-[#673AB7]">
            <TbUserEdit />
          </span>
          <span className="tracking-wide">Mutual Funds</span>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "end",
          }}
        >
          <Button
            onClick={open}
            className="rounded-md  bg-blue-700 hover:bg-blue-800 py-2 px-4 text-sm font-medium text-white focus:outline-none data-[hover]:[#673AB7] data-[focus]:outline-1 data-[focus]:outline-white"
          >
            Create New
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => { }} className="relative z-10">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className={`sm:mx-auto sm:w-full items-center `}>
                <form
                  className=""
                  action="#"
                  method="POST"
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <div className="sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:text-left">
                        <DialogTitle
                          as="h3"
                          className="text-base font-semibold leading-6 text-gray-900"
                        >
                          Create New Mutual Fund
                        </DialogTitle>
                        <div className="mt-2 ">
                          <div className="mt-5 grid grid-cols-2 gap-7">
                            <div className="flex flex-col">
                              <label
                                htmlFor="mfType"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Type
                              </label>
                              <div className="mt-2">
                                <Select
                                  id="mfType"
                                  name="mftype"
                                  placeholder="Select Type"
                                  options={mfTypeOptions}
                                  onChange={handleSelectChange}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label
                                htmlFor="title"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Amount
                              </label>
                              <div className="mt-2">
                                <input
                                  id="amount"
                                  name="amount"
                                  type="number"
                                  autoComplete="amount"
                                  required
                                  onChange={handleInputChange}
                                  value={formData.amount}
                                  placeholder="Enter Amount"
                                  className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-5  grid grid-cols-2 gap-7">
                            <div className="flex flex-col ">
                              <label
                                htmlFor="Frequency"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Frequency
                              </label>
                              <div className="mt-2">
                                <Select
                                  id="Frequency"
                                  name="frequency"
                                  options={frequencyOptions}
                                  placeholder="Select Frequency"
                                  onChange={handleSelectChange}
                                />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <label
                                htmlFor="Frequency"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Start Date
                              </label>
                              <div className="mt-2">
                                <DatePicker
                                  stateValue={startDate}
                                  setStateValue={setStartDate}
                                />
                              </div>
                            </div>
                          </div>

                          <div className="mt-5">
                            <div className="flex items-center justify-between">
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Description
                              </label>
                            </div>
                            <div className="mt-2">
                              <textarea
                                id="description"
                                name="description"
                                cols={4}
                                autoComplete="current-description"
                                required
                                onChange={handleInputChange}
                                value={formData.description}
                                className="block w-full h-36 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 mt-0 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex w-full justify-center rounded-md bg-blue-700 hover:bg-blue-800 px-3 py-2 text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      data-autofocus
                      onClick={close}
                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
