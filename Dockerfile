FROM nginx:alpine

# Configuração customizada (gzip + cache de assets)
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Arquivos do site estático
COPY . /usr/share/nginx/html
