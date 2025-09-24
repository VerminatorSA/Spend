
/**
 * @fileOverview A service for interacting with product data.
 *
 * - createProduct - A function that creates a new product.
 */

import { products, type Product } from '@/lib/data';

interface CreateProductInput {
    name: string;
    description: string;
    bom: {
        itemId: string;
        quantity: number;
    }[];
}

/**
 * Creates a new product and adds it to the list.
 * @param input The details of the product to create.
 * @returns A promise that resolves when the product is created.
 */
export async function createProduct(input: CreateProductInput): Promise<void> {
    const newId = `prod-${String(products.length + 1).padStart(3, '0')}`;
    
    const newProduct: Product = {
        id: newId,
        name: input.name,
        description: input.description,
        imageUrl: `https://picsum.photos/seed/${newId}/600/400`,
        bom: input.bom,
    };

    products.push(newProduct);
}
