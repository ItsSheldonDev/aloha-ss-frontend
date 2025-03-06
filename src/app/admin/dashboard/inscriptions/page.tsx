"use client"

import { useState, useEffect } from 'react';
import { 
  Card, 
  CardBody,
  Button,
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
  ChipProps,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Textarea,
  Spinner
} from "@nextui-org/react";
import { 
  PlusIcon, 
  PencilSquareIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PhoneIcon,
  CalendarIcon,
  EnvelopeIcon,
  UserIcon
} from "@heroicons/react/24/outline";
import { toast } from 'sonner';
import { StatutInscription } from '@prisma/client';
import Link from 'next/link';

// Types
interface Inscription {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  message?: string;
  statut: StatutInscription;
  createdAt: string;
  formation: {
    titre: string;
    type: string;
    date: string;
    duree: string;
    lieu: string;
  };
}

// Statut colors et labels
const statusColorMap: Record<StatutInscription, ChipProps["color"]> = {
  EN_ATTENTE: "warning",
  ACCEPTEE: "success",
  REFUSEE: "danger",
  ANNULEE: "default"
};

const statusLabelMap: Record<StatutInscription, string> = {
  EN_ATTENTE: "En attente",
  ACCEPTEE: "Acceptée",
  REFUSEE: "Refusée",
  ANNULEE: "Annulée"
};

// Définition des colonnes
const columns = [
  { name: "PARTICIPANT", uid: "participant" },
  { name: "FORMATION", uid: "formation" },
  { name: "CONTACT", uid: "contact" },
  { name: "DATE", uid: "date" },
  { name: "STATUT", uid: "statut" },
  { name: "ACTIONS", uid: "actions" }
];

