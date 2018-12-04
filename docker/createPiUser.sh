#!/bin/bash

if [ -z $DB_PASS ] ; then
	echo "env var DB_PASS is required"
	exit 1
fi

# cat << EOF >> /etc/my.cnf
# bind-address=0.0.0.0
# EOF

mysql -p$MYSQL_ROOT_PASSWORD  -e "create user 'pi'@'%' identified by '$DB_PASS'; grant select,insert,update,delete on pi.* to 'pi'@'%'; flush privileges" &>/dev/null
