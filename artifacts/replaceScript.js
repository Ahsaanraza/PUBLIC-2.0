const fs = require('fs');
let liveTickets = fs.readFileSync('c:/Users/AHSAN/my-new-app/admin-saer-pk/src/pages/operations/LiveTickets.jsx', 'utf8');

const searchForm = fs.readFileSync('c:/Users/AHSAN/my-new-app/artifacts/scratch_form.jsx', 'utf8');

const handlersToInsert = `
  const handleDecreaseAdults = () => {
    if (adults > 1) {
      setAdults(adults - 1);
      if (infants >= adults) setInfants(adults - 1);
    }
  };

  const handleAddInfant = () => {
    if (infants < adults) setInfants(infants + 1);
  };

  const handleAddDestination = (e) => {
    e.preventDefault();
    if (multiCityFlights.length < 6) {
      const lastFlight = multiCityFlights[multiCityFlights.length - 1];
      const newDate = lastFlight.date ? new Date(lastFlight.date) : new Date();
      if (lastFlight.date) {
        newDate.setDate(newDate.getDate() + 3);
      }
      setMultiCityFlights([...multiCityFlights, { from: lastFlight.to, to: null, date: newDate }]);
    }
  };

  const handleRemoveDestination = (index) => {
    const newFlights = [...multiCityFlights];
    newFlights.splice(index, 1);
    setMultiCityFlights(newFlights);
  };
`;

const insertMarker = 'const filteredAirports = airports.filter(a =>';
if (liveTickets.includes(insertMarker)) {
  liveTickets = liveTickets.replace(insertMarker, handlersToInsert + '\n  ' + insertMarker);
}

const formStartMarker = '<div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-visible">';
const formEndMarker = '{/* Results Module */}';

const startIndex = liveTickets.indexOf(formStartMarker);
const endIndex = liveTickets.indexOf(formEndMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
      {/* Hero Style Wrapper for Exact Match */}
      <div className="bg-slate-900 rounded-[2rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90"></div>
        <div className="relative z-20 max-w-[1100px] mx-auto bg-white/10 backdrop-blur-xl rounded-[2rem] p-2 md:p-4 border border-white/20 shadow-2xl transition-all duration-500">
           <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:px-8 shadow-2xl">
              ${searchForm}
           </div>
        </div>
      </div>
  `;
  const newLiveTickets = liveTickets.substring(0, startIndex) + replacement + '      ' + liveTickets.substring(endIndex);
  fs.writeFileSync('c:/Users/AHSAN/my-new-app/admin-saer-pk/src/pages/operations/LiveTickets.jsx', newLiveTickets);
  console.log('Successfully updated LiveTickets.jsx');
} else {
  console.error('Could not find markers', startIndex, endIndex);
}
