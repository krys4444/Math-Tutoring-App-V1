import { useEffect, useState } from "react"
import { useParams } from "next/navigation" // or useRouter()
import { unitService, type Unit } from "@/lib/unit-service"

export default function CourseUnitsPage() {
  const { course_id } = useParams()
  const [units, setUnits] = useState<Unit[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!course_id) return

    const loadUnits = async () => {
      const { data, error } = await unitService.getUnitsByCourseId(Number(course_id))
      if (error) {
        setError(error.message)
      } else {
        setUnits(data || [])
      }
    }

    loadUnits()
  }, [course_id])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Units for Course {course_id}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {units.map((unit) => (
          <li key={unit.unit_id} className="mb-2">
            <strong>{unit.unit_name}</strong>: {unit.description}
          </li>
        ))}
      </ul>
    </div>
  )
}
