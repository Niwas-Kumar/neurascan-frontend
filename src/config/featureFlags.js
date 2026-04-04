const parseBoolean = (value, defaultValue = false) => {
  if (value == null || value === '') return defaultValue
  return !['false', '0', 'no', 'off'].includes(String(value).trim().toLowerCase())
}

// Rollout flag for class drill-down navigation.
// true  -> /teacher/classes -> /teacher/classes/:classId/students
// false -> /teacher/students (legacy list)
export const CLASS_DRILLDOWN_ENABLED = parseBoolean(
  import.meta.env.VITE_USE_CLASS_DRILLDOWN,
  true
)
