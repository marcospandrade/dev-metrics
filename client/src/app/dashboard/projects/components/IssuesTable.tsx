import { LibIcons } from '@/lib/icons'
import { Issue } from '@/models/Issue.model'
import { Project } from '@/models/Project.model'
import { Button } from '@material-tailwind/react'

interface IssueTableProps {
  tickets: Issue[]
}

export function IssuesTable({ tickets }: Readonly<IssueTableProps>) {
  if (!tickets) return <></>
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-indigo-100">
      <div className="w-full flex justify-between items-center mb-3 mt-1 px-3 py-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">List of Issues</h3>
        </div>
        <div className="ml-3">
          <div className="w-full max-w-sm min-w-[300px] relative">
            <div className="relative">
              <input
                className="bg-white w-full pr-11 h-10 pl-3 py-2 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded transition duration-200 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md"
                placeholder="Search for issue title or key..."
              />
              <button className="absolute h-8 w-8 right-1 top-1 my-auto px-2 flex items-center bg-white rounded " type="button">
                <LibIcons.SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </div>
      <table className="w-full text-sm table-auto text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-indigo-50">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              Summary
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Last sprint
            </th>
            <th scope="col" className="px-6 py-3">
              Story Points
            </th>
            <th scope="col" className="px-6 py-3">
              Created At
            </th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr className="odd:bg-white even:bg-indigo-50 border-b" key={ticket.id}>
              <th scope="row" className="px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white font-semibold">
                {ticket.jiraIssueKey}
              </th>
              <td className="p-4">
                <p className="text-sm">{ticket.summary}</p>
              </td>
              <td className="p-4">
                <p className="text-sm">{JSON.stringify(ticket.customFields) || ''}</p>
              </td>
              <td className="p-4">
                <p className="text-sm">{JSON.stringify(ticket.customFields) || ''}</p>
              </td>
              <td className="p-4">
                <p className="text-sm">{JSON.stringify(ticket.customFields) || ''}</p>
              </td>
              <td className="p-4">
                <p>{new Intl.DateTimeFormat('pt-br', { dateStyle: 'medium' }).format(new Date(ticket.createdAt))}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
