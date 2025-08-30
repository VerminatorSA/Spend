
import Link from 'next/link';
import { Header } from '@/components/header';
import { Card, CardContent } from '@/components/ui/card';
import { User, Building, Brush, Bell, ChevronRight } from 'lucide-react';

const settingsSections = [
    { 
        href: '/settings/profile', 
        title: 'My Profile', 
        description: 'Manage your personal information and preferences.', 
        icon: User 
    },
    { 
        href: '/settings/organization', 
        title: 'Organization', 
        description: 'Manage company profile and global settings.', 
        icon: Building
    },
    { 
        href: '/settings/customization', 
        title: 'Customization', 
        description: 'Customize appearance and forms.', 
        icon: Brush
    },
    { 
        href: '/settings/notifications', 
        title: 'Notifications', 
        description: 'Choose how you want to be notified.', 
        icon: Bell 
    },
]

export default function SettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
          <Card>
            <CardContent className="p-0">
                <div className="divide-y divide-border">
                    {settingsSections.map((section) => (
                    <Link href={section.href} key={section.href} className="flex items-center justify-between p-4 transition-colors hover:bg-muted/50">
                        <div className="flex items-center gap-4">
                            <section.icon className="h-5 w-5 text-muted-foreground" />
                            <div className="flex flex-col">
                                <span className="font-medium">{section.title}</span>
                                <span className="text-sm text-muted-foreground">{section.description}</span>
                            </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </Link>
                    ))}
                </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
