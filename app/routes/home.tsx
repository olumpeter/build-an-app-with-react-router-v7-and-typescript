import { useEffect, useState } from "react"
import type { Route } from "./+types/home"

type User = {
    id: number
    login: string
    avatar_url: string
    showDetails: boolean
}

type UserDetails = {
    name: string
    company: string
    location: string
}

export async function loader() {
    const res = await fetch("https://api.github.com/users")

    if (!res.ok) {
        throw new Error(`HTTP Error! status: ${res.status}`)
    }

    const users: User[] = await res.json()

    return { users }
}

export default function Home({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState(loaderData.users)

    function handleShowDetails(userId: number) {
        const nextUsers = users.map((user, index) => {
            if (user.id === userId) {
                return { ...user, showDetails: true }
            } else {
                return user
            }
        })

        setUsers(nextUsers)
    }

    function handleHideDetails(e: any, userId: number) {
        e.stopPropagation()
        const nextUsers = users.map((user) => {
            if (user.id === userId) {
                return { ...user, showDetails: false }
            } else {
                return user
            }
        })

        setUsers(nextUsers)
    }

    return (
        <>
            <section className="w-1/2 m-auto border border-gray-400 p-8 rounded">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="m-4 cursor-pointer"
                        onClick={() => handleShowDetails(user.id)}
                    >
                        <div className="flex">
                            <img
                                src={user.avatar_url}
                                alt="avatar"
                                className="rounded-full w-12"
                            />
                            <p className="my-auto font-semibold ml-2">
                                {user.login}
                            </p>
                        </div>
                        {user.showDetails == true ? (
                            <>
                                <button
                                    onClick={(e) =>
                                        handleHideDetails(e, user.id)
                                    }
                                >
                                    X
                                </button>
                                <UserDetails userLogin={user.login} />
                            </>
                        ) : null}
                    </div>
                ))}
            </section>
        </>
    )
}

function UserDetails({ userLogin }: { userLogin: string }) {
    const [userDetails, setUserDetails] = useState<
        UserDetails | undefined
    >()

    useEffect(() => {
        const fetchUserDetails = async () => {
            const res = await fetch(
                `https://api.github.com/users/${userLogin}`
            )

            if (!res.ok) {
                throw new Error(`HTTP Error! Status: ${res.status}`)
            }

            const userDetails: UserDetails = await res.json()

            setUserDetails(userDetails)
        }
        fetchUserDetails()
    }, [])

    return (
        <>
            <p className="font-semibold">{userDetails?.name}</p>
            <p className="text-sm">{userDetails?.company}</p>
            <p className="text-sm">{userDetails?.location}</p>
        </>
    )
}
