// eslint-disable-next-line
import classes from "./Stravovani.module.scss";
import allergens from "../../../public/img/alergeny2.png";
import Image from "next/legacy/image"
import Link from "next/link";
import { useEffect, useState } from "react";
import { FoodData } from "@features/web/components/types";

type StravovaniProps = {

}

const Stravovani: React.FC<StravovaniProps> = ({

}) => {
    const [menuData, setMenuData] = useState<FoodData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("https://www.strava.cz/strava5/Jidelnicky/XML?zarizeni=4129");
                const text = await response.text();
                const parser = new DOMParser();
                const xml = parser.parseFromString(text, "application/xml");

                const days: Array<FoodData> = Array.from(xml.getElementsByTagName("den")).map((day) => {
                    const date = day.getAttribute("datum") || "";
                    const meals = Array.from(day.getElementsByTagName("jidlo")).map((meal) => ({
                        name: meal.getAttribute("nazev") || "",
                        type: meal.getAttribute("druh") || "",
                        allergens: meal.getAttribute("alergeny") || "",
                    }));
                    return { date, meals };
                });

                setMenuData(days);
            } catch (error) {
                console.error("Error fetching or parsing XML:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <p>Načítám data...</p>;
    }
    return (

        <div>
            <h1>Jídelní lístek</h1>
            {menuData.length === 0 ? (
                <p>Žádná data nejsou k dispozici.</p>
            ) : (
                <div>
                    {menuData.map((day) => (
                        <div key={day.date} className="mb-4">
                            <h2 className="font-bold text-xl mb-2">Datum: {day.date}</h2>
                            <table className="table-auto border-collapse border border-gray-300 w-full">
                                <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-4 py-2">Jídlo</th>
                                        <th className="border border-gray-300 px-4 py-2">Typ</th>
                                        <th className="border border-gray-300 px-4 py-2">Alergeny</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {day.meals.map((meal, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-4 py-2">{meal.name}</td>
                                            <td className="border border-gray-300 px-4 py-2">{meal.type}</td>
                                            <td className="border border-gray-300 px-4 py-2">{meal.allergens || "Žádné"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Stravovani;