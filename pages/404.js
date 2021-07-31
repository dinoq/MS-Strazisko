// eslint-disable-next-line
//import classes from "./404.module.css";
import Image from "next/image";
import kid from "../public/img/404.webp";

const Error404 = (props) => {

    return (
        <>
            <div className="container my-5">
                <div className="row justify-content-center">
                    <div className="col-8 position-relative">
                        <div className="row justify-content-center">
                            <div className="col-3">
                                <Image src={kid} layout="responsive" />
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col text-center">
                                <h1>Chyba 404 - stránka nenalezena!</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error404;