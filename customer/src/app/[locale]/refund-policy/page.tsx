import React from "react";

const RefundPolicy = () => {
  return (
    <main className="main-wrapper relative overflow-hidden">
      <div className="py-28 px-3 lg:px-20">
        <section className="py-4 antialiased md:py-12">
          {/* Section Header */}
          <div className="mb-5 sm:mb-10 text-center">
            <h2 className="text-2xl font-bold lg:text-3xl lg:leading-tight dark:text-white">
              Refund and Cancellation Policy
            </h2>
          </div>

          {/* Content Starts */}
          <div className="max-w-4xl mx-auto text-gray-700 dark:text-gray-300">
            <h3 className="text-xl font-semibold mb-4">Return Policy</h3>
            <p className="mb-6">Last updated October 07, 2024</p>

            <h4 className="text-lg font-medium mb-2">Refunds</h4>
            <p className="mb-6">All sales are final and no refund will be issued.</p>

            <h4 className="text-lg font-medium mb-2">Questions</h4>
            <p>
              If you have any questions concerning our return policy, please contact us at:
            </p>
            <ul className="list-none mt-4">
              <li className="mb-2">
                <strong>Phone:</strong> 99623 40067
              </li>
              <li>
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:info@rxtn.in"
                  className="text-blue-500 hover:underline"
                >
                  info@rxtn.in
                </a>
              </li>
            </ul>
          </div>
          {/* Content Ends */}
        </section>
      </div>
    </main>
  );
};

export default RefundPolicy;
