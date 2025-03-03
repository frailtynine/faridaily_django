FROM nginx:1.22.1
ARG FRONTEND_IMAGE=faridaily_frontend
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=${FRONTEND_IMAGE} /app/dist /usr/share/nginx/html