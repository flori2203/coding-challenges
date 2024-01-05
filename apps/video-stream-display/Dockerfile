FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

COPY ./apps/video-stream-display/nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/apps/video-stream-display/ ./

EXPOSE 80

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
