export const FACULTIES = [
  'Computer Science & IT',
  'Engineering & Applied Sciences',
  'Business Administration',
  'Biotechnology',
] as const;

export type Faculty = (typeof FACULTIES)[number];

export type Availability = 'available' | 'limited' | 'checked-out';

export type ItemType = 'textbook' | 'research' | 'capstone';

export interface Book {
  id: string;
  title: string;
  author: string;
  edition: string;
  faculty: Faculty;
  /** Campus location: floor & shelf coordinates. */
  location: string;
  /** Legacy field kept for modal compatibility. */
  vault: string;
  /** Academic subject category. */
  pinakes: string;
  isbn: string;
  year: number;
  copies: number;
  totalCopies: number;
  pickup: string;
  itemType: ItemType;
  abstract?: string;
}

export const BOOKS: readonly Book[] = [
  // ── Computer Science & IT ──────────────────────────────────────────────────
  {
    id: 'cs-algorithms',
    title: 'Algorithms & Data Structures in C++',
    author: 'Cormen, Leiserson, Rivest & Stein',
    edition: '4th Edition',
    faculty: 'Computer Science & IT',
    location: 'Main Library • Floor 2 • Shelf CS-104',
    vault: 'Main Library • Floor 2 • Shelf CS-104',
    pinakes: 'Algorithms & Complexity',
    isbn: '978-0-262-04630-5',
    year: 2022,
    copies: 4,
    totalCopies: 6,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
    abstract: 'Comprehensive treatment of algorithms, data structures, and their analysis.',
  },
  {
    id: 'cs-os',
    title: 'Operating System Concepts',
    author: 'Silberschatz, Galvin & Gagne',
    edition: '10th Edition',
    faculty: 'Computer Science & IT',
    location: 'Main Library • Floor 2 • Shelf CS-108',
    vault: 'Main Library • Floor 2 • Shelf CS-108',
    pinakes: 'Systems & Architecture',
    isbn: '978-1-119-80036-1',
    year: 2021,
    copies: 1,
    totalCopies: 5,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
    abstract: 'Core OS principles: processes, memory, file systems, and virtualization.',
  },
  {
    id: 'cs-database',
    title: 'Database Systems Architecture',
    author: 'Ramakrishnan & Gehrke',
    edition: '3rd Edition',
    faculty: 'Computer Science & IT',
    location: 'Main Library • Floor 2 • Shelf CS-112',
    vault: 'Main Library • Floor 2 • Shelf CS-112',
    pinakes: 'Database & Information Systems',
    isbn: '978-0-072-46563-1',
    year: 2023,
    copies: 3,
    totalCopies: 4,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
    abstract: 'Relational theory, SQL, query optimisation, and modern NoSQL paradigms.',
  },
  {
    id: 'cs-ml-medical',
    title: 'Machine Learning for Medical Diagnostics',
    author: 'Dr. Layla Hassan & Dr. Omar Farouk',
    edition: 'Nile University Press, 2024',
    faculty: 'Computer Science & IT',
    location: 'Floor 3 • Postgraduate Archives • Shelf PG-22',
    vault: 'Floor 3 • Postgraduate Archives • Shelf PG-22',
    pinakes: 'AI & Healthcare Informatics',
    isbn: '978-977-416-801-3',
    year: 2024,
    copies: 2,
    totalCopies: 3,
    pickup: 'Floor 3 • Research Archives Desk',
    itemType: 'capstone',
    abstract:
      'Deep learning pipelines for radiological image analysis; trained on Egyptian hospital datasets.',
  },
  {
    id: 'cs-networks',
    title: 'Computer Networks: A Systems Approach',
    author: 'Peterson & Davie',
    edition: '6th Edition',
    faculty: 'Computer Science & IT',
    location: 'Main Library • Floor 2 • Shelf CS-115',
    vault: 'Main Library • Floor 2 • Shelf CS-115',
    pinakes: 'Networks & Communications',
    isbn: '978-0-128-11901-5',
    year: 2022,
    copies: 5,
    totalCopies: 7,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
  {
    id: 'cs-security-capstone',
    title: 'Blockchain-Based Identity for Egyptian E-Gov',
    author: 'Ahmed Selim — NU Capstone 2024',
    edition: 'Capstone Report',
    faculty: 'Computer Science & IT',
    location: 'Floor 3 • Postgraduate Archives • Shelf PG-31',
    vault: 'Floor 3 • Postgraduate Archives • Shelf PG-31',
    pinakes: 'Cybersecurity & Distributed Systems',
    isbn: '978-977-416-802-0',
    year: 2024,
    copies: 1,
    totalCopies: 1,
    pickup: 'Floor 3 • Research Archives Desk',
    itemType: 'capstone',
    abstract:
      'A self-sovereign identity framework using Hyperledger Fabric integrated with Egyptian NID infrastructure.',
  },

  // ── Engineering & Applied Sciences ────────────────────────────────────────
  {
    id: 'eng-renewable',
    title: 'Renewable Energy Systems in Egypt',
    author: 'Dr. Maged Nour & Dr. Sara Khalil',
    edition: 'Nile University Press, 2023',
    faculty: 'Engineering & Applied Sciences',
    location: 'Main Library • Floor 2 • Shelf EN-201',
    vault: 'Main Library • Floor 2 • Shelf EN-201',
    pinakes: 'Energy & Sustainability',
    isbn: '978-977-416-790-0',
    year: 2023,
    copies: 4,
    totalCopies: 5,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
    abstract:
      'Solar PV, wind, and CSP deployment across the Nile corridor — technical and economic analysis.',
  },
  {
    id: 'eng-dynamics',
    title: 'Engineering Mechanics: Dynamics',
    author: 'J. L. Meriam & L. G. Kraige',
    edition: '9th Edition',
    faculty: 'Engineering & Applied Sciences',
    location: 'Main Library • Floor 2 • Shelf EN-207',
    vault: 'Main Library • Floor 2 • Shelf EN-207',
    pinakes: 'Mechanics & Motion',
    isbn: '978-1-119-39098-4',
    year: 2020,
    copies: 6,
    totalCopies: 8,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
  {
    id: 'eng-thermo',
    title: 'Fundamentals of Thermodynamics',
    author: 'Borgnakke & Sonntag',
    edition: '10th Edition',
    faculty: 'Engineering & Applied Sciences',
    location: 'Main Library • Floor 2 • Shelf EN-215',
    vault: 'Main Library • Floor 2 • Shelf EN-215',
    pinakes: 'Thermal & Fluid Sciences',
    isbn: '978-1-119-49496-5',
    year: 2023,
    copies: 2,
    totalCopies: 5,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
  {
    id: 'eng-smart-grid-capstone',
    title: 'Smart Grid Optimisation for Cairo Metro',
    author: 'Youssef Ibrahim — NU Capstone 2023',
    edition: 'Capstone Report',
    faculty: 'Engineering & Applied Sciences',
    location: 'Floor 3 • Postgraduate Archives • Shelf PG-44',
    vault: 'Floor 3 • Postgraduate Archives • Shelf PG-44',
    pinakes: 'Power Systems & Smart Infrastructure',
    isbn: '978-977-416-803-7',
    year: 2023,
    copies: 1,
    totalCopies: 1,
    pickup: 'Floor 3 • Research Archives Desk',
    itemType: 'capstone',
    abstract:
      'Demand-response algorithms reducing peak load by 18% across six Cairo Metro distribution zones.',
  },

  // ── Business Administration ────────────────────────────────────────────────
  {
    id: 'biz-managerial-econ',
    title: 'Managerial Economics & Business Strategy',
    author: 'Baye & Prince',
    edition: '9th Edition',
    faculty: 'Business Administration',
    location: 'Main Library • Floor 2 • Shelf BA-301',
    vault: 'Main Library • Floor 2 • Shelf BA-301',
    pinakes: 'Economics & Strategy',
    isbn: '978-1-260-04016-4',
    year: 2022,
    copies: 3,
    totalCopies: 6,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
  {
    id: 'biz-fintech-research',
    title: 'FinTech Adoption in Egyptian SMEs',
    author: 'Dr. Rania Mostafa — NU Research 2024',
    edition: 'Faculty Research Paper',
    faculty: 'Business Administration',
    location: 'Floor 3 • E-Resource Lab • Digital Only',
    vault: 'Floor 3 • E-Resource Lab • Digital Only',
    pinakes: 'Financial Technology & Entrepreneurship',
    isbn: '978-977-416-810-5',
    year: 2024,
    copies: 0,
    totalCopies: 0,
    pickup: 'Digital Access — Floor 3 E-Resource Lab',
    itemType: 'research',
    abstract:
      'Quantitative study on mobile payment and digital lending adoption rates across 320 Egyptian SMEs.',
  },
  {
    id: 'biz-corporate-governance',
    title: 'Corporate Governance in Emerging Markets',
    author: 'Claessens & Yurtoglu',
    edition: '2nd Edition',
    faculty: 'Business Administration',
    location: 'Main Library • Floor 2 • Shelf BA-310',
    vault: 'Main Library • Floor 2 • Shelf BA-310',
    pinakes: 'Corporate Governance & Finance',
    isbn: '978-0-198-87610-2',
    year: 2023,
    copies: 4,
    totalCopies: 4,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },

  // ── Biotechnology ──────────────────────────────────────────────────────────
  {
    id: 'bio-molecular',
    title: 'Molecular Biology of the Cell',
    author: 'Alberts, Heald, Johnson & Morgan',
    edition: '7th Edition',
    faculty: 'Biotechnology',
    location: 'Main Library • Floor 2 • Shelf BT-401',
    vault: 'Main Library • Floor 2 • Shelf BT-401',
    pinakes: 'Cell & Molecular Biology',
    isbn: '978-0-393-88482-3',
    year: 2022,
    copies: 3,
    totalCopies: 5,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
  {
    id: 'bio-nile-water-capstone',
    title: 'CRISPR-Based Biosensors for Nile Water Quality',
    author: 'Nour El-Din Tawfiq — NU Capstone 2024',
    edition: 'Capstone Report',
    faculty: 'Biotechnology',
    location: 'Floor 3 • Postgraduate Archives • Shelf PG-58',
    vault: 'Floor 3 • Postgraduate Archives • Shelf PG-58',
    pinakes: 'Biosensors & Environmental Genomics',
    isbn: '978-977-416-820-4',
    year: 2024,
    copies: 1,
    totalCopies: 1,
    pickup: 'Floor 3 • Research Archives Desk',
    itemType: 'capstone',
    abstract:
      'A portable CRISPR-Cas13 lateral-flow biosensor detecting heavy-metal contamination in Nile tributaries.',
  },
  {
    id: 'bio-protein-engineering',
    title: 'Introduction to Protein Engineering',
    author: 'Shriver & Atkins',
    edition: '5th Edition',
    faculty: 'Biotechnology',
    location: 'Main Library • Floor 2 • Shelf BT-415',
    vault: 'Main Library • Floor 2 • Shelf BT-415',
    pinakes: 'Protein Science & Biochemistry',
    isbn: '978-0-198-86456-7',
    year: 2021,
    copies: 2,
    totalCopies: 4,
    pickup: 'Main Library • Floor 2 • Information Desk',
    itemType: 'textbook',
  },
];

export function getAvailability(copies: number): Availability {
  if (copies <= 0) return 'checked-out';
  if (copies <= 2) return 'limited';
  return 'available';
}

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'Available',
  limited: 'Limited Copies',
  'checked-out': 'On Loan',
};
