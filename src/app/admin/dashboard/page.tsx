// src/app/admin/dashboard/page.tsx
'use client'

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardBody, Tabs, Tab } from "@nextui-org/react";
import { UserGroupIcon, CalendarIcon, PhotoIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const chartdata = [
  { date: 'Jan', inscriptions: 12 },
  { date: 'Feb', inscriptions: 18 },
  { date: 'Mar', inscriptions: 15 },
  { date: 'Apr', inscriptions: 25 },
  { date: 'May', inscriptions: 30 },
  { date: 'Jun', inscriptions: 28 },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
 
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0e5399]"></div>
      </div>
    );
  }
 
  if (status === "unauthenticated") {
    router.push('/admin');
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <Tabs 
          color="primary" 
          aria-label="Périodes"
          radius="full"
          size="sm"
        >
          <Tab key="jour" title="Aujourd'hui" />
          <Tab key="semaine" title="Cette semaine" />
          <Tab key="mois" title="Ce mois" />
        </Tabs>
      </div>

      {/* Cartes statistiques */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <UserGroupIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Inscriptions en attente</p>
                <p className="text-xl font-semibold">12</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CalendarIcon className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Sessions à venir</p>
                <p className="text-xl font-semibold">5</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <PhotoIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Images galerie</p>
                <p className="text-xl font-semibold">45</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <DocumentTextIcon className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-small text-default-500">Formations actives</p>
                <p className="text-xl font-semibold">8</p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Graphique et listes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inscriptions</h3>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartdata}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="inscriptions" 
                    stroke="#0e5399"
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Dernières inscriptions</h3>
            </div>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div 
                  key={item} 
                  className="flex items-center justify-between p-3 bg-default-100 rounded-lg"
                >
                  <div>
                    <p className="text-small">Formation PSC1</p>
                    <p className="text-tiny text-default-500">Il y a 2 heures</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-success rounded-full" />
                    <p className="text-tiny">En attente</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}