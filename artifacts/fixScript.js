const fs = require('fs');

const appCode = fs.readFileSync('c:/Users/AHSAN/my-new-app/src/App.js', 'utf8');
const lines = appCode.split('\n');

const startLine = 574;
const endLine = 913; 

let formLines = lines.slice(startLine, endLine);
formLines[0] = formLines[0].replace('const flightSearchForm = ', '');
formLines[formLines.length - 1] = formLines[formLines.length - 1].replace(';', '');

const formJSX = formLines.join('\n');

let liveTickets = fs.readFileSync('c:/Users/AHSAN/my-new-app/admin-saer-pk/src/pages/operations/LiveTickets.jsx', 'utf8');

const startMarker = '{/* Hero Style Wrapper for Exact Match */}';
const endMarker = '      {/* Results Module */}';

const startIndex = liveTickets.indexOf(startMarker);
const endIndex = liveTickets.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `
      {/* Hero Style Wrapper for Exact Match */}
      <div className="bg-slate-900 rounded-[2rem] p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-slate-900/90"></div>
        <div className="relative z-20 max-w-[1100px] mx-auto bg-white/10 backdrop-blur-xl rounded-[2rem] p-2 md:p-4 border border-white/20 shadow-2xl transition-all duration-500">
           <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 lg:px-8 shadow-2xl">
              ${formJSX}
           </div>
        </div>
      </div>
`;
  
  const newLiveTickets = liveTickets.substring(0, startIndex) + replacement + '      ' + liveTickets.substring(endIndex);
  fs.writeFileSync('c:/Users/AHSAN/my-new-app/admin-saer-pk/src/pages/operations/LiveTickets.jsx', newLiveTickets);
  console.log('Fixed LiveTickets.jsx successfully.');
} else {
  console.log('Markers not found!');
  console.log('StartIndex:', startIndex, 'EndIndex:', endIndex);
}
