"use client"

import { useState } from "react"
import { Video, UserPlus, CalendarDays, ArrowLeft, ChevronDown } from "lucide-react"

type AttendanceRecord = {
  Name: string
  Roll: number
  Time: string
}

type View = "home" | "mark" | "register" | "attendance"

export default function FaceAttendancePage() {
  const [view, setView] = useState<View>("home")

  // Register
  const [name, setName] = useState("")
  const [roll, setRoll] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Attendance viewer
  const [dates, setDates] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [datesLoading, setDatesLoading] = useState(false)
  const [recordsLoading, setRecordsLoading] = useState(false)

  const goTo = async (v: View) => {
    setView(v)
    setMessage("")
    if (v === "attendance") {
      setDatesLoading(true)
      const res = await fetch("http://127.0.0.1:5000/face/dates")
      const data = await res.json()
      setDates(data.dates || [])
      setDatesLoading(false)
    }
  }

  const markAttendance = async () => {
    setLoading(true)
    setMessage("")
    const res = await fetch("http://127.0.0.1:5000/face/mark", { method: "POST" })
    const data = await res.json()
    setMessage(data.message + (data.person ? ` — ${data.person}` : ""))
    setLoading(false)
  }

  const registerUser = async () => {
    setLoading(true)
    setMessage("")
    const res = await fetch("http://127.0.0.1:5000/face/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, roll }),
    })
    const data = await res.json()
    setMessage(data.message || data.error)
    setLoading(false)
  }

  const fetchRecords = async (date: string) => {
    setRecordsLoading(true)
    setSelectedDate(date)
    const res = await fetch(`http://127.0.0.1:5000/face/attendance/${date}`)
    const data = await res.json()
    setRecords(data.records || [])
    setRecordsLoading(false)
  }

  // ── shared back button ──────────────────────────────────────
  const BackBtn = () => (
    <button
      onClick={() => { setView("home"); setMessage(""); setSelectedDate(null); setRecords([]) }}
      className="flex items-center gap-2 text-sm mb-6 opacity-50 hover:opacity-100 transition-opacity"
      style={{ color: "var(--text-secondary)" }}
    >
      <ArrowLeft size={15} /> Back
    </button>
  )

  // ── HOME: 3 cards ───────────────────────────────────────────
  if (view === "home") return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "var(--bg-tertiary)",
          display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          <Video size={18} style={{ color: "var(--text-primary)" }} />
        </div>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--text-primary)" }}>Face Attendance</h1>
      </div>
      <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "2.5rem", marginLeft: 48 }}>
        AI-powered facial recognition attendance. Register new users or mark your attendance instantly.
      </p>

      <p style={{ fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-muted)", textAlign: "center", marginBottom: "1.25rem" }}>
        HOW WOULD YOU LIKE TO PROCEED?
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
        {[
          {
            id: "mark" as View,
            icon: Video,
            label: "Mark Attendance",
            sub: "I'm a returning student",
          },
          {
            id: "register" as View,
            icon: UserPlus,
            label: "Register Face",
            sub: "First time here",
          },
          {
            id: "attendance" as View,
            icon: CalendarDays,
            label: "View Attendance",
            sub: "Browse records by date",
          },
        ].map(({ id, icon: Icon, label, sub }) => (
          <button
            key={id}
            onClick={() => goTo(id)}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: 16,
              padding: "2.25rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "1rem",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color-hover)"
              ;(e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-md)"
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border-color)"
              ;(e.currentTarget as HTMLElement).style.transform = "translateY(0)"
              ;(e.currentTarget as HTMLElement).style.boxShadow = "none"
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "var(--bg-tertiary)",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Icon size={22} style={{ color: "var(--text-primary)" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{sub}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  // ── MARK ATTENDANCE ─────────────────────────────────────────
  if (view === "mark") return (
    <div className="p-8 max-w-md mx-auto">
      <BackBtn />
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Video size={18} style={{ color: "var(--text-primary)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Mark Attendance</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Camera will scan your face</div>
          </div>
        </div>
        <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
          Ensure your face is clearly visible and well-lit. The AI will identify you automatically.
        </p>
        <button
          onClick={markAttendance}
          disabled={loading}
          style={{
            width: "100%", background: "var(--text-primary)", color: "var(--bg-primary)",
            border: "none", borderRadius: 10, padding: "0.75rem", fontSize: "0.875rem",
            fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
            transition: "opacity 0.2s"
          }}
        >
          {loading ? "Scanning..." : "Start Camera Scan"}
        </button>
        {message && (
          <div style={{ marginTop: "1rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )

  // ── REGISTER ────────────────────────────────────────────────
  if (view === "register") return (
    <div className="p-8 max-w-md mx-auto">
      <BackBtn />
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 16, padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <UserPlus size={18} style={{ color: "var(--text-primary)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Register Face</div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>One-time setup for new students</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "1.25rem" }}>
          {[
            { label: "Full Name", value: name, setter: setName, placeholder: "Enter your name" },
            { label: "Roll Number", value: roll, setter: setRoll, placeholder: "Enter roll number" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                {label}
              </label>
              <input
                style={{
                  width: "100%", background: "var(--bg-primary)", border: "1px solid var(--border-color)",
                  borderRadius: 8, padding: "0.625rem 0.875rem", fontSize: "0.875rem",
                  color: "var(--text-primary)", outline: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s"
                }}
                placeholder={placeholder}
                value={value}
                onChange={e => setter(e.target.value)}
                onFocus={e => (e.target as HTMLElement).style.borderColor = "var(--border-color-hover)"}
                onBlur={e => (e.target as HTMLElement).style.borderColor = "var(--border-color)"}
              />
            </div>
          ))}
        </div>
        <button
          onClick={registerUser}
          disabled={loading || !name || !roll}
          style={{
            width: "100%", background: "var(--text-primary)", color: "var(--bg-primary)",
            border: "none", borderRadius: 10, padding: "0.75rem", fontSize: "0.875rem",
            fontWeight: 600, cursor: (loading || !name || !roll) ? "not-allowed" : "pointer",
            opacity: (loading || !name || !roll) ? 0.5 : 1, transition: "opacity 0.2s"
          }}
        >
          {loading ? "Capturing Faces..." : "Register & Mark Attendance"}
        </button>
        {message && (
          <div style={{ marginTop: "1rem", background: "var(--bg-tertiary)", border: "1px solid var(--border-color)", borderRadius: 8, padding: "0.75rem", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )

  // ── VIEW ATTENDANCE ─────────────────────────────────────────
  if (view === "attendance") return (
    <div className="p-8 max-w-5xl mx-auto">
      <BackBtn />
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CalendarDays size={18} style={{ color: "var(--text-primary)" }} />
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "var(--text-primary)" }}>Attendance Records</div>
          <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Select a date to view logs</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "1.25rem" }}>
        {/* Date list */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--border-color)", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Dates
          </div>
          {datesLoading ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>Loading...</div>
          ) : dates.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.8rem" }}>No records found</div>
          ) : (
            dates.map(d => (
              <button
                key={d}
                onClick={() => fetchRecords(d)}
                style={{
                  width: "100%", textAlign: "left", padding: "0.7rem 1rem",
                  borderBottom: "1px solid var(--border-color)",
                  background: selectedDate === d ? "var(--bg-tertiary)" : "transparent",
                  color: selectedDate === d ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "0.8rem", fontWeight: selectedDate === d ? 600 : 400,
                  cursor: "pointer", border: "none",
                  borderLeft: selectedDate === d ? "2px solid var(--text-primary)" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
              >
                {d}
              </button>
            ))
          )}
        </div>

        {/* Records table */}
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 14, overflow: "hidden" }}>
          {!selectedDate ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, color: "var(--text-muted)", fontSize: "0.85rem" }}>
              ← Select a date to view records
            </div>
          ) : recordsLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: 200, color: "var(--text-muted)", fontSize: "0.85rem" }}>
              Loading...
            </div>
          ) : (
            <>
              <div style={{ padding: "0.75rem 1.25rem", borderBottom: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)" }}>{selectedDate}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{records.length} students</span>
              </div>
              {records.length === 0 ? (
                <div style={{ padding: "3rem", textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>No records for this date</div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border-color)" }}>
                      {["#", "Name", "Roll", "Time"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "0.65rem 1.25rem", fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.07em", textTransform: "uppercase" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((r, i) => (
                      <tr key={i} style={{ borderBottom: i < records.length - 1 ? "1px solid var(--border-color)" : "none" }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "var(--bg-tertiary)"}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "transparent"}
                      >
                        <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>{String(i + 1).padStart(2, "0")}</td>
                        <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)" }}>{r.Name}</td>
                        <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.Roll}</td>
                        <td style={{ padding: "0.75rem 1.25rem", fontSize: "0.85rem", color: "var(--text-secondary)" }}>{r.Time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )

  return null
}