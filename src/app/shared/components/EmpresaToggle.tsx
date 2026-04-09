/**
 * Componente EmpresaToggle
 * Permite alternar entre empresas sem fazer login/logout
 * Útil para Dev/Gestão testar segmentação
 */

import { useState, useEffect } from 'react';
import { sbEmpresa } from '@/lib/supabase-extended';

// IDs das empresas do seu banco
const EMPRESAS = [
  {
    id: '9d06823f-cbbc-473d-a346-1182e4332add',
    nome: 'Doctor Auto Bosch',
    slug: 'doctor-auto-bosch',
  },
  {
    id: 'f7de0c30-a07f-4d48-8ff3-553cf5bb05da',
    nome: 'Doctor Auto Prime',
    slug: 'doctor-auto-prime',
  },
];

interface EmpresaToggleProps {
  className?: string;
  showLabel?: boolean;
}

export const EmpresaToggle = ({ className = '', showLabel = true }: EmpresaToggleProps) => {
  const [empresaAtual, setEmpresaAtual] = useState<string>(() => sbEmpresa());
  const [isLoading, setIsLoading] = useState(false);

  const empresaSelecionada = EMPRESAS.find((e) => e.id === empresaAtual);

  const handleToggle = async (novaEmpresaId: string) => {
    setIsLoading(true);

    // Atualizar localStorage
    localStorage.setItem('empresa_id', novaEmpresaId);
    localStorage.setItem('oficina_id', novaEmpresaId); // Em OPÇÃO 1, oficina_id = empresa_id

    // Aguardar um pouco para localStorage ser sincronizado
    await new Promise((resolve) => setTimeout(resolve, 100));

    setEmpresaAtual(novaEmpresaId);

    // Recarregar página para aplicar novos filtros
    window.location.reload();

    setIsLoading(false);
  };

  return (
    <div className={`empresa-toggle ${className}`}>
      {showLabel && <label>Empresa:</label>}

      <div className="toggle-buttons">
        {EMPRESAS.map((empresa) => (
          <button
            key={empresa.id}
            onClick={() => handleToggle(empresa.id)}
            disabled={isLoading}
            className={`toggle-btn ${empresa.id === empresaAtual ? 'active' : ''}`}
            title={`Alternar para ${empresa.nome}`}
          >
            {empresa.nome}
          </button>
        ))}
      </div>

      {empresaSelecionada && (
        <span className="empresa-info">
          ✓ {empresaSelecionada.nome}
        </span>
      )}
    </div>
  );
};

export default EmpresaToggle;

/**
 * =====================================================
 * ESTILOS CSS (adicione em seu arquivo de styles)
 * =====================================================
 */

const styles = `
.empresa-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
}

.empresa-toggle label {
  font-weight: 600;
  color: #333;
  margin: 0;
}

.toggle-buttons {
  display: flex;
  gap: 8px;
}

.toggle-btn {
  padding: 6px 12px;
  border: 2px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.toggle-btn.active {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.toggle-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empresa-info {
  color: #666;
  font-size: 12px;
  font-weight: 500;
}
`;
