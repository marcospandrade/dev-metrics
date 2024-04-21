import { getUser } from '@/lib/auth'
import { Home } from './components/Home'
import { localApi } from '@/lib/api'
import { User } from '@/models/User.model'

export default async function Dashboard() {
  // const userLogged = getUser()
  // console.log('USERRR', user)
  // if (userLogged) {
  //   return (
  //     <>
  //       <Home userLogged={userLogged}></Home>
  //     </>
  //   )
  // }
  // const { data: user } = await localApi.get<User>('api/auth/getUser')
  // if (!user) {
  //   return <>LOADING</>
  // }
}
