import { Hero } from '@/components/landingPage/Hero'
import { Services } from '@/components/landingPage/Services'
import { Featured } from '@/components/landingPage/Featured'
// import { Team } from '@/components/LandingPage/Team'
// import { Finisher } from '@/components/LandingPage/Finisher'
import { Contact } from '@/components/landingPage/Contact'
import { Navbar } from '@/components/landingPage/Navbar'
import { Footer } from '@/components/landingPage/Footer'

const IndexPage = () => (
  <>
    <header>
      <Navbar />
    </header>

    <main className="bg-white">
      <Hero />
      <Services />
      <Featured />
      {/* <Team /> */}
      {/* <Finisher /> */}
      <Contact />
    </main>
    <footer>
      <Footer />
    </footer>
  </>
)

export default IndexPage
