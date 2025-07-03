'use client'
import TipTabEditor from "@/components/TipTabEditor/TipTabEditor"
import { useParams } from "next/navigation";

const DynamicDocument=()=>{
    const params = useParams();
    const id = params?.id as string;

    return(
        <div>
            <TipTabEditor id={id}></TipTabEditor>
        </div>
    )
}
export default DynamicDocument