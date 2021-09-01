// eslint-disable-next-line
import classes from "./KontaktPage.module.scss";

const KontaktPage: React.FC<{ propname: any }> = (props) => {
    
    return (
        <>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    <div className="col-8">
                        <h1 className="text-center mb-4">Kontakt</h1>
                        
                        <div className={classes["mapouter"]}>
                        <div className={classes["gmap_canvas"]}>
                            <iframe width="800" height="400" id="gmap_canvas" src="https://maps.google.com/maps?q=M%C5%A0%20Stra%C5%BEisko&t=&z=13&ie=UTF8&iwloc=&output=embed" scrolling="no"></iframe>
                        </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default KontaktPage;