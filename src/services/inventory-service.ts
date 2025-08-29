
/**
 * @fileOverview A service for interacting with inventory data.
 *
 * - getLowStockItems - A function that returns items with low stock levels.
 */

import { items, type Item } from '@/lib/data';

interface LowStockItem extends Item {
    status: 'Low Stock' | 'Out of Stock';
}

/**
 * Retrieves a list of items that are currently low on stock or out of stock.
 * @returns A promise that resolves to an array of low stock items.
 */
export async function getLowStockItems(): Promise<LowStockItem[]> {
    const lowStockItems = items.filter(item => item.stock < item.reorderLevel).map(item => ({
        ...item,
        status: item.stock === 0 ? 'Out of Stock' : 'Low Stock'
    }));

    return lowStockItems;
}
