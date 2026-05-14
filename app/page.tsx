import fs from "fs"
import path from "path"

interface TeamStanding {
  team: string
  played: number
  wins: number
  draws: number
  losses: number
  gf: number
  ga: number
  gd: number
  points: number
}

function getStandings(): TeamStanding[] {
  try {
    const filePath = path.join(process.cwd(), "standings.json")
    const data = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Error reading standings:", error)
    return []
  }
}

export default function Home() {
  const standings = getStandings()

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-2">
            Tablica Pocetnici U-9
          </h1>
          <p className="text-[var(--muted-foreground)]">
            Sezona 2024/2025 - Nakon 19. kola
          </p>
        </header>

        <div className="bg-[var(--card)] rounded-xl shadow-lg overflow-hidden border border-[var(--border)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[var(--primary)] text-[var(--primary-foreground)]">
                  <th className="py-3 px-2 md:px-4 text-center font-semibold w-12">#</th>
                  <th className="py-3 px-2 md:px-4 text-left font-semibold">Ekipa</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">U</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">P</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">R</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">I</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold hidden sm:table-cell">GF</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold hidden sm:table-cell">GA</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">+/-</th>
                  <th className="py-3 px-2 md:px-4 text-center font-semibold">Bod</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, index) => (
                  <tr
                    key={team.team}
                    className={`
                      border-b border-[var(--border)] transition-colors
                      ${index === 0 ? "bg-[#fef3c7]" : ""}
                      ${index === 1 ? "bg-[#f1f5f9]" : ""}
                      ${index === 2 ? "bg-[#fed7aa]" : ""}
                      ${index >= standings.length - 2 ? "bg-[#fee2e2]" : ""}
                      hover:bg-[var(--muted)]
                    `}
                  >
                    <td className="py-3 px-2 md:px-4 text-center">
                      <span
                        className={`
                          inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-sm
                          ${index === 0 ? "bg-[var(--accent)] text-[var(--foreground)]" : ""}
                          ${index === 1 ? "bg-gray-400 text-white" : ""}
                          ${index === 2 ? "bg-amber-600 text-white" : ""}
                          ${index > 2 ? "text-[var(--muted-foreground)]" : ""}
                        `}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-2 md:px-4 text-left font-medium text-[var(--foreground)] text-sm md:text-base">
                      {team.team}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-[var(--muted-foreground)]">
                      {team.played}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-green-600 font-medium">
                      {team.wins}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-[var(--muted-foreground)]">
                      {team.draws}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-red-500">
                      {team.losses}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-[var(--muted-foreground)] hidden sm:table-cell">
                      {team.gf}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center text-[var(--muted-foreground)] hidden sm:table-cell">
                      {team.ga}
                    </td>
                    <td
                      className={`py-3 px-2 md:px-4 text-center font-medium ${
                        team.gd > 0
                          ? "text-green-600"
                          : team.gd < 0
                          ? "text-red-500"
                          : "text-[var(--muted-foreground)]"
                      }`}
                    >
                      {team.gd > 0 ? `+${team.gd}` : team.gd}
                    </td>
                    <td className="py-3 px-2 md:px-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-bold">
                        {team.points}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
          <div className="flex flex-wrap justify-center gap-4 mb-2">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#fef3c7]"></span> 1. mjesto
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#f1f5f9]"></span> 2. mjesto
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#fed7aa]"></span> 3. mjesto
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#fee2e2]"></span> Ispadanje
            </span>
          </div>
          <p>U = Utakmice | P = Pobjede | R = Remi | I = Izgubljene | GF = Golovi za | GA = Golovi protiv</p>
        </footer>
      </div>
    </main>
  )
}
