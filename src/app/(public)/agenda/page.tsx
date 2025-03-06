"use client"

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  ChipProps,
  Input,
  Divider,
  Spinner
} from "@nextui-org/react";
import { Calendar, Users, CheckCircle2, AlertCircle, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Types
interface Formation {
  id: string;
  titre: string;
  type: 'PSC1' | 'PSE1' | 'PSE2' | 'BNSSA' | 'SSA' | 'SST' | 'BSB';
  date: string;
  duree: string;
  placesTotal: number;
  placesDisponibles: number;
  statut: 'PLANIFIEE' | 'EN_COURS' | 'TERMINEE' | 'ANNULEE';
  prix: number;
  lieu: string;
}

const formationTypes = {
  PSC1: "PSC1 - Prévention et Secours Civiques niveau 1",
  PSE1: "PSE1 - Premiers Secours en Équipe niveau 1",
  PSE2: "PSE2 - Premiers Secours en Équipe niveau 2",
  BNSSA: "BNSSA - Brevet National de Sécurité et Sauvetage Aquatique",
  SSA: "SSA - Surveillant Sauveteur Aquatique",
  SST: "SST - Sauveteur Secouriste du Travail",
  BSB: "BSB - Brevet de Surveillant de Baignade"
};

const statusColorMap: Record<string, ChipProps["color"]> = {
  PLANIFIEE: "success",
  EN_COURS: "primary",
  TERMINEE: "default",
  ANNULEE: "danger",
};

const columns = [
  { name: "FORMATION", uid: "formation" },
  { name: "DATE", uid: "date" },
  { name: "DURÉE", uid: "duree" },
  { name: "PLACES", uid: "places" },
  { name: "PRIX", uid: "prix" },
  { name: "LIEU", uid: "lieu" },
  { name: "STATUT", uid: "statut" },
  { name: "ACTIONS", uid: "actions" }
];

function AgendaPage() {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [currentMonth, setCurrentMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [formations, setFormations] = useState<Formation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFormations();
  }, [selectedType, currentMonth]);

  const loadFormations = async () => {
    try {
      setIsLoading(true);
      let url = '/api/formations';
      const params = new URLSearchParams();
      
      if (selectedType !== 'all') {
        params.append('type', selectedType);
      }
      if (currentMonth) {
        params.append('month', currentMonth);
      }
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error('Erreur chargement');
      const data = await response.json();
      setFormations(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = (formation: Formation, columnKey: string) => {
    switch(columnKey) {
      case "formation":
        return (
          <div>
            <p className="text-bold text-small capitalize">{formation.titre}</p>
            <p className="text-bold text-tiny text-default-400">
              {formationTypes[formation.type]}
            </p>
          </div>
        );
      case "date":
        return (
          <p className="text-bold text-small">
            {new Date(formation.date).toLocaleDateString('fr-FR')}
          </p>
        );
      case "duree":
        return formation.duree;
      case "places":
        return `${formation.placesDisponibles}/${formation.placesTotal}`;
      case "prix":
        return `${formation.prix}€`;
      case "lieu":
        return formation.lieu;
      case "statut":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[formation.statut]}
            size="sm"
            variant="flat"
          >
            {formation.statut}
          </Chip>
        );
      case "actions":
        return (
          <Button
            as={Link}
            href={`/inscription?formation=${formation.type.toLowerCase()}&date=${formation.date}`}
            color="primary"
            size="sm"
            variant={formation.placesDisponibles === 0 ? "flat" : "solid"}
            isDisabled={formation.placesDisponibles === 0}
          >
            {formation.placesDisponibles === 0 ? "Complet" : "S'inscrire"}
          </Button>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-art-brush text-[#0e5399] mb-6">
            Calendrier des formations
          </h1>
          <p className="text-xl font-mk-abel text-gray-600 max-w-3xl mx-auto">
            Consultez nos prochaines sessions de formation et inscrivez-vous en ligne
          </p>
        </div>

        {/* Cartes statistiques */}
        <div className="grid gap-6 md:grid-cols-3 mb-12">
          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Calendar className="w-6 h-6 text-primary"/>
              </div>
              <div>
                <p className="text-default-500">Sessions à venir</p>
                <p className="text-2xl font-semibold">{formations.length}</p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-success/10">
                <Users className="w-6 h-6 text-success"/>
              </div>
              <div>
                <p className="text-default-500">Places disponibles</p>
                <p className="text-2xl font-semibold">
                  {formations.reduce((acc, curr) => acc + curr.placesDisponibles, 0)}
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody className="flex flex-row items-center gap-4">
              <div className="p-3 rounded-full bg-warning/10">
                <CheckCircle2 className="w-6 h-6 text-warning"/>
              </div>
              <div>
                <p className="text-default-500">Taux de réussite</p>
                <p className="text-2xl font-semibold">98%</p>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <Select
            label="Type de formation"
            selectedKeys={[selectedType]}
            className="max-w-xs"
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <SelectItem key="all" value="all">Toutes les formations</SelectItem>
            {Object.entries(formationTypes).map(([key, label]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </Select>

          <Input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {/* Tableau des formations */}
        <Card>
          <CardBody>
            <div className="overflow-x-auto">
              {formations.length > 0 ? (
                <Table
                  aria-label="Tableau des formations"
                  selectionMode="none"
                >
                  <TableHeader>
                    {columns.map((column) => (
                      <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                        {column.name}
                      </TableColumn>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {formations.map((formation) => (
                      <TableRow key={formation.id}>
                        {columns.map((column) => (
                          <TableCell key={column.uid}>
                            {renderCell(formation, column.uid)}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
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
              )}
            </div>
          </CardBody>
        </Card>

        {/* Section Contact */}
        <div className="mt-16 bg-white rounded-xl p-8 text-center">
          <h2 className="text-2xl font-mk-abel text-[#0e5399] mb-4">
            Besoin d'aide pour choisir votre formation ?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Notre équipe est là pour vous guider dans le choix de votre formation.
            N'hésitez pas à nous contacter pour plus d'informations.
          </p>
          <div className="flex justify-center gap-4">
            <Button
              as={Link}
              href="tel:0641543355"
              variant="bordered"
              color="primary"
              size="lg"
              className="font-mk-abel"
            >
              06 41 54 33 55
            </Button>
            <Button
              as={Link}
              href="mailto:contact@aloha-sauvetage.fr"
              color="primary"
              size="lg"
              className="font-mk-abel"
            >
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendaPage;