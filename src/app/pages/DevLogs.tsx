import DevLayout from "../components/DevLayout";

export default function DevLogs() {
  return (
    <DevLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Logs do Sistema</h1>
          <p className="text-zinc-400">Monitoramento de eventos e erros do sistema</p>
        </div>
        <p className="text-zinc-500">Em desenvolvimento...</p>
      </div>
    </DevLayout>
  );
}
