
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { User, Palette, FileText, Bell, Building } from 'lucide-react';

const settingsSections = [
    { 
        href: '/settings/profile', 
        title: 'My Profile', 
        description: 'Manage your personal information and preferences.', 
        icon: User 
    },
    { 
        href: '/settings/company', 
        title: 'Company', 
        description: 'Manage your organization\'s details and branding.', 
        icon: Building
    },
    { 
        href: '/settings/appearance', 
        title: 'Appearance', 
        description: 'Customize the look and feel of the application.', 
        icon: Palette
    },
    { 
        href: '/settings/forms', 
        title: 'Forms', 
        description: 'Customize the fields in your forms.', 
        icon: FileText 
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
          <div className="grid gap-6 md:grid-cols-2">
            {settingsSections.map((section) => (
              <Card key={section.href}>
                <CardHeader className='flex flex-row items-start gap-4 space-y-0'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
                        <section.icon className="h-6 w-6" />
                    </div>
                    <div className='flex-1'>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription className='mt-1'>{section.description}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Button asChild variant="outline">
                        <Link href={section.href}>
                            Go to {section.title}
                        </Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
