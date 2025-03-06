"use client"

import { useState, useEffect } from 'react';
import { 
  Button,
  Card, 
  CardBody,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner
} from "@nextui-org/react";
import { Calendar, Plus, X, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { TypeFormation, StatutFormation } from '@prisma/client';

const formationTypes = {
  PSC1: "PSC1 - Prévention et Secours Civiques niveau 1",
  PSE1: "PSE1 - Premiers Secours en Équipe niveau 1",
  PSE2: "PSE2 - Premiers Secours en Équipe niveau 2",
  BNSSA: "BNSSA - Brevet National de Sécurité et Sauvetage Aquatique",
  SSA: "SSA - Surveillant Sauveteur Aquatique",
  SST: "SST - Sauveteur Secouriste du Travail",
  BSB: "BSB - Brevet de Surveillant de Baignade"
};

interface Formation {
  id: string;
  titre: string;
  type: TypeFormation;
  date: string;
  duree: string;
  placesTotal: number;
  placesDisponibles: number;
  prix: number;
  lieu: string;
  formateur: string;
  statut: StatutFormation;
  createdAt: string;
}

interface FormData {
  titre: string;
  type: TypeFormation;
  date: string;
  duree: string;
  placesTotal: number;
  prix: number;
  lieu: string;
  formateur: string;
}

export default function CalendarPage() {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  );
  const [formData, setFormData] = useState<FormData>({
    titre: "",
    type: "PSC1",
    date: "",
    duree: "",
    placesTotal: 0,
    prix: 0,
    lieu: "",
    formateur: ""
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    loadFormations();
  }, [filterType, filterMonth]);

  const loadFormations = async () => {
    try {
      setIsLoading(true);
      const url = new URL('/api/admin/formations', window.location.origin);
      if (filterType !== "all") url.searchParams.append('type', filterType);
      if (filterMonth) url.searchParams.append('month', filterMonth);

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Erreur chargement des formations');
      const data = await response.json();
      setFormations(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des formations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = '/api/admin/formations';
      const method = selectedFormation ? 'PUT' : 'POST';
      const body = selectedFormation 
        ? { id: selectedFormation.id, ...formData }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

      await loadFormations();
      onClose();
      setFormData({
        titre: "",
        type: "PSC1",
        date: "",
        duree: "",
        placesTotal: 0,
        prix: 0,
        lieu: "",
        formateur: ""
      });
      
      toast.success(
        selectedFormation 
          ? 'Formation mise à jour avec succès'
          : 'Formation créée avec succès'
      );
    } catch (error) {
      toast.error('Une erreur est survenue');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette formation ?')) return;

    try {
      const response = await fetch(`/api/admin/formations/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur suppression');

      await loadFormations();
      toast.success('Formation supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Calendrier des formations</h1>
        <Button
          color="primary"
          startContent={<Plus className="w-4 h-4" />}
          onPress={() => {
            setSelectedFormation(null);
            setFormData({
              titre: "",
              type: "PSC1",
              date: "",
              duree: "",
              placesTotal: 0,
              prix: 0,
              lieu: "",
              formateur: ""
            });
            onOpen();
          }}
        >
          Nouvelle session
        </Button>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          label="Type de formation"
          selectedKeys={[filterType]}
          className="max-w-xs"
          onChange={(e) => setFilterType(e.target.value)}
        >
          <SelectItem key="all" value="all">
            Toutes les formations
          </SelectItem>
          {Object.entries(formationTypes).map(([key, value]) => (
            <SelectItem key={key} value={key}>
              {value}
            </SelectItem>
          ))}
        </Select>

        <Input
          type="month"
          label="Mois"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="max-w-xs"
        />
      </div>

      {/* Liste des formations */}
      <Card>
        <CardBody>
          <Table>
            <TableHeader>
              <TableColumn>FORMATION</TableColumn>
              <TableColumn>DATE</TableColumn>
              <TableColumn>PLACES</TableColumn>
              <TableColumn>FORMATEUR</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Aucune formation trouvée">
              {formations.map((formation) => (
                <TableRow key={formation.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold">{formation.titre}</p>
                      <p className="text-small text-default-500">
                        {formationTypes[formation.type]}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(formation.date).toLocaleDateString('fr-FR')}
                  </TableCell>
                  <TableCell>
                    {formation.placesDisponibles}/{formation.placesTotal}
                  </TableCell>
                  <TableCell>{formation.formateur}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        variant="light"
                        onPress={() => {
                          setSelectedFormation(formation);
                          setFormData({
                            titre: formation.titre,
                            type: formation.type,
                            date: formation.date.slice(0, 10),
                            duree: formation.duree,
                            placesTotal: formation.placesTotal,
                            prix: formation.prix,
                            lieu: formation.lieu,
                            formateur: formation.formateur
                          });
                          onOpen();
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        variant="light"
                        color="danger"
                        onPress={() => handleDelete(formation.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal ajout/édition */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader>
            {selectedFormation ? 'Modifier' : 'Nouvelle'} formation
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                required
              />
              <Select
                label="Type"
                selectedKeys={[formData.type]}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as TypeFormation })}
                required
              >
                {Object.entries(formationTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    {value}
                  </SelectItem>
                ))}
              </Select>
              <Input
                type="date"
                label="Date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
              <Input
                label="Durée"
                value={formData.duree}
                onChange={(e) => setFormData({ ...formData, duree: e.target.value })}
                required
              />
              <Input
                type="number"
                label="Places totales"
                value={formData.placesTotal.toString()}
                onChange={(e) => setFormData({ ...formData, placesTotal: parseInt(e.target.value) })}
                required
              />
              <Input
                type="number"
                label="Prix"
                value={formData.prix.toString()}
                onChange={(e) => setFormData({ ...formData, prix: parseFloat(e.target.value) })}
                required
                startContent="€"
              />
              <Input
                label="Lieu"
                value={formData.lieu}
                onChange={(e) => setFormData({ ...formData, lieu: e.target.value })}
                required
              />
              <Input
                label="Formateur"
                value={formData.formateur}
                onChange={(e) => setFormData({ ...formData, formateur: e.target.value })}
                required
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={onClose}
            >
              Annuler
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
            >
              {selectedFormation ? 'Modifier' : 'Créer'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}