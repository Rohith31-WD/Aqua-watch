// Initial sample data for demonstration
export const initialReports = [
  {
    id: '1',
    category: 'CONTAMINATED_WATER',
    description: 'Brown water coming from public tap. Residents have been experiencing stomach issues.',
    photoUrl: null,
    latitude: 28.6139,
    longitude: 77.2090,
    address: 'Connaught Place, New Delhi',
    status: 'OPEN',
    riskScore: 85,
    reporterId: 'user1',
    reporterName: 'Priya Sharma',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    category: 'OPEN_DRAINAGE',
    description: 'Open drainage near primary school. Children are at risk of falling and diseases.',
    photoUrl: null,
    latitude: 28.6280,
    longitude: 77.2195,
    address: 'Rajendra Nagar, New Delhi',
    status: 'INVESTIGATING',
    riskScore: 72,
    reporterId: 'user2',
    reporterName: 'Rajesh Kumar',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    category: 'BROKEN_FACILITY',
    description: 'Public toilet facility has been broken for 2 weeks. No maintenance done.',
    photoUrl: null,
    latitude: 28.6025,
    longitude: 77.1985,
    address: 'Karol Bagh, New Delhi',
    status: 'OPEN',
    riskScore: 65,
    reporterId: 'user3',
    reporterName: 'Anita Verma',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: '4',
    category: 'LACK_SOAP',
    description: 'School washroom has no soap for handwashing. Children cannot practice hygiene.',
    photoUrl: null,
    latitude: 28.6200,
    longitude: 77.2050,
    address: 'Janpath, New Delhi',
    status: 'RESOLVED',
    riskScore: 45,
    reporterId: 'user1',
    reporterName: 'Priya Sharma',
    createdAt: new Date(Date.now() - 259200000).toISOString()
  },
  {
    id: '5',
    category: 'CONTAMINATED_WATER',
    description: 'Industrial waste being dumped into local water body. Fish dying.',
    photoUrl: null,
    latitude: 28.5950,
    longitude: 77.2250,
    address: 'Okhla Industrial Area, New Delhi',
    status: 'OPEN',
    riskScore: 92,
    reporterId: 'user4',
    reporterName: 'Mohammed Ali',
    createdAt: new Date(Date.now() - 43200000).toISOString()
  }
];

export const initialUsers = [
  {
    id: 'user1',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    role: 'REPORTER',
    points: 20,
    badges: ['FIRST_REPORTER', 'WATER_GUARDIAN'],
    reportsCount: 2
  },
  {
    id: 'user2',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    role: 'REPORTER',
    points: 10,
    badges: ['FIRST_REPORTER'],
    reportsCount: 1
  },
  {
    id: 'user3',
    name: 'Anita Verma',
    email: 'anita@example.com',
    role: 'REPORTER',
    points: 10,
    badges: ['FIRST_REPORTER'],
    reportsCount: 1
  },
  {
    id: 'user4',
    name: 'Mohammed Ali',
    email: 'mohammed@example.com',
    role: 'REPORTER',
    points: 10,
    badges: ['FIRST_REPORTER'],
    reportsCount: 1
  }
];

// Badge definitions
export const BADGES = {
  FIRST_REPORTER: { name: 'First Reporter', icon: '🌊', description: 'Submitted your first report', threshold: 1 },
  WATER_GUARDIAN: { name: 'Water Guardian', icon: '🛡️', description: 'Submitted 5 reports', threshold: 5 },
  CLEAN_STREETS: { name: 'Clean Streets', icon: '🏆', description: 'Submitted 10 reports', threshold: 10 },
  LIFESAVER: { name: 'Lifesaver', icon: '💉', description: 'Submitted 20 reports', threshold: 20 }
};

// Category definitions with icons and colors
export const CATEGORIES = {
  CONTAMINATED_WATER: { 
    name: 'Contaminated Water', 
    icon: '💧', 
    color: '#ef4444',
    riskWeight: 10 
  },
  BROKEN_FACILITY: { 
    name: 'Broken Facility', 
    icon: '🚽', 
    color: '#f97316',
    riskWeight: 7 
  },
  OPEN_DRAINAGE: { 
    name: 'Open Drainage', 
    icon: '🕳️', 
    color: '#eab308',
    riskWeight: 8 
  },
  LACK_SOAP: { 
    name: 'Lack of Soap', 
    icon: '🧼', 
    color: '#8b5cf6',
    riskWeight: 5 
  },
  OTHER: { 
    name: 'Other Issue', 
    icon: '⚠️', 
    color: '#6b7280',
    riskWeight: 4 
  }
};

// Status definitions
export const STATUSES = {
  OPEN: { name: 'Open', color: '#ef4444', bgColor: 'bg-red-100', textColor: 'text-red-800' },
  INVESTIGATING: { name: 'Investigating', color: '#f97316', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
  RESOLVED: { name: 'Resolved', color: '#22c55e', bgColor: 'bg-green-100', textColor: 'text-green-800' }
};
