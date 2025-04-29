"use client";

import { useState, useEffect, ReactNode } from "react";
import { 
  Card, 
  CardBody,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Spinner,
  Selection
} from "@nextui-org/react";
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ChevronDown, 
  Filter 
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

// Types de formation disponibles avec leurs libellés
const formationTypes = {
  PSC1: "PSC1 - Prévention et Secours Civiques niveau 1",
  PSE1: "PSE1 - Premiers Secours en Équipe niveau 1",
  PSE2: "PSE2 - Premiers Secours en Équipe niveau 2",
  BNSSA: "BNSSA - Brevet National de Sécurité et Sauvetage Aquatique",
  SSA: "SSA - Surveillant Sauveteur Aquatique",
  SST: "SST - Sauveteur Secouriste du Travail",
  BSB: "BSB - Brevet de Surveillant de Baignade",
  GQS: "GQS - Gestes Qui Sauvent",
  FORMATEUR: "Formations de Formateurs",
  RECYCLAGE: "Recyclage / Remise à niveau",
  PERMIS: "Permis Côtier"
};

// Mapping des statuts vers les couleurs de chips
const statusColorMap: Record<string, string> = {
  PLANIFIEE: "success",
  EN_COURS: "primary",
  TERMINEE: "default",
  ANNULEE: "danger",
};

// Colonnes pour le tableau - Exactement comme dans l'Excel
const columns = [
  { name: "FORMATION", uid: "formation" },
  { name: "TARIF", uid: "prix" },
  { name: "Date de début", uid: "dateDebut" },
  { name: "Date de Fin", uid: "dateFin" },
  { name: "Description", uid: "description" },
  { name: "Horaires", uid: "horaires" },
  { name: "INSCRIPTION", uid: "actions" },
];

// Interface pour définir la structure d'un élément Excel
interface ExcelItem {
  FORMATION: string;
  TARIF: number | string;
  "Date de début": string | Date;
  "Date de Fin": string | Date;
  Description: string | null;
  Horaires: string;
  [key: string]: any;
}

// Interface pour une formation formatée pour l'affichage
interface Formation {
  id: string;
  titre: string;
  type: string;
  dateDebutStr: string;  // Date as string
  dateFinStr: string;    // Date as string
  dateDebutObj: Date;    // Date as object (for filtering)
  description: string | null;
  duree: string;
  prix: number | string;
  statut: string;
}

