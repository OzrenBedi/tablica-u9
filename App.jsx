import { useEffect, useState } from 'react';

function App() {
  const [standings, setStandings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStandings = async () => {
    setLoading(true);
    setError(null);
    try {
      // Zamijeni sa stvarnim URL-om tvog backend servisa
      const res = await fetch('http://localhost:3000/api/standings');
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setStandings(data);
    } catch (err) {
      console.error('Error fetching standings:', err);
      setError('Greška pri učitavanju podataka');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStandings();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Tablica Početnici U-9</h1>
      
      <button 
        onClick={fetchStandings} 
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Učitavanje...' : 'Osvježi'}
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <p>Učitavanje...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2">#</th>
                <th className="border p-2 text-left">Ekipa</th>
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
              {standings.length > 0 ? (
                standings.map((team, index) => (
                  <tr key={team.team} className="text-center hover:bg-gray-50">
                    <td className="border p-2 font-medium">{index + 1}</td>
                    <td className="border p-2 text-left">{team.team}</td>
                    <td className="border p-2">{team.played}</td>
                    <td className="border p-2">{team.wins}</td>
                    <td className="border p-2">{team.draws}</td>
                    <td className="border p-2">{team.losses}</td>
                    <td className="border p-2">{team.gf}</td>
                    <td className="border p-2">{team.ga}</td>
                    <td className="border p-2">{team.gd}</td>
                    <td className="border p-2 font-bold">{team.points}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="border p-4 text-center text-gray-500">
                    Nema podataka o tablici
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
