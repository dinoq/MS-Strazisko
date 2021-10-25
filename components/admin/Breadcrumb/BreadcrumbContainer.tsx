import Breadcrumb from "./Breadcrumb";
import classes from "./Breadcrumb.module.scss";

const BreadcrumbContainer = (props) => {

    let items: [] = props.items ? props.items : [];

    const resetNav = () => {
        props.setItems([]);
    }

    const itemClicked = (index) => {
        props.setItems(items.slice(0, index + 1));
    }
    return (
        <Breadcrumb items={items} resetNav={resetNav} itemClicked={itemClicked}/>
    )
}

export default BreadcrumbContainer;