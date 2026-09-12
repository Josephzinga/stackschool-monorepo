'use client';

import React, { useEffect, useState } from 'react';
import {
  Bell,
  Building2,
  CreditCard,
  Settings,
  ShieldCheck,
  SidebarIcon,
  Users,
} from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { PermissionsPane } from '@/components/settings/permission-pane';
import { Button } from '@/components/ui/button';
import { useWindowSize } from 'react-use';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const SECTIONS = [
  { id: 'general', label: 'Général', icon: Building2 },
  { id: 'accounts', label: 'Comptes', icon: Users },
  { id: 'permissions', label: 'Rôles et permissions', icon: ShieldCheck },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'billing', label: 'Facturation', icon: CreditCard },
];

const MODULE_LABEL_FR = {
  ATTENDANCE: 'Présences',
  ACADEMICS: 'Pédagogie',
  USERS: 'Utilisateurs',
  FINANCE: 'Finances',
  SETTINGS: "Paramètres de l'école",
};

const MODULE_ORDER = [
  'ATTENDANCE',
  'ACADEMICS',
  'USERS',
  'FINANCE',
  'SETTINGS',
];

const ACTION_LABEL_FR = {
  manage: 'GÉRER',
  create: 'CRÉER',
  read: 'LIRE',
  update: 'MODIFIER',
  delete: 'SUPPRIMER',
  mark: 'MARQUER',
  publish: 'PUBLIER',
  export: 'EXPORTER',
};

// Mirrors the Permission table: one row per (action, subject) pair.
// `key` is action:subject — matches the @@unique constraint, used as the
// identity for granting/toggling in the UI and for ability.can(action, subject).
const PERMISSIONS = [
  {
    action: 'mark',
    subject: 'AttendanceRecord',
    module: 'ATTENDANCE',
    name: 'Marquer les présences',
  },
  {
    action: 'read',
    subject: 'AttendanceRecord',
    module: 'ATTENDANCE',
    name: 'Consulter les rapports de présence',
  },

  {
    action: 'manage',
    subject: 'Class',
    module: 'ACADEMICS',
    name: 'Gérer les classes',
  },
  {
    action: 'manage',
    subject: 'Subject',
    module: 'ACADEMICS',
    name: 'Gérer les matières',
  },
  {
    action: 'manage',
    subject: 'Timetable',
    module: 'ACADEMICS',
    name: "Gérer l'emploi du temps",
  },
  {
    action: 'update',
    subject: 'Grade',
    module: 'ACADEMICS',
    name: 'Saisir les notes',
  },
  {
    action: 'publish',
    subject: 'Bulletin',
    module: 'ACADEMICS',
    name: 'Publier les bulletins',
  },
  {
    action: 'manage',
    subject: 'Exam',
    module: 'ACADEMICS',
    name: 'Gérer les examens',
  },

  {
    action: 'create',
    subject: 'Student',
    module: 'USERS',
    name: 'Créer un élève',
  },
  {
    action: 'update',
    subject: 'Student',
    module: 'USERS',
    name: 'Modifier un élève',
  },
  {
    action: 'delete',
    subject: 'Student',
    module: 'USERS',
    name: 'Supprimer un élève',
  },
  {
    action: 'create',
    subject: 'Teacher',
    module: 'USERS',
    name: 'Créer un enseignant',
  },
  {
    action: 'update',
    subject: 'Teacher',
    module: 'USERS',
    name: 'Modifier un enseignant',
  },
  {
    action: 'delete',
    subject: 'Teacher',
    module: 'USERS',
    name: 'Supprimer un enseignant',
  },
  {
    action: 'create',
    subject: 'Parent',
    module: 'USERS',
    name: 'Créer un parent',
  },
  {
    action: 'update',
    subject: 'Parent',
    module: 'USERS',
    name: 'Modifier un parent',
  },
  {
    action: 'manage',
    subject: 'SchoolUserPermission',
    module: 'USERS',
    name: 'Gérer les permissions des utilisateurs',
    description:
      'Permet à un admin secondaire de modifier les accès des autres utilisateurs.',
  },

  {
    action: 'manage',
    subject: 'Payment',
    module: 'FINANCE',
    name: 'Gérer les paiements',
  },
  {
    action: 'manage',
    subject: 'Payroll',
    module: 'FINANCE',
    name: 'Gérer les salaires',
  },
  {
    action: 'read',
    subject: 'FinancialReport',
    module: 'FINANCE',
    name: 'Consulter les rapports financiers',
  },
  {
    action: 'export',
    subject: 'FinancialReport',
    module: 'FINANCE',
    name: 'Exporter les rapports financiers',
  },

  {
    action: 'manage',
    subject: 'SchoolSettings',
    module: 'SETTINGS',
    name: "Gérer les paramètres de l'école",
  },
];

