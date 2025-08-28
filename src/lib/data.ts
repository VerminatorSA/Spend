
export type Supplier = {
  id: string;
  name: string;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  itemsOffered: number;
  location: string;
};

export type Item = {
  id: string;
  name: string;
  supplier: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  bom: {
    itemId: string;
    quantity: number;
  }[];
};

export const suppliers: Supplier[] = [
  {
    id: 'sup-001',
    name: 'Global Components Inc.',
    contact: {
      name: 'Sarah Chen',
      email: 'sarah.chen@globalcomp.com',
      phone: '1-800-555-0101',
    },
    itemsOffered: 150,
    location: 'Shenzhen, China',
  },
  {
    id: 'sup-002',
    name: 'Precision Parts Co.',
    contact: {
      name: 'David Rodriguez',
      email: 'david.r@precisionparts.com',
      phone: '1-800-555-0102',
    },
    itemsOffered: 230,
    location: 'Stuttgart, Germany',
  },
  {
    id: 'sup-003',
    name: 'American Metals LLC',
    contact: {
      name: 'John Miller',
      email: 'jmiller@americanmetals.com',
      phone: '1-800-555-0103',
    },
    itemsOffered: 85,
    location: 'Pittsburgh, USA',
  },
  {
    id: 'sup-004',
    name: 'Advanced Polymers',
    contact: {
      name: 'Yuki Tanaka',
      email: 'y.tanaka@advancedpolymers.jp',
      phone: '1-800-555-0104',
    },
    itemsOffered: 300,
    location: 'Osaka, Japan',
  },
  {
    id: 'sup-005',
    name: 'TechFasteners Ltd.',
    contact: {
      name: 'Emily White',
      email: 'emily.w@techfasteners.co.uk',
      phone: '1-800-555-0105',
    },
    itemsOffered: 500,
    location: 'Manchester, UK',
  },
  {
    id: 'sup-006',
    name: 'Silicon Valley Circuits',
    contact: {
        name: 'Michael Brown',
        email: 'mbrown@svcircuits.com',
        phone: '1-800-555-0106',
    },
    itemsOffered: 120,
    location: 'San Jose, USA',
  },
];

export const items: Item[] = [
  {
    id: 'item-001',
    name: 'High-Grade Steel Screws (Box of 1000)',
    supplier: 'TechFasteners Ltd.',
    description: 'M4x10mm self-tapping screws, zinc-plated for corrosion resistance.',
    price: 45.0,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Fasteners',
  },
  {
    id: 'item-002',
    name: 'ABS Polymer Pellets (10kg Bag)',
    supplier: 'Advanced Polymers',
    description: 'High-impact strength ABS thermoplastic pellets, ideal for injection molding.',
    price: 120.5,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Polymers',
  },
  {
    id: 'item-003',
    name: 'ATmega328P Microcontroller',
    supplier: 'Global Components Inc.',
    description: '8-bit AVR microcontroller, widely used in electronics and robotics.',
    price: 2.5,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Electronics',
  },
  {
    id: 'item-004',
    name: 'Aluminum Sheet 6061 (48"x96")',
    supplier: 'American Metals LLC',
    description: 'T6 temper aluminum sheet, 1/8" thickness. Versatile and lightweight.',
    price: 250.0,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Metals',
  },
  {
    id: 'item-005',
    name: 'CNC-Milled Gear Set',
    supplier: 'Precision Parts Co.',
    description: 'Hardened steel 20-tooth and 40-tooth gear set for high-torque applications.',
    price: 85.75,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Mechanical Parts',
  },
  {
    id: 'item-006',
    name: '4-Layer PCB Prototype Board',
    supplier: 'Silicon Valley Circuits',
    description: '10x10cm 4-layer printed circuit board with ENIG finish.',
    price: 15.0,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Electronics',
  },
  {
    id: 'item-007',
    name: 'Carbon Fiber Weave (1 sq meter)',
    supplier: 'Advanced Polymers',
    description: '2x2 twill weave carbon fiber cloth for high-strength composite parts.',
    price: 75.0,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Composites',
  },
  {
    id: 'item-008',
    name: 'Titanium Rod Grade 5 (1m)',
    supplier: 'American Metals LLC',
    description: '10mm diameter Grade 5 (Ti-6Al-4V) titanium rod. High strength-to-weight ratio.',
    price: 180.0,
    imageUrl: 'https://picsum.photos/600/400',
    category: 'Metals',
  },
];

export const products: Product[] = [
    {
        id: 'prod-001',
        name: 'Standard Drone Kit',
        description: 'A complete DIY drone kit with all necessary components for assembly.',
        imageUrl: 'https://picsum.photos/600/400',
        bom: [
            { itemId: 'item-003', quantity: 1 },
            { itemId: 'item-006', quantity: 1 },
            { itemId: 'item-001', quantity: 20 },
            { itemId: 'item-002', quantity: 1 },
        ],
    },
    {
        id: 'prod-002',
        name: 'Robotic Arm Assembly',
        description: 'A 5-axis robotic arm assembly kit for hobbyists and educational purposes.',
        imageUrl: 'https://picsum.photos/600/400',
        bom: [
            { itemId: 'item-005', quantity: 4 },
            { itemId: 'item-003', quantity: 2 },
            { itemId: 'item-004', quantity: 1 },
            { itemId: 'item-001', quantity: 50 },
        ],
    }
];
