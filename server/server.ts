import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));

// Route pour récupérer et envoyer les données depuis Airtable
app.get("/api", async (req: Request, res: Response): Promise<void> => {
  try {
    // Appel à l'API Airtable
    const response = await globalThis.fetch(
      "https://api.airtable.com/v0/appRbmrbJj8DO4Fmb/tblVX5Suv30stk1P8",
      {
        headers: {
          Authorization: `Bearer patqGqNfjpUuvUtE1.d2c5786c6a19799b5012e3760afcbfba70328cb13ffef1f9361f4a50e92d1043`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Erreur API Airtable : ${response.statusText}`);
    }

    // Récupère et formate les données
    const data = await response.json();
    const filteredData = data.records.reduce((acc: any, record: any) => {
      acc[record.id] = {
        companyName: record.fields.CompanyName || "Nom inconnu",
        logo: record.fields.Logo || "",
        category: record.fields.Category || "",
        typeOfMember: record.fields["Type of Member"] || "",
        innovationDriver: record.fields.InnovationDriver || "Non spécifié",
        website: record.fields.Website || "",
      };
      return acc;
    }, {});

    // Envoie les données formatées au frontend
    res.status(200).json(filteredData);
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des données" });
  }
});

// Écoute sur le port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur ${PORT}`);
});
