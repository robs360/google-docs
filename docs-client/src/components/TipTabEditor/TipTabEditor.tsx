import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"

const TipTabEditor = ({id}:{id:string}) => {
    return (
        <div>
             <SimpleEditor id={id} />
        </div>
    )
}

export default TipTabEditor