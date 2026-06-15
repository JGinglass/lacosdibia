FROM nginx:alpine

# Configuração customizada (gzip + cache de assets)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Arquivos do site estático
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/
