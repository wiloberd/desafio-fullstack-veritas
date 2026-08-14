const BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = async (endpoint, customConfig = {}) => {
  // Configuração dos cabeçalhos padrão (nosso "DefaultHeaders" do front)
  const headers = {
    'Content-Type': 'application/json',
    ...customConfig.headers, // Permite sobrescrever se necessário
  };

  const config = {
    ...customConfig,
    headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    if (!response.ok) {
      // Tratamento global de erros HTTP
      const errorData = await response.json().catch(() => ({}));

      throw {status: response.status, payload: errorData};
    }
    
    return await response.json();
  } catch (error) {
    
    throw error;
  }
};