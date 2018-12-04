DOCKER_HOST_IP="$(ip route | awk 'NR==1 {print $3}')"

sed -i "s#\(server \)site#\1$DOCKER_HOST_IP#g" /etc/nginx/nginx.conf

nginx -g 'daemon off;'
