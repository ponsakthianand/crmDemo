import React from "react";

const PolicyPage = () => {
  return (
    <div className='px-5 py-20 lg:px-32 lg:py-24 text-base'>
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Terms and Conditions</h1>
          <div className="space-y-8 text-gray-700 dark:text-gray-300">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">1. Scope of Services</h2>
              <p className="text-base leading-relaxed">
                RxT offers a range of financial services designed to help clients achieve their financial goals. These services include but are not limited to:
              </p>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>NRI Financial Services</li>
                <li>Portfolio Analysis & Review</li>
                <li>Unlisted Shares and Private Placements</li>
                <li>Mutual Funds, Stock Market & IPO Advisory</li>
                <li>Risk Management, Insurance, Loan Advisory, and Optimal Financial Solutions</li>
                <li>Financial Education, Assessments, Consulting, Planning, and Tax Planning</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">2. Client Responsibilities</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  Clients must provide accurate, complete, and up-to-date financial and personal information required for effective service delivery.
                </li>
                <li>
                  Clients are responsible for reviewing and understanding all recommendations, service agreements, and reports shared by RxT.
                </li>
                <li>
                  All investment decisions based on RxT's recommendations are made at the client’s discretion and risk.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">3. Disclaimer</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  Financial markets are inherently unpredictable. RxT does not guarantee specific outcomes or investment returns.
                </li>
                <li>
                  Past performance is not indicative of future results. Clients should consult additional resources before critical financial decisions.
                </li>
                <li>
                  Recommendations provided are advisory and should not be construed as legal, tax, or accounting advice.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">4. Confidentiality</h2>
              <p className="text-base leading-relaxed">
                RxT is committed to maintaining the confidentiality of client information. Personal and financial details are used solely to deliver agreed services and comply with privacy laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">5. Payment and Fees</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Fees for services will be outlined in the service agreement signed by the client.</li>
                <li>
                  Payment terms, including due dates, will be clearly stated. Late payments may incur additional charges or result in service suspension.
                </li>
                <li>All fees are non-refundable unless specified otherwise in the service agreement.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">6. Limitation of Liability</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>
                  RxT is not liable for financial losses resulting from client decisions based on our advice.
                </li>
                <li>
                  RxT is not responsible for disruptions caused by third-party services or external factors beyond our control.
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">7. Termination of Services</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>Clients may terminate the service agreement with prior written notice, as specified in the agreement.</li>
                <li>
                  RxT reserves the right to terminate services for non-compliance with terms, unpaid dues, or misrepresentation.
                </li>
                <li>Outstanding fees must be paid in full upon termination.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">8. Amendments to Terms and Conditions</h2>
              <p className="text-base leading-relaxed">
                RxT reserves the right to modify terms and conditions. Clients will be notified of changes via email or website updates.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">9. Governing Law and Dispute Resolution</h2>
              <ul className="list-disc list-inside mt-4 space-y-2">
                <li>These terms are governed by the laws of [Insert Jurisdiction].</li>
                <li>
                  Disputes will be resolved through mutual negotiation or arbitration under [Insert Arbitration Rules].
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">10. Contact Information</h2>
              <p className="text-base leading-relaxed">
                For questions or clarifications, reach out to us:
              </p>
              <ul className="list-none mt-4 space-y-2">
                <li><span className="font-medium">Phone:</span> 99623 40067</li>
                <li><span className="font-medium">Email:</span> Info@rxtn.in</li>
                <li>
                  <span className="font-medium">Office Address:</span> ReturnX Edumode LLP, New No. 26, Old No. 47, Brindavanam Street Extension, West Mambalam, Chennai - 600033
                </li>
                <li><span className="font-medium">Website:</span> www.rxtn.in</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PolicyPage;
