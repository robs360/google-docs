'use client'
import { ShareModal } from "@/components/ShareModal/ShareModal";
import TipTabEditor from "@/components/TipTabEditor/TipTabEditor"

import { useParams } from "next/navigation";

const DynamicDocument=()=>{
    const params = useParams();
    const id = params?.id as string;

    return(
        <div>
            <ShareModal></ShareModal>
            <TipTabEditor id={id}></TipTabEditor>
        </div>
    )
}
export default DynamicDocument