FROM nginx:1.27.2-alpine

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx server configuration to conf.d
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for Certbot challenges
RUN mkdir -p /var/www/certbot

# Expose port 80
EXPOSE 80 443