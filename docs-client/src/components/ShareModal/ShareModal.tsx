import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SelectField } from "./SelectField"
import { useState } from "react"
import { ShareDocs } from "@/app/actions/Share"

export function ShareModal({id}:{id:string}) {
  const [user, setuser] = useState("")
  const [role, setRole] = useState("")

  const shareData={
    user,role
  }
  const handleShare=async ()=>{
    const token=localStorage.getItem('token')
    if(token && shareData.user && shareData.role){
      const response=await ShareDocs({id,token,shareData})
      console.log(response)
    }
  }
  return (
    <Dialog>

      <DialogTrigger asChild>
        <Button className="px-4 py-1 w-[130px] h-[40px] text-white rounded-[7px] bg-blue-500 hover:bg-blue-500 hover:text-white" variant="outline">
          Share
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onClick={(e)=>{
          e.preventDefault()
          handleShare()
          }} className="flex flex-col space-y-6">
          <DialogHeader>
            <DialogTitle>Share Deal</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label>Email</Label>
              <Input value={user} onChange={e=>setuser(e.target.value)} id="email" />
            </div>

            <div className="grid gap-3">
              <Label>Role</Label>
              <SelectField setRole={setRole} />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button  className="bg-blue-500 text-white hover:text-white" type="submit">
              Share
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
