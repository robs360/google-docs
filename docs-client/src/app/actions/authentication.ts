'use server'
type TUser={
    name:string,
    email:string
    password:string
    image:string
}

export const registerUser = async (user: TUser) => {
    try {
        console.log(user)
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/register`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user)
        })
        const ressult = await res.json()
        console.log("done ",ressult)
        return ressult
    }
    catch (err) {
        console.log(err)
    }
}

export const loginUser = async (userData: { email: string, password: string }) => {
    try {

        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        })
        const ressult = await res.json()
        return ressult
    }
    catch (err) {
        console.log(err)
    }
}