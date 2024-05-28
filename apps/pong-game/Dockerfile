FROM nginx:1.25-alpine

WORKDIR /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

COPY ./dist/ ./

EXPOSE 80

# Add bash
RUN apk add --no-cache bash

# Start Nginx server
CMD ["/bin/bash", "-c", "nginx -g \"daemon off;\""]
