"use client"
import { useQuery } from "convex/react"
import { api } from "@workspace/backend/_generated/api"

export default function Page() {
  const users = useQuery(api.users.getMany)
  return (
    <div className="flex items-center  flex-col justify-center min-h-svh">
        <h1 className="text-2xl font-bold">Hello World app/widget</h1>
        {JSON.stringify(users)}
    </div>
  )
}
