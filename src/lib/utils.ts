import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { type Item } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateItemTags(item: Item): string[] {
  const tags = new Set<string>();

  // Add category tag
  if (item.category) {
    tags.add(item.category);
  }

  // Add supplier tag
  if (item.supplier) {
    tags.add(item.supplier);
  }

  // Add stock status tags
  if (item.stock === 0) {
    tags.add('Out of Stock');
  } else if (item.stock < item.reorderLevel) {
    tags.add('Low Stock');
  } else {
    tags.add('In Stock');
  }

  return Array.from(tags);
}
