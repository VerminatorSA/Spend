
import Link from 'next/link';
import { Header } from '@/components/header';
import { FileText, ChevronRight, User, Package, ShoppingCart, Mail, Users } from 'lucide-react';

const formSettingsSections = [
    { 
        href: '/settings/forms/supplier', 
        title: 'Supplier Form', 
        description: 'Customize the fields for adding new suppliers.', 
        icon: User
    },
    { 
        href: '/settings/forms/item', 
        title: 'Item Form', 
        description: 'Customize the fields for adding new items.', 
        icon: Package
    },
    { 
        href: '/settings/forms/product', 
        title: 'Product Form', 
        description: 'Customize the fields for creating new products.', 
        icon: ShoppingCart
    },
    { 
        href: '/settings/forms/contact', 
        title: 'Contact Form', 
        description: 'Customize the fields for the supplier contact form.', 
        icon: Mail
    },
    {
        href: '/settings/forms/user',
        title: 'User Form',
        description: 'Customize the fields for adding new users.',
        icon: Users
    }
]

export default function FormsSettingsPage() {
  return (
    <div className="flex h-full flex-col">
      <Header title="Form Settings" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="mx-auto max-w-4xl">
           <div>
              <h2 className="text-2xl font-bold">Form Customization</h2>
              <p className="text-muted-foreground">Select a form to add, remove, or reconfigure its fields.</p>
            </div>
            <div className="mt-8 divide-y divide-border rounded-xl border">
                {formSettingsSections.map((section) => (
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
        </div>
      </main>
    </div>
  );
}
