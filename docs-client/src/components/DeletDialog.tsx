import { deleteDocs } from "@/app/actions/deleteDocs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { toast } from 'sonner'
export function AlertDialogDemo({ id }: { id: string }) {

    const handleDelete = async (id: string) => {
        const token = localStorage.getItem('token')
        if (token) {
            const response = await deleteDocs(id, token)
            if (response.deletedCount === 1) {
                
                toast.success('Document deleted successfully!', {
                    position: 'bottom-right', // positions: 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'top-center', 'bottom-center'
                    duration: 4000, // duration in ms
                })
            } else {
                // optional: handle failure
                toast.error('Failed to delete document.', { position: 'bottom-right' })
            }
        }
    };
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline">
                    <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(id)} className="bg-red-500">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
