export function Contact() {
  return (
    <section className="relative mt-40 block bg-indigo-300 py-24 lg:pt-24">
      <div className="container mx-auto px-4">
        <div className="-mt-48 flex flex-wrap justify-center lg:-mt-64">
          <div className="w-full px-4 lg:w-6/12">
            <div className="relative mb-6 flex w-full min-w-0 flex-col break-words rounded-lg bg-red-300 shadow-lg">
              <div className="flex-auto p-5 lg:p-10">
                <h4 className="text-2xl font-semibold text-gray-900">
                  Want to work with us?
                </h4>
                <p className="mb-4 mt-1 leading-relaxed text-gray-600">
                  Complete this form and we will get back to you.
                </p>
                <div className="relative mb-3 mt-8 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-gray-700"
                    htmlFor="full-name"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-400 shadow focus:outline-none focus:ring"
                    placeholder="Full Name"
                    style={{ transition: 'all .15s ease' }}
                  />
                </div>

                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-gray-700"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-400 shadow focus:outline-none focus:ring"
                    placeholder="Email"
                    style={{ transition: 'all .15s ease' }}
                  />
                </div>

                <div className="relative mb-3 w-full">
                  <label
                    className="mb-2 block text-xs font-bold uppercase text-gray-700"
                    htmlFor="message"
                  >
                    Message
                  </label>
                  <textarea
                    rows={4}
                    cols={80}
                    className="w-full rounded border-0 bg-white px-3 py-3 text-sm text-gray-700 placeholder-gray-400 shadow focus:outline-none focus:ring"
                    placeholder="Type a message..."
                  />
                </div>
                <div className="mt-6 text-center">
                  <button
                    className="mb-1 mr-1 rounded bg-indigo-700 px-6 py-3 text-sm font-bold uppercase text-white shadow outline-none hover:shadow-lg focus:outline-none active:bg-gray-700"
                    type="button"
                    style={{ transition: 'all .15s ease' }}
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
