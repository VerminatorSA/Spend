
export type GroupProfile = {
  name: string;
  website: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postalCode: string;
  country: 'US' | 'CA' | 'GB' | 'AU' | 'ZA' | 'DE' | 'JP' | 'CN' | 'BR' | 'IN';
  currency: 'USD' | 'CAD' | 'EUR' | 'GBP' | 'AUD' | 'JPY' | 'ZAR' | 'BRL' | 'INR';
};

export type Company = {
    id: string;
    name: string;
    industry: string;
};

export type Division = {
    id: string;
    name: string;
    companyId: string;
}

export let group: GroupProfile = {
  name: 'Spend Group',
  website: 'https://spend.com',
  address1: '123 Innovation Drive',
  address2: 'Suite 100',
  city: 'Palo Alto',
  state: 'CA',
  postalCode: '94304',
  country: 'US',
  currency: 'USD',
};

export let companies: Company[] = [
    { id: 'comp-001', name: 'Spend Manufacturing', industry: 'Automotive' },
    { id: 'comp-002', name: 'Spend Logistics', industry: 'Transportation' },
    { id: 'comp-003', name: 'Spend Retail', industry: 'Consumer Goods' },
];

export let divisions: Division[] = [
    { id: 'div-001', name: 'EV Powertrain', companyId: 'comp-001' },
    { id: 'div-002', name: 'Chassis & Body', companyId: 'comp-001' },
    { id: 'div-003', name: 'North American Freight', companyId: 'comp-002' },
    { id: 'div-004', name: 'European Distribution', companyId: 'comp-002' },
    { id: 'div-005', name: 'Online Store', companyId: 'comp-003' },
];
