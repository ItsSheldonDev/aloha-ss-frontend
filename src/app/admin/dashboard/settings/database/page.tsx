"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  Card, 
  CardBody,
  Button,
  Divider,
  Chip,
} from "@nextui-org/react"
import { 
  Database,
  Download,
  Upload,
  FileDown,
  FileUp,
  RefreshCcw,
  AlertTriangle,
  Check
} from "lucide-react"
import { toast } from 'sonner'

interface DatabaseStats {
  users: number;
  formations: number;
  inscriptions: number;
  lastBackup: string | null;
}

export default function DatabaseSettings() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [stats, setStats] = useState<DatabaseStats>({
    users: 0,
    formations: 0,
    inscriptions: 0,
    lastBackup: null
  })

  // Rediriger si l'utilisateur n'est pas super admin
  useEffect(() => {
    if (session?.user?.role !== 'SUPER_ADMIN') {
      router.push('/admin/dashboard')
    }
  }, [session, router])

  // Charger les statistiques de la base de données
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/database/stats')
        if (!response.ok) throw new Error('Erreur chargement stats')
        const data = await response.json()
        setStats(data)
      } catch (error) {
        toast.error("Erreur lors du chargement des statistiques")
      }
    }

    loadStats()
  }, [])

  const handleExport = async () => {
    try {
      setIsExporting(true)
      const response = await fetch('/api/admin/database/export', {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Erreur export')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `backup-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()
      
      toast.success('Export réussi')
    } catch (error) {
      toast.error("Erreur lors de l'export")
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    try {
      setIsImporting(true)
      const file = e.target.files[0]
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/database/import', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Erreur import')
      
      toast.success('Import réussi')
      // Recharger les stats
      const statsResponse = await fetch('/api/admin/database/stats')
      const newStats = await statsResponse.json()
      setStats(newStats)
    } catch (error) {
      toast.error("Erreur lors de l'import")
    } finally {
      setIsImporting(false)
      // Réinitialiser l'input file
      e.target.value = ''
    }
  }

  const handleReset = async () => {
    if (!confirm('⚠️ ATTENTION : Cette action va réinitialiser toute la base de données. Cette action est irréversible. Êtes-vous sûr ?')) 
      return

    if (!confirm('Dernière confirmation : Toutes les données seront perdues. Continuer ?'))
      return

    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/database/reset', {
        method: 'POST'
      })

      if (!response.ok) throw new Error('Erreur reset')
      
      toast.success('Base de données réinitialisée')
      // Recharger les stats
      const statsResponse = await fetch('/api/admin/database/stats')
      const newStats = await statsResponse.json()
      setStats(newStats)
    } catch (error) {
      toast.error("Erreur lors de la réinitialisation")
    } finally {
      setIsLoading(false)
    }
  }

  if (session?.user?.role !== 'SUPER_ADMIN') {
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Base de donnees</h1>
        <p className="text-gray-500">Gérer les sauvegardes et restaurations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Statistiques */}
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Statistiques
            </h2>
            <Divider className="my-4" />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Utilisateurs</span>
                <Chip size="sm" variant="flat">{stats.users}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Formations</span>
                <Chip size="sm" variant="flat">{stats.formations}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Inscriptions</span>
                <Chip size="sm" variant="flat">{stats.inscriptions}</Chip>
              </div>
              <div className="flex justify-between items-center">
                <span>Dernière sauvegarde</span>
                <Chip 
                  size="sm" 
                  variant="flat"
                  color={stats.lastBackup ? "success" : "warning"}
                >
                  {stats.lastBackup 
                    ? new Date(stats.lastBackup).toLocaleDateString('fr-FR') 
                    : 'Jamais'}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Actions */}
        <Card>
          <CardBody className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileDown className="w-5 h-5" />
              Actions
            </h2>
            <Divider className="my-4" />
            <div className="space-y-4">
              <Button
                startContent={<Download className="w-4 h-4" />}
                color="primary"
                className="w-full"
                isLoading={isExporting}
                onClick={handleExport}
              >
                Exporter les données
              </Button>

              <div className="relative">
                <Button
                  startContent={<Upload className="w-4 h-4" />}
                  color="primary"
                  variant="bordered"
                  className="w-full"
                  isLoading={isImporting}
                >
                  Importer des données
                </Button>
                <input 
                  type="file" 
                  accept=".json"
                  onChange={handleImport}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isImporting}
                />
              </div>

              <Button
                startContent={<RefreshCcw className="w-4 h-4" />}
                color="danger"
                variant="flat"
                className="w-full"
                isLoading={isLoading}
                onClick={handleReset}
              >
                Réinitialiser la base de données
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Avertissements */}
      <Card className="mt-8 bg-danger-50">
        <CardBody>
          <div className="flex gap-2 text-danger">
            <AlertTriangle className="w-5 h-5" />
            <div>
              <h3 className="text-lg font-semibold">Attention</h3>
              <p className="text-sm mt-1">
                La réinitialisation de la base de données est une action irréversible. 
                Assurez-vous d'avoir une sauvegarde avant de procéder.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}