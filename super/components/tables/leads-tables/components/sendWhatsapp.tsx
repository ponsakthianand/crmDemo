"use client";
import { LeadsInfo } from "@/app/store/reducers/allLeadsData";
import { Button } from "@/registry/new-york/ui/button";
import { Checkbox } from "@/registry/new-york/ui/checkbox";
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/registry/new-york/ui/dialog";
import { Label } from "@/registry/new-york/ui/label";
import { useState } from "react";

// Transform the data to ensure only non-empty fields are included
const transformUserData = (data: any) => {
  return {
    full_Name: data.full_Name || "",
    mobile: data.mobile || "",
    mobileTwo: data.mobileTwo || "",
    email: data.email || "",
    dob: data.dob || "",
    age: data.age || 0,
    annualIncome: data.annualIncome || "",
    employmentType: data.employmentType || "",
    note: data.note || [],
    comment: data.comment || "",
    street: data.street || "",
    zipCode: data.zipCode || "",
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    panNumber: data.panNumber || "",
    aadharNumber: data.aadharNumber || "",
    filingType: data.filingType || [],
    loanType: data.loanType || "",
    delayInPayment: data.delayInPayment || false,
    cibilIssues: data.cibilIssues || false,
    insuranceType: data.insuranceType || [],
    isKnownCoverage: data.isKnownCoverage || false,
    healthCondition: data.healthCondition || "",
    differentlyAbled: data.differentlyAbled || false,
    lifeStyleHabits: data.lifeStyleHabits || "",
    isIncomeTaxFiled: data.isIncomeTaxFiled || false,
    residentialStatus: data.residentialStatus || "",
  };
};

// Function to clean field names to be more user-friendly
const formatFieldLabel = (field: string) => {
  const formatted = field.replace(/([A-Z])/g, " $1").toUpperCase();
  return formatted.charAt(0) + formatted.slice(1).toLowerCase(); // Capitalize first letter
};

export function WhatsAppSender({ userData }: { userData: LeadsInfo }) {
  const filteredData = transformUserData(userData);

  // Filter out keys with empty data
  const validFields = Object.keys(filteredData).filter(
    (key) => filteredData[key as keyof typeof filteredData] !== "" && filteredData[key as keyof typeof filteredData] !== undefined
  );

  const [selectedFields, setSelectedFields] = useState<string[]>([
    "full_Name",
    "email",
    "mobile",
  ]);

  const [receiverMobile, setReceiverMobile] = useState("");

  const handleCheckboxChange = (field: string) => {
    setSelectedFields((prev) =>
      prev.includes(field) ? prev.filter((item) => item !== field) : [...prev, field]
    );
  };

  const sendWhatsAppMessage = () => {
    if (!receiverMobile) {
      alert("Please enter a receiver's mobile number.");
      return;
    }

    if (selectedFields.length === 0) {
      alert("Please select at least one field.");
      return;
    }

    const formattedPhone = receiverMobile.replace("+", "").replace(/\s/g, ""); // Remove spaces & "+"
    const message = selectedFields
      .map((field) => {
        let value = filteredData[field as keyof typeof filteredData];
        if (Array.isArray(value)) value = value.join(", ") || "N/A"; // Convert arrays to string
        if (typeof value === "boolean") value = value ? "Yes" : "No"; // Convert boolean to Yes/No
        return `${formatFieldLabel(field)}: ${value || "N/A"}`;
      })
      .join("\n");

    const url = `https://wa.me/+91${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <DialogContent className="sm:max-w-[800px]">
      <DialogHeader>
        <DialogTitle>Send {filteredData.full_Name}'s Info</DialogTitle>
        <DialogDescription>
          <div className="pt-4 text-gray-800">
            <label className="block mb-2">
              <span className="font-semibold">Receiver Mobile Number:</span>
              <input
                type="text"
                value={receiverMobile}
                onChange={(e) => setReceiverMobile(e.target.value)}
                placeholder="9XXXXXXXXX"
                className="border p-2 w-full mt-1 rounded"
              />
            </label>

            <p className="mb-2">Select the details you want to send:</p>
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-4">
              {validFields.map((key) => (
                <div className="w-full" key={key}>
                  <Label className="font-semibold" htmlFor={key}>{formatFieldLabel(key)}</Label>
                  <div className='flex items-center space-x-2 mt-2'>
                    <Checkbox
                      id={key}
                      checked={selectedFields.includes(key)}
                      onCheckedChange={() => handleCheckboxChange(key)}
                    />
                    <label
                      htmlFor={key}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 truncate"
                    >
                      {Array.isArray(filteredData[key as keyof typeof filteredData])
                        ? (filteredData[key as keyof typeof filteredData] as any[]).join(", ") || "N/A"
                        : filteredData[key as keyof typeof filteredData] || "N/A"}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant={"outline"}>
            Cancel
          </Button>
        </DialogClose>
        <DialogClose asChild>
          <Button type="button" onClick={sendWhatsAppMessage}>
            Send to Whatsapp
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent >
  );
}
