#!/bin/sh
if [ ! -e bin/mysqlConfig.js ]; then
    ERR=0
    [ -z $DB_HOST ] && echo "ERROR: Env [DB_HOST] required." && ERR=1
    [ -z $DB_USER ] && echo "ERROR: Env [DB_USER] required." && ERR=1
    [ -z $DB_PASS ] && echo "ERROR: Env [DB_PASS] required." && ERR=1
    [ $ERR == 1 ] && exit 1
    DB_PORT=${DB_PORT:=3306}
    DB_NAME=${DB_NAME:=webfunny_db}
    cat bin/mysqlConfig.js.def \
    | sed "/ip/s/''/'$DB_HOST'/g" \
    | sed "/port/s/3306/$DB_PORT/g" \
    | sed "/dataBaseName/s/webfunny_db/$DB_NAME/g" \
    | sed "/userName/s/''/'$DB_USER'/g" \
    | sed "/password/s/''/'$DB_PASS'/g" \
    > bin/mysqlConfig.js
fi
npm run prd
