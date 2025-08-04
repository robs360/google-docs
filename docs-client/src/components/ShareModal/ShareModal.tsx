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

export function ShareModal() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="px-4 py-1 text-white 
          rounded-[7px] bg-blue-500 hover:bg-blue-500 hover:text-white" variant="outline">Share</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Share Deal</DialogTitle>
          
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Email</Label>
              <Input id="name-1" name="name" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Role</Label>
              <SelectField></SelectField>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button className="bg-blue-500 text-white hover:text-white" type="submit">Share</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
