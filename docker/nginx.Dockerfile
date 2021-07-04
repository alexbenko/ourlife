FROM nginx
COPY ./docker/nginx.conf /etc/nginx/conf.d/default.conf
#/etc/nginx/nginx.conf
COPY ./docker/ourlife.crt /etc/nginx/ssl/
COPY ./docker/ourlife.key /etc/nginx/ssl/