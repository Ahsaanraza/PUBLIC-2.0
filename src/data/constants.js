import { Plane, Moon, Sparkles, Building, Shield, FileText, Compass, Briefcase, Luggage, X, Info, RefreshCw, Ban, CheckCircle2 } from 'lucide-react';

// --- Static Data ---
export const tabs = [
  { name: 'Flights', icon: Plane },
  { name: 'Umrah Packages', icon: Moon },
  { name: 'AI Planner', icon: Sparkles },
  { name: 'Hotels', icon: Building },
  { name: 'Insurance', icon: Shield },
  { name: 'Visa', icon: FileText },
  { name: 'Trips', icon: Compass }
];

export const recommendedHolidays = [
  { title: "Premium Umrah Package", days: "14 Days", price: "Rs 250,000", image: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.9 },
  { title: "Makkah & Madinah Saver", days: "21 Days", price: "Rs 180,000", image: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.7 },
  { title: "Ramadan Special", days: "30 Days", price: "Rs 350,000", image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.8 },
  { title: "Family Economy Package", days: "15 Days", price: "Rs 150,000", image: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 4.6 },
  { title: "VIP Executive Umrah", days: "10 Days", price: "Rs 450,000", image: "https://images.unsplash.com/photo-1564769665977-9dd6d5d59045?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", rating: 5.0 }
];

