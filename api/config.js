/* Função serverless da Vercel: responde /api/config.js com as credenciais
   públicas do Supabase vindas das variáveis de ambiente.

   O index.html carrega este caminho com <script src="/api/config.js">. Em
   produção a Vercel executa a função e o navegador recebe o window.APP_CONFIG
   montado abaixo. Num servidor estático (localhost, Live Server, python -m
   http.server) o arquivo é entregue cru para o navegador, então o corpo fica
   protegido pelo teste de `module`: sem ele o script não faz nada, APP_CONFIG
   não é definido e o app cai na tela de configuração, onde a URL e a chave
   podem ser coladas à mão e ficam no localStorage. */
if (typeof module !== 'undefined' && module.exports) {
    module.exports = (req, res) => {
        res.setHeader('Content-Type', 'application/javascript');
        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');

        const supabaseUrl = process.env.SUPABASE_URL || '';
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

        res.status(200).send(`window.APP_CONFIG = {
  SUPABASE_URL: ${JSON.stringify(supabaseUrl)},
  SUPABASE_ANON_KEY: ${JSON.stringify(supabaseAnonKey)}
};`);
    };
}
