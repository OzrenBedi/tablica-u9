import { useEffect,useState } from 'react';


function App() {
const [standings,setStandings]=useState([]);
const [loading,setLoading]=useState(true);


const fetchStandings = async()=>{
setLoading(true);
try{
const res=await fetch('https://YOUR_RENDER_BACKEND_URL/api/standings');
const data=await res.json();
setStandings(data);
}catch(err){console.error(err);}
setLoading(false);
}


useEffect(()=>{fetchStandings();},[]);


return (
<div className="p-4 max-w-4xl mx-auto">
<h1 className="text-3xl font-bold mb-4">Tablica Početnici U-9</h1>
<button onClick={fetchStandings} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
Osvježi
</button>
{loading ? <p>Učitavanje...</p> : (
<table className="w-full border border-gray-300">
<thead className="bg-gray-100">
<tr>
<th className="border p-2">#</th>
<th className="border p-2">Ekipa</th>
<th className="border p-2">U</th>
<th className="border p-2">P</th>
<th className="border p-2">R</th>
<th className="border p-2">I</th>
<th className="border p-2">GF</th>
<th className="border p-2">GA</th>
<th className="border p-2">GD</th>
<th className="border p-2">Bodovi</th>
</tr>
</thead>
<tbody>
{standings.map((team,index)=>(
<tr key={team.team} className="text-center">
<td className="border p-2">{index+1}</td>
<td className="border p-2 text-left">{team.team}</td>
<td className="border p-2">{team.played}</td>
<td className="border p-2">{team.wins}</td>
<td className="border p-2">{team.draws}</td>
<td className="border p-2">{team.losses}</td>
<td className="border p-2">{team.gf}</td>
<td className="border p-2">{team.ga}</td>
<td className="border p-2">{team.gd}</td>
<td className="border p-2">{team.points}</td>
</tr>
))}
</tbody>
</table>
)}
</div>
);
}


export default App;