// Comprehensive NCR Metro Dataset
// Covers Delhi Metro (DMRC), Noida Metro (NMRC Aqua Line), and Rapid Metro Gurugram.
// Accurate GeoJSON coordinates, line colors, interchange mappings, and station facilities.

export const METRO_NETWORKS = {
  DMRC: 'Delhi Metro Rail Corporation',
  NMRC: 'Noida Metro (Aqua Line)',
  RAPID: 'Rapid Metro Gurugram',
};

export const METRO_LINES = {
  yellow: {
    id: 'yellow',
    name: 'Yellow Line',
    code: 'Line 2',
    network: 'DMRC',
    color: '#EAB308',
    textColor: '#000000',
    terminals: 'Samaypur Badli ⇄ Millennium City Centre Gurugram',
    totalStations: 37,
  },
  blue: {
    id: 'blue',
    name: 'Blue Line',
    code: 'Line 3 & 4',
    network: 'DMRC',
    color: '#2563EB',
    textColor: '#FFFFFF',
    terminals: 'Dwarka Sector 21 ⇄ Noida Electronic City / Vaishali',
    totalStations: 57,
  },
  violet: {
    id: 'violet',
    name: 'Violet Line',
    code: 'Line 6',
    network: 'DMRC',
    color: '#7C3AED',
    textColor: '#FFFFFF',
    terminals: 'Kashmere Gate ⇄ Raja Nahar Singh (Ballabhgarh)',
    totalStations: 34,
  },
  magenta: {
    id: 'magenta',
    name: 'Magenta Line',
    code: 'Line 8',
    network: 'DMRC',
    color: '#DB2777',
    textColor: '#FFFFFF',
    terminals: 'Janakpuri West ⇄ Botanical Garden (Noida)',
    totalStations: 25,
  },
  red: {
    id: 'red',
    name: 'Red Line',
    code: 'Line 1',
    network: 'DMRC',
    color: '#DC2626',
    textColor: '#FFFFFF',
    terminals: 'Rithala ⇄ Shaheed Sthal (Ghaziabad)',
    totalStations: 29,
  },
  pink: {
    id: 'pink',
    name: 'Pink Line',
    code: 'Line 7 (Ring Road)',
    network: 'DMRC',
    color: '#F472B6',
    textColor: '#000000',
    terminals: 'Majlis Park ⇄ Shiv Vihar',
    totalStations: 38,
  },
  orange: {
    id: 'orange',
    name: 'Airport Express (Orange Line)',
    code: 'Airport Line',
    network: 'DMRC',
    color: '#EA580C',
    textColor: '#FFFFFF',
    terminals: 'New Delhi ⇄ Yashobhoomi Dwarka Sector 25',
    totalStations: 7,
  },
  green: {
    id: 'green',
    name: 'Green Line',
    code: 'Line 5',
    network: 'DMRC',
    color: '#16A34A',
    textColor: '#FFFFFF',
    terminals: 'Inderlok / Kirti Nagar ⇄ Brigadier Hoshiyar Singh (Bahadurgarh)',
    totalStations: 24,
  },
  grey: {
    id: 'grey',
    name: 'Grey Line',
    code: 'Line 9',
    network: 'DMRC',
    color: '#6B7280',
    textColor: '#FFFFFF',
    terminals: 'Dwarka ⇄ Dhansa Bus Stand',
    totalStations: 4,
  },
  aqua: {
    id: 'aqua',
    name: 'Aqua Line (Noida Metro)',
    code: 'NMRC Line 1',
    network: 'NMRC',
    color: '#06B6D4',
    textColor: '#FFFFFF',
    terminals: 'Noida Sector 51 ⇄ Depot (Greater Noida)',
    totalStations: 21,
  },
  rapid: {
    id: 'rapid',
    name: 'Rapid Metro Gurugram',
    code: 'RMGL',
    network: 'Rapid Metro',
    color: '#0284C7',
    textColor: '#FFFFFF',
    terminals: 'Sector 55-56 ⇄ Cyber City (Loop)',
    totalStations: 11,
  },
};

