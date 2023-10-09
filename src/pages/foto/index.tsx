// eslint-disable-next-line
//import classes from "./FotoPage.module.css";
import Link from "next/link";
import { getApiURL } from "../../../src/helpers/utils";

type FotoPageProps = {
    years: Array<any>
}
const FotoPage: React.FC<FotoPageProps> = ({
    years
}) => {
    
    return <>
        <div className="container-fluid">
            <div className={" row my-4 justify-content-center align-items-center"}>
                <div className="col-10">
                {/* <h1 className="text-center mb-4">Fotogalerie</h1> */}
                <div className="text-blue fw-bold text-center h1 my-3">Vyberte školní rok</div>
                    {years.map((year, index) => {
                        return <Link key={year} href={"/foto/" + year.replace("/", "_")}><div className="text-blue fw-bold text-center h3 my-3">{year}</div></Link>;
                    })}
                </div>
            </div>
        </div>
    </>;
}

export async function getServerSideProps(context) {
    let yearsArray = await(await fetch(getApiURL("getPhotosYears"))).json();
    return {
      props: { years: yearsArray},
    }
  }

export default FotoPage;

