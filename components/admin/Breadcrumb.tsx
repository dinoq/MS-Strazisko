import classes from "./Breadcrumb.module.scss";

const Breadcrumb = (props) => {

    let items: [] = props.items ? props.items : [];

    const resetNav = () => {
        props.setItems([]);
    }

    const itemClicked = (index) => {
        props.setItems(items.slice(0, index + 1));
    }
    return (
        <div className={classes.breadcrumb}>
            <span className={classes.breadcrumbItem + " link"} onClick={resetNav}>
                Foto
            </span>&nbsp;&gt;&nbsp;
            {items.map((item, index) => {
                return (
                    <span key={"breadcrumb-item-" + index} className={""}>
                        {index != 0 && " > "}
                        <span className={classes.breadcrumbItem + " link"} onClick={itemClicked.bind(this, index)}>
                            {item}
                        </span>
                    </span>
                )
            })}
        </div>
    )
}

export default Breadcrumb;