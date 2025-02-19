import React from "react";

const PolicyPage = () => {
  return (
    <main className='main-wrapper relative overflow-hidden'>
      <div className='py-28 px-3 lg:px-20'>
        <section className="py-4 antialiased md:py-12">
          <div className="mb-5 sm:mb-10 text-center">
            <h2 className="text-2xl font-bold lg:text-3xl lg:leading-tight dark:text-white">Privacy Policy</h2>
          </div>
          <p>Welcome to Rxtn.in!</p>
          <p className="mt-4">
            RXTN is the product of Returnx Edumode LLP. We value your privacy and are committed to protecting your personal information. This policy explains what information we collect, how we use it, and how we keep it safe. By using our website, you agree to this Privacy Policy.
          </p>

          {/* Information Collection */}
          <h2 className="text-2xl font-semibold mt-6">What Information Do We Collect?</h2>

          <h3 className="text-xl font-medium mt-4">Personal Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Contact Details: Your name, email address, phone number, and mailing address.</li>
            <li>Financial Info: Details like your income, investment preferences, bank account details, and credit history.</li>
            <li>Identification: Information like your date of birth, Social Security Number, PAN number, and other government IDs.</li>
          </ul>

          <h3 className="text-xl font-medium mt-4">Non-Personal Information</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Usage Data: How you use our site, including your IP address, browser type, pages visited, and time spent on those pages.</li>
            <li>Device Info: Information about the device you use to access our site, such as your device model, operating system, and unique device identifiers.</li>
          </ul>

          <h3 className="text-xl font-medium mt-4">Cookies and Tracking Technologies</h3>
          <p className="mt-2">
            We use cookies and similar technologies to understand your interaction with our site. This helps us remember your preferences and improve your experience.
          </p>

          {/* Usage of Information */}
          <h2 className="text-2xl font-semibold mt-6">How Do We Use Your Information?</h2>

          <h3 className="text-xl font-medium mt-4">To Provide and Improve Our Services</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Process your requests and manage your account.</li>
            <li>Personalize your experience with tailored financial products and services.</li>
            <li>Communicate with you about updates, promotions, and other relevant information.</li>
          </ul>

          <h3 className="text-xl font-medium mt-4">For Legal and Regulatory Purposes</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Comply with laws, regulations, and legal processes.</li>
            <li>Detect, prevent, and address fraud and other illegal activities.</li>
          </ul>

          <h3 className="text-xl font-medium mt-4">For Marketing and Advertising</h3>
          <ul className="list-disc ml-6 space-y-2">
            <li>Send you promotional offers and advertisements that may interest you.</li>
            <li>Analyze the effectiveness of our marketing campaigns.</li>
          </ul>

          {/* Sharing Information */}
          <h2 className="text-2xl font-semibold mt-6">Who Do We Share Your Information With?</h2>
          <h3 className="text-xl font-medium mt-4">Service Providers</h3>
          <p>We may share your information with third-party companies that help us provide our services, like payment processors and marketing agencies.</p>

          <h3 className="text-xl font-medium mt-4">For Legal Reasons</h3>
          <p>We may disclose your information if required by law or to protect our rights, property, or safety.</p>

          <h3 className="text-xl font-medium mt-4">Business Transfers</h3>
          <p>If we are involved in a merger or acquisition, your information may be transferred to the new entity.</p>

          {/* Your Choices */}
          <h2 className="text-2xl font-semibold mt-6">Your Choices and Rights</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Access and Correction:</strong> You can request to see your personal information and ask us to correct any mistakes.</li>
            <li><strong>Opt-Out:</strong> You can opt out of receiving promotional emails by following the unsubscribe instructions in those emails.</li>
            <li><strong>Data Deletion:</strong> You can request that we delete your personal information, subject to legal requirements.</li>
            <li><strong>Cookies:</strong> You can manage cookies through your browser settings.</li>
          </ul>

          {/* Security */}
          <h2 className="text-2xl font-semibold mt-6">How Do We Protect Your Information?</h2>
          <p>We use various security measures to protect your information from unauthorized access and use. However, no method of transmission over the Internet or electronic storage is completely secure.</p>

          {/* Children's Privacy */}
          <h2 className="text-2xl font-semibold mt-6">Children’s Privacy</h2>
          <p>
            Our site is not for children under 18. We do not knowingly collect information from children under 18. If we learn we have, we will delete it.
          </p>

          {/* Changes */}
          <h2 className="text-2xl font-semibold mt-6">Changes to This Policy</h2>
          <p>
            We may update this policy occasionally. We will notify you of any significant changes by posting the new policy on our site with an updated effective date. By continuing to use our site, you agree to the revised policy.
          </p>

          {/* Contact */}
          <h2 className="text-2xl font-semibold mt-6">Contact Us</h2>
          <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
          <p>
            <strong>Email:</strong> info@rxtn.com <br />
            <strong>Phone:</strong> 99623 40067
          </p>
        </section>
      </div>
    </main>
  );
};

export default PolicyPage;
