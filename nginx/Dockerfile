FROM nginx:alpine

# Copy configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80
EXPOSE 443

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
