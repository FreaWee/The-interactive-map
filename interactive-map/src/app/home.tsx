"use client";
import React, { useState, useEffect } from "react";
import { Url } from "url";

function Button(props) {
  return (
    <button
      onClick={props.handleClick}
      className={
        `btn min-h-[50px] w-[120px] p-1 text-white text-md border rounded-lg ease-in duration-200 flex justify-center items-center
        ${
          props.isActive
            ? "bg-blue-600 border-white"
            : "bg-[#325084] hover:bg-blue-400 border-[#325084]"
        }
        ` + props.className
      }
    >
      {props.text}
    </button>
  );
}

interface DataItem {
  companyName: string;
  logo;
  category: string;
  typeOfMember: string;
  innovationDriver: string;
  website: string;
}

export default function Home() {
  const [data, setData] = useState<DataItem[]>([]); // Stocke les données reçues
  const [selectedKey, setSelectedKey] = useState(""); // Clé de filtrage
  const [filteredData, setFilteredData] = useState<DataItem[]>([]); // Données filtrées
  const [startupData, setStartupData] = useState<DataItem[]>([]); // Données filtrées
  const [showButtons, setShowButtons] = useState(false); // Affiche les boutons secondaires
  const [showButtons2, setShowButtons2] = useState(false); // Affiche les boutons secondaires
  const [activeButton, setActiveButton] = useState("");

  // Fonction pour fetch les données depuis le serveur local
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((jsonData: Record<string, Omit<DataItem, "id">>) => {
        // Transforme les données en tableau
        const formattedData = Object.keys(jsonData).map((key) => ({
          id: key, // Ajoute l'ID
          ...jsonData[key], // Copie les propriétés
        }));

        console.log("Données formatées :", formattedData);
        setData(formattedData); // Définit les données formatées
      })
      .catch((error) => {
        console.error("Erreur lors du fetch des données :", error);
      });
  }, []);

  // 1. Bouton Startup : filtre les données par Type of Member "Startup"

  const handleStartupClick = () => {
    const filteredStartups: DataItem[] = data.filter((item) =>
      item.typeOfMember.includes("Startup")
    );

    setStartupData(filteredStartups);
    setFilteredData([]);

    setShowButtons(true);
    setShowButtons2(false);

    console.log("Données Startup filtrées :", filteredStartups);
  };

  // 2. Boutons principaux : filtrer par catégorie sur les données Startup

  const handleCategoryClick = (filterValue) => {
    if (startupData.length === 0) return; // Sécurité : éviter une erreur si startupData est vide

    const filteredData = startupData.filter((item) =>
      item.category.includes(filterValue)
    );
    console.log("Startup Data avant filtrage :", startupData);
    setFilteredData([]);

    console.log("Valeur de filtre (Category) :", filterValue);
    console.log("Résultat après filtrage :", filteredData);

    setSelectedKey(filterValue);
    setShowButtons2(true);
    setActiveButton(activeButton);

    console.log("Catégorie sélectionnée :", filteredData);
  };

  // 3. Boutons secondaires : filtrer par Innovation Driver

  const handleFilterClick = (filterValue: string) => {
    console.log("Clé de filtrage actuelle :", selectedKey);
    console.log(
      "Données de la catégorie sélectionnée :",
      data.filter((item) => item.category === selectedKey)
    );

    const filteredItems = data.filter(
      (item) =>
        item.category === selectedKey &&
        Array.isArray(item.innovationDriver) &&
        item.innovationDriver.includes(filterValue)
    );

    console.log("Données filtrées par Innovation Driver :", filteredItems);
    setFilteredData(filteredItems);
  };

  return (
    <div className="m-0 bg-[url('/back.png')] bg-cover bg-no-repeat h-screen w-full flex justify-center">
      <div className="flex flex-col min-h-screen justify-start max-w-full">
        {/* Bouton Startup */}
        <div className="flex justify-center mt-6 ">
          <Button text="Startups" handleClick={handleStartupClick} />
        </div>

        {showButtons && (
          <div className="w-[1080px] mt-6 max-h-[50px] grid grid-cols-5 gap-16">
            {[
              "Finance & Invest",
              "Design & Build",
              "Market & Transact",
              "Manage & Operate",
              "Live & Work",
            ].map((category) => (
              <div key={category} className="flex flex-col items-center">
                <Button
                  text={category}
                  handleClick={() => {
                    handleCategoryClick(category);
                    setActiveButton(category);
                  }}
                  isActive={activeButton === category}
                />
                {showButtons2 && selectedKey === category && (
                  <div className="mt-6 flex ">
                    <Button
                      text="Efficiency"
                      handleClick={() => handleFilterClick("Efficiency")}
                    />
                    <Button
                      text="User Experience"
                      handleClick={() => handleFilterClick("User-Centricity")}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredData.length > 0 ? (
          <div className="grid grid-cols-3 mt-10 bg-blue-400/50 border border-blue-200 gap-10 rounded-lg p-2 ">
            {filteredData.map((item, index) => {
              // Ajoute "https://" si l'URL ne contient pas déjà "http"
              const websiteUrl = item.website.startsWith("http")
                ? item.website
                : `https://${item.website}`;

              return (
                <div key={index} className="text-[#325084] text-xl">
                  <ul>
                    <li className="flex justify-center">
                      <a
                        href={websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="h-12 hover:animat-pulse"
                          src={item.logo[0]?.url || "/placeholder-logo.png"}
                          alt={item.companyName}
                        />
                      </a>
                    </li>
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          selectedKey && <p className="text-center text-red-500 mt-4"></p>
        )}
      </div>
    </div>
  );
}
