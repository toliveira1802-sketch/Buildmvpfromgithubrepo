-- Função para executar SQL dinâmico via RPC
-- Usada pelo Agente SQL do DevTables
-- SECURITY DEFINER = executa com permissões do owner (service role)

CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSONB;
  row_count INT;
BEGIN
  -- Bloquear comandos perigosos
  IF sql_query ~* '\b(DROP\s+DATABASE|TRUNCATE\s+TABLE\s+(users|auth\.|dev_users))\b' THEN
    RAISE EXCEPTION 'Comando bloqueado por segurança';
  END IF;

  -- Executar o SQL
  EXECUTE sql_query;
  GET DIAGNOSTICS row_count = ROW_COUNT;

  result := jsonb_build_object(
    'success', true,
    'rows_affected', row_count,
    'executed_at', now()::text
  );

  RETURN result;

EXCEPTION WHEN OTHERS THEN
  RAISE EXCEPTION 'SQL Error: %', SQLERRM;
END;
$$;

-- Garantir que só service_role pode executar
REVOKE ALL ON FUNCTION exec_sql(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO service_role;