export const videos = [
  { name: "Ahmed Family", trip: "14-Day Umrah Package", img: "https://images.unsplash.com/photo-1564769665977-9dd6d5d59045?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Sarah & John", trip: "Premium Makkah Tour", img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { name: "Brother Tariq", trip: "Ramadan Special", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];
export const reviewVideos = [
  { 
    name: "Ahmed Family", 
    trip: "14-Day Umrah Package", 
    category: "Family", 
    duration: "2:45", 
    quote: "The team at Saer.pk made our family Umrah so easy. From the flights to the hotel proximity, everything was perfect.",
    img: "https://images.unsplash.com/photo-1564769665977-9dd6d5d59045?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Sarah & John", 
    trip: "Premium Makkah Tour", 
    category: "Couples", 
    duration: "1:30", 
    quote: "An spiritually uplifting experience. The premium package really allowed us to focus on our prayers without worrying about logistics.",
    img: "https://images.unsplash.com/photo-1542816417-0983c9c9ad53?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "Brother Tariq", 
    trip: "Ramadan Special", 
    category: "Ramadan", 
    duration: "3:15", 
    quote: "Booking Ramadan Umrah is usually a headache, but Saer.pk had the best rates and instant confirmation.",
    img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
  }
];

export const blogs = [
  { title: "Essential Tips for First-Time Umrah Performers", date: "Oct 12, 2024", category: "Guides", img: "https://images.unsplash.com/photo-1591604466107-ec97de577aaf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { title: "Best Places to Visit in Madinah After Ziyarat", date: "Oct 08, 2024", category: "Travel", img: "https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" },
  { title: "Understanding the New Umrah Visa Regulations", date: "Sep 28, 2024", category: "News", img: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" }
];

export const faqs = [
  { question: "How do I book an Umrah package?", answer: "Booking is simple! Select your desired package, choose your travel dates, and click 'Book Now'. You will be guided through a secure payment process." },
  { question: "What is the 48-Hour Refund Guarantee?", answer: "If you need to cancel your booking within 48 hours of purchase, we offer a full refund, no questions asked, ensuring your peace of mind." },
  { question: "Are visas included in the packages?", answer: "Most of our comprehensive Umrah packages include visa processing. Please check the specific details of the package you are interested in." },
  { question: "Can I customize my travel itinerary?", answer: "Yes, we offer fully customizable packages. You can contact our 24/7 support team via WhatsApp or phone to tailor your spiritual journey to your exact needs." }
];

export const airports = [
  { code: 'LHE', city: 'Lahore', country: 'Pakistan', name: 'Allama Iqbal International' },
  { code: 'ISB', city: 'Islamabad', country: 'Pakistan', name: 'Islamabad International' },
  { code: 'KHI', city: 'Karachi', country: 'Pakistan', name: 'Jinnah International' },
  { code: 'DXB', city: 'Dubai', country: 'United Arab Emirates', name: 'Dubai International' },
  { code: 'JED', city: 'Jeddah', country: 'Saudi Arabia', name: 'King Abdulaziz International' },
  { code: 'MED', city: 'Madinah', country: 'Saudi Arabia', name: 'Prince Mohammad Bin Abdulaziz' },
  { code: 'LHR', city: 'London', country: 'United Kingdom', name: 'Heathrow Airport' },
  { code: 'JFK', city: 'New York', country: 'United States', name: 'John F. Kennedy International' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', name: 'Istanbul Airport' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', name: 'Hamad International' },
  { code: 'SKT', city: 'Sialkot', country: 'Pakistan', name: 'Sialkot International' }
];

export const mockAirlines = [
  { name: 'Qatar Airways', logo: 'https://trade.newchoudhary.com/flight/images/airlines/QR.png', code: 'QR' },
  { name: 'flydubai', logo: 'https://trade.newchoudhary.com/flight/images/airlines/FZ.png', code: 'FZ' },
  { name: 'Emirates', logo: 'https://trade.newchoudhary.com/flight/images/airlines/EK.png', code: 'EK' },
  { name: 'Air Arabia', logo: 'https://trade.newchoudhary.com/flight/images/airlines/G9.png', code: 'G9' },
  { name: 'AirSial', logo: 'https://trade.newchoudhary.com/flight/images/airlines/PF.png', code: 'PF' }
];

export const mockFlightResults = [
  { id: 1, airline: mockAirlines[0], price: 211659, duration: '10h 50m', durationMins: 650, stops: '1 Stop', depTime: '03:10 AM', arrTime: '12:00 PM', layoverCity: 'DOH' },
  { id: 2, airline: mockAirlines[4], price: 268725, duration: '8h 20m', durationMins: 500, stops: 'Non-stop', depTime: '10:15 PM', arrTime: '02:35 AM', layoverCity: null },
  { id: 3, airline: mockAirlines[2], price: 304023, duration: '8h 25m', durationMins: 505, stops: '1 Stop', depTime: '07:50 AM', arrTime: '03:15 PM', layoverCity: 'DXB' },
  { id: 4, airline: mockAirlines[1], price: 139984, duration: '12h 05m', durationMins: 725, stops: '1 Stop', depTime: '05:50 AM', arrTime: '04:45 PM', layoverCity: 'DXB' },
  { id: 5, airline: mockAirlines[3], price: 95966, duration: '9h 00m', durationMins: 540, stops: 'Non-stop', depTime: '03:45 AM', arrTime: '11:45 AM', layoverCity: null },
  { id: 6, airline: mockAirlines[2], price: 274051, duration: '8h 30m', durationMins: 510, stops: 'Non-stop', depTime: '10:45 AM', arrTime: '01:10 AM', layoverCity: null },
];

export const fareTiers = [
  { 
    id: 'classic', name: 'Economy Classic', tag: 'CHEAPEST', addPrice: 0, 
    features: [
      {icon: Briefcase, text: '7kg Cabin Baggage', cross: false}, 
      {icon: Luggage, text: 'Total: 25kg PCs: 1', cross: false}, 
      {icon: X, text: 'Seat Selection', cross: true}, 
      {icon: Info, text: 'Meal Included', cross: false}, 
      {icon: RefreshCw, text: 'Modification Penalty', cross: false}, 
      {icon: Ban, text: 'Cancellation Penalty', cross: false}
    ] 
  },
  { 
    id: 'convenience', name: 'Economy Convenience', tag: 'RECOMMENDED', addPrice: 12010, 
    features: [
      {icon: Briefcase, text: '7kg Cabin Baggage', cross: false}, 
      {icon: Luggage, text: 'Total: 30kg PCs: 1', cross: false}, 
      {icon: X, text: 'Seat Selection', cross: true}, 
      {icon: Info, text: 'Meal Included', cross: false}, 
      {icon: RefreshCw, text: 'Modification Penalty', cross: false}, 
      {icon: Ban, text: 'Cancellation Penalty', cross: false}
    ] 
  },
  { 
    id: 'comfort', name: 'Economy Comfort', tag: 'FLEXIBLE', addPrice: 98080, 
    features: [
      {icon: Briefcase, text: '7kg Cabin Baggage', cross: false}, 
      {icon: Luggage, text: 'Total: 35kg PCs: 1', cross: false}, 
      {icon: CheckCircle2, text: 'Free Seat Selection', cross: false}, 
      {icon: Info, text: 'Meal Included', cross: false}, 
      {icon: RefreshCw, text: 'Free Modification', cross: false}, 
      {icon: Ban, text: 'Cancellation Penalty', cross: false}
    ] 
  }
];

export const branchLocations = [
  { city: 'Lahore (Head Office)', address: '123 Business Avenue, Block 4, Gulberg III, Lahore, Pakistan', phone: '0300-0701506', email: 'lahore@saer.pk' },
  { city: 'Karachi', address: 'Suite 405, Shahrah-e-Faisal, PECHS, Karachi, Pakistan', phone: '0300-1234567', email: 'karachi@saer.pk' },
  { city: 'Islamabad', address: 'Office 12, Blue Area, F-7 Markaz, Islamabad, Pakistan', phone: '0300-7654321', email: 'islamabad@saer.pk' },
  { city: 'Sialkot', address: 'Kashmir Road, Cantt Area, Sialkot, Pakistan', phone: '0300-9876543', email: 'sialkot@saer.pk' },
  { city: 'Multan', address: 'Aziz Shaheed Road, Multan Cantt, Multan, Pakistan', phone: '0300-5678912', email: 'multan@saer.pk' },
  { city: 'Peshawar', address: 'Abdali Road, Near Cantt Plaza, Peshawar, Peshawar, Pakistan', phone: '0300-3456789', email: 'peshawar@saer.pk' }
];