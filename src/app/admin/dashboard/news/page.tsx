// src/app/admin/dashboard/news/page.tsx
"use client"

import { useEffect, useState } from 'react'
import { 
 Button, 
 Table, 
 TableHeader, 
 TableBody, 
 TableColumn, 
 TableRow, 
 TableCell,
 Modal, 
 ModalContent, 
 ModalHeader, 
 ModalBody,
 ModalFooter,
 Input,
 Textarea,
 useDisclosure,
 Chip,
 ChipProps,
 Dropdown,
 DropdownTrigger,
 DropdownMenu,
 DropdownItem,
 Spinner
} from "@nextui-org/react"
import { PlusIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline"
import { toast } from 'sonner'

interface News {
 id: string;
 title: string;
 content: string;
 author?: string;
 published: boolean;
 createdAt: string;
 updatedAt: string;
}

const columns = [
 { name: "TITRE", uid: "title" },
 { name: "AUTEUR", uid: "author" },
 { name: "STATUT", uid: "published" },
 { name: "DATE", uid: "createdAt" },
 { name: "ACTIONS", uid: "actions" }
];

export default function NewsPage() {
 const [news, setNews] = useState<News[]>([]);
 const [selectedNews, setSelectedNews] = useState<News | null>(null);
 const [isLoading, setIsLoading] = useState(true);
 const { isOpen, onOpen, onClose } = useDisclosure();
 const [formData, setFormData] = useState({
   title: '',
   content: '',
   author: '',
   published: true
 });

 // Charger les actualités
 const loadNews = async () => {
   try {
     const response = await fetch('/api/admin/news');
     if (!response.ok) throw new Error('Erreur chargement actualités');
     const data = await response.json();
     setNews(data);
   } catch (error) {
     toast.error("Erreur lors du chargement des actualités");
   } finally {
     setIsLoading(false);
   }
 };

 useEffect(() => {
   loadNews();
 }, []);

 const handleSubmit = async () => {
   try {
     const response = await fetch('/api/admin/news', {
       method: selectedNews ? 'PUT' : 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(selectedNews ? { id: selectedNews.id, ...formData } : formData)
     });

     if (!response.ok) throw new Error('Erreur lors de la sauvegarde');

     onClose();
     loadNews();
     toast.success(selectedNews ? 'Actualité mise à jour' : 'Actualité créée');
     
   } catch (error) {
     toast.error("Une erreur est survenue");
   }
 };

 const handleDelete = async (id: string) => {
   if (!confirm('Êtes-vous sûr de vouloir supprimer cette actualité ?')) {
     return;
   }

   try {
     const response = await fetch(`/api/admin/news?id=${id}`, {
       method: 'DELETE'
     });

     if (!response.ok) throw new Error('Erreur suppression');

     loadNews();
     toast.success('Actualité supprimée');
   } catch (error) {
     toast.error("Erreur lors de la suppression");
   }
 };

 const handleEdit = (news: News) => {
   setSelectedNews(news);
   setFormData({
     title: news.title,
     content: news.content,
     author: news.author || '',
     published: news.published
   });
   onOpen();
 };

 const handleNew = () => {
   setSelectedNews(null);
   setFormData({
     title: '',
     content: '',
     author: '',
     published: true
   });
   onOpen();
 };

 const renderCell = (news: News, columnKey: React.Key) => {
   switch(columnKey) {
     case "title":
       return (
         <div className="flex flex-col">
           <p className="text-bold text-small capitalize">{news.title}</p>
           <p className="text-bold text-tiny text-default-400">
             {news.content.substring(0, 50)}...
           </p>
         </div>
       );
     case "author":
       return news.author || "-";
     case "published":
       return (
         <Chip 
           color={news.published ? "success" : "warning"}
           size="sm"
           variant="flat"
         >
           {news.published ? "Publié" : "Brouillon"}
         </Chip>
       );
     case "createdAt":
       return new Date(news.createdAt).toLocaleDateString('fr-FR');
     case "actions":
       return (
         <div className="flex gap-2">
           <Button
             isIconOnly
             size="sm"
             variant="light"
             onPress={() => handleEdit(news)}
           >
             <PencilSquareIcon className="w-4 h-4" />
           </Button>
           <Button
             isIconOnly
             size="sm"
             color="danger"
             variant="light"
             onPress={() => handleDelete(news.id)}
           >
             <TrashIcon className="w-4 h-4" />
           </Button>
         </div>
       );
     default:
       return news[columnKey as keyof News];
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
       <h1 className="text-2xl font-bold">Gestion des actualités</h1>
       <Button
         color="primary"
         startContent={<PlusIcon className="w-4 h-4" />}
         onPress={handleNew}
       >
         Nouvelle actualité
       </Button>
     </div>

     <Table aria-label="Liste des actualités">
       <TableHeader columns={columns}>
         {(column) => (
           <TableColumn key={column.uid}>
             {column.name}
           </TableColumn>
         )}
       </TableHeader>
       <TableBody items={news}>
         {(item) => (
           <TableRow key={item.id}>
             {(columnKey) => (
               <TableCell>
                 {renderCell(item, columnKey)}
               </TableCell>
             )}
           </TableRow>
         )}
       </TableBody>
     </Table>

     <Modal 
       isOpen={isOpen} 
       onClose={onClose}
       size="3xl"
     >
       <ModalContent>
         <ModalHeader>
           {selectedNews ? 'Modifier' : 'Nouvelle'} actualité
         </ModalHeader>
         <ModalBody>
           <div className="space-y-4">
             <Input
               label="Titre"
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               required
             />
             <Textarea
               label="Contenu"
               value={formData.content}
               onChange={(e) => setFormData({...formData, content: e.target.value})}
               minRows={5}
               required
             />
             <Input
               label="Auteur"
               value={formData.author}
               onChange={(e) => setFormData({...formData, author: e.target.value})}
             />
             <div className="flex items-center gap-2">
               <input
                 type="checkbox"
                 id="published"
                 checked={formData.published}
                 onChange={(e) => setFormData({...formData, published: e.target.checked})}
                 className="w-4 h-4"
               />
               <label htmlFor="published" className="text-sm">
                 Publier l'actualité
               </label>
             </div>
           </div>
         </ModalBody>
         <ModalFooter>
           <Button color="danger" variant="light" onPress={onClose}>
             Annuler
           </Button>
           <Button color="primary" onPress={handleSubmit}>
             {selectedNews ? 'Modifier' : 'Créer'}
           </Button>
         </ModalFooter>
       </ModalContent>
     </Modal>
   </div>
 );
}