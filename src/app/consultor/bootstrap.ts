// src/app/consultor/bootstrap.ts
import { SEED_CLIENTES, SEED_VEICULOS, SEED_OS } from './store/seed'
import { useClientesStore } from './store/clientesStore'
import { useVeiculosStore } from './store/veiculosStore'
import { useOSStore } from './store/osStore'

export function initializeSeedIfEmpty(): void {
  if (useClientesStore.getState().items.length === 0) {
    SEED_CLIENTES.forEach((c) => useClientesStore.getState().add(c))
  }
  if (useVeiculosStore.getState().items.length === 0) {
    SEED_VEICULOS.forEach((v) => useVeiculosStore.getState().add(v))
  }
  if (useOSStore.getState().items.length === 0) {
    useOSStore.setState({ items: SEED_OS })
  }
}

export function resetConsultorMocks(): void {
  localStorage.removeItem('dap-consultor/auth')
  localStorage.removeItem('dap-consultor/clientes')
  localStorage.removeItem('dap-consultor/veiculos')
  localStorage.removeItem('dap-consultor/os')
  window.location.reload()
}
