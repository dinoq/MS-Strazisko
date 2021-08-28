export default function handler(req, res) {
    res.status(200).json({
        photos:
            ["https://www.ms-strazisko.cz/img/skolka.jpeg"]
    })
}