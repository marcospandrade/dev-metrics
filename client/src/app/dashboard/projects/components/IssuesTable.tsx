import { Issue } from "@/models/Issue.model"
import { Project } from "@/models/Project.model"
import { Button } from "@material-tailwind/react"

interface IssueTableProps {
    tickets: Issue[]
}

export function IssuesTable({ tickets }: Readonly<IssueTableProps>) {
    if (!tickets) return <></>
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Id
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Summary
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Jira Key
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Created At
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr className="odd:bg-white even:bg-indigo-50 border-b" key={ticket.id}>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {ticket.id}
                            </th>
                            <td className="px-6 py-4">{ticket.summary}</td>
                            <td className="px-6 py-4">{ticket.jiraIssueKey}</td>
                            <td className="px-6 py-4">{new Intl.DateTimeFormat('pt-br', { dateStyle: "medium" }).format(new Date(ticket.createdAt))}</td>
                            {/* <td className="px-6 py-4">
                                <Button className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                    Sync
                                </Button>
                            </td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}