export default function AgendaPage() {
  // États pour les filtres
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all");
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);
  
  // Extraire le type de formation depuis le titre
  const extractType = (titre: string): string => {
    if (titre.toLowerCase().includes("psc1") || titre.toLowerCase().includes("psc")) return "PSC1";
    if (titre.toLowerCase().includes("pse1")) return "PSE1";
    if (titre.toLowerCase().includes("pse2")) return "PSE2";
    if (titre.toLowerCase().includes("bnssa")) return "BNSSA";
    if (titre.toLowerCase().includes("ssa")) return "SSA";
    if (titre.toLowerCase().includes("sst")) return "SST";
    if (titre.toLowerCase().includes("bsb")) return "BSB";
    if (titre.toLowerCase().includes("gqs")) return "GQS";
    if (titre.toLowerCase().includes("formateur")) return "FORMATEUR";
    if (titre.toLowerCase().includes("recyclage") || titre.toLowerCase().includes("continue")) return "RECYCLAGE";
    if (titre.toLowerCase().includes("permis côtier")) return "PERMIS";
    return "AUTRE";
  };
  
  // Charger les formations depuis le fichier Excel
  useEffect(() => {
    const loadFormations = async () => {
      try {
        setIsLoading(true);
        
        // Lire le fichier Excel
        const excelData = await fetch('/RECAP_FORMATIONS_pour site.xlsx').then(res => res.arrayBuffer());
        
        // Utiliser SheetJS pour lire le contenu du fichier Excel
        const workbook = XLSX.read(excelData, {
          type: 'array',
          raw: true  // On ne convertit pas les dates automatiquement
        });
        
        // Lire la première feuille
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convertir la feuille en JSON
        const data = XLSX.utils.sheet_to_json<ExcelItem>(worksheet, { 
          raw: true, 
          defval: null,
          rawNumbers: false  // Pour conserver le format des cellules
        });
        
        // Fonction pour extraire la chaîne de date et la formater au format JJ/MM/AAAA
        const getDateString = (dateValue: any): string => {
          if (!dateValue) return "";
          
          // Si c'est une chaîne de format américain M/D/YY ou M/D/YYYY
          if (typeof dateValue === 'string') {
            // Format américain typique: M/D/YY ou M/D/YYYY ou MM/DD/YYYY
            const usDateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2}|\d{4})$/;
            const match = dateValue.match(usDateRegex);
            
            if (match) {
              // Dans le format américain, le premier nombre est le mois, le deuxième est le jour
              const month = match[1].padStart(2, '0');
              const day = match[2].padStart(2, '0');
              let year = match[3];
              
              // Si l'année est sur 2 chiffres, convertir en 4 chiffres
              if (year.length === 2) {
                year = parseInt(year) < 50 ? `20${year}` : `19${year}`;
              }
              
              // Retourner au format français JJ/MM/AAAA
              return `${day}/${month}/${year}`;
            }
          }
          
          // Si c'est une date JS, la formater en chaîne JJ/MM/AAAA
          if (dateValue instanceof Date) {
            const day = dateValue.getDate().toString().padStart(2, '0');
            const month = (dateValue.getMonth() + 1).toString().padStart(2, '0');
            const year = dateValue.getFullYear();
            return `${day}/${month}/${year}`;
          }
          
          // Pour les formats comme '3/30/25', inverser mois et jour
          const shortUsDateRegex = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2})$/;
          if (typeof dateValue === 'string') {
            const match = dateValue.match(shortUsDateRegex);
            if (match) {
              const month = match[1].padStart(2, '0');
              const day = match[2].padStart(2, '0');
              const year = `20${match[3]}`; // Supposer que c'est 2000+ pour les années à 2 chiffres
              return `${day}/${month}/${year}`;
            }
          }
          
          // Si tout échoue, essayer de convertir en date et formater
          try {
            const dateStr = String(dateValue);
            // Vérifier si c'est au format M/D/Y
            if (/^\d{1,2}\/\d{1,2}\/\d{2,4}$/.test(dateStr)) {
              const parts = dateStr.split('/');
              // En supposant format américain, inverser mois et jour
              const month = parts[0].padStart(2, '0');
              const day = parts[1].padStart(2, '0');
              let year = parts[2];
              if (year.length === 2) year = `20${year}`;
              return `${day}/${month}/${year}`;
            }
            
            // Sinon essayer de créer une date et la formater
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            }
          } catch (e) {
            console.error("Erreur lors de la conversion de date:", e);
          }
          
          // Si vraiment rien ne fonctionne, retourner la valeur d'origine
          return String(dateValue);
        };
        
        // Fonction pour créer un objet Date à partir d'une chaîne (pour le filtrage)
        const createDateObject = (dateStr: string): Date => {
          if (!dateStr) return new Date();
          
          try {
            const parts = dateStr.split(/[/\-\s]/);
            if (parts.length >= 3) {
              // Format JJ/MM/AAAA attendu
              const day = parseInt(parts[0]);
              const month = parseInt(parts[1]) - 1; // Mois JS commence à 0
              const year = parseInt(parts[2]);
              
              if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                return new Date(year, month, day);
              }
            }
          } catch (e) {
            console.error("Erreur lors de la conversion de date:", e);
          }
          
          return new Date();
        };
        
        // Convertir les données au format attendu
        const formattedData: Formation[] = data.map((item, index) => {
          const type = extractType(item.FORMATION || "");
          const dateDebutStr = getDateString(item["Date de début"]);
          const dateFinStr = getDateString(item["Date de Fin"]);
          
          return {
            id: `formation-${index}`,
            titre: item.FORMATION || "",
            type: type,
            dateDebutStr: dateDebutStr,
            dateFinStr: dateFinStr,
            dateDebutObj: createDateObject(dateDebutStr), // Pour le filtrage
            description: item.Description,
            duree: item.Horaires || "",
            prix: item.TARIF || 0,
            statut: "PLANIFIEE" // Valeur par défaut
          };
        });
        
        setFormations(formattedData);
        setIsLoading(false);
      } catch (err) {
        console.error("Erreur lors du chargement des formations:", err);
        setError(err);
        setIsLoading(false);
        toast.error("Erreur lors du chargement des formations");
      }
    };
    
    loadFormations();
  }, []);
  
  // Filtrer les formations en fonction des critères sélectionnés
  const filteredFormations = formations.filter(formation => {
    // Filtre par type
    const typeMatch = selectedType === "all" || formation.type === selectedType;
    
    // Filtre par période
    let periodMatch = selectedPeriod === "all";
    if (!periodMatch) {
      const formationDate = formation.dateDebutObj;
      const currentDate = new Date();
      
      switch(selectedPeriod) {
        case "2025":
          periodMatch = formationDate.getFullYear() === 2025;
          break;
        case "2024":
          periodMatch = formationDate.getFullYear() === 2024;
          break;
        case "recent":
          // Les 3 prochains mois
          const threeMonthsLater = new Date();
          threeMonthsLater.setMonth(currentDate.getMonth() + 3);
          periodMatch = formationDate >= currentDate && formationDate <= threeMonthsLater;
          break;
      }
    }
    
    return typeMatch && periodMatch;
  });
  
  // Formater le prix pour l'affichage
  const formatPrixForDisplay = (prix: number | string) => {
    if (typeof prix === 'number') {
      return `${prix} €`;
    }
    return prix;
  };
  
  // Générer un email d'inscription
  const generateEmailLink = (formation: Formation) => {
    const sujet = `Inscription: ${formation.titre}`;
    
    let dates = "";
    if (formation.description) {
      dates = formation.description;
    } else {
      dates = `Du ${formation.dateDebutStr} au ${formation.dateFinStr}`;
    }
    
    const corps = `Bonjour,\n\nJe souhaite m'inscrire à la formation suivante :\n\nFormation : ${formation.titre}\nDates : ${dates}\nHoraires : ${formation.duree}\n\nMerci de me confirmer les modalités d'inscription.\n\nCordialement,`;
    
    return `mailto:contact@aloha-sauvetage.fr?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`;
  };

  // Gestionnaire pour le changement de type de formation
  const handleTypeSelectionChange = (keys: Selection) => {
    const key = keys instanceof Set ? Array.from(keys)[0] : keys;
    if (key) {
      setSelectedType(key.toString());
    }
  };
  
  // Gestionnaire pour le changement de période
  const handlePeriodSelectionChange = (keys: Selection) => {
    const key = keys instanceof Set ? Array.from(keys)[0] : keys;
    if (key) {
      setSelectedPeriod(key.toString());
    }
  };

  // Rendu des cellules du tableau
  const renderCell = (formation: Formation, columnKey: string): ReactNode => {
    switch (columnKey) {
      case "formation":
        return (
          <div>
            <p className="text-bold text-small capitalize">{formation.titre}</p>
            <p className="text-bold text-tiny text-default-400 block sm:hidden">
              {formationTypes[formation.type as keyof typeof formationTypes] || formation.type}
            </p>
          </div>
        );
      case "prix":
        return (
          <p className="text-bold text-small">
            {formatPrixForDisplay(formation.prix)}
          </p>
        );
      case "dateDebut":
        return (
          <p className="text-bold text-small">
            {formation.dateDebutStr}
          </p>
        );
      case "dateFin":
        return (
          <p className="text-bold text-small">
            {formation.dateFinStr}
          </p>
        );
      case "description":
        return formation.description || "-";
      case "horaires":
        return formation.duree;
      case "actions":
        const emailLink = generateEmailLink(formation);
        return (
          // Utiliser un <a> HTML standard au lieu du composant Button pour résoudre le problème sur mobile
          <a 
            href={emailLink}
            className="inline-block bg-primary text-white py-2 px-4 rounded-md text-sm font-medium text-center hover:bg-primary-dark transition-colors"
            rel="noopener noreferrer"
          >
            S'inscrire
          </a>
        );
      default:
        return null;
    }
  };

  // Calcul des statistiques pour les cartes
  const totalFormations = filteredFormations.length;
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 flex justify-center items-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  // Rendu du composant
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête avec animation */}
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6 relative inline-block">
            Calendrier des formations
            <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#0e5399] to-transparent"></span>
          </h1>
          <p className="text-xl font-mk-abel text-gray-600 max-w-3xl mx-auto">
            Consultez nos prochaines sessions de formation et inscrivez-vous en ligne
          </p>
        </div>

        {/* Cartes statistiques avec effet d'élévation */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card className="overflow-visible hover:shadow-lg transition-shadow duration-300">
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="p-4 rounded-full bg-primary/10">
                <Calendar className="w-8 h-8 text-primary"/>
              </div>
              <div>
                <p className="text-default-500 text-lg">Sessions à venir</p>
                <p className="text-3xl font-semibold">{totalFormations}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="overflow-visible hover:shadow-lg transition-shadow duration-300">
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="p-4 rounded-full bg-success/10">
                <Users className="w-8 h-8 text-success"/>
              </div>
              <div>
                <p className="text-default-500 text-lg">Formations disponibles</p>
                <p className="text-3xl font-semibold">{Object.keys(formationTypes).length}</p>
              </div>
            </CardBody>
          </Card>

          <Card className="overflow-visible hover:shadow-lg transition-shadow duration-300">
            <CardBody className="flex flex-row items-center gap-4 p-6">
              <div className="p-4 rounded-full bg-warning/10">
                <CheckCircle2 className="w-8 h-8 text-warning"/>
              </div>
              <div>
                <p className="text-default-500 text-lg">Taux de réussite</p>
                <p className="text-3xl font-semibold">98%</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filtres avec style amélioré */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="shadow" 
                  endContent={<ChevronDown className="text-small" />}
                  className="capitalize bg-white"
                  startContent={<Filter className="w-4 h-4" />}
                >
                  {selectedType === "all" ? "Toutes les formations" : formationTypes[selectedType as keyof typeof formationTypes]}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Types de formation"
                variant="flat"
                closeOnSelect
                selectionMode="single"
                selectedKeys={new Set([selectedType])}
                onSelectionChange={handleTypeSelectionChange}
              >
                <DropdownItem key="all">Toutes les formations</DropdownItem>
                <DropdownItem key="PSC1">{formationTypes.PSC1}</DropdownItem>
                <DropdownItem key="PSE1">{formationTypes.PSE1}</DropdownItem>
                <DropdownItem key="PSE2">{formationTypes.PSE2}</DropdownItem>
                <DropdownItem key="BNSSA">{formationTypes.BNSSA}</DropdownItem>
                <DropdownItem key="SSA">{formationTypes.SSA}</DropdownItem>
                <DropdownItem key="FORMATEUR">{formationTypes.FORMATEUR}</DropdownItem>
                <DropdownItem key="RECYCLAGE">{formationTypes.RECYCLAGE}</DropdownItem>
                <DropdownItem key="PERMIS">{formationTypes.PERMIS}</DropdownItem>
              </DropdownMenu>
            </Dropdown>
            
            <Dropdown>
              <DropdownTrigger>
                <Button 
                  variant="shadow" 
                  endContent={<ChevronDown className="text-small" />}
                  className="capitalize bg-white"
                  startContent={<Calendar className="w-4 h-4" />}
                >
                  {selectedPeriod === "all" ? "Toutes les périodes" : 
                   selectedPeriod === "2025" ? "Année 2025" :
                   selectedPeriod === "2024" ? "Année 2024" : 
                   "3 prochains mois"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Périodes disponibles"
                variant="flat"
                closeOnSelect
                selectionMode="single"
                selectedKeys={new Set([selectedPeriod])}
                onSelectionChange={handlePeriodSelectionChange}
              >
                <DropdownItem key="all">Toutes les périodes</DropdownItem>
                <DropdownItem key="2025">Année 2025</DropdownItem>
                <DropdownItem key="2024">Année 2024</DropdownItem>
                <DropdownItem key="recent">3 prochains mois</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>

        {/* Tableau des formations avec style amélioré */}
        <Card className="shadow-xl overflow-visible border border-gray-200">
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              {error ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Erreur
                  </h3>
                  <p className="text-gray-500">
                    Une erreur est survenue lors du chargement des formations.
                    Veuillez réessayer plus tard.
                  </p>
                </div>
              ) : filteredFormations.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Aucune formation trouvée
                  </h3>
                  <p className="text-gray-500">
                    Aucune formation ne correspond à vos critères de recherche.
                    Essayez de modifier vos filtres ou revenez plus tard.
                  </p>
                </div>
              ) : (
                <Table
                  aria-label="Tableau des formations"
                  selectionMode="none"
                  className="min-w-full"
                >
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn 
                        key={column.uid} 
                        align={column.uid === "actions" ? "center" : "start"}
                        className="bg-gray-50 py-4 text-[#0e5399]"
                      >
                        {column.name}
                      </TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {filteredFormations.map((formation) => (
                      <TableRow key={formation.id} className="hover:bg-blue-50/50 transition-colors">
                        {columns.map((column) => (
                          <TableCell key={column.uid} className="py-4">
                            {renderCell(formation, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Section Contact avec design amélioré */}
        <div className="mt-16 bg-white rounded-xl p-8 text-center shadow-xl border border-gray-100 bg-gradient-to-br from-white to-blue-50">
          <h2 className="text-2xl font-mk-abel text-[#0e5399] mb-4 relative inline-block">
            Besoin d'aide pour choisir votre formation ?
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0e5399]/30"></span>
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous guider dans le choix de votre formation.
            N'hésitez pas à nous contacter pour plus d'informations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button
              as={Link}
              href="tel:0641543355"
              variant="bordered"
              color="primary"
              size="lg"
              className="font-mk-abel hover:bg-primary/10 transition-colors"
              startContent={<span className="i-lucide-phone w-4 h-4" />}
            >
              06 41 54 33 55
            </Button>
            <Button
              as={Link}
              href="mailto:contact@aloha-sauvetage.fr"
              color="primary"
              size="lg"
              className="font-mk-abel shadow-md hover:shadow-lg transition-all"
              endContent={<ArrowRight className="w-4 h-4" />}
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}