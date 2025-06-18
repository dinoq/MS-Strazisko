import Link from "next/link";

type PhotoPageProps = {
    years: Array<any>
}
const Photo: React.FC<PhotoPageProps> = ({
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
                    {years.length === 0 && <div className="text-blue fw-bold text-center h3 my-3">Žádná data!</div>}
                </div>
            </div>
        </div>
    </>;
}

export default Photo;

