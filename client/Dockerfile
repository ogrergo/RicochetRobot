FROM node:latest AS builder
COPY . .
RUN npm install 
RUN npm run build


FROM lipanski/docker-static-website:latest
COPY --from=builder dist .
CMD ["/busybox", "httpd", "-f", "-v", "-p", "3000", "-c", "httpd.conf"]
