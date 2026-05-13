export function normalizeContractorName(name) {
  return String(name ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

export function getContractorById(contractors = [], contractorId) {
  if (!contractorId) return null
  return contractors.find((contractor) => contractor.id === contractorId) ?? null
}

function legacyClient(client) {
  const value = String(client ?? '').trim()
  return value ? { name: value, source: 'legacy' } : null
}

export function getProjectContractor(project, contractors = []) {
  if (!project) return null

  const contractor = getContractorById(contractors, project.contractor_id)
  if (contractor) return { name: contractor.name, source: 'contractor', contractor }

  return legacyClient(project.client)
}

export function getEventContractor(event, projects = [], contractors = []) {
  if (!event) return null

  const project = event.project_id ? projects.find((item) => item.id === event.project_id) : null
  if (project?.contractor_id && event.contractor_id === project.contractor_id) {
    const inheritedContractor = getContractorById(contractors, project.contractor_id)
    if (inheritedContractor) return { name: inheritedContractor.name, source: 'project', contractor: inheritedContractor }
  }

  const ownContractor = getContractorById(contractors, event.contractor_id)
  if (ownContractor) return { name: ownContractor.name, source: 'contractor', contractor: ownContractor }

  const projectContractor = getProjectContractor(project, contractors)
  if (projectContractor) return { ...projectContractor, source: 'project' }

  return legacyClient(event.client)
}

export function formatContractorDisplay(contractorInfo, { showInherited = false } = {}) {
  if (!contractorInfo?.name) return ''
  if (showInherited && contractorInfo.source === 'project') return `${contractorInfo.name} · heredado`
  return contractorInfo.name
}
