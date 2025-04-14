import { CSSProperties, FC } from "react"
import classes from "./ContextMenu.module.scss";

type ContextMenuProps = {
    styles: CSSProperties
}
const ContextMenu: FC<ContextMenuProps> = ({
    styles
}) => {

    return (
        <div className={classes.contextMenu} style={{ ...styles }}>
            <span>Uložit jako</span>
        </div>
    )
}

export default ContextMenu;