import useSelector from "@hooks/useAppSelector";
import { RootState } from "FilesToDistribute/types";
import { FC } from "react";


export const BreadcrumbLight: FC<{hideDetailFrame: any}> = ({hideDetailFrame}) => {
    const items: any[] = useSelector((state: RootState) => state.breadcrumb.items)

    return (
        <div>
            test {">"} test1
            <div onClick={hideDetailFrame}>click</div>
            {items.length !==0 && items.map((i, index)=>{
                return (
                    <span key={index}>{i}</span>
                )
            })}
            <span>{items.length}</span>
        </div>
    )
}