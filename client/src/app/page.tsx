import { Hero } from '@/components/LandingPage/Hero'
import { Services } from '@/components/LandingPage/Services'
import { Featured } from '@/components/LandingPage/Featured'
// import { Team } from '@/components/LandingPage/Team'
// import { Finisher } from '@/components/LandingPage/Finisher'
import { Contact } from '@/components/LandingPage/Contact'
import { Navbar } from '@/components/LandingPage/Navbar'
import { Footer } from '@/components/LandingPage/Footer'

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
