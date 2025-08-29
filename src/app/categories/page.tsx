
import { Header } from '@/components/header';
import { items } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shapes } from 'lucide-react';

type CategoryInfo = {
    name: string;
    count: number;
};

export default function CategoriesPage() {
    const categories = items.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = { name: item.category, count: 0 };
        }
        acc[item.category].count++;
        return acc;
    }, {} as Record<string, CategoryInfo>);

    const categoryList = Object.values(categories);

  return (
    <div className="flex h-full flex-col">
      <Header title="Item Categories" />
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categoryList.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Shapes className="mr-1.5 h-4 w-4" />
                  <span>{category.count} {category.count === 1 ? 'item' : 'items'}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
