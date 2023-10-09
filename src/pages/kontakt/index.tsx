// eslint-disable-next-line
import classes from "./KontaktPage.module.scss";

type KontaktPageProps = {

}

const KontaktPage: React.FC<KontaktPageProps> = ({

}) => {
    
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10">
                        <h1 className="text-center mb-4">Kontakt</h1>
                        
                        <div className={classes["mapouter"]}>
                        <div className={classes["gmap_canvas"] + " row"}>
                            {/* <iframe width="800" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=M%C5%A0%20Stra%C5%BEisko&t=&z=13&ie=UTF8&iwloc=&output=embed" scrolling="no"></iframe> */}
                            <div style={{width: "100%"}}><iframe width="100%" height="600" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=en&amp;q=M%C5%A1%20stra%C5%BEisko%2025+(M%C5%A0%20Stra%C5%BEisko)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"><a href="https://www.gps.ie/truck-gps/">transport gps</a></iframe></div>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default KontaktPage;