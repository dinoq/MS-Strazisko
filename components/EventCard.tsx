// eslint-disable-next-line
import Image from "next/image";
import classes from "../styles/EventCard.module.scss";
import Card from "./ui/Card/Card";

const EventCard: React.FC<{ imgSrc: string, title: string, description: string, date: string }> = ({ imgSrc, title, description, date }) => {

    return (
            <div className={classes.card + " card mb-3"}>
                <div className="row g-0">
                    <div className="col-md-4 position-relative">
                        <Image src={imgSrc} alt="Obrázek události" layout="fill" objectFit="cover"/>
                    </div>
                    <div className="col-md-8">
                        <div className="card-body">
                            <div className={classes["event-date"]}>
                                {date}
                            </div>
                            <h5 className="card-title fw-bold">{title}</h5>
                            <p className="card-text" dangerouslySetInnerHTML={{ __html: `${description}` }}></p>
                            {/* <p className="card-text"><small className="text-muted">Naposledy editováno...</small></p> */}
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default EventCard;