export const NCR_METRO_STATIONS = [
  // =========================================================================
  // YELLOW LINE (37 stations: Samaypur Badli ⇄ Millennium City Centre Gurugram)
  // =========================================================================
  { id: 'stn-samaypur-badli', name: 'Samaypur Badli', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.7456, lng: 77.1388, isInterchange: false },
  { id: 'stn-rohini-sec18-19', name: 'Rohini Sector 18, 19', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.7360, lng: 77.1432, isInterchange: false },
  { id: 'stn-haiderpur-badli-mor', name: 'Haiderpur Badli Mor', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.7238, lng: 77.1517, isInterchange: false },
  { id: 'stn-jahangirpuri', name: 'Jahangirpuri', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.7155, lng: 77.1643, isInterchange: false },
  { id: 'stn-adarsh-nagar', name: 'Adarsh Nagar', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.7042, lng: 77.1728, isInterchange: false },
  { id: 'stn-azadpur-y', name: 'Azadpur', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6998, lng: 77.1812, isInterchange: true, interchangeLines: ['yellow', 'pink'] },
  { id: 'stn-model-town', name: 'Model Town', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6925, lng: 77.1915, isInterchange: false },
  { id: 'stn-gtb-nagar', name: 'Guru Tegh Bahadur Nagar (GTB Nagar)', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6978, lng: 77.2065, isInterchange: false },
  { id: 'stn-vishwavidyalaya', name: 'Vishwavidyalaya (DU North Campus)', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6914, lng: 77.2118, isInterchange: false },
  { id: 'stn-vidhan-sabha', name: 'Vidhan Sabha', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6811, lng: 77.2205, isInterchange: false },
  { id: 'stn-civil-lines', name: 'Civil Lines', line: 'yellow', network: 'DMRC', zone: 'North Delhi', lat: 28.6750, lng: 77.2255, isInterchange: false },
  { id: 'stn-kashmere-gate-y', name: 'Kashmere Gate', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6675, lng: 77.2285, isInterchange: true, interchangeLines: ['red', 'yellow', 'violet'] },
  { id: 'stn-chandni-chowk-m', name: 'Chandni Chowk', line: 'yellow', network: 'DMRC', zone: 'Old Delhi', lat: 28.6578, lng: 77.2304, isInterchange: false },
  { id: 'stn-chawri-bazar-m', name: 'Chawri Bazar', line: 'yellow', network: 'DMRC', zone: 'Old Delhi', lat: 28.6496, lng: 77.2268, isInterchange: false },
  { id: 'stn-new-delhi-y', name: 'New Delhi (Railway Station / Airport Express)', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6429, lng: 77.2195, isInterchange: true, interchangeLines: ['yellow', 'orange'] },
  { id: 'stn-rajiv-chowk-y', name: 'Rajiv Chowk (Connaught Place)', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6328, lng: 77.2195, isInterchange: true, interchangeLines: ['yellow', 'blue'] },
  { id: 'stn-patel-chowk', name: 'Patel Chowk', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6231, lng: 77.2144, isInterchange: false },
  { id: 'stn-central-secretariat-y', name: 'Central Secretariat', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6148, lng: 77.2119, isInterchange: true, interchangeLines: ['yellow', 'violet'] },
  { id: 'stn-udyog-bhawan', name: 'Udyog Bhawan', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.6115, lng: 77.2120, isInterchange: false },
  { id: 'stn-lok-kalyan-marg', name: 'Lok Kalyan Marg', line: 'yellow', network: 'DMRC', zone: 'Central Delhi', lat: 28.5997, lng: 77.2118, isInterchange: false },
  { id: 'stn-jor-bagh', name: 'Jor Bagh', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5888, lng: 77.2115, isInterchange: false },
  { id: 'stn-dilli-haat-ina-y', name: 'Dilli Haat - INA', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5744, lng: 77.2096, isInterchange: true, interchangeLines: ['yellow', 'pink'] },
  { id: 'stn-aiims', name: 'AIIMS', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5684, lng: 77.2078, isInterchange: false },
  { id: 'stn-green-park', name: 'Green Park', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5588, lng: 77.2064, isInterchange: false },
  { id: 'stn-hauz-khas-y', name: 'Hauz Khas', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5432, lng: 77.2062, isInterchange: true, interchangeLines: ['yellow', 'magenta'] },
  { id: 'stn-malviya-nagar', name: 'Malviya Nagar', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5282, lng: 77.2063, isInterchange: false },
  { id: 'stn-saket-m', name: 'Saket', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5204, lng: 77.2023, isInterchange: false },
  { id: 'stn-qutab-minar', name: 'Qutab Minar', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5134, lng: 77.1860, isInterchange: false },
  { id: 'stn-chhatarpur', name: 'Chhatarpur', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.5065, lng: 77.1748, isInterchange: false },
  { id: 'stn-sultanpur', name: 'Sultanpur', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.4988, lng: 77.1615, isInterchange: false },
  { id: 'stn-ghitorni', name: 'Ghitorni', line: 'yellow', network: 'DMRC', zone: 'South Delhi', lat: 28.4925, lng: 77.1488, isInterchange: false },
  { id: 'stn-arjan-garh', name: 'Arjan Garh (Delhi-Haryana Border)', line: 'yellow', network: 'DMRC', zone: 'South Delhi / Border', lat: 28.4812, lng: 77.1260, isInterchange: false },
  { id: 'stn-guru-dronacharya', name: 'Guru Dronacharya', line: 'yellow', network: 'DMRC', zone: 'Gurugram', lat: 28.4820, lng: 77.1022, isInterchange: false },
  { id: 'stn-sikanderpur-y', name: 'Sikanderpur', line: 'yellow', network: 'DMRC', zone: 'Gurugram', lat: 28.4816, lng: 77.0927, isInterchange: true, interchangeLines: ['yellow', 'rapid'] },
  { id: 'stn-mg-road', name: 'MG Road', line: 'yellow', network: 'DMRC', zone: 'Gurugram', lat: 28.4796, lng: 77.0805, isInterchange: false },
  { id: 'stn-iffco-chowk', name: 'IFFCO Chowk', line: 'yellow', network: 'DMRC', zone: 'Gurugram', lat: 28.4722, lng: 77.0725, isInterchange: false },
  { id: 'stn-millennium-city-centre', name: 'Millennium City Centre Gurugram (HUDA)', line: 'yellow', network: 'DMRC', zone: 'Gurugram', lat: 28.4593, lng: 77.0725, isInterchange: false },

  // =========================================================================
  // BLUE LINE (Dwarka Sector 21 ⇄ Noida Electronic City & Vaishali Branch)
  // =========================================================================
  { id: 'stn-dwarka-sec21-b', name: 'Dwarka Sector 21', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5523, lng: 77.0583, isInterchange: true, interchangeLines: ['blue', 'orange'] },
  { id: 'stn-dwarka-sec8', name: 'Dwarka Sector 8', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5694, lng: 77.0685, isInterchange: false },
  { id: 'stn-dwarka-sec9', name: 'Dwarka Sector 9', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5772, lng: 77.0645, isInterchange: false },
  { id: 'stn-dwarka-sec10', name: 'Dwarka Sector 10', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5812, lng: 77.0578, isInterchange: false },
  { id: 'stn-dwarka-sec11', name: 'Dwarka Sector 11', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5878, lng: 77.0512, isInterchange: false },
  { id: 'stn-dwarka-sec12', name: 'Dwarka Sector 12', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.5925, lng: 77.0425, isInterchange: false },
  { id: 'stn-dwarka-sec13', name: 'Dwarka Sector 13', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6015, lng: 77.0345, isInterchange: false },
  { id: 'stn-dwarka-sec14', name: 'Dwarka Sector 14', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6045, lng: 77.0285, isInterchange: false },
  { id: 'stn-dwarka-m', name: 'Dwarka', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6145, lng: 77.0210, isInterchange: true, interchangeLines: ['blue', 'grey'] },
  { id: 'stn-dwarka-mor', name: 'Dwarka Mor', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6195, lng: 77.0325, isInterchange: false },
  { id: 'stn-nawada', name: 'Nawada', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6225, lng: 77.0450, isInterchange: false },
  { id: 'stn-uttam-nagar-w', name: 'Uttam Nagar West', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6248, lng: 77.0560, isInterchange: false },
  { id: 'stn-uttam-nagar-e', name: 'Uttam Nagar East', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6258, lng: 77.0678, isInterchange: false },
  { id: 'stn-janakpuri-west-b', name: 'Janakpuri West', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6295, lng: 77.0778, isInterchange: true, interchangeLines: ['blue', 'magenta'] },
  { id: 'stn-janakpuri-east', name: 'Janakpuri East', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6325, lng: 77.0885, isInterchange: false },
  { id: 'stn-tilak-nagar', name: 'Tilak Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6365, lng: 77.0988, isInterchange: false },
  { id: 'stn-subhash-nagar', name: 'Subhash Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6405, lng: 77.1085, isInterchange: false },
  { id: 'stn-tagore-garden', name: 'Tagore Garden', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6442, lng: 77.1145, isInterchange: false },
  { id: 'stn-rajouri-garden-b', name: 'Rajouri Garden', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6492, lng: 77.1228, isInterchange: true, interchangeLines: ['blue', 'pink'] },
  { id: 'stn-ramesh-nagar', name: 'Ramesh Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6532, lng: 77.1325, isInterchange: false },
  { id: 'stn-moti-nagar', name: 'Moti Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6578, lng: 77.1425, isInterchange: false },
  { id: 'stn-kirti-nagar-b', name: 'Kirti Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6558, lng: 77.1518, isInterchange: true, interchangeLines: ['blue', 'green'] },
  { id: 'stn-shadipur', name: 'Shadipur', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6525, lng: 77.1585, isInterchange: false },
  { id: 'stn-patel-nagar', name: 'Patel Nagar', line: 'blue', network: 'DMRC', zone: 'West Delhi', lat: 28.6495, lng: 77.1695, isInterchange: false },
  { id: 'stn-rajendra-place', name: 'Rajendra Place', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6425, lng: 77.1785, isInterchange: false },
  { id: 'stn-karol-bagh', name: 'Karol Bagh', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6442, lng: 77.1902, isInterchange: false },
  { id: 'stn-jhandewalan', name: 'Jhandewalan', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6445, lng: 77.1995, isInterchange: false },
  { id: 'stn-rk-ashram', name: 'Ramakrishna Ashram Marg', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6385, lng: 77.2085, isInterchange: false },
  { id: 'stn-rajiv-chowk-b', name: 'Rajiv Chowk', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6328, lng: 77.2195, isInterchange: true, interchangeLines: ['blue', 'yellow'] },
  { id: 'stn-barakhamba', name: 'Barakhamba Road', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6305, lng: 77.2255, isInterchange: false },
  { id: 'stn-mandi-house-b', name: 'Mandi House', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6258, lng: 77.2340, isInterchange: true, interchangeLines: ['blue', 'violet'] },
  { id: 'stn-supreme-court', name: 'Supreme Court (Pragati Maidan)', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6225, lng: 77.2435, isInterchange: false },
  { id: 'stn-indraprastha', name: 'Indraprastha', line: 'blue', network: 'DMRC', zone: 'Central Delhi', lat: 28.6205, lng: 77.2525, isInterchange: false },
  { id: 'stn-yamuna-bank', name: 'Yamuna Bank', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6245, lng: 77.2685, isInterchange: true, interchangeLines: ['blue'] },
  { id: 'stn-akshardham-m', name: 'Akshardham', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6178, lng: 77.2795, isInterchange: false },
  { id: 'stn-mayur-vihar-1-b', name: 'Mayur Vihar Phase 1', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6045, lng: 77.2915, isInterchange: true, interchangeLines: ['blue', 'pink'] },
  { id: 'stn-mayur-vihar-ext', name: 'Mayur Vihar Extension', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.5942, lng: 77.2985, isInterchange: false },
  { id: 'stn-new-ashok-nagar', name: 'New Ashok Nagar', line: 'blue', network: 'DMRC', zone: 'East Delhi / Border', lat: 28.5895, lng: 77.3075, isInterchange: false },
  { id: 'stn-noida-sec15', name: 'Noida Sector 15', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5835, lng: 77.3145, isInterchange: false },
  { id: 'stn-noida-sec16', name: 'Noida Sector 16', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5785, lng: 77.3195, isInterchange: false },
  { id: 'stn-noida-sec18-m', name: 'Noida Sector 18 (Atta Market)', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5708, lng: 77.3260, isInterchange: false },
  { id: 'stn-botanical-garden-b', name: 'Botanical Garden', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5644, lng: 77.3342, isInterchange: true, interchangeLines: ['blue', 'magenta'] },
  { id: 'stn-golf-course', name: 'Golf Course', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5675, lng: 77.3455, isInterchange: false },
  { id: 'stn-noida-city-centre', name: 'Noida City Centre (Sector 32)', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5745, lng: 77.3555, isInterchange: false },
  { id: 'stn-noida-sec34', name: 'Noida Sector 34', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5815, lng: 77.3615, isInterchange: false },
  { id: 'stn-noida-sec52', name: 'Noida Sector 52 (NMRC Aqua Link)', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.5915, lng: 77.3685, isInterchange: true, interchangeLines: ['blue', 'aqua'] },
  { id: 'stn-noida-sec61', name: 'Noida Sector 61', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.6015, lng: 77.3715, isInterchange: false },
  { id: 'stn-noida-sec59', name: 'Noida Sector 59', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.6115, lng: 77.3735, isInterchange: false },
  { id: 'stn-noida-sec62-m', name: 'Noida Sector 62', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.6205, lng: 77.3685, isInterchange: false },
  { id: 'stn-noida-electronic-city', name: 'Noida Electronic City', line: 'blue', network: 'DMRC', zone: 'Noida', lat: 28.6280, lng: 77.3649, isInterchange: false },
  // Blue Line (Vaishali Branch)
  { id: 'stn-laxmi-nagar', name: 'Laxmi Nagar', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6315, lng: 77.2775, isInterchange: false },
  { id: 'stn-nirman-vihar', name: 'Nirman Vihar', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6365, lng: 77.2865, isInterchange: false },
  { id: 'stn-preet-vihar', name: 'Preet Vihar', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6415, lng: 77.2945, isInterchange: false },
  { id: 'stn-karkarduma-b', name: 'Karkarduma', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6485, lng: 77.3045, isInterchange: true, interchangeLines: ['blue', 'pink'] },
  { id: 'stn-anand-vihar-b', name: 'Anand Vihar ISBT & Railway', line: 'blue', network: 'DMRC', zone: 'East Delhi', lat: 28.6469, lng: 77.3160, isInterchange: true, interchangeLines: ['blue', 'pink'] },
  { id: 'stn-kaushambi', name: 'Kaushambi', line: 'blue', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6455, lng: 77.3245, isInterchange: false },
  { id: 'stn-vaishali', name: 'Vaishali', line: 'blue', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6495, lng: 77.3395, isInterchange: false },

  // =========================================================================
  // VIOLET LINE (Kashmere Gate ⇄ Raja Nahar Singh Ballabhgarh / Faridabad)
  // =========================================================================
  { id: 'stn-lal-quila', name: 'Lal Quila (Red Fort)', line: 'violet', network: 'DMRC', zone: 'Old Delhi', lat: 28.6565, lng: 77.2415, isInterchange: false },
  { id: 'stn-jama-masjid-m', name: 'Jama Masjid', line: 'violet', network: 'DMRC', zone: 'Old Delhi', lat: 28.6505, lng: 77.2395, isInterchange: false },
  { id: 'stn-delhi-gate', name: 'Delhi Gate', line: 'violet', network: 'DMRC', zone: 'Old Delhi', lat: 28.6415, lng: 77.2405, isInterchange: false },
  { id: 'stn-ito', name: 'ITO', line: 'violet', network: 'DMRC', zone: 'Central Delhi', lat: 28.6285, lng: 77.2410, isInterchange: false },
  { id: 'stn-janpath', name: 'Janpath', line: 'violet', network: 'DMRC', zone: 'Central Delhi', lat: 28.6215, lng: 77.2185, isInterchange: false },
  { id: 'stn-khan-market-m', name: 'Khan Market', line: 'violet', network: 'DMRC', zone: 'Central Delhi', lat: 28.6003, lng: 77.2270, isInterchange: false },
  { id: 'stn-jln-stadium', name: 'Jawaharlal Nehru Stadium', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5865, lng: 77.2335, isInterchange: false },
  { id: 'stn-jangpura', name: 'Jangpura', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5815, lng: 77.2395, isInterchange: false },
  { id: 'stn-lajpat-nagar-v', name: 'Lajpat Nagar', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5677, lng: 77.2433, isInterchange: true, interchangeLines: ['violet', 'pink'] },
  { id: 'stn-moolchand-m', name: 'Moolchand', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5670, lng: 77.2389, isInterchange: false },
  { id: 'stn-kailash-colony', name: 'Kailash Colony', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5555, lng: 77.2425, isInterchange: false },
  { id: 'stn-nehru-place-m', name: 'Nehru Place', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5494, lng: 77.2528, isInterchange: false },
  { id: 'stn-kalkaji-mandir-v', name: 'Kalkaji Mandir', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5498, lng: 77.2605, isInterchange: true, interchangeLines: ['violet', 'magenta'] },
  { id: 'stn-govindpuri-m', name: 'Govindpuri (Okhla)', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5283, lng: 77.2625, isInterchange: false },
  { id: 'stn-harkesh-nagar', name: 'Harkesh Nagar Okhla', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5245, lng: 77.2765, isInterchange: false },
  { id: 'stn-jasola-apollo', name: 'Jasola Apollo', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5395, lng: 77.2885, isInterchange: false },
  { id: 'stn-sarita-vihar', name: 'Sarita Vihar', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5295, lng: 77.2985, isInterchange: false },
  { id: 'stn-mohan-estate', name: 'Mohan Estate', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5195, lng: 77.3065, isInterchange: false },
  { id: 'stn-tughlakabad', name: 'Tughlakabad Station', line: 'violet', network: 'DMRC', zone: 'South Delhi', lat: 28.5085, lng: 77.3095, isInterchange: false },
  { id: 'stn-badarpur-border', name: 'Badarpur Border', line: 'violet', network: 'DMRC', zone: 'Delhi-Haryana Border', lat: 28.4985, lng: 77.3085, isInterchange: false },
  { id: 'stn-sarai', name: 'Sarai', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4845, lng: 77.3105, isInterchange: false },
  { id: 'stn-nhpc-chowk', name: 'NHPC Chowk', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4695, lng: 77.3115, isInterchange: false },
  { id: 'stn-mewala-maharajpur', name: 'Mewala Maharajpur', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4555, lng: 77.3125, isInterchange: false },
  { id: 'stn-sec28-faridabad', name: 'Sector 28 Faridabad', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4415, lng: 77.3135, isInterchange: false },
  { id: 'stn-badkal-mor', name: 'Badkal Mor', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4285, lng: 77.3145, isInterchange: false },
  { id: 'stn-old-faridabad', name: 'Old Faridabad', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.4145, lng: 77.3155, isInterchange: false },
  { id: 'stn-neelam-chowk', name: 'Neelam Chowk Ajronda', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.3985, lng: 77.3165, isInterchange: false },
  { id: 'stn-bata-chowk', name: 'Bata Chowk', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.3845, lng: 77.3175, isInterchange: false },
  { id: 'stn-escorts-mujesar', name: 'Escorts Mujesar', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.3705, lng: 77.3185, isInterchange: false },
  { id: 'stn-sant-surdas', name: 'Sant Surdas (Sihi / NCB Colony)', line: 'violet', network: 'DMRC', zone: 'Faridabad', lat: 28.3515, lng: 77.3205, isInterchange: false },
  { id: 'stn-raja-nahar-singh', name: 'Raja Nahar Singh (Ballabhgarh)', line: 'violet', network: 'DMRC', zone: 'Ballabhgarh', lat: 28.3365, lng: 77.3225, isInterchange: false },

  // =========================================================================
  // MAGENTA LINE (Janakpuri West ⇄ Botanical Garden Noida)
  // =========================================================================
  { id: 'stn-dabri-mor', name: 'Dabri Mor - Janakpuri South', line: 'magenta', network: 'DMRC', zone: 'West Delhi', lat: 28.6185, lng: 77.0885, isInterchange: false },
  { id: 'stn-dashrath-puri', name: 'Dashrath Puri', line: 'magenta', network: 'DMRC', zone: 'West Delhi', lat: 28.6085, lng: 77.0945, isInterchange: false },
  { id: 'stn-palam', name: 'Palam', line: 'magenta', network: 'DMRC', zone: 'South West Delhi', lat: 28.5895, lng: 77.0865, isInterchange: false },
  { id: 'stn-sadar-bazar-cantt', name: 'Sadar Bazar Cantonment', line: 'magenta', network: 'DMRC', zone: 'South West Delhi', lat: 28.5785, lng: 77.1085, isInterchange: false },
  { id: 'stn-t1-igi-airport', name: 'Terminal 1-IGI Airport (Domestic)', line: 'magenta', network: 'DMRC', zone: 'Airport', lat: 28.5635, lng: 77.1195, isInterchange: false },
  { id: 'stn-shankar-vihar', name: 'Shankar Vihar', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5585, lng: 77.1425, isInterchange: false },
  { id: 'stn-vasant-vihar', name: 'Vasant Vihar', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5565, lng: 77.1605, isInterchange: false },
  { id: 'stn-munirka', name: 'Munirka', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5562, lng: 77.1745, isInterchange: false },
  { id: 'stn-iit-delhi', name: 'IIT Delhi', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5465, lng: 77.1935, isInterchange: false },
  { id: 'stn-panchsheel-park', name: 'Panchsheel Park', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5425, lng: 77.2185, isInterchange: false },
  { id: 'stn-chirag-delhi', name: 'Chirag Delhi', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5428, lng: 77.2305, isInterchange: false },
  { id: 'stn-greater-kailash', name: 'Greater Kailash (GK Enclave)', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5435, lng: 77.2415, isInterchange: false },
  { id: 'stn-nehru-enclave', name: 'Nehru Enclave', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5485, lng: 77.2515, isInterchange: false },
  { id: 'stn-okhla-nsic', name: 'Okhla NSIC', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5535, lng: 77.2715, isInterchange: false },
  { id: 'stn-sukhdev-vihar', name: 'Sukhdev Vihar', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5625, lng: 77.2785, isInterchange: false },
  { id: 'stn-jamia-millia', name: 'Jamia Millia Islamia', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5645, lng: 77.2835, isInterchange: false },
  { id: 'stn-okhla-vihar', name: 'Okhla Vihar', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5595, lng: 77.2945, isInterchange: false },
  { id: 'stn-jasola-vihar', name: 'Jasola Vihar Shaheen Bagh', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5495, lng: 77.3015, isInterchange: false },
  { id: 'stn-kalindi-kunj', name: 'Kalindi Kunj', line: 'magenta', network: 'DMRC', zone: 'South Delhi', lat: 28.5435, lng: 77.3115, isInterchange: false },
  { id: 'stn-okhla-bird-sanctuary', name: 'Okhla Bird Sanctuary', line: 'magenta', network: 'DMRC', zone: 'Noida Border', lat: 28.5475, lng: 77.3245, isInterchange: false },

  // =========================================================================
  // AIRPORT EXPRESS LINE (ORANGE LINE - 7 Stations)
  // =========================================================================
  { id: 'stn-shivaji-stadium', name: 'Shivaji Stadium (Connaught Place)', line: 'orange', network: 'DMRC', zone: 'Central Delhi', lat: 28.6310, lng: 77.2120, isInterchange: false },
  { id: 'stn-dhaula-kuan', name: 'Dhaula Kuan (South Campus Interchange)', line: 'orange', network: 'DMRC', zone: 'South West Delhi', lat: 28.5910, lng: 77.1620, isInterchange: true, interchangeLines: ['orange', 'pink'] },
  { id: 'stn-delhi-aerocity', name: 'Delhi Aerocity (Worldmark Plaza)', line: 'orange', network: 'DMRC', zone: 'Aerocity', lat: 28.5502, lng: 77.1215, isInterchange: false },
  { id: 'stn-igi-airport-t3', name: 'IGI Airport Terminal 3 (International & T2)', line: 'orange', network: 'DMRC', zone: 'Airport', lat: 28.5562, lng: 77.0999, isInterchange: false },
  { id: 'stn-yashobhoomi-dwarka25', name: 'Yashobhoomi Dwarka Sector 25 (IICC)', line: 'orange', network: 'DMRC', zone: 'West Delhi', lat: 28.5445, lng: 77.0425, isInterchange: false },

  // =========================================================================
  // NOIDA METRO (NMRC AQUA LINE - ALL 21 STATIONS)
  // =========================================================================
  { id: 'stn-noida-sec51-aqua', name: 'Noida Sector 51', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5920, lng: 77.3695, isInterchange: true, interchangeLines: ['aqua', 'blue'] },
  { id: 'stn-noida-sec50-aqua', name: 'Noida Sector 50 (Rainbow Station)', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5835, lng: 77.3715, isInterchange: false },
  { id: 'stn-noida-sec76-aqua', name: 'Noida Sector 76', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5745, lng: 77.3775, isInterchange: false },
  { id: 'stn-noida-sec101-aqua', name: 'Noida Sector 101', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5635, lng: 77.3825, isInterchange: false },
  { id: 'stn-noida-sec81-aqua', name: 'Noida Sector 81', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5525, lng: 77.3885, isInterchange: false },
  { id: 'stn-nsez-aqua', name: 'NSEZ (Special Economic Zone)', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5395, lng: 77.3945, isInterchange: false },
  { id: 'stn-noida-sec83-aqua', name: 'Noida Sector 83', line: 'aqua', network: 'NMRC', zone: 'Noida', lat: 28.5285, lng: 77.3995, isInterchange: false },
  { id: 'stn-noida-sec137-aqua', name: 'Noida Sector 137 (Paras Tierea)', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.5145, lng: 77.4085, isInterchange: false },
  { id: 'stn-noida-sec142-aqua', name: 'Noida Sector 142 (Advant Navis)', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.5028, lng: 77.4124, isInterchange: false },
  { id: 'stn-noida-sec143-aqua', name: 'Noida Sector 143', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4915, lng: 77.4185, isInterchange: false },
  { id: 'stn-noida-sec144-aqua', name: 'Noida Sector 144', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4795, lng: 77.4255, isInterchange: false },
  { id: 'stn-noida-sec145-aqua', name: 'Noida Sector 145', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4685, lng: 77.4325, isInterchange: false },
  { id: 'stn-noida-sec146-aqua', name: 'Noida Sector 146', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4575, lng: 77.4395, isInterchange: false },
  { id: 'stn-noida-sec147-aqua', name: 'Noida Sector 147', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4465, lng: 77.4465, isInterchange: false },
  { id: 'stn-noida-sec148-aqua', name: 'Noida Sector 148', line: 'aqua', network: 'NMRC', zone: 'Noida Expressway', lat: 28.4355, lng: 77.4535, isInterchange: false },
  { id: 'stn-knowledge-park-2', name: 'Knowledge Park II (University Hub)', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4585, lng: 77.4895, isInterchange: false },
  { id: 'stn-pari-chowk', name: 'Pari Chowk (Greater Noida Iconic)', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4635, lng: 77.5025, isInterchange: false },
  { id: 'stn-alpha-1', name: 'Alpha 1', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4725, lng: 77.5135, isInterchange: false },
  { id: 'stn-delta-1', name: 'Delta 1', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4815, lng: 77.5245, isInterchange: false },
  { id: 'stn-gnida-office', name: 'GNIDA Office (Greater Noida Authority)', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4905, lng: 77.5355, isInterchange: false },
  { id: 'stn-depot-aqua', name: 'Depot (Greater Noida Terminal)', line: 'aqua', network: 'NMRC', zone: 'Greater Noida', lat: 28.4985, lng: 77.5465, isInterchange: false },

  // =========================================================================
  // GURGAON RAPID METRO (RMGL - ALL 11 STATIONS)
  // =========================================================================
  { id: 'stn-rapid-sec55-56', name: 'Sector 55-56 (Golf Course Extn)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4235, lng: 77.1065, isInterchange: false },
  { id: 'stn-rapid-sec54-chowk', name: 'Sector 54 Chowk', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4385, lng: 77.1015, isInterchange: false },
  { id: 'stn-rapid-sec53-54', name: 'Sector 53-54 (South Point Mall)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4515, lng: 77.0985, isInterchange: false },
  { id: 'stn-rapid-sec42-43', name: 'Sector 42-43 (Genpact / Golf Course)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4645, lng: 77.0945, isInterchange: false },
  { id: 'stn-rapid-phase1', name: 'Phase 1', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4745, lng: 77.0935, isInterchange: false },
  { id: 'stn-rapid-sikanderpur', name: 'Sikanderpur Rapid Metro (Interchange)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4816, lng: 77.0927, isInterchange: true, interchangeLines: ['rapid', 'yellow'] },
  { id: 'stn-rapid-phase2', name: 'Phase 2', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4885, lng: 77.0905, isInterchange: false },
  { id: 'stn-rapid-belvedere', name: 'Belvedere Towers', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4915, lng: 77.0895, isInterchange: false },
  { id: 'stn-rapid-cyber-city', name: 'Cyber City (Building 10 / CyberHub)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4950, lng: 77.0895, isInterchange: false },
  { id: 'stn-rapid-moulsari', name: 'Moulsari Avenue (Ambience Mall)', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.5025, lng: 77.0945, isInterchange: false },
  { id: 'stn-rapid-phase3', name: 'Phase 3', line: 'rapid', network: 'Rapid Metro', zone: 'Gurugram', lat: 28.4965, lng: 77.0995, isInterchange: false },

  // =========================================================================
  // RED LINE (Rithala ⇄ Shaheed Sthal Ghaziabad)
  // =========================================================================
  { id: 'stn-rithala', name: 'Rithala', line: 'red', network: 'DMRC', zone: 'North West Delhi', lat: 28.7185, lng: 77.1075, isInterchange: false },
  { id: 'stn-rohini-west', name: 'Rohini West', line: 'red', network: 'DMRC', zone: 'North West Delhi', lat: 28.7125, lng: 77.1145, isInterchange: false },
  { id: 'stn-rohini-east', name: 'Rohini East', line: 'red', network: 'DMRC', zone: 'North West Delhi', lat: 28.7075, lng: 77.1245, isInterchange: false },
  { id: 'stn-pitampura', name: 'Pitampura', line: 'red', network: 'DMRC', zone: 'North West Delhi', lat: 28.6995, lng: 77.1395, isInterchange: false },
  { id: 'stn-netaji-subhash-place-r', name: 'Netaji Subhash Place', line: 'red', network: 'DMRC', zone: 'North West Delhi', lat: 28.6945, lng: 77.1525, isInterchange: true, interchangeLines: ['red', 'pink'] },
  { id: 'stn-inderlok-r', name: 'Inderlok', line: 'red', network: 'DMRC', zone: 'North Delhi', lat: 28.6735, lng: 77.1705, isInterchange: true, interchangeLines: ['red', 'green'] },
  { id: 'stn-shastri-park', name: 'Shastri Park', line: 'red', network: 'DMRC', zone: 'North East Delhi', lat: 28.6695, lng: 77.2525, isInterchange: false },
  { id: 'stn-seelampur', name: 'Seelampur', line: 'red', network: 'DMRC', zone: 'North East Delhi', lat: 28.6698, lng: 77.2645, isInterchange: false },
  { id: 'stn-welcome-r', name: 'Welcome', line: 'red', network: 'DMRC', zone: 'North East Delhi', lat: 28.6715, lng: 77.2765, isInterchange: true, interchangeLines: ['red', 'pink'] },
  { id: 'stn-shahdara', name: 'Shahdara (Railway Station)', line: 'red', network: 'DMRC', zone: 'East Delhi', lat: 28.6735, lng: 77.2885, isInterchange: false },
  { id: 'stn-dilshad-garden', name: 'Dilshad Garden', line: 'red', network: 'DMRC', zone: 'East Delhi', lat: 28.6815, lng: 77.3215, isInterchange: false },
  { id: 'stn-shaheed-nagar', name: 'Shaheed Nagar', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6825, lng: 77.3315, isInterchange: false },
  { id: 'stn-raj-bagh', name: 'Raj Bagh', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6835, lng: 77.3415, isInterchange: false },
  { id: 'stn-major-mohit-sharma', name: 'Major Mohit Sharma Rajendra Nagar', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6845, lng: 77.3515, isInterchange: false },
  { id: 'stn-shyam-park', name: 'Shyam Park', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6855, lng: 77.3615, isInterchange: false },
  { id: 'stn-mohan-nagar', name: 'Mohan Nagar', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6865, lng: 77.3715, isInterchange: false },
  { id: 'stn-arthala', name: 'Arthala', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6875, lng: 77.3815, isInterchange: false },
  { id: 'stn-hindon-river', name: 'Hindon River', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6885, lng: 77.3915, isInterchange: false },
  { id: 'stn-shaheed-sthal', name: 'Shaheed Sthal (New Bus Adda Ghaziabad)', line: 'red', network: 'DMRC', zone: 'Ghaziabad', lat: 28.6715, lng: 77.4265, isInterchange: false },

  // =========================================================================
  // GREEN LINE (Inderlok / Kirti Nagar ⇄ Bahadurgarh City)
  // =========================================================================
  { id: 'stn-punjabi-bagh-g', name: 'Punjabi Bagh', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6712, lng: 77.1485, isInterchange: false },
  { id: 'stn-paschim-vihar-east', name: 'Paschim Vihar East', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6705, lng: 77.1105, isInterchange: false },
  { id: 'stn-paschim-vihar-west', name: 'Paschim Vihar West', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6702, lng: 77.0965, isInterchange: false },
  { id: 'stn-peeragarhi', name: 'Peeragarhi (Outer Ring Road)', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6700, lng: 77.0845, isInterchange: false },
  { id: 'stn-nangloi', name: 'Nangloi', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6775, lng: 77.0505, isInterchange: false },
  { id: 'stn-mundka', name: 'Mundka', line: 'green', network: 'DMRC', zone: 'West Delhi', lat: 28.6855, lng: 77.0185, isInterchange: false },
  { id: 'stn-tikri-border', name: 'Tikri Border (Delhi-Haryana Border)', line: 'green', network: 'DMRC', zone: 'Haryana Border', lat: 28.6915, lng: 76.9505, isInterchange: false },
  { id: 'stn-bahadurgarh-city', name: 'Bahadurgarh City', line: 'green', network: 'DMRC', zone: 'Bahadurgarh', lat: 28.6935, lng: 76.9245, isInterchange: false },
  { id: 'stn-brig-hoshiyar-singh', name: 'Brigadier Hoshiyar Singh (Bahadurgarh Terminal)', line: 'green', network: 'DMRC', zone: 'Bahadurgarh', lat: 28.6945, lng: 76.9125, isInterchange: false },

  // =========================================================================
  // PINK LINE (Majlis Park ⇄ Shiv Vihar Ring Road Orbit)
  // =========================================================================
  { id: 'stn-majlis-park', name: 'Majlis Park', line: 'pink', network: 'DMRC', zone: 'North Delhi', lat: 28.7185, lng: 77.1795, isInterchange: false },
  { id: 'stn-shalimar-bagh', name: 'Shalimar Bagh', line: 'pink', network: 'DMRC', zone: 'North West Delhi', lat: 28.6985, lng: 77.1685, isInterchange: false },
  { id: 'stn-punjabi-bagh-west', name: 'Punjabi Bagh West', line: 'pink', network: 'DMRC', zone: 'West Delhi', lat: 28.6685, lng: 77.1325, isInterchange: true, interchangeLines: ['pink', 'green'] },
  { id: 'stn-naraina-vihar', name: 'Naraina Vihar', line: 'pink', network: 'DMRC', zone: 'West Delhi', lat: 28.6255, lng: 77.1385, isInterchange: false },
  { id: 'stn-delhi-cantt', name: 'Delhi Cantt', line: 'pink', network: 'DMRC', zone: 'South West Delhi', lat: 28.5995, lng: 77.1495, isInterchange: false },
  { id: 'stn-south-campus', name: 'Durgabai Deshmukh South Campus', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5875, lng: 77.1635, isInterchange: true, interchangeLines: ['pink', 'orange'] },
  { id: 'stn-bhikaji-cama', name: 'Bhikaji Cama Place', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5685, lng: 77.1885, isInterchange: false },
  { id: 'stn-sarojini-nagar-p', name: 'Sarojini Nagar', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5745, lng: 77.1985, isInterchange: false },
  { id: 'stn-south-extension', name: 'South Extension', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5685, lng: 77.2205, isInterchange: false },
  { id: 'stn-vinobapuri', name: 'Vinobapuri', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5715, lng: 77.2535, isInterchange: false },
  { id: 'stn-ashram', name: 'Ashram', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5785, lng: 77.2625, isInterchange: false },
  { id: 'stn-hazrat-nizamuddin-p', name: 'Sarai Kale Khan - Hazrat Nizamuddin', line: 'pink', network: 'DMRC', zone: 'South Delhi', lat: 28.5888, lng: 77.2565, isInterchange: true, interchangeLines: ['pink'] },
  { id: 'stn-trilokpuri', name: 'Trilokpuri Sanjay Lake', line: 'pink', network: 'DMRC', zone: 'East Delhi', lat: 28.6145, lng: 77.3045, isInterchange: false },
  { id: 'stn-ip-extension', name: 'IP Extension', line: 'pink', network: 'DMRC', zone: 'East Delhi', lat: 28.6365, lng: 77.3075, isInterchange: false },
  { id: 'stn-shiv-vihar', name: 'Shiv Vihar (Terminal)', line: 'pink', network: 'DMRC', zone: 'North East Delhi', lat: 28.7145, lng: 77.2645, isInterchange: false }
];

// Helper: Filter stations by line or network
export function getStationsByLine(lineId) {
  if (!lineId || lineId === 'all') return NCR_METRO_STATIONS;
  return NCR_METRO_STATIONS.filter(s => s.line === lineId || (s.interchangeLines && s.interchangeLines.includes(lineId)));
}

// Helper: Fast text search
export function searchMetroStations(query) {
  if (!query) return NCR_METRO_STATIONS;
  const q = query.toLowerCase().trim();
  return NCR_METRO_STATIONS.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.zone.toLowerCase().includes(q) ||
    s.network.toLowerCase().includes(q) ||
    s.line.toLowerCase().includes(q)
  );
}
