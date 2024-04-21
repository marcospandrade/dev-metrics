import { Typography } from '@/lib/material'

const defaultProps = {
  brandName: 'EstimAi',
  brandLink: 'https://github.com/marcospandrade/estimai-web',
  routes: [
    { name: 'Home', path: 'https://localhost:3000/dashboard' },
    { name: 'Repo', path: 'https://github.com/marcospandrade/estimai-web' },
  ],
}

interface Route {
  name: string
  path: string
}

interface FooterProps {
  brandName?: string
  brandLink?: string
  routes?: Route[]
}

export function DashboardFooter({
  brandName = defaultProps.brandName,
  brandLink = defaultProps.brandLink,
  routes = defaultProps.routes,
}: FooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="py-3">
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <Typography variant="small" className="font-normal text-inherit">
          &copy; {year}, made with 🖤 by{' '}
          <a href={brandLink} target="_blank" className="transition-colors hover:text-gray-500">
            {brandName}
          </a>
        </Typography>
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-gray-500"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