function permKey(p) {
  return `${p.action}:${p.subject}`;
}

// Grouped by module for the UI — derived, not hand-duplicated.
const PERMISSION_GROUPS = MODULE_ORDER.map((moduleId) => ({
  id: moduleId,
  label: MODULE_LABEL_FR[moduleId],
  permissions: PERMISSIONS.filter((p) => p.module === moduleId),
})).filter((g) => g.permissions.length > 0);

function PlaceholderPane({ text }: { text: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 p-10 text-sm text-slate-500">
      {text}
    </div>
  );
}
function allPermissionIds() {
  return PERMISSION_GROUPS.flatMap((g) => g.permissions.map((p) => p.id));
}

export function SettingsView() {
  const { setOpen } = useSidebar();
  const isMobile = useIsMobile();
  const [active, setActive] = useState('permissions');
  const { width } = useWindowSize();
  const [sideIconOpen, setSideIconOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const activeSection = SECTIONS.find((s) => s.id === active);

  useEffect(() => {
    if (width < 900) {
      setOpen(false);
    }
  }, [width]);

  const openSection = (id: string) => {
    setActive(id);
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
  };

  return (
    <div className="relative flex max-h-svh w-full min-h-0 flex-1 overflow-hidden rounded-xl bg-background">
      {!isMobile && (
        <div
          className={cn(
            'flex flex-col py-4 gap-1 border-r transition-discrete ease-in duration-300',
            sideIconOpen ? 'w-10' : 'w-55',
          )}
        >
          <div>
            {SECTIONS.map((item) => (
              <div key={item.id} className="transition-opacity duration-300">
                <Button
                  variant={item.id === active ? 'secondary' : 'ghost'}
                  className="w-full justify-start rounded-sm"
                  onClick={() => openSection(item.id)}
                >
                  {item.icon && <item.icon />}
                  {!sideIconOpen && <span>{item.label}</span>}
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {isMobile && (
        <div
          className={cn(
            'fixed left-0 top-0 z-50 h-full w-72 border-r bg-background shadow-2xl transition-transform duration-300',
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex flex-col py-4 gap-1">
            {SECTIONS.map((item) => (
              <div key={item.id} className="transition-opacity duration-300">
                <Button
                  variant={item.id === active ? 'secondary' : 'ghost'}
                  className="w-full justify-start rounded-sm"
                  onClick={() => openSection(item.id)}
                >
                  {item.icon && <item.icon />}
                  <span>{item.label}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <div className="flex items-center gap-2.5 border-b px-2 py-2">
          <Button
            onClick={() => {
              if (isMobile) {
                setMobileSidebarOpen((prev) => !prev);
              } else {
                setSideIconOpen(!sideIconOpen);
              }
            }}
            variant="ghost"
          >
            <SidebarIcon />
          </Button>
          <Settings className="h-[17px] w-[17px]" strokeWidth={1.8} />
          <h1 className="text-[17px] font-semibold">Paramètres</h1>
          <span className="text-sm">· StackSchool</span>
        </div>

        {/* Content */}
        <div className="flex min-h-0 flex-1 w-full flex-col overflow-hidden px-2 py-6">
          {active === 'permissions' ? (
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <h2
                className="mb-1 text-xl font-semibold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Rôles et permissions
              </h2>
              <p className="mb-5 text-sm font-poppins">
                Sélectionnez un utilisateur pour ajuster ses permissions dans
                cet établissement.
              </p>
              <div className="min-h-0 flex-1 overflow-hidden">
                <PermissionsPane />
              </div>
            </div>
          ) : (
            <>
              <h2
                className="mb-1 text-xl font-semibold"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {activeSection?.label}
              </h2>
              <p className="mb-5 text-sm text-slate-500">
                Cette section n'est pas encore implémentée.
              </p>
              <PlaceholderPane
                text={
                  active === 'general'
                    ? "Paramètres généraux de l'établissement — nom, adresse, année scolaire en cours."
                    : active === 'accounts'
                      ? 'Gestion des comptes utilisateurs.'
                      : active === 'notifications'
                        ? 'Préférences de notification.'
                        : 'Facturation et abonnement.'
                }
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
