#!/bin/bash

mysqldump --defaults-file=.prod-db.cnf --skip-lock-tables --add-drop-database --no-data --databases pi > pi-schema.sql
