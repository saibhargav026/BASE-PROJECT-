FROM harbormz.unionbankofindia.co.in/base-image/angular:17 AS build
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --no-create-home --ingroup appgroup appuser
COPY package*.json ./
COPY . .
RUN chmod +x ./node_modules/.bin/ng
RUN npm run build --prod
FROM harbormz.unionbankofindia.co.in/base-image/nginx:alpine
RUN addgroup --system appgroup && adduser --system --no-create-home --ingroup appgroup appuser
COPY --from=build /app/dist/icaap-app/ /usr/share/nginx/html
RUN chown -R appuser:appgroup /usr/share/nginx/html  /var/cache/nginx  /var/log/nginx  /var/run/
RUN chown -R appuser:appgroup  /etc/nginx/conf.d/
RUN chmod -R 755 /usr/share/nginx/html  /var/cache/nginx  /var/log/nginx  /var/run/ 
RUN chmod -R 755 /etc/nginx/conf.d/
USER appuser
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

