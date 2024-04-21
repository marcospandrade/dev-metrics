export function Finisher() {
  return (
    <section className="relative block bg-gray-900 pb-20">
      <div
        className="pointer-events-none absolute bottom-auto left-0 right-0 top-0 -mt-20 w-full overflow-hidden"
        style={{ height: '80px' }}
      >
        <svg
          className="absolute bottom-0 overflow-hidden"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          version="1.1"
          viewBox="0 0 2560 100"
          x="0"
          y="0"
        >
          <polygon
            className="fill-current text-gray-900"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>

      <div className="container mx-auto px-4 lg:pb-64 lg:pt-24">
        <div className="flex flex-wrap justify-center text-center">
          <div className="w-full px-4 lg:w-6/12">
            <h2 className="text-4xl font-semibold text-white">
              Build something
            </h2>
            <p className="mb-4 mt-4 text-lg leading-relaxed text-gray-500">
              Put the potentially record low maximum sea ice extent tihs year
              down to low ice. According to the National Oceanic and Atmospheric
              Administration, Ted, Scambos.
            </p>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center">
          <div className="w-full px-4 text-center lg:w-3/12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-gray-900 shadow-lg">
              <i className="fas fa-medal text-xl"></i>
            </div>
            <h6 className="mt-5 text-xl font-semibold text-white">
              Excelent Services
            </h6>
            <p className="mb-4 mt-2 text-gray-500">
              Some quick example text to build on the card title and make up the
              bulk of the card content.
            </p>
          </div>
          <div className="w-full px-4 text-center lg:w-3/12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-gray-900 shadow-lg">
              <i className="fas fa-poll text-xl"></i>
            </div>
            <h5 className="mt-5 text-xl font-semibold text-white">
              Grow your market
            </h5>
            <p className="mb-4 mt-2 text-gray-500">
              Some quick example text to build on the card title and make up the
              bulk of the cards content.
            </p>
          </div>
          <div className="w-full px-4 text-center lg:w-3/12">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white p-3 text-gray-900 shadow-lg">
              <i className="fas fa-lightbulb text-xl"></i>
            </div>
            <h5 className="mt-5 text-xl font-semibold text-white">
              Launch time
            </h5>
            <p className="mb-4 mt-2 text-gray-500">
              Some quick example text to build on the card title and make up the
              bulk of the cards content.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
