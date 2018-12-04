rm -f ssm-parameters.json
$(umask 0377; aws ssm get-parameters-by-path --path /pi/db/ --with-decryption > ssm-parameters.json)

export DB_HOST="$(cat ssm-parameters.json | jq -r '.Parameters[] | select(.Name=="/pi/db/pi.db-host") | "\(.Value)"')"
export DB_USER="$(cat ssm-parameters.json | jq -r '.Parameters[] | select(.Name=="/pi/db/pi.db-user") | "\(.Value)"')"
export DB_PASS="$(cat ssm-parameters.json | jq -r '.Parameters[] | select(.Name=="/pi/db/pi.db-pass") | "\(.Value)"')"


rm -f ssm-parameters.json
printf "\n\n$(ls -l)\n\n$DB_HOST\n$DB_USER\n$DB_PASS\n\n"

pm2 start pm2.json --attach