export default function InscriptionsPage() {
  // States
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [selectedInscription, setSelectedInscription] = useState<Inscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set(["all"]));
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Chargement initial
  useEffect(() => {
    loadInscriptions();
  }, []);

  // Charger les inscriptions
  const loadInscriptions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/inscriptions');
      if (!response.ok) throw new Error('Erreur chargement inscriptions');
      const data = await response.json();
      setInscriptions(data);
    } catch (error) {
      toast.error("Erreur lors du chargement des inscriptions");
    } finally {
      setIsLoading(false);
    }
  };

  // Mettre à jour le statut
  const handleStatusChange = async (inscriptionId: string, newStatus: StatutInscription) => {
    try {
      const response = await fetch(`/api/admin/inscriptions/${inscriptionId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ statut: newStatus })
      });

      if (!response.ok) throw new Error('Erreur modification statut');
      await loadInscriptions();
      toast.success('Statut mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer une inscription
  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette inscription ?')) return;

    try {
      const response = await fetch(`/api/admin/inscriptions?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Erreur suppression');
      await loadInscriptions();
      toast.success('Inscription supprimée');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Filtrer les inscriptions
  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = [
      inscription.nom,
      inscription.prenom,
      inscription.email,
      inscription.formation.titre
    ].some(value => value.toLowerCase().includes(filterValue.toLowerCase()));

    const matchesStatus = statusFilter.has("all") || statusFilter.has(inscription.statut);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const pages = Math.ceil(filteredInscriptions.length / rowsPerPage);
  const items = filteredInscriptions.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // Rendu des cellules
  const renderCell = (inscription: Inscription, columnKey: React.Key) => {
    switch (columnKey) {
      case "participant":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {inscription.nom} {inscription.prenom}
            </p>
            <p className="text-bold text-tiny text-default-400">
              {new Date(inscription.dateNaissance).toLocaleDateString('fr-FR')}
            </p>
          </div>
        );
      
      case "formation":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">{inscription.formation.titre}</p>
            <p className="text-bold text-tiny text-default-400">
              {inscription.formation.lieu}
            </p>
          </div>
        );

      case "contact":
        return (
          <div className="flex flex-col">
            <p className="text-small">{inscription.email}</p>
            <p className="text-tiny text-default-400">{inscription.telephone}</p>
          </div>
        );

      case "date":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small">
              {new Date(inscription.formation.date).toLocaleDateString('fr-FR')}
            </p>
            <p className="text-tiny text-default-400">
              {inscription.formation.duree}
            </p>
          </div>
        );

      case "statut":
        return (
          <Chip
            className="capitalize"
            color={statusColorMap[inscription.statut]}
            size="sm"
            variant="flat"
          >
            {statusLabelMap[inscription.statut]}
          </Chip>
        );

      case "actions":
        return (
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => {
                setSelectedInscription(inscription);
                onOpen();
              }}
            >
              <PencilSquareIcon className="w-4 h-4" />
            </Button>

            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => handleDelete(inscription.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        );

      default:
        const value = inscription[columnKey as keyof Inscription];
        return value ? String(value) : '';
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
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des inscriptions</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <ClockIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-default-500">En attente</p>
              <p className="text-2xl font-semibold">
                {inscriptions.filter(i => i.statut === 'EN_ATTENTE').length}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-success/10">
              <CheckCircleIcon className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-default-500">Acceptées</p>
              <p className="text-2xl font-semibold">
                {inscriptions.filter(i => i.statut === 'ACCEPTEE').length}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-danger/10">
              <XCircleIcon className="w-6 h-6 text-danger" />
            </div>
            <div>
              <p className="text-default-500">Refusées</p>
              <p className="text-2xl font-semibold">
                {inscriptions.filter(i => i.statut === 'REFUSEE').length}
              </p>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="flex flex-row items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/10">
              <CalendarIcon className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-default-500">Ce mois</p>
              <p className="text-2xl font-semibold">
                {inscriptions.filter(i => {
                  const date = new Date(i.createdAt);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && 
                         date.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Rechercher par nom, prénom ou email..."
          startContent={<MagnifyingGlassIcon className="w-4 h-4 text-default-400" />}
          value={filterValue}
          onValueChange={setFilterValue}
        />
        <Select
          label="Statut"
          selectedKeys={statusFilter}
          onSelectionChange={(keys) => setStatusFilter(new Set(Array.from(keys) as string[]))}
          className="w-full sm:max-w-[200px]"
        >
          <SelectItem key="all" value="all">Tous les statuts</SelectItem>
          <SelectItem key="EN_ATTENTE" value="EN_ATTENTE">En attente</SelectItem>
          <SelectItem key="ACCEPTEE" value="ACCEPTEE">Acceptée</SelectItem>
          <SelectItem key="REFUSEE" value="REFUSEE">Refusée</SelectItem>
          <SelectItem key="ANNULEE" value="ANNULEE">Annulée</SelectItem>
        </Select>
      </div>

      {/* Table */}
      <Card>
        <CardBody>
          <Table
            aria-label="Table des inscriptions"
            bottomContent={
              <div className="flex justify-between items-center">
                <span className="text-small text-default-400">
                  {filteredInscriptions.length} inscriptions au total
                </span>
                <div className="flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
                    isDisabled={page === 1}
                  >
                    Précédent
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    onPress={() => setPage((prev) => Math.min(prev + 1, pages))}
                    isDisabled={page === pages}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            }
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn 
                  key={column.uid}
                  align={column.uid === "actions" ? "center" : "start"}
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody 
              items={items}
              emptyContent={
                <div className="text-center py-12">
                  <p className="text-default-400">Aucune inscription trouvée</p>
                </div>
              }
            >
              {(item) => (
                <TableRow key={item.id}>
                  {(columnKey) => (
                    <TableCell>{renderCell(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal de détails */}
      <Modal
        size="2xl"
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {selectedInscription && (
            <>
              <ModalHeader>
                <h3 className="text-xl font-semibold">
                  Détails de l'inscription
                </h3>
              </ModalHeader>

              <ModalBody>
                <div className="grid grid-cols-2 gap-6">
                  {/* Informations personnelles */}
                  <Card>
                    <CardBody>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Informations personnelles
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-small text-default-500">Nom complet</p>
                          <p className="font-medium">
                            {selectedInscription.nom} {selectedInscription.prenom}
                          </p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Email</p>
                          <div className="flex items-center gap-2">
                            <EnvelopeIcon className="w-4 h-4 text-default-400" />
                            <a
                              href={`mailto:${selectedInscription.email}`}
                              className="text-primary"
                            >
                              {selectedInscription.email}
                            </a>
                          </div>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Téléphone</p>
                          <div className="flex items-center gap-2">
                            <PhoneIcon className="w-4 h-4 text-default-400" />
                            <a
                              href={`tel:${selectedInscription.telephone}`}
                              className="text-primary"
                            >
                              {selectedInscription.telephone}
                            </a>
                          </div>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Date de naissance</p>
                          <p className="font-medium">
                            {new Date(selectedInscription.dateNaissance).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Informations de formation */}
                  <Card>
                    <CardBody>
                      <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        Informations de formation
                      </h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-small text-default-500">Formation</p>
                          <p className="font-medium">{selectedInscription.formation.titre}</p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Date</p>
                          <p className="font-medium">
                            {new Date(selectedInscription.formation.date).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Durée</p>
                          <p className="font-medium">{selectedInscription.formation.duree}</p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Lieu</p>
                          <p className="font-medium">{selectedInscription.formation.lieu}</p>
                        </div>
                        <div>
                          <p className="text-small text-default-500">Statut</p>
                          <Chip
                            className="capitalize mt-1"
                            color={statusColorMap[selectedInscription.statut]}
                            size="sm"
                            variant="flat"
                          >
                            {statusLabelMap[selectedInscription.statut]}
                          </Chip>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Message */}
                  {selectedInscription.message && (
                    <Card className="col-span-2">
                      <CardBody>
                        <h4 className="text-lg font-semibold mb-4">Message</h4>
                        <p className="text-gray-600 whitespace-pre-wrap">
                          {selectedInscription.message}
                        </p>
                      </CardBody>
                    </Card>
                  )}

                  {/* Dates */}
                  <Card className="col-span-2">
                    <CardBody>
                      <h4 className="text-lg font-semibold mb-4">Historique</h4>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-small text-default-500">Date d'inscription</p>
                          <p className="font-medium">
                            {new Date(selectedInscription.createdAt).toLocaleString('fr-FR')}
                          </p>
                        </div>
                        <Button
                          color="danger"
                          variant="light"
                          startContent={<TrashIcon className="w-4 h-4" />}
                          onPress={() => {
                            handleDelete(selectedInscription.id);
                            onClose();
                          }}
                        >
                          Supprimer l'inscription
                        </Button>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Fermer
                </Button>
                <div className="flex gap-2">
                  <Button
                    color="warning"
                    variant="flat"
                    startContent={<ClockIcon className="w-4 h-4" />}
                    onPress={() => {
                      handleStatusChange(selectedInscription.id, 'EN_ATTENTE');
                      onClose();
                    }}
                  >
                    En attente
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    startContent={<CheckCircleIcon className="w-4 h-4" />}
                    onPress={() => {
                      handleStatusChange(selectedInscription.id, 'ACCEPTEE');
                      onClose();
                    }}
                  >
                    Accepter
                  </Button>
                  <Button
                    color="danger"
                    variant="flat"
                    startContent={<XCircleIcon className="w-4 h-4" />}
                    onPress={() => {
                      handleStatusChange(selectedInscription.id, 'REFUSEE');
                      onClose();
                    }}
                  >
                    Refuser
